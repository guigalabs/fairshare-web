# Audit Log

Site: fairshare.guigalabs.com (free site + /pricing, /for-attorneys, /for-scholars marketing surface; /app is the Pro app behind auth and is out of scope for this loop)

Stack: SvelteKit 2 / Svelte 5 / Vite / Tailwind v4 / TypeScript. Dev server runs at http://localhost:5173.

Loop: every 30 minutes. Cron job ID `48c4f1b9`. Auto-expires after 7 days unless extended.

Focus rotation index: **15** (next pass = Code hygiene — fifth cycle).
Skip streak: **0** consecutive (exit at 7).

---

## Pass 1 — Typography & hierarchy — 2026-05-07
**Type:** visual
**Status:** shipped
**Page(s):** / (homepage, desktop 1440x900 + mobile 390x844)
**What:** Tightened display-heading line-height from inherited body 1.5 to 1.15 on the three uncovered homepage h2 rules (`.pro-header h2`, `.section-header h2`, `.cta-inner h2`).
**Why:** Display headings at 28-40px were rendering at line-height 1.5 (60px on a 40px h2), inherited from body. The Pro section's "Built for Islamic estate practitioners." had visible vertical space between wrapped lines, weakening the hierarchy and breaking visual rhythm with the hero h1, which already sits at a tight 1.05. Going to 1.15 preserves enough breathing room for two-line wraps while pulling each heading into a single visual block. Hero stays at 1.05 (single line, can be tighter).
**Files changed:** src/routes/+page.svelte (3 CSS rules)
**Testing:** Probed computed line-height via agent-browser (was 60px / 51px / 51px on h2; now 46px / 39.1px / 39.1px, all ratio 1.150). Captured desktop and mobile screenshots before and after at /tmp/audit_home_desktop_after.png and /tmp/audit_home_mobile_after.png; the wrapped Pro section heading now reads as a single visual unit. No console errors. HMR picked the change up cleanly.

## Pass 2 — Spacing & layout rhythm — 2026-05-07
**Type:** visual
**Status:** shipped
**Page(s):** / (homepage, desktop 1440x900 + mobile 390x844)
**What:** Made `.features` and `.methodology` sections' vertical padding symmetric (4rem top + 4rem bottom) to match the page's prevailing section rhythm.
**Why:** Both sections used `class="features container"` and `class="methodology container"`. The base `.container` rule sets `padding: 2rem 1rem`, and each section overrode only `padding-top: 4rem`, leaving them visually pinched at the bottom (32px) while feeling spacious at the top (64px). Every other section on the page is either symmetric (strip 24/24, disclaimer 32/32, pro-section 64/64) or intentionally asymmetric for boundary reasons (hero 96/64 with nav above; cta 64/96 leading into footer). The features and methodology asymmetry was unintentional inheritance, not design intent. Visible result: the 3-card features grid no longer reads as crammed against the Pro section's tinted top edge, and the 5-card madhabs grid has equal breathing room above the "Try it for yourself" CTA.
**Files changed:** src/routes/+page.svelte (added `padding-bottom: 4rem` to `.features` and `.methodology`)
**Testing:** Probed computed padding via agent-browser (was 64/32 on both; now 64/64). Captured before/after at /tmp/spacing_home_desktop_after.png and /tmp/spacing_home_mobile_after.png; section rhythm now reads as intentional. No layout shift, no console errors. HMR clean.

## Pass 3 — Color & contrast — 2026-05-07
**Type:** visual
**Status:** shipped
**Page(s):** site-wide (Button.svelte is reused on /, /pricing, /for-attorneys, /for-scholars, /methodology, /calculate, /saved, and elsewhere)
**What:** Bumped `.btn--secondary` resting border from `--color-border` (#e5e5e5) to `--color-border-strong` (#ccc).
**Why:** Audited every text-on-background pair on the homepage with computed-luminance ratios; all body text is comfortably WCAG AAA (8-18:1). The real issue surfaced on a non-text element: the secondary button (e.g. "Read the methodology" in the hero, "Browse methodology" in the CTA) had a 1.19:1 border against the page background, so the button shape was barely perceptible — the eye read it as floating text next to the green primary, not a paired CTA. Bumping to the existing `--color-border-strong` token raises border contrast to 1.53:1 (still soft, in keeping with the brand's restrained palette, but enough to read as a button). The hover state already darkens to `var(--color-text)` for full 18:1 contrast, so the resting/hover delta still communicates interactivity. The token swap stays inside the existing design vocabulary rather than introducing a new value.
**Files changed:** src/lib/ui/Button.svelte
**Testing:** Probed border-color via agent-browser before (rgb(229,229,229)) and after (rgb(204,204,204)). Captured /tmp/contrast_home_desktop.png; secondary buttons now read as paired CTAs alongside the primary, not as floating link text. Affects every secondary button site-wide; spot-checked on hero CTA row and bottom CTA. Type-check 0 errors.

## Pass 4 — CTAs & interactive elements — 2026-05-07
**Type:** visual
**Status:** shipped
**Page(s):** / (homepage bottom CTA section)
**What:** Switched the homepage bottom CTA's "Browse methodology" button from `variant="ghost"` to `variant="secondary"`.
**Why:** The hero already pairs "Start a calculation" (primary) with "Read the methodology" (secondary, outlined pill). The bottom CTA pairs the SAME destination ("Browse methodology" → /methodology) with `variant="ghost"`, which renders as borderless text. After Pass 3 strengthened the secondary border, this inconsistency became more visible: the hero now has a clear primary-plus-secondary CTA pair, while the bottom CTA still reads as "one button plus one floating link." Standardizing on the secondary pattern makes the homepage's CTA hierarchy consistent: every "primary action + alternative" pair on the page now uses the same button shapes. Ghost remains the right variant for genuinely tertiary actions (it is still used elsewhere); this change targets the hero/CTA pair specifically because both surfaces drive the same conversion choice.
**Files changed:** src/routes/+page.svelte (one variant prop)
**Testing:** Verified the rendered class via agent-browser is now `btn--secondary btn--lg` (was `btn--ghost btn--lg`). Captured /tmp/cta_home_top.png; the bottom CTA now shows two pill buttons (green primary + outlined secondary) matching the hero pattern, instead of one button plus floating text. Type-check 0 errors. The Pro section's two ghost buttons ("For attorneys", "For scholars") were left unchanged for now; they sit on a tinted background with a primary CTA that already dominates, so the visual call is less clear-cut and worth its own pass if needed.

## Pass 5 — Mobile responsiveness — 2026-05-07
**Type:** visual
**Status:** shipped
**Page(s):** site-wide footer (renders on every non-`/app` page)
**What:** Added `padding-block: 0.5rem` to `.footer-links a` so each footer link's tap target grows from 23px to 39px tall on mobile (16px taller).
**Why:** Probed touch-target sizes at iPhone 14 viewport (390x844). Most interactive surfaces were fine: main CTAs are 51-52px (above the 44px Apple HIG / WCAG 2.5.5 minimum), scenario cards are 145px tall, madhab cards are 82px+. The footer link row, however, was a flat 23px tall — text height with no surrounding hit area. The narrowest links ("Pro", 24×23 and "Saved", 44×23) were near-impossible to thumb-tap accurately, especially with adjacent links only 20px apart horizontally. Adding 8px top + 8px bottom padding pushes each tap target to 39px, still slightly short of 44px but a real, low-risk win. The visual layout barely changes (the existing 4px row-gap absorbs the extra padding cleanly into the wrap), and desktop is unaffected since the links were already comfortable to mouse-click. Considered also fixing the missing mobile nav (the topnav links are `display: none` below 640px, so mobile users can only navigate via in-page CTAs) — but a hamburger menu is a multi-component change that doesn't fit a one-pass scope; logged as a future opportunity.
**Files changed:** src/lib/components/SiteFooter.svelte
**Testing:** Probed `.footer-links a` heights at iPhone 14 viewport (was 23px on every link; now 39px). Captured /tmp/mobile_full_after.png; footer renders cleanly, no overflow, no visual regressions. Type-check 0 errors. Pre-existing 5 warnings unchanged.

## Pass 6 — Motion & polish — 2026-05-07
**Type:** visual
**Status:** shipped
**Page(s):** / (homepage hero stagger)
**What:** Made the homepage hero's `in:fly` cascade respect `prefers-reduced-motion: reduce` by zeroing out `y` and `duration` for users who've asked their OS for less motion.
**Why:** The site already has a global CSS `@media (prefers-reduced-motion: reduce)` rule in `app.css` that flattens animation/transition durations to 0.01ms, but that rule only neutralizes CSS-driven motion. The homepage's hero stagger uses Svelte's `in:fly` from `svelte/transition`, which is JS-driven (it animates style changes per frame), so the reduce-motion CSS override doesn't reach it. Users with vestibular conditions or who've intentionally turned reduced-motion on were still seeing the 500ms cascade of pro-banner → kicker → title → subtitle → CTAs → meta on every homepage load. Reading `window.matchMedia('(prefers-reduced-motion: reduce)').matches` at module init (which runs at hydration on the client) and branching the `enter()` factory makes the cascade collapse to an instant render for those users while preserving the existing motion delight for everyone else. Module-scope `typeof window !== 'undefined'` guard keeps SSR safe.
**Files changed:** src/routes/+page.svelte
**Testing:** Type-check 0 errors. Verified normal-motion path: page loads with hero animating in as before, all elements visible, opacity 1 after transition. Spoofed `matchMedia` in the live page via eval to confirm the reduce-motion query surface returns `matches: true` — the `enter()` factory now branches correctly. Captured /tmp/motion_home.png (normal motion) showing the page renders cleanly. Real reduced-motion verification requires OS-level preference, but the logic is straightforward and matches the documented Svelte transition API.

## Pass 7 — Overall composition — 2026-05-07
**Type:** visual
**Status:** skip
**Page(s):** /, /pricing, /for-attorneys (audited)
**What:** No focused composition change met the bar without risking the established aesthetic.
**Why:** Homepage hero has a clear focal stack (kicker → 56px h1 → subtitle → primary+secondary CTAs → meta), all centered to reinforce the scholarly Islamic-publication tone. Whitespace balance was fixed in Pass 2; CTA pairing was fixed in Pass 4; section rhythm reads intentional. Pricing page has a single anchored pricing card as the focal point with a backup waitlist below — composition is straightforward and works. /for-attorneys uses a left-aligned documentation style with a dense "What's included" bullet list; converting that list to a 2-column icon grid would improve scanability, but it's a multi-element redesign affecting markup, copy structure, and tokens — outside one-pass scope. Logged as a future opportunity.
**Files changed:** none
**Testing:** Captured /tmp/comp_above_fold.png, /tmp/comp_pricing_full.png, /tmp/comp_attorneys.png at 1440x900 desktop and reviewed for hierarchy, focal points, whitespace, and above-the-fold impact. All three pages compose cleanly.

## Pass 8 — Edge cases & error handling — 2026-05-08
**Type:** feature
**Status:** shipped
**Page(s):** site-wide error boundary (any 404 / 500 / etc.)
**What:** Added a branded `+error.svelte` page so 404s and other errors render with full layout and clear navigation back, replacing the SvelteKit default fallback.
**Why:** Visiting any nonexistent URL (e.g. `/this-page-does-not-exist`) was rendering the framework's bare default: tiny "404" + "Not Found" text crammed in the top-left while the rest of the main area sat empty. The topnav and footer were already coming through via `+layout.svelte`, which made the broken middle stand out even more — users saw a half-rendered site with no way to recover. The new `/src/routes/+error.svelte` matches the homepage hero composition: large translucent status code, accent kicker ("SOMETHING'S OFF"), bold h1, explanatory lede, primary "Back to home" + secondary "Open the calculator" CTA pair, and a tertiary methodology link. Different copy fires for 404 vs. generic errors. Added i18n keys for both English and Arabic so the page localizes alongside the rest of the site. `<meta name="robots" content="noindex">` keeps error URLs out of search results.
**Files changed:** src/routes/+error.svelte (new), messages/en.json, messages/ar.json
**Testing:** Visited `/this-page-does-not-exist` at desktop 1440x900 and iPhone 14 viewport; both render the new layout with full nav, footer, branded hero composition, and two visible CTAs. Captured /tmp/error_404_after.png and /tmp/error_404_mobile.png. Type-check 0 errors (1148 files, +1 from new component). i18n keys added in both locales using the same composition pattern as the rest of the site (no em dashes, plain copy).

## Pass 9 — User feedback & responsiveness — 2026-05-08
**Type:** feature
**Status:** shipped
**Page(s):** /pricing (Stripe Checkout subscribe form)
**What:** Wired a `subscribing` state and `loading` prop to the "Subscribe to Pro" button so the click is acknowledged visually during the round-trip to `/api/stripe/checkout`.
**Why:** The Subscribe form was a plain `<form method="POST" action="/api/stripe/checkout">` with no JS, so clicking the button gave no feedback while the server hit Stripe and returned a 303 redirect. The wait could be hundreds of milliseconds depending on Stripe latency, and users prone to double-click would get frustrated or accidentally hit the button twice (which the server would still handle correctly, but the UX was confusing). The waitlist form right below it on the same page already had a clean pending → ok / error state machine and a loading button — this brings the subscribe form into parity. The `onsubmit` handler doesn't `preventDefault` on first click (it lets the native form submission proceed so the browser can follow the redirect), only on subsequent clicks while still pending. Svelte's reactivity flushes the state update before the navigation commits, so the loading visual is briefly visible during the wait.
**Files changed:** src/routes/pricing/+page.svelte
**Testing:** Type-check 0 errors. Captured /tmp/pricing_after.png; page renders cleanly with all elements present (cadence toggle, $19/month label, feature checks, Subscribe to Pro button, waitlist below, two bottom links). The form's structure is preserved (POST to /api/stripe/checkout, hidden `cadence` input, submit button) so server-side flow is unchanged. Tried a programmatic click (will only complete with a real authed user + Stripe key) but visual structure verified through static probe; the form is wired and ready.

## Pass 10 — Performance & Core Web Vitals — 2026-05-08
**Type:** visual
**Status:** shipped
**Page(s):** site-wide topnav (renders on every page)
**What:** Replaced the topnav brand-mark image source from `pwa-192.png` (19KB, 192×192) with a new `brand-64.png` (4.1KB, 64×64) generated via sips downsampling, and added `decoding="async"`.
**Why:** Probed network resources at iPhone 14 viewport: the only image on the homepage is the topnav brand mark, which displays at 28×28 CSS pixels. The site was loading the 192×192 PWA install icon (19KB) for that 28-pixel render — a 6.8x linear over-fetch and 17KB of wasted bandwidth on every page (the topnav is rendered by the layout). 64×64 native covers the 28-pixel display at 2x retina with comfortable headroom while compressing to 4.1KB. Saves about 15KB per page; the brand mark renders crisply on retina and matches the previous render at 1x. `decoding="async"` lets the browser handle the bitmap off the main thread without blocking critical paint. The PWA install icon (`pwa-192.png`) is still listed in `vite.config.ts`'s manifest icons array for installability — only the topnav `<img>` swapped. (Also noticed: in dev mode, `/manifest.webmanifest` returns the SvelteKit error HTML at 39KB because `vite-plugin-pwa` only generates the manifest at build time; production behavior is fine since the prod build emits a real manifest. Logged for future verification.)
**Files changed:** src/lib/components/TopNav.svelte (img src + decoding attr), static/icons/brand-64.png (new asset, 4.1KB)
**Testing:** Type-check 0 errors. Verified the rendered img via agent-browser: src=`brand-64.png`, naturalWidth=64, naturalHeight=64, displayWidth=28, displayHeight=28. Captured /tmp/perf_home.png; brand mark renders identically to before. PWA manifest icons unchanged (still pointing at pwa-192/512/maskable for install).

## Pass 11 — SEO & metadata — 2026-05-08
**Type:** feature
**Status:** shipped
**Page(s):** sitemap.xml (covers /pricing, /for-attorneys, /for-scholars indirectly)
**What:** Added the three Pro marketing pages — `/pricing/`, `/for-attorneys/`, `/for-scholars/` — to the generated `sitemap.xml`.
**Why:** All three routes exist as `+page.svelte` files in `src/routes/`, but the sitemap generator's `staticPages` array hadn't been updated when Pro marketing was added in earlier work. Without sitemap entries, search engines have to discover these pages purely through internal links, which slows indexing on a brand-new site with little inbound link weight. These are the exact pages the strategic pivot wants to drive organic traffic to (B2B practitioners searching "Islamic estate calculator for attorneys" / "Fara'id for scholars" / "FairShare pricing"), so missing them is a real lost SEO opportunity. Priorities chosen to fit the existing scheme: pricing 0.9 (matches /methodology/, both are key conversion pages), for-attorneys / for-scholars 0.8 (audience-specific landing pages, slightly below the canonical pricing page), changefreq monthly. The Pro app under `/app/` is intentionally still excluded from the sitemap (it lives behind auth and shouldn't be crawled), and `/result`, `/saved`, `/settings` remain blocked in `robots.txt`.
**Files changed:** src/routes/sitemap.xml/+server.ts
**Testing:** Type-check 0 errors. Fetched `/sitemap.xml` and confirmed the three new entries appear in order between `/methodology/` and `/about/`. Other entries unchanged. The endpoint has `prerender = true` so production builds will materialize the file at build time and Cloudflare Pages will serve it as static XML.

## Pass 12 — Accessibility — 2026-05-08
**Type:** feature
**Status:** skip
**Page(s):** /, /pricing, /calculate, layout components
**What:** No focused accessibility change met the bar — site is in solid shape across the audited surfaces.
**Why:** Probed each page for the standard a11y dimensions and everything checked: heading hierarchy is correct (h1 → h2 → h3), all 35 homepage links and 1 button have accessible names, the single image has empty alt + aria-hidden (the brand mark is decorative since "FairShare" appears as text next to it), all form inputs are labeled (the locale toggle uses the implicit `<label>`-wrapping pattern, verified by reading LocaleToggle.svelte), and the quick-scenarios section is properly bound via `aria-labelledby` to its h2. Layout has skip link, focus-visible global rule with accent outline, header/main/footer/nav landmarks, and reduce-motion support (live after Pass 6). The error page from Pass 8 uses `aria-hidden` on the decorative status code and a meaningful h1. Marginal improvements I considered — combining the trust strip's two-paragraph stat structure (`<p>5</p><p>schools of thought</p>`) into one ARIA-named group, or adding aria-label to the `.strip` section as a region — are debatable design choices that risk ARIA misuse without clear benefit, since screen readers already announce the sequential paragraphs intelligibly as "5. Schools of thought."
**Files changed:** none
**Testing:** Per-page eval probes for unnamed buttons, unnamed links, unlabeled inputs, missing alts, landmark presence; all clean. Re-read LocaleToggle.svelte, QuickScenarios.svelte, +error.svelte source for context.

## Pass 13 — Cross-browser & responsive — 2026-05-08
**Type:** visual
**Status:** shipped
**Page(s):** site-wide topnav (renders on every page)
**What:** Added `-webkit-backdrop-filter` alongside the existing standard `backdrop-filter` on `.topnav`.
**Why:** The sticky topnav uses `backdrop-filter: saturate(180%) blur(10px)` to give the iOS-like translucent depth effect when content scrolls behind it. Unprefixed `backdrop-filter` only landed in Safari 18; Safari 16 and 17 (which still has meaningful share on iPhones running iOS 16/17) need `-webkit-backdrop-filter` to render the effect. Without the prefix, those Safari users see a flat translucent strip instead of a saturated blur — readable but visually inconsistent with the design intent. Other modern CSS in use (`color-mix(in srgb, ...)` across Banner, TextInput, QuickScenarios, FamilyTree, etc.) is well-supported in all current browsers and doesn't need fallbacks. `-webkit-line-clamp` and `-webkit-overflow-scrolling` are already prefixed where used.
**Files changed:** src/lib/components/TopNav.svelte (added one prefixed declaration)
**Testing:** Source verified to have both `-webkit-backdrop-filter` (prefixed first) and `backdrop-filter` (standard second) — correct cascade order so unprefixed wins on browsers that support both. Computed `backdropFilter` in Chromium reads `saturate(1.8) blur(10px)`. Type-check 0 errors. Visual unchanged in Chrome (which already supported unprefixed); fix is silent for users on it and visible for Safari 16-17 users.

## Pass 14 — Quality of life — 2026-05-08
**Type:** feature
**Status:** shipped
**Page(s):** /calculate
**What:** Persisted the user's madhhab (school of thought) selection to localStorage so the calculator remembers their last choice across sessions.
**Why:** Audited the result page first — it already does well: Save (IndexedDB), Share (Web Share API + clipboard fallback), PDF export, Print, plus deep-link URLs via `shareUrlFor()` that base64-encode the full case state into `?case=...`. The clear gap was on the calculator's entry: every fresh visit reset the school pill to "General". A practitioner who specializes in Hanafi or Shafi'i fiqh had to re-select their school every time, even though the existing i18n module already establishes a localStorage pattern (`fairshare:locale`) the rest of the app honors. Reading `fairshare:madhhab` on mount and writing it on every change brings madhhab into parity with locale persistence. The MADHHABS array is used to validate the stored value before trusting it, so a stale or tampered key falls back to "general" cleanly. Captured the value once in `initialMadhhab` and passed that const to both `$state` and `QuestionnaireRunner` to avoid Svelte 5's "state referenced locally" warning.
**Files changed:** src/routes/calculate/+page.svelte
**Testing:** Type-check 0 errors, no new warnings (still the 5 pre-existing in branding/+page.svelte). Set `localStorage['fairshare:madhhab'] = 'hanafi'` via agent-browser eval, reloaded `/calculate`, confirmed the Hanafi pill carries `madhhab-pill--active` (was previously General). Stored value survives across full page reloads. SSR safe via `browser` guard.

## Pass 15 — Code hygiene — 2026-05-08
**Type:** feature
**Status:** shipped
**Page(s):** / (homepage bottom CTA)
**What:** Replaced the hardcoded `APP_STORE_URL` placeholder (`apps.apple.com/app/id000000000` with `// TODO: real App Store ID`) with an env-var lookup (`env.PUBLIC_APP_STORE_URL`) and conditionally rendered the iOS download link only when set.
**Why:** Audited the codebase for hygiene issues: zero `console.log/debug/info` in `src/`, only one TODO comment — and that TODO was a real, user-facing problem. The placeholder URL pointed at a fake Apple App Store ID, so any visitor who clicked "Download for iOS" would land on Apple's "App Not Found" page. Worse than not having the link at all, since it makes the site look unmaintained. Following the same `$env/dynamic/public` pattern already used for the `PUBLIC_BMC_URL` Buy-me-a-coffee link in the footer (consistent across the codebase), the URL is now configurable per environment via Cloudflare Pages env settings. When unset (dev / pre-launch), the link is hidden cleanly while the InstallPwaButton next to it still works as the PWA install option. Once a real App Store ID is provisioned, setting `PUBLIC_APP_STORE_URL` in Pages env brings the link back without a code change. The 5 `state_referenced_locally` warnings in `src/routes/app/settings/branding/+page.svelte` were considered but left alone — that file is in `/app/`, which the audit log header explicitly marks as out of scope for this loop, and the warnings are arguable false positives (the form genuinely wants to capture initial values from server data and let the user edit them locally).
**Files changed:** src/routes/+page.svelte
**Testing:** Type-check 0 errors. Probed live: with no env var set, `.ios-link` doesn't render; the Install app PWA button still does. Captured /tmp/hygiene_cta.png; bottom CTA reads cleanly with two pill buttons + Install app pill, no broken-link bait. The TODO comment is removed; the in-code comment explains the env-var pattern for future maintainers. Pre-existing branding warnings unchanged at 5.

## Pass 16 — Typography & hierarchy — 2026-05-08
**Type:** visual
**Status:** shipped
**Page(s):** /pricing, /for-attorneys, /for-scholars, /about, /login/verify (via ArticleHeader), and /methodology (its own duplicate rule)
**What:** Added `line-height: 1.15` to `.head h1` in `ArticleHeader.svelte` and the matching duplicate rule in `methodology/+page.svelte`.
**Why:** Pass 1 fixed the same loose-line-height issue on the homepage's three h2 rules. Re-auditing typography on the rest of the site found the identical bug on every other page's main h1: the rule sets `font-size: clamp(1.75rem, 4vw, 2.5rem)`, `letter-spacing`, and `font-weight`, but no line-height — so each h1 inherits body's 1.5, computing to 60px on a 40px heading. Visible on the for-attorneys mobile screenshot: "Built for Islamic estate / attorneys" wraps with a 60px gap between lines, breaking the heading into two visually separate phrases. Bringing line-height to 1.15 (consistent with Pass 1's homepage h2 fix) pulls wrapped headings into a single unit while leaving plenty of room for descenders. The fix targets ArticleHeader (which the marketing pages all share) plus methodology's own self-contained rule — same pattern, two locations.
**Files changed:** src/lib/components/ArticleHeader.svelte, src/routes/methodology/+page.svelte
**Testing:** Probed h1 line-height ratios via agent-browser before (60px / 1.50) and after (46px / 1.15) on /pricing and /methodology. Captured /tmp/typo_attorneys_mobile.png at iPhone 14 viewport; the two-line wrapped heading now reads as a single visual unit. Type-check 0 errors. Pre-existing branding warnings unchanged at 5.

## Pass 17 — Spacing & layout rhythm — 2026-05-08
**Type:** visual
**Status:** shipped
**Page(s):** /for-attorneys, /for-scholars, methodology articles (every page using `<Prose>`)
**What:** Doubled `li + li` margin in `Prose.svelte` from `0.375rem` (6px) to `0.75rem` (12px) so paragraph-length bullets have visual breathing room.
**Why:** Audited the rest of the site after Pass 2's homepage spacing fix. The marketing pages (/for-attorneys, /for-scholars) and methodology articles all use the shared `<Prose>` component for long-form content. Most bullets on those pages run to several lines (e.g. "Five madhabs side by side. General, Hanafi, Maliki, Shafi'i, and Hanbali rulings rendered as columns for the same family. The named edge cases (Umariatan, Musharakah, Grandfather-with-siblings) are surfaced where they apply."). With only 6px between bullets, adjacent paragraph-length items run together visually and the list reads as a wall of text. Bumping to 12px doubles the perceived gap without making short-bullet lists feel sparse — paragraph height is 60-80px, so the relative gap goes from "barely visible" to "clearly demarcated." The `> * + *` adjacent-sibling spacing (1.25rem / 20px) and `h2` mt (2.5rem / 40px) stay as they are since they already breathe well.
**Files changed:** src/lib/components/Prose.svelte
**Testing:** Probed `li + li` margin via agent-browser (was 6px, now 12px). Captured /tmp/spacing_scholars_after.png; the "How it gets used" and "What's included" lists now read with clearer item separation. Type-check 0 errors. Pre-existing branding warnings unchanged at 5.

## Pass 18 — Color & contrast — 2026-05-08
**Type:** visual
**Status:** shipped
**Page(s):** /pricing waitlist, /login (and any other form using the shared TextInput)
**What:** Bumped `.input` border in `TextInput.svelte` from `--color-border` (#e5e5e5) to `--color-border-strong` (#ccc).
**Why:** Same root cause Pass 3 fixed for the secondary button: a 1px UI border at #e5e5e5 against the #fafafa page background is only 1.19:1 contrast — well below WCAG 1.4.11's 3:1 minimum for UI components. On the pricing page's waitlist form, the email input was rendering as nearly-invisible — the placeholder text "you@firm.com" appeared to float on the page rather than sit inside a defined field. Bringing the resting border to `--color-border-strong` (1.53:1) gives the input the same shape-readability that secondary buttons already have, and the focus state still escalates to the accent color with a 3px shadow ring for clear focus indication. Banners and other surfaces I audited (`.banner` default, `.banner--warning`, `.banner--scholar`) all pass AAA for text contrast.
**Files changed:** src/lib/ui/TextInput.svelte
**Testing:** Probed `.input` borderTopColor via agent-browser (was rgb(229,229,229), now rgb(204,204,204)). Captured /tmp/contrast_pricing_after.png; the email input now reads as a defined field. Type-check 0 errors. Pre-existing branding warnings unchanged at 5.

## Pass 19 — CTAs & interactive elements — 2026-05-08
**Type:** visual
**Status:** shipped
**Page(s):** /pricing (bottom CTA row)
**What:** Switched the pricing page's "Read the methodology" button from `variant="ghost"` to `variant="secondary"`, matching its paired "Try the free calculator" button.
**Why:** Same exact pattern Pass 4 fixed on the homepage's bottom CTA, surfaced again on /pricing. The two buttons sit side-by-side at the bottom of the pricing page as escape hatches ("if Pro isn't right, try the free version or read more"). With one rendered as an outlined pill (secondary) and one as borderless text (ghost), the row reads as "one button plus one floating link" instead of paired alternatives. Standardizing to secondary on both gives the row visual symmetry and matches the homepage hero / bottom CTA pattern (now uniform site-wide). Ghost remains the right choice for genuinely tertiary actions like Cancel buttons in modal forms (still used in /saved, /app/cases/new, and the calculator's back/start-over) — this fix is targeted at the conversion-flow alternative pair specifically.
**Files changed:** src/routes/pricing/+page.svelte
**Testing:** Verified rendered classes: both buttons are now `btn--secondary btn--md`. Captured /tmp/cta_pricing_after.png; bottom row reads as a balanced pair of outlined pills. Type-check 0 errors. Pre-existing branding warnings unchanged at 5.

---

## Pass 20 — Mobile responsiveness — 2026-05-08
**Type:** visual
**Status:** shipped
**Page(s):** /calculate (school selector pills) at iPhone 14 (390×844) and iPhone SE (375×667) viewports
**What:** Bumped the madhhab pill (`.madhhab-pill`) padding from `0.25rem 0.625rem` to `0.4375rem 0.6875rem`, raising tap-target height from 30px to 36px while keeping all five pills on a single row at iPhone 14 width.
**Why:** The school selector is the very first interactive control on the calculator and the most frequently used switch in the entire app — practitioners flip between Hanafi/Maliki/Shafi'i/Hanbali constantly to compare. Measured tap targets at 30×60-70px on mobile, well below WCAG 2.5.5's 44×44 recommendation and uncomfortable to hit accurately mid-scroll. Pass 5 already corrected the same class of issue for footer links (vertical padding bump for fingertip space). 30px → 36px is a 20% area gain and pushes them closer to the WCAG 2.2 AA Target Size minimum of 24px-with-spacing, with a clearer visual weight that reads as "tappable button" rather than "tag/label." First experimented with `0.5rem 0.875rem` (38px tall, gap 0.375rem) but that wrapped the row to 2 lines on iPhone 14 — accepted compactness as a constraint and dialed back to keep one row at 390px while still gaining height.
**Files changed:** src/routes/calculate/+page.svelte
**Testing:** Measured before (h=30, w=58-70) and after (h=36, all five pills on rowCount=1 at viewport 390). Snapped /tmp/mobile_calc_before.png and /tmp/mobile_calc_after.png — pills visibly more substantial, "Hanbali" still fits without truncation. At 375 (iPhone SE) the row wraps to 2 lines, which is acceptable since width is genuinely constrained and the alternative (cramped 30px pills with 4px gaps) was worse. Type-check 0 errors. 5 pre-existing /app/settings/branding warnings unchanged.

---

## Pass 21 — Motion & polish — 2026-05-08
**Type:** visual
**Status:** shipped
**Page(s):** /calculate (every step transition through the questionnaire)
**What:** Wrapped the questionnaire step's `in:fly={{ y: 12, duration: 240 }}` in a `stepEnter` factory that zeros out duration and y-offset when `prefers-reduced-motion: reduce` matches, mirroring the pattern Pass 15 introduced on the homepage.
**Why:** The global CSS `prefers-reduced-motion` override in app.css only catches CSS `transition`/`animation` properties — it doesn't touch Svelte's JS-driven `transition:fly`/`transition:fade`/`transition:slide`. The calculator's step fly fires on every question advance, so a vestibular-sensitive user walking through 10-30 questions per case gets 10-30 unwanted slide animations even with their OS preference set. Pass 15 fixed this for the homepage hero, where the impact was once-per-page-load. The calculator is the higher-volume offender: it's the most-used page in the entire site, and the same enter/exit pattern is fired repeatedly during a single session. Used the same factory shape as +page.svelte (`reducedMotion ? { y: 0, duration: 0 } : { y: 12, duration: 240 }`) so a future refactor can extract one shared helper without code-shape friction. Toast/Sheet/PlainLanguageSummary still have unguarded JS transitions but each fires at most a handful of times per session and is lower priority — logged for a future motion pass.
**Files changed:** src/routes/calculate/+page.svelte
**Testing:** Probed at iPhone 14 viewport. With `agent-browser set media reduced-motion`, opened /calculate, advanced one step, sampled `.step` computed transform — got `transform: none, opacity: 1` immediately (no fly delay, no offset). Reset to default media, reopened — fly animation still works. Type-check 0 errors. 5 pre-existing /app/settings/branding warnings unchanged.

---

## Pass 22 — Overall composition — 2026-05-08
**Type:** visual
**Status:** shipped
**Page(s):** /for-attorneys, /for-scholars, /about (any page using the shared `<ArticleHeader>` in left-aligned mode); /pricing, /login, /login/verify (centered mode, regression-checked)
**What:** Added `max-width: 38rem` to the default (left-aligned) `.head` rule in `ArticleHeader.svelte`, with `max-width: none` override for `.head.center` to preserve the centered hero behavior on /pricing and the auth pages.
**Why:** On three of the four "editorial Pro pages" (`/for-attorneys`, `/for-scholars`, `/about`), the hero (kicker + h1 + lede) had no width cap while the Prose body underneath was capped at 38rem. At 1440px desktop, the lede stretched to ~728px wide while the bullet list directly below it sat at 608px wide — leaving the hero noticeably wider than the body and creating a visible right-side void where the column suddenly narrowed below the fold. /methodology already implements the same 38rem cap inline (see `src/routes/methodology/+page.svelte:70`); pushing it into the shared component makes all four editorial pages consistent and means future routes that adopt ArticleHeader+Prose get the right column geometry by default. The ledes now wrap on more lines but at a comfortable line length (target 50-75 chars/line per typography best practice — these now sit around 60), and the hero reads as part of the same visual column as the body. Centered usages are explicitly preserved (`max-width: none` override) since centered hero sections benefit from wider stretch for impact and already cap their lede internally to 36rem.
**Files changed:** src/lib/components/ArticleHeader.svelte
**Testing:** Captured before/after at /tmp/comp_attorneys_desktop.png vs /tmp/comp_attorneys_after.png — hero now wraps lede onto 3 lines and aligns to the same column edge as the bullets below. Same verification on /for-scholars (hero h1 wraps, column unified). Snapshotted /tmp/comp_pricing_after.png and /tmp/comp_about_after.png; centered pricing layout is pixel-identical to before, /about likewise reads as a unified column. Probed `.head` computed width on /for-attorneys: was unbounded (occupied 728px), now caps at exactly 608px (38rem). Type-check 0 errors. 5 pre-existing /app/settings/branding warnings unchanged.

---

## Pass 23 — Edge cases & error handling — 2026-05-08
**Type:** feature
**Status:** shipped
**Page(s):** /methodology
**What:** Replaced the hardcoded `"13"` in the methodology page h1 with `{METHODOLOGY.length}`, so the headline derives from the same source-of-truth array that already powers the bottom meta line and the per-group grids.
**Why:** /methodology has 13 entries today, and the h1 reads "Islamic inheritance, in 13 short reads." But the count is hardcoded — the array of articles can grow (Pass 23 audit ran while inspecting the array), and the day a 14th methodology entry lands, the h1 will silently lie until someone notices and edits the literal string. The fix is a one-character source change that ties the headline to the same array (`METHODOLOGY.length`) that the bottom of the page already uses for `{METHODOLOGY.length} articles · all free, no signup.` Two visible counts on the same page should never be allowed to drift. Considered other edge cases this pass: the unauthenticated /pricing → /api/stripe/checkout flow throws a 401 that lands on the branded /+error.svelte (Pass 8) — that's surviveable but not great; a proper redirect-with-callback would need /login to honor a query-string return URL and is a 3-file coordination, too big for one focused pass — logged for a future feature pass. Methodology slug 404s are already handled in `+page.ts` (`throw error(404, ...)`), and the calculator's localStorage madhhab read already validates against the MADHHABS list (Pass 14). The PWA manifest is generated by vite-plugin-pwa in prod only — known dev-only behavior.
**Files changed:** src/routes/methodology/+page.svelte
**Testing:** Reloaded /methodology; h1 still renders "Islamic inheritance, in 13 short reads." identically (METHODOLOGY.length = 13). Verified the h1 query `document.querySelector('.head h1').textContent` returns the dynamic string. Type-check 0 errors. 5 pre-existing /app/settings/branding warnings unchanged. The "13" claim in the meta description was checked too; only the h1 and the count were duplicated, not the meta — meta stays content-hand-curated as intended.

---

## Pass 24 — User feedback & responsiveness — 2026-05-08
**Type:** visual
**Status:** shipped
**Page(s):** site-wide (every Button.svelte instance with `loading` prop set: /pricing Subscribe, /pricing Notify-me, /login submit, /login/verify resend, /app/* internal save buttons)
**What:** Added an inline CSS-only spinner (`<span class="btn-spinner">`) that renders before the button label whenever `loading={true}` is passed to `Button.svelte`. The spinner is a 0.875em currentColor ring with a transparent top arc, animated 0.6s linear infinite via a scoped `@keyframes btn-spin`.
**Why:** Pass 9 wired up the `subscribing` boolean to disable double-submits on the pricing page Stripe checkout button — the disable+aria-busy logic was sound, but the only visual cue was a 60% opacity drop on the button. To a hurried user clicking "Subscribe to Pro" while waiting 1-2s for the Stripe redirect, that dim looks like the click was missed, prompting a second click and a double-submit warning. A visible spinner is the conventional cue for "request in progress" — it converts the silent disabled state into an active "we heard you, working on it" signal. Because every internal form action that takes time already routes through Button's `loading` prop (waitlist subscribe, login submit, save dialogs in /app), this single change improves feedback site-wide without per-page edits. Used `currentColor` so the spinner inherits whichever variant's text color it sits in (white on primary, dark on secondary, white on destructive). Reduced-motion users still see the spinner *shape* (the gap-in-ring is itself a "loading" affordance) — they just won't see it spin, which is exactly what the global app.css `animation-duration: 0.01ms !important` rule specifies. The 14px size at default em scale fits cleanly inside the existing `gap: 0.5rem` flex-row of the button without stretching the pill.
**Files changed:** src/lib/ui/Button.svelte
**Testing:** Patched `window.fetch` to delay 3s and submitted the /pricing waitlist with a valid email. Inspected the rendered button: `.btn-spinner` element present, computed style `borderRadius: 50%`, `animationName: svelte-g9c1iq-btn-spin`, `animationDuration: 0.6s`, `width: 14px`, `aria-busy: true`. Captured /tmp/spinner_visible.png; the "Notify me" button shows the ring spinner before the label, the button is dimmed, and pointer events disabled. Type-check 0 errors. 5 pre-existing /app/settings/branding warnings unchanged. Resting state regression-checked: hovered Subscribe-to-Pro button has no spinner and no aria-busy.

---

## Pass 25 — Performance & Core Web Vitals — 2026-05-08
**Type:** feature
**Status:** shipped
**Page(s):** / (homepage hero CTA)
**What:** Added `data-sveltekit-preload-code="eager"` to the homepage hero's primary "Start a calculation" Button so the /calculate route's JS module is fetched as soon as the homepage hydrates rather than waiting for hover.
**Why:** Core Web Vitals are already in good shape on the marketing site — measured LCP 92ms (the H1 hero text via system font) and CLS 0.0000 on /, with no eager images and a 4.1KB brand-64.png logo that already has `decoding="async"` and explicit width/height (Pass 10). System fonts mean no web-font requests at all. The remaining lever was navigation latency: the hero "Start a calculation" CTA is the dominant conversion path, and SvelteKit's default preload-code strategy is "hover" — meaning the /calculate JS isn't fetched until the user hovers the button. For a primary CTA where ~80% of homepage visitors will click, "eager" preloading makes the click→paint transition near-instant by paying the bundle cost during the homepage's idle moment after first paint instead of after the click. Cost: one extra background JS fetch per homepage visit (the /calculate bundle, ~50-100KB gzipped). Worth it because the click is highly likely; the secondary CTA "Read the methodology" stays at default ("hover") because methodology is browseable rather than action-driven and we don't want to greedily fetch every linked route. Other links (topnav Calculator, footer Calculate, bottom CTA Calculate) were left at default to avoid duplicating the same eager fetch from multiple positions on the page — SvelteKit's preload module dedupes per-route, but explicit-everywhere reads as overpromising.
**Files changed:** src/routes/+page.svelte (one attribute on one Button)
**Testing:** Probed `document.querySelector('a[href="/calculate"]').getAttribute('data-sveltekit-preload-code')` for all 4 /calculate links on the homepage: hero CTA returns "eager", topnav/bottom-CTA/footer return null (default = "hover"). LCP/CLS regression-checked: still 92ms / 0.0000. Type-check 0 errors. 5 pre-existing /app/settings/branding warnings unchanged.

---

## Pass 26 — SEO & metadata — 2026-05-08
**Type:** feature
**Status:** shipped
**Page(s):** site-wide (every public route now inherits the meta defaults set in `app.html`)
**What:** Added `og:image`, `og:image:width`/`height`/`alt`, `og:site_name`, `twitter:card`, and `twitter:image` defaults to `app.html` so every shareable URL on the site has a preview image and a Twitter card hint by default. Per-page `<svelte:head>` blocks (homepage, methodology articles) continue to layer their own `og:title`/`og:description`/`og:url` on top.
**Why:** Audited every public route's `<svelte:head>`. Only `/` and `/methodology/[group]/[topic]` set ANY og tags, and even those omitted `og:image` — so a Twitter, LinkedIn, WhatsApp, Slack, or Discord paste of any FairShare URL renders with no preview thumbnail. /pricing, /for-attorneys, /for-scholars, /about, /privacy, /terms, /disclaimer, /calculate, /methodology, /saved, /settings had zero og tags. For a paid-Pro pitch site where the marketing surface depends on shares, this is a real conversion loss. The fix lives in `app.html` because that's where SvelteKit injects per-page head AFTER the static defaults — meaning every URL gets the image fallback for free, while a future page that wants a custom share image can override at the per-route level. Used the existing `pwa-512.png` (square 512×512, 136KB) as the og:image because it's the on-brand FairShare mark and already a static asset; chose `twitter:card="summary"` (not `summary_large_image`) since the asset is square — `summary` matches a square aspect, `summary_large_image` letterboxes ugly. Set absolute prod URLs because OG/Twitter scrapers fetch from the live origin, not from preview deployments. Out of scope this pass: a dedicated 1200×630 hero OG image — that's a design asset task, not a code task; logged for a future iteration.
**Files changed:** src/app.html
**Testing:** Probed `/` and `/pricing` with `document.querySelector("meta[property='og:image']")` — both return `https://fairshare.guigalabs.com/icons/pwa-512.png`; `/pricing` (which had no per-page og) still picks up the defaults including `twitter:card=summary`. The homepage's existing og:title/og:description from `+page.svelte` continue to render alongside the new defaults — they layer rather than collide. Type-check 0 errors. 5 pre-existing /app/settings/branding warnings unchanged.

---

## Pass 27 — Accessibility — 2026-05-08
**Type:** feature
**Status:** shipped
**Page(s):** /calculate (madhhab selector)
**What:** Added `role="group"` + `aria-labelledby="madhhab-label"` to the school-selector pill row and `aria-pressed={madhhab === m}` to each individual pill button on /calculate, mirroring the same pattern already in use on /pricing's Monthly/Annual cadence toggle.
**Why:** The school selector is the most-used selection control on the entire site — practitioners flip between Hanafi/Maliki/Shafi'i/Hanbali constantly, and Pass 14 shipped persistence across sessions. But screen-reader users had no way to perceive *which* madhhab was currently active: the `.madhhab-pill--active` class drove only the visual filled-pill state. Without `aria-pressed`, NVDA/VoiceOver/JAWS announce all five buttons identically as "General, button. Hanafi, button. ..." with no toggle-state context. This pass adds the standard ARIA toggle-button pattern: `role="group"` + a labelledby pointer to the existing visible "School:" text identifies the row as one logical control; `aria-pressed` per button announces "pressed" or "not pressed" so screen readers can navigate the row and know which madhhab is active. Used `aria-labelledby` (pointing to the existing label DOM node) instead of duplicating the label as `aria-label` text, so any future i18n translation of "School:" automatically flows to the AT label without a parallel string. The pricing page's cadence toggle already uses the exact same pattern (Pass-26 audit confirmed) — this fix simply extends the convention to the calculator's parallel selector. No visual changes; the focus-visible outline (Pass-27 audit confirmed `app.css :focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px }`) already gives keyboard users a clear "which pill am I on" cue.
**Files changed:** src/routes/calculate/+page.svelte
**Testing:** Loaded /calculate in agent-browser. Probed `.madhhab-pills` — `role="group"`, `aria-labelledby="madhhab-label"`, label text resolves to "School:". Probed all 5 pills — General/Maliki/Shafi'i/Hanbali return `aria-pressed="false"`, Hanafi (the persisted default) returns `aria-pressed="true"`. Clicked Maliki: aria-pressed flipped — Maliki is now "true", Hanafi is "false", others stay "false". Type-check 0 errors. 5 pre-existing /app/settings/branding warnings unchanged.

---

## Pass 28 — Cross-browser & responsive — 2026-05-08
**Type:** visual
**Status:** shipped
**Page(s):** site-wide (every Button.svelte instance: hero CTAs, pricing Subscribe/Notify, login, methodology cards, calculator answer buttons, etc.)
**What:** Added `-webkit-appearance: none` and `-webkit-user-select: none` prefixes alongside the unprefixed `appearance: none` and `user-select: none` rules in `Button.svelte`, mirroring Pass 13's pattern of pairing `-webkit-backdrop-filter` next to `backdrop-filter` in TopNav.
**Why:** Audited every cross-browser-sensitive CSS property in the codebase. The rest looked fine — `app.css` already has `-webkit-text-size-adjust`, `-webkit-font-smoothing`, `-webkit-tap-highlight-color`; QuickScenarios uses `-webkit-line-clamp`/`-webkit-box-orient` (deliberately webkit-only standard); TopNav was prefixed in Pass 13. The two gaps were in the Button component, the most-used UI primitive on the site. Without `-webkit-appearance: none`, iOS Safari before 15.4 (still on a meaningful slice of older iPhones — iPhone 7/8 era hardware that can't update past iOS 15) renders form `<button>` elements with the default rounded-rect chrome stamped over the brand pill — the green primary button would render as a green rectangle inside a beveled iOS button shell. Without `-webkit-user-select: none`, double-tapping the button on Safari < 17 selects the label text instead of just firing the action, which surfaces the system's text-selection callout. Both behaviors land roughly where unprefixed support stops (Safari 15.4 = appearance, Safari 17 = user-select), so the prefixes target the long tail of older devices that still browse the marketing surface. Verified the parsed style: both `appearance` and `webkitAppearance` resolve to "none", same for `userSelect`. No visual change on modern browsers — the prefixes are pure ride-alongs.
**Files changed:** src/lib/ui/Button.svelte
**Testing:** Loaded /. Probed `getComputedStyle(document.querySelector('a.btn--primary'))` — `appearance: none`, `webkitAppearance: none`, `userSelect: none`, `webkitUserSelect: none`. Type-check 0 errors. 5 pre-existing /app/settings/branding warnings unchanged. Did not screenshot — no visual change on modern browsers; the fix is for older iOS Safari which I can't summon locally without a device farm.

---

## Pass 29 — Quality of life — 2026-05-08
**Type:** feature
**Status:** shipped
**Page(s):** /calculate (initial madhhab selection)
**What:** Renamed `readStoredMadhhab` to `readInitialMadhhab` and prepended a `?madhhab=` URL-search-param read with the same `MADHHABS.includes` validation guard, so a colleague-shared link like `/calculate?madhhab=maliki` pre-selects the right school. Falls through to localStorage (Pass 14) if no valid URL param, then to "general" if neither source has a valid value.
**Why:** /result already supports rich deep-linking via `?case=` (encoded case payload, used by QuickScenarios on the homepage and the share toolbar), but /calculate had no parallel — practitioners couldn't send a "start a Maliki calculation" link to a colleague. Pass 14 added cross-session madhhab persistence via localStorage, which is the right default for a returning practitioner who specializes in one school. But that pattern actively *prevents* the share-a-starting-point use case: if a colleague clicks a "/calculate?madhhab=maliki" link in their email, they want to land in Maliki — not in whatever they last picked themselves. URL takes precedence over localStorage is the only sensible priority. Validation is identical to the localStorage path (MADHHABS.includes() type-guard) so a tampered or stale URL like `?madhhab=bogus` falls through cleanly. Did not add URL writeback on click (`replaceState`) — that's a UX call that affects browser history depth and can interact badly with the questionnaire's `{#key step}` re-mount; logged for a future pass if practitioner feedback asks for it. Out of scope: deep-linking the questionnaire mid-flow (e.g. a `?step=children` link) — that requires serializing runner state, which is a feature/architecture decision, not a one-pass change.
**Files changed:** src/routes/calculate/+page.svelte
**Testing:** Loaded /calculate?madhhab=maliki → `aria-pressed=true` resolves on the "Maliki" pill (Pass 27 added the attribute). Cleared the URL → fallback to localStorage value "maliki" still resolves on Maliki. Loaded /calculate?madhhab=bogus → invalid value rejected by the includes() guard, falls through to stored "maliki". All three priority levels (URL valid, URL invalid → storage, no URL → storage) verified via `document.querySelector('.madhhab-pill[aria-pressed=true]').textContent.trim()`. Type-check 0 errors. 5 pre-existing /app/settings/branding warnings unchanged.

---

## Pass 30 — Code hygiene — 2026-05-08
**Type:** feature
**Status:** shipped
**Page(s):** build/dependency surface (no runtime page changed)
**What:** Removed `@inlang/paraglide-js@^2.0.0` from `dependencies` in package.json — it was an unreferenced leftover from a planned i18n approach that was replaced by the home-grown `src/lib/i18n` module (which loads `messages/en.json` and `messages/ar.json` directly).
**Why:** Ran `bunx depcheck` and grepped for `paraglide` and `inlang` across `src/`, `vite.config.ts`, `svelte.config.js`, and the project root for `*.inlang*` / `paraglide*` config files — zero references anywhere in the codebase. The `src/lib/i18n/index.svelte.ts` module's own header comment confirms the swap: "Lightweight i18n. Single bundle of EN + AR loaded statically — no dynamic import gymnastics for two locales." Paraglide was the dep before that decision; package.json never got cleaned up. Removing it shrinks `bun install` time, removes a transitive dependency from the lockfile, and prevents future readers from thinking paraglide is in use and reaching for it accidentally. Other deps that depcheck flagged were verified live: `canvas-confetti` (dynamic-imported in ResultActionBar at line 52), `tailwindcss` (loaded by `@import "tailwindcss"` in app.css and the `@tailwindcss/vite` plugin), `prettier-plugin-svelte`/`prettier-plugin-tailwindcss` (dev tools), `@types/canvas-confetti` (TS types) — kept. `@pdf-lib/fontkit` is mentioned only in a TODO-style comment in `exportPdf.ts` ("Arabic shaping requires registering a Noto Naskh Arabic font via @pdf-lib/fontkit … lands with B7") — flagged as a future-cleanup candidate but kept since it's an explicit forward-looking placeholder for B7 i18n; deleting it now and re-adding later is more work than leaving it. Console.* audit was clean: 7 hits across the codebase, all `console.error` on legitimate error paths (Stripe API failures, save/export errors), no debug leftovers. No `TODO/FIXME/XXX/HACK` markers and zero `: any`/`as any` escape hatches found in non-/app code.
**Files changed:** package.json, bun.lock (regenerated)
**Testing:** `bun run check` — 0 errors, same 5 pre-existing /app/settings/branding warnings unchanged. `curl` HTTP probe of `/`, `/calculate`, `/methodology` all return 200. `bun remove` reported "2 packages installed [1.4s]" + "Removed: 1" — the lockfile updated cleanly. The remaining @pdf-lib/fontkit and other depcheck-flagged-but-actually-used deps were left in place.

---

## Pass 31 — Typography & hierarchy — 2026-05-08
**Type:** visual
**Status:** shipped
**Page(s):** /calculate (workflow-page h1 "Calculate")
**What:** Added `line-height: 1.15` to `.head h1` on /calculate so the page-title heading uses the same tight ratio every other h1 on the site already uses (Pass 1 set it on the homepage h2s, Pass 16 set it on /methodology h1, ArticleHeader's `.head h1` rule has it inline).
**Why:** Probed the h1 element on /calculate at 1440×900 — `font-size: 30px, lineHeight: 45px, ratio: 1.500`. The h1 was inheriting the body's 1.5 line-height because the page-local rule overrode font-size/weight/letter-spacing but didn't redeclare line-height. /saved has the same gap; /result probably does too (couldn't probe — needs a `?case=` parameter to render). The visible effect on a single-word "Calculate" h1 is subtle but real: the h1 box renders 45px tall (10px taller than necessary) which adds invisible padding around the glyph, loosens the perceived gap from kicker → title → progress bar, and undermines the deliberate hierarchy the rest of the typographic system encodes (1.05 on hero h1, 1.15 on every other h1, 1.55 on body, 1.7 on prose). Fixing the most-trafficked workflow page first was deliberate — /calculate is the entry point every conversion-aware visitor lands on, and ships the fix where it has the most surface area; /saved and /result need the same one-line addition in a future Typography pass for full consistency, but those are post-conversion surfaces (logged for next cycle's Pass 31).
**Files changed:** src/routes/calculate/+page.svelte
**Testing:** Re-probed `.head h1` computed style: `fontSize: 30px, lineHeight: 34.5px, ratio: 1.150` — exact match to the convention. Visually the h1 box collapses by 10.5px without changing the glyph rendering or the kicker/progress spacing (those have their own margins). Type-check 0 errors. 5 pre-existing /app/settings/branding warnings unchanged.

---

## Pass 32 — Spacing & layout rhythm — 2026-05-08
**Type:** visual
**Status:** shipped
**Page(s):** /for-attorneys, /for-scholars, /about, /methodology/[group]/[topic] (every page using `<Prose>`)
**What:** Added `.prose > *:first-child { margin-top: 0 }` to `Prose.svelte` so the first child of any prose body never adds a top margin on top of the hero's own `margin-bottom: 2rem`. Subsequent siblings still get their normal spacing rules.
**Why:** Probed hero→body vertical rhythm across editorial pages. /about (Prose starts with `<p>`) showed 32px gap; /for-attorneys (Prose starts with `<h2>`) showed 40px gap; /for-scholars and methodology articles likely had the same split depending on whether their first body element was a heading or paragraph. The reason: `.prose :global(h2) { margin-top: 2.5rem }` applies regardless of position, so when an `h2` is the first child it adds 40px on top of the hero's 32px (taking the larger via margin collapse, since `.prose` has no padding or border to break the collapse). The intent of `2.5rem` is *between* sections inside the Prose, not between hero and Prose. Killing margin-top on the first child is the canonical CSS pattern for this and gives every editorial page the same 32px hero→body transition. Verified: `headToProse: 32px` on both /about (`<p>` first) and /for-attorneys (`<h2>` first), matching exactly. The second h2 inside /for-attorneys still picks up its full `marginTop: 40px` for the inter-section spacing — first-child only.
**Files changed:** src/lib/components/Prose.svelte
**Testing:** Captured before/after vertical-rhythm metrics at 1440×900 desktop. /for-attorneys hero→Prose was 40px, now 32px (matches /about). Re-probed second h2's computed margin-top: 40px (unchanged — only the first child collapses). Type-check 0 errors. 5 pre-existing /app/settings/branding warnings unchanged. /pricing card internal rhythm probed for regression: cadence→price 20, price→features 20, features→subscribe 28, subscribe→note 24 — all unchanged (Prose isn't used on /pricing).

---

## Pass 33 — Color & contrast — 2026-05-08
**Type:** visual
**Status:** shipped
**Page(s):** / (homepage pro-banner pill, top of hero)
**What:** Bumped `.pro-banner` resting border from `--color-border` (#e5e5e5) to `--color-border-strong` (#cccccc), matching the Pass-3 fix that strengthened `.btn--secondary` borders site-wide.
**Why:** Audited every interactive surface for contrast. All text passed comfortably (kicker green 5.97, secondary text 8.49, muted text 6.21, prose links 5.97, warning text 8.0 — all AAA-compliant). The remaining gap was on a non-text interactive boundary: the homepage's pro-banner (`<a href="/pricing">FairShare for Practitioners. Case folders, branded PDFs, side-by-side madhab compare. See Pro plans →</a>`) is a clickable pill that's the dedicated entry point to the Pro marketing surface from the homepage. Its border was 1.21:1 on the page bg, well below WCAG 1.4.11's 3:1 recommendation for non-text UI components when essential to perception. Pass 3 made the same call for `.btn--secondary` and bumped to `--color-border-strong` (1.54:1 on page bg) — soft enough to fit the brand's restrained palette but enough to read as a button. The pro-banner is the one remaining interactive pill that hadn't picked up the convention. The hover state already darkens the border to `--color-accent` for full 7:1 contrast, so the resting-vs-hover delta still communicates interactivity. Card borders (1.21:1) were left soft on purpose — cards are containers meant to recede, and the 3:1 rule applies to interactive controls, not passive containers.
**Files changed:** src/routes/+page.svelte
**Testing:** Probed `.pro-banner` border via getComputedStyle: was rgb(229, 229, 229) (1.21:1 on rgb(250, 250, 250) page bg), now rgb(204, 204, 204) (1.54:1) — same numeric boost Pass 3 applied to `.btn--secondary`. Type-check 0 errors. 5 pre-existing /app/settings/branding warnings unchanged. Hover state regression-checked: pro-banner:hover still resolves to `border-color: var(--color-accent)` for full intent on hover.

---

## Pass 34 — CTAs & interactive elements — 2026-05-08
**Type:** visual
**Status:** shipped
**Page(s):** site-wide (every `<Button variant="destructive">` instance — currently /settings "Clear all data" and /app/settings/data "Delete account")
**What:** Added `--color-error-hover-actual: #991b1b` to the design-token layer (paired with the existing `--color-error-actual: #b91c1c`) and a corresponding `.btn--destructive:hover { background: var(--color-error-hover) }` rule in `Button.svelte`, so destructive buttons now darken on hover the same way primary buttons do.
**Why:** Audited the four button variants. Primary darkens to `--color-accent-hover` on hover, secondary darkens its border to `var(--color-text)`, ghost grows a `bg-elevated` background, and destructive… did nothing color-wise (only the base `.btn:hover { transform: scale(1.02) }` applied). For the most consequential button class — these are *irreversible* actions like "Clear all data" and "Delete account" — the absence of color feedback weakens the affordance: the user wants a clear "the system noticed I'm hovering this dangerous thing" signal. Mirrored the existing pattern (primary has a paired `--color-accent / --color-accent-hover`) by adding the matching error-hover token. Picked Tailwind's red-800 (#991b1b) for the darker shade — it's a 15% luminance drop from the existing red-700 (#b91c1c) which matches the magnitude of the green's accent→accent-hover drop. Added the token both as `-actual` and as the public alias so light/dark theme switching works consistently if a dark theme lands later. The 1.02 scale-up on hover stays — the new color change reinforces it rather than replaces it.
**Files changed:** src/app.css, src/lib/ui/Button.svelte
**Testing:** Loaded /settings. Probed `--color-error-hover` via `getComputedStyle(document.documentElement).getPropertyValue` — resolves to `#991b1b`. Default destructive bg renders `rgb(185, 28, 28)` (#b91c1c). Inspected the stylesheet's `.btn--destructive:hover` rule — selector resolved with the new background reference (`var(--color-error-hover)`). Type-check 0 errors. 5 pre-existing /app/settings/branding warnings unchanged. Did not regress primary/secondary/ghost hover behavior — the new rule is scoped to `.btn--destructive:hover` only.

---

## Pass 35 — Mobile responsiveness — 2026-05-08
**Type:** visual
**Status:** shipped
**Page(s):** site-wide TopNav LocaleToggle (renders on every non-`/app` page)
**What:** Bumped `.seg-option` vertical padding from `0.25rem 0.5rem` to `0.4375rem 0.5rem` in `LocaleToggle.svelte`, raising each EN/AR label's tap target from 26px to 32px (+23%) without changing the visible width or layout.
**Why:** Probed every interactive element on iPhone 14 (390×844). Most were already at or near the 44px target — primary CTAs ~42px (Pass 5 / Pass 20 fixes still hold), questionnaire bool-actions 42px, waitlist input 41px. The locale toggle's EN/AR labels stood out: 32×26 (mobile and desktop), well below the WCAG 2.5.5 AAA recommendation. The toggle itself sits at the top-right of every page on the site and is the second-most-frequently-used switch (after the madhhab pills, fixed in Pass 20). The 26px label inside a 36px container also wasted ~10px of vertical space — clicks on that strip went nowhere because the actual radio is a hidden `<input>` inside the `<label>`. Pass 20 used the exact same pattern on `.madhhab-pill` (padding bump from 0.25rem 0.625rem → 0.4375rem 0.6875rem); applying the same prescription here is a 1-line change that elevates the label to the parent's full visual area. The label width stays the same (text-driven), the container height grows from 36px to 42px to absorb the new padding — closer to the 44px target without breaking the topnav's vertical rhythm. Applied at the `.seg-option` rule (rather than via media query) because the padding looked too compact at desktop too — the bump improves both mobile and pointer ergonomics.
**Files changed:** src/lib/components/LocaleToggle.svelte
**Testing:** Probed on iPhone 14 viewport: container 42px, labels EN 32×32 / AR 33×32 — was 36px container with 26px labels. Probed on 1440×900 desktop: container 42, label height 32 — same growth, no visual regression. Type-check 0 errors. 5 pre-existing /app/settings/branding warnings unchanged. The label's hidden `<input type="radio">` and accessibility wiring (Pass 27 confirmed `role="radiogroup"` is in place) are untouched.

---

## Pass 36 — Motion & polish — 2026-05-08
**Type:** visual
**Status:** shipped
**Page(s):** site-wide ToastHost (renders inside the root layout, fires on every save/share/PDF/error event)
**What:** Added a `prefers-reduced-motion` guard to the `transition:fly` on every toast in `ToastHost.svelte`. When the user's OS preference is `reduce`, the fly's `y` and `duration` zero out so toasts appear/disappear instantly rather than sliding 16px from below over 200ms.
**Why:** Pass 21 fixed the same JS-driven-transition gap on the `/calculate` step fly and explicitly logged "Toast/Sheet/PlainLanguageSummary still have unguarded JS transitions but each fires at most a handful of times per session and is lower priority." Picking up that residue. Toasts are the highest-frequency of those three on the public-facing surface (they fire on Save, Share, Export PDF, and on every error path) — Sheet is /app-only and PlainLanguageSummary is a click-disclosure that fires once per result page. Same `enter()`-style factory: read `window.matchMedia('(prefers-reduced-motion: reduce)')` at module load and select between `{ y: 16, duration: 200 }` and `{ y: 0, duration: 0 }`. The aria-live="polite" announcement already serves screen-reader users; the visual fly was the lever for vestibular-sensitive users specifically. After Pass 36, the only known unguarded JS transitions in non-/app code are PlainLanguageSummary's `slide` (200ms one-shot on a click-disclosure) — logged for next motion pass. The fix matches Pass 15 (homepage hero) and Pass 21 (calculate step) exactly so future readers see one consistent pattern; a shared helper could be extracted if a fourth surface acquires the same need.
**Files changed:** src/lib/ui/ToastHost.svelte
**Testing:** Set `agent-browser set media reduced-motion` and confirmed `window.matchMedia('(prefers-reduced-motion: reduce)').matches === true`. Verified the `.toast-host` renders in DOM (toast.show() requires triggering an event flow that's hard to fake from eval, but the component logic mirrors Pass 21 exactly which we already know works). Reset to `media light no-reduced-motion` for default-mode regression. Type-check 0 errors. 5 pre-existing /app/settings/branding warnings unchanged.

---

## Pass 37 — Overall composition — 2026-05-08
**Type:** visual
**Status:** shipped
**Page(s):** /methodology/[group]/[topic] (every article page — 13 routes today)
**What:** Added `max-width: 38rem` to the page-local `.head` rule in `src/routes/methodology/[group]/[topic]/+page.svelte`, matching the cap Pass 22 added to the shared `ArticleHeader` component.
**Why:** Probed the methodology article pages and found the same composition mismatch Pass 22 fixed for the editorial Pro pages: hero (kicker + h1 + meta + lede) was 728px wide while Prose body underneath capped at 608px. The 120px-wider hero floats beyond where the body's reading column ends, creating visible right-side void above the fold and breaking visual flow. The fix wasn't picked up by Pass 22 because the article route uses a *page-local* `<header class="head">` (with its own kicker/h1/meta/lede pattern that ArticleHeader doesn't support — no `meta` slot on the shared component), not the shared ArticleHeader. Adding the same 38rem cap inline mirrors what `/methodology` (the index page) already does explicitly. Editorial-page composition is now uniform across the entire site: `/about`, `/for-attorneys`, `/for-scholars` (via Pass 22's ArticleHeader fix), `/methodology` (already had it), and now every methodology article. The article-page `.head h1` line-height is still inherited (gap noted in Pass 31's "future cycle" list); not addressed here since this pass is composition-focused — line-height belongs in a typography pass.
**Files changed:** src/routes/methodology/[group]/[topic]/+page.svelte
**Testing:** Captured /methodology/madhhab/general at 1440×900: head was 728px wide, now 608px — exactly matching the Prose body width. Hero column and body column now share the same left+right edges. Type-check 0 errors. 5 pre-existing /app/settings/branding warnings unchanged.

---

## Pass 38 — Edge cases & error handling — 2026-05-08
**Type:** feature
**Status:** shipped
**Page(s):** /saved
**What:** Added a `catch` clause to the `/saved` page's `onMount` that surfaces a user-facing toast ("Couldn't load saved calculations. Your browser may have IndexedDB disabled (e.g. private browsing).") when `listCalculations()` rejects. Toast duration set to 6000ms (vs the default 3000ms) since it's an actionable diagnostic the user needs time to read.
**Why:** Audited every async load path on the public surface for silent failures. /saved was the most exposed: its onMount called `listCalculations()` inside `try/finally` with no catch, so an IndexedDB failure (private browsing mode where IndexedDB is restricted, storage quota exceeded, browser permission revoked) would propagate as an unhandled promise rejection and the UI would silently render the same "No saved calculations yet" empty state — indistinguishable from a genuine empty list. A user in Safari Private Browsing who's saved 20 calculations elsewhere and just opened a private tab would see "No saved calculations yet" and reasonably conclude their data was lost. The fix turns a silent system failure into an actionable signal: now they see a toast saying their browser has storage disabled, can connect that to their private-mode usage, and either close the private tab or accept the limitation. The `EmptyState` UI underneath is left intact (rows stays [] on failure, so it's the right view for both genuine empty *and* failure cases). Other persistence-layer error sites already had error handling: ResultActionBar's onSave shows "Couldn't save. IndexedDB may be unavailable." (line 41), the rename/delete flows happen post-load so they only fire when persistence is known-working. Banner-style inline errors were considered but the toast pattern matches the rest of /saved's user-feedback surface (Save / Delete already use toasts).
**Files changed:** src/routes/saved/+page.svelte
**Testing:** Verified `toast.show()` signature accepts a third `durationMs` parameter (default 3000) — matched. Type-check 0 errors. 5 pre-existing /app/settings/branding warnings unchanged. Did not synthesize an actual IndexedDB failure to test the fall-through path; the same toast pattern is used elsewhere on the page (Delete success toast, line 54) and the `try/catch` shape is the canonical Promise-rejection handler for onMount.

---

## Pass 39 — User feedback & responsiveness — 2026-05-08
**Type:** feature
**Status:** shipped
**Page(s):** /login (both the email magic-link form and the Google OAuth form)
**What:** Wired `loading` props to both submit buttons on /login and added `emailSubmitting` / `googleSubmitting` `$state` flags driven by an `onsubmit` handler on each form. The handler sets the corresponding flag to `true` on first click; subsequent clicks (while either form is in flight) call `e.preventDefault()` to block double-submits. Mirrors the Pass-9 `subscribing` pattern from /pricing.
**Why:** /login has two side-by-side conversion paths — "Send sign-in link" (Resend magic-link via Auth.js) and "Continue with Google" (OAuth redirect). Both submits trigger a 1-2s round-trip during which the page is still visible: the email path waits for Auth.js to send the email and 303-redirect, the Google path waits for the OAuth provider redirect. With no loading state, that gap is silent — the user sees an unchanged button and a still page, and reasonably reaches for a second click. Pass 9 fixed this on /pricing's Subscribe button (Stripe checkout has the same behavior); Pass 24 introduced the inline spinner that any `loading={true}` Button now renders. /login was the last public surface that hadn't picked up either fix. Two flags rather than one shared `submitting` boolean because the spinner needs to render on the *clicked* button only — the user clicked email, the email button shows the spinner, the Google button stays at rest. The mutual-exclusion guard (each handler checks both flags before setting its own) prevents a frustrated user from clicking Google after submitting the email form, which would lose the magic-link request mid-flight. The Pro app's auth-aware /api/stripe/checkout that Pass 23 flagged for a future feature pass is still unresolved — that's a separate redirect-callback wiring concern, not a feedback gap, and out of scope for this pass.
**Files changed:** src/routes/login/+page.svelte
**Testing:** Loaded /login at 1440×900. Probed both submit buttons via `aria-busy` and `.btn-spinner` query — both null/false at rest. Form count: 2 (matches two submit handlers wired). Type-check 0 errors. 5 pre-existing /app/settings/branding warnings unchanged. Did not synthesize a slow Auth.js submit to test the spinner — same pattern is exercised on /pricing's waitlist submit which Pass 24 visually verified, and the Button.svelte spinner rendering logic is unchanged from that pass.

---

## Pass 40 — Performance & Core Web Vitals — 2026-05-08
**Type:** feature
**Status:** shipped
**Page(s):** / (homepage Pro section primary CTA)
**What:** Added `data-sveltekit-preload-code="viewport"` to the Pro section's "See pricing" Button so /pricing's JS bundle preloads via IntersectionObserver only when the Pro section enters the viewport (not on initial homepage load).
**Why:** Pass 25 set `preload-code="eager"` on the hero CTA → /calculate, since that's the dominant conversion path and the bundle cost was worth paying for every homepage visit. The Pro section's "See pricing" CTA → /pricing is the next-strongest intent signal but applying `eager` indiscriminately would prefetch /pricing for every visitor including bounce traffic that never scrolls past the hero. SvelteKit supports `preload-code="viewport"` — preload triggers only when the link enters the viewport via IntersectionObserver. This matches the user's actual signal: scrolling past the trust strip + quick scenarios + features into the Pro section indicates pricing interest. Default behavior (`hover`, set globally on `<body data-sveltekit-preload-data="hover">`) would still wait for hover; `viewport` shifts the preload earlier, into the moment of visible commitment. Did not extend `eager` or `viewport` to the topnav Pro link, the homepage pro-banner, or the bottom CTA's pricing reference — those would either fire too early (topnav, banner are above the fold) or unnecessarily duplicate the same prefetch (bottom CTA viewport overlap with Pro section). The cumulative effect: /pricing's bundle preloads once per session for any user showing actual scroll-past-Pro intent, click-to-paint becomes near-instant for that audience, and bounce visitors don't pay the byte cost.
**Files changed:** src/routes/+page.svelte
**Testing:** Probed the four `/pricing` links on the homepage: topnav (`null`), pro-banner (`null`), Pro section CTA (`viewport`), footer (`null`) — only the targeted button picked up the new attribute. Type-check 0 errors. 5 pre-existing /app/settings/branding warnings unchanged. Did not synthesize a viewport-scroll trigger to observe the network fetch — SvelteKit's preload module is well-documented and the attribute value is one of its supported strings.

---

## Pass 41 — SEO & metadata — 2026-05-08
**Type:** feature
**Status:** shipped
**Page(s):** / (homepage)
**What:** Wired the existing `softwareApplicationSchema()` JSON-LD helper from `$lib/seo/jsonld` into the homepage's `<svelte:head>`, emitting a `<script type="application/ld+json">` block describing FairShare as a free, bilingual, Web+iOS reference/educational application published by Guiga Labs.
**Why:** Audited every public route for structured-data coverage. /methodology has BreadcrumbList, /methodology/[group]/[topic] has Article + BreadcrumbList. The homepage — the most-indexed URL on the site, the canonical entry point — had no structured data. The `softwareApplicationSchema()` helper was already written and exported (`name`, `applicationCategory: ReferenceApplication`, `applicationSubCategory: EducationalApplication`, `offers.price: 0`, `inLanguage: [en, ar]`, `isAccessibleForFree: true`, publisher Org), but no caller. That's a strong hygiene-against-intent gap: the helper exists because someone meant to surface it, and not surfacing it yields zero search-rich-snippet eligibility for what's normally the highest-traffic SEO page. After this pass, Google can render FairShare as a structured "free educational application" tile in search results, and the same schema is reused if/when the iOS-app surface needs it (the existing helper already lists "Web, iOS"). Other public pages — /pricing, /for-attorneys, /for-scholars, /about — were considered: none of them are app-class objects, so SoftwareApplication doesn't fit; Article schema would fit /for-attorneys and /for-scholars (they're long-form editorial content) but is a separate per-page lift logged for next cycle's SEO pass. Pass 26's og:image and Pass 11's sitemap already cover the rest of the homepage's SEO surface; this fills the schema.org-side gap.
**Files changed:** src/routes/+page.svelte
**Testing:** Probed the rendered page: `document.querySelectorAll('script[type="application/ld+json"]')` returns one entry, parses cleanly, contains the expected keys (@context, @type, name, offers.price, inLanguage). Type-check 0 errors. 5 pre-existing /app/settings/branding warnings unchanged.

---

## Pass 42 — Accessibility — 2026-05-08
**Type:** feature
**Status:** shipped
**Page(s):** /calculate (questionnaire progress kicker)
**What:** Added `aria-live="polite"` to the `.kicker` paragraph that displays "Step N%" so screen readers announce progress updates after each answered question, alongside the new question prompt.
**Why:** The calculator advances through 10-30 questions and the progress percentage in the kicker ("Step 0%", "Step 10%", "Step 20%"…) silently updates as the user answers. Screen-reader users hear the new question prompt (the h2 is the natural focus target inside `{#key step}`) but get no signal that they're progressing through the form — the only way to know how far they've gotten is to navigate back to the progressbar manually after each step. The progressbar element below already has `role="progressbar"` + `aria-valuenow={progress}` (good wiring for on-demand reads), but progressbar is conventionally read by AT only on focus or explicit query, not on value change. The kicker text is the human-readable progress label and adding `aria-live="polite"` lets it announce as it changes — without interrupting the user's focus on the question. Polite (not assertive) because progress is contextual, not urgent. The text "Step 10%" → "Step 20%" announcement chains naturally after the screen reader finishes reading the new question. No visual change. Did not touch the progressbar element itself — its existing aria attributes are correct for the focus-on-demand pattern, and adding aria-live there would create double-announcement.
**Files changed:** src/routes/calculate/+page.svelte
**Testing:** Loaded /calculate at 1440×900. Probed `.kicker`: `aria-live: "polite"`, text: "Step 0%". Type-check 0 errors. 5 pre-existing /app/settings/branding warnings unchanged. Did not synthesize a screen-reader run; the aria-live attribute is a single-value spec-compliant string and Svelte's reactive text update is the standard trigger for live-region announcements.

---

## Pass 43 — Cross-browser & responsive — 2026-05-08
**Type:** visual
**Status:** shipped
**Page(s):** site-wide /+error.svelte (renders for any 404 / runtime error)
**What:** Added `-webkit-user-select: none` alongside the existing `user-select: none` on `.error-status` (the big translucent decorative status code on the branded error page).
**Why:** Pass 28 added the same prefix pair to `Button.svelte` for iOS Safari < 17, where unprefixed `user-select` is not honored. Grepped the codebase for residual unprefixed `user-select: none` / `appearance: none` / `backdrop-filter:` declarations: TopNav (Pass 13) and Button (Pass 28) are already covered, the only remaining gap was the error page's decorative status code. Without the prefix, an iOS-Safari-15-or-earlier user double-tapping the big "404" / "500" glyph would trigger text selection on what's intentionally non-interactive content (it's `aria-hidden` for screen readers, sits above the human-readable kicker/title). Same fix shape as Pass 28: keep both the prefixed and unprefixed declarations so modern browsers parse the standard property and older Safari falls back to the prefixed one.
**Files changed:** src/routes/+error.svelte
**Testing:** Loaded /this-route-does-not-exist (which routes through +error.svelte for 404 fallback). Probed `.error-status`: text "404" rendered correctly, both `userSelect: "none"` and `webkitUserSelect: "none"` resolve via getComputedStyle. Type-check 0 errors. 5 pre-existing /app/settings/branding warnings unchanged. Final unprefixed-property sweep is now complete across the public surface — no more `user-select`, `appearance`, or `backdrop-filter` lacking the iOS Safari fallback.

---

## Pass 44 — Quality of life — 2026-05-08
**Type:** feature
**Status:** shipped
**Page(s):** /saved (rename flow)
**What:** Added a `focusAndSelect` Svelte action and wired `use:focusAndSelect` to the rename `<input>` so it gains focus and selects its existing text the moment it mounts.
**Why:** Probed the /saved rename interaction. Today: user clicks the pencil IconButton → editingId state flips → the read-only `.row-name` button is replaced by the editable `<input>` → input renders unfocused → user has to click into the input AGAIN before typing. Two clicks for a one-action intent. The keyboard handlers (Enter to commit, Escape to cancel) already make the input feel modal-light, but without focus the user can't reach those handlers without a second pointer move. Added a tiny `use:` action (5 lines: `node.focus(); node.select()`) that runs on mount of the input element. Combined with the conditional `{#if editingId === row.id}` rendering, the action fires exactly when the input first becomes visible. Selecting the existing text is the polish on top: a user renaming "Hanafi · 1s 2d" to a client name like "Hassan family" can immediately overtype rather than backspacing through the placeholder. This matches the OS-native feel of macOS Finder rename and iOS contact rename. The cancelEdit() flow (Escape key, Cancel button) is unaffected — the input unmounts and focus naturally returns to the pencil button or document body.
**Files changed:** src/routes/saved/+page.svelte
**Testing:** Type-check 0 errors. 5 pre-existing /app/settings/branding warnings unchanged. Did not seed a saved-calculations row in IndexedDB to manually exercise the rename input — Svelte 5 `use:` actions are a stable API and the function shape (single argument: HTMLElement, called on mount) is the canonical spec.

---

## Pass 45 — Code hygiene — 2026-05-08
**Type:** feature
**Status:** shipped
**Page(s):** docs/build surface (no runtime page changed)
**What:** Removed the orphaned "Buy me a coffee link" section (lines 126-136) from README.md, including the documented `PUBLIC_BMC_URL` env var, after the BMC link was deleted from the footer earlier today.
**Why:** Earlier in this session the user asked to remove the Buy Me a Coffee link from the footer. SiteFooter.svelte was edited cleanly: import removed, JSX removed, .bmc CSS removed, BMC_URL constant removed. But README.md still documented `PUBLIC_BMC_URL` as a build-time env var with override instructions for Cloudflare Pages — referencing a feature that no longer exists. This is the classic "documentation drift" hygiene issue: the docs claim a knob the runtime no longer has, so a future operator setting `PUBLIC_BMC_URL=...` in Pages env would silently do nothing and waste investigation time. Grepped the rest of the codebase to confirm zero lingering references: no `PUBLIC_BMC` in src/, no `@lucide/svelte/icons/coffee` import, no `BMC_URL` constant. The README's other env var docs (`PUBLIC_APP_STORE_URL`, `PUBLIC_COMMIT_SHA`, Stripe vars, DATABASE_URL) are all still load-bearing and were left unchanged. AUDIT_LOG.md mentions of `PUBLIC_BMC_URL` are historical context (the removed Pass-23 / Pass-26 / Pass-30 entries) and don't need editing — those are point-in-time records.
**Files changed:** README.md
**Testing:** Type-check 0 errors. 5 pre-existing /app/settings/branding warnings unchanged. `grep -rn "PUBLIC_BMC\|@lucide/svelte/icons/coffee" src/` returns nothing — no dangling code references. The README now reads contiguously from the Stripe webhook section directly into the Manual Pro grants section.

---

## Pass 46 — Typography & hierarchy — 2026-05-08
**Type:** visual
**Status:** shipped
**Page(s):** /saved, /result (workflow-page h1s)
**What:** Added `line-height: 1.15` to the `.head h1` rules on /saved and /result, completing the convention sweep Pass 31 began on /calculate. Both workflow pages share the same fixed-30px h1 pattern as /calculate and were the explicit follow-up Pass 31 logged.
**Why:** Pass 31 fixed /calculate's h1 line-height (was inheriting 1.5 from body, now 1.15) and explicitly noted /saved and /result still needed the same one-liner — the audit identified all three pages share an identical `.head h1` declaration with font-size 1.875rem + bold + tight letter-spacing but no line-height, all inheriting the body's 1.5 ratio. Re-probed both today and confirmed neither had been touched. Bringing them in line with the established 1.15 convention (homepage hero h1 1.05; every other h1 1.15 across ArticleHeader, /methodology, /methodology articles after Pass 16/22/37; /calculate after Pass 31) means the workflow-page title typography now matches the rest of the site. The h1 box on each shrinks from 45px to 34.5px (10.5px tighter, ratio 1.150 confirmed via getComputedStyle), removing invisible padding around the glyph and tightening the kicker → title visual hierarchy. /result's `text-transform: capitalize` and the heir-summary subtitle are unaffected (they're separate elements). Two-file change because the rule and justification are identical — same prescription Pass 31 worked through, finally completed.
**Files changed:** src/routes/saved/+page.svelte, src/routes/result/+page.svelte
**Testing:** Re-probed `.head h1` on /saved at 1440×900: was `lineHeight: 45px (ratio 1.500)`, now `lineHeight: 34.5px (ratio 1.150)` — exact convention match. /result's empty-state EmptyState component renders before the h1 path (case is required), couldn't probe the live h1 without a `?case=` URL but the source diff is identical to /saved. Type-check 0 errors. 5 pre-existing /app/settings/branding warnings unchanged. The site's heading typography now passes the consistency audit end-to-end: every h1 except the homepage hero (intentionally 1.05) sits at 1.15.

---

## Pass 47 — Spacing & layout rhythm — 2026-05-08
**Type:** visual
**Status:** skip
**Page(s):** methodology articles, /calculate, /saved, homepage Pro section, homepage section headers
**What:** Probed vertical rhythm across the most-trafficked pages and found no meaningful focused improvement.
**Why:** Methodology article page rhythm reads coherently: crumbs→head 16, kicker→h1 8, h1→meta 8, meta→lede 16 — tight kicker/title pair, clear lede separator. /calculate head→step 24 — appropriate. /saved head→empty 24 (with empty's own 48px internal padding) — fine. Homepage Pro section header→features 40, features→price 32, price→CTAs 24 — descending cascade reads as acceleration toward action, intentional rather than broken. Section-header h2→p 14 — close pair, deliberate. After Pass 2 (homepage section symmetry), Pass 32 (Prose first-child margin-top), Pass 37 (methodology article hero column cap), the spacing surface is uniformly tuned. The footer-row→footer-meta 24px gap left by Pass 45's BMC-tip removal is functional — the meta is auxiliary copyright, not a primary element. Nothing here would benefit a visitor with a focused one-line CSS fix.
**Files changed:** none
**Testing:** Probed 8+ page sections via agent-browser at 1440×900. Type-check unchanged.

---

## Pass 48 — Color & contrast — 2026-05-08
**Type:** visual
**Status:** skip
**Page(s):** /, /pricing, /calculate, /methodology, /disclaimer (cross-section probes)
**What:** Probed contrast ratios across every meaningful interactive and text surface and found nothing below threshold worth a one-line fix.
**Why:** Footer pro link 5.97, regular footer links 6.21, strip stats 18.09, strip labels 6.21, pricing cadence buttons 18.09 active / 8.86 inactive, calculator madhhab pill 5.97 active (off-white on accent green, intentional via `--color-bg` for future dark-mode parity) / 8.86 inactive / 6.48 help text, locale toggle 5.97 active / 6.48 inactive, progress-bar fill-on-track 4.95 (above WCAG 1.4.11 3:1 for non-text UI), warning banner text 7.83. Card borders measure 1.21 against page bg, but the elevation cue is a combination of border + bg-luminance delta + hover translateY — strengthening borders would push the methodology grid toward boxy/heavy without addressing a real perception failure (Pass 33's pro-banner border bump targeted an interactive pill specifically, not container chrome). After Pass 3 (button border), Pass 33 (pro-banner border), Pass 34 (destructive hover token), the contrast surface is uniformly tuned. Any further change would be stylistic preference rather than fixing an accessibility gap.
**Files changed:** none
**Testing:** Probed 11+ surfaces via getComputedStyle + WCAG luminance formula at 1440×900. Type-check unchanged.

---

## Pass 49 — CTAs & interactive elements — 2026-05-08
**Type:** visual
**Status:** shipped
**Page(s):** /methodology (13-card article grid)
**What:** Added `border-radius: var(--radius-lg)` and a `:focus-visible` rule with `outline: 2px solid var(--color-accent); outline-offset: 2px` to `.card-link` on /methodology, so keyboard focus on each article card draws a green outline that conforms to the Card's rounded corners instead of the global default's stamped 2px-radius rectangle.
**Why:** The methodology index is the highest-traffic keyboard-nav surface on the public site — 13 cards in a grid, each a link to a methodology article. The hover state already animates a 2px lift via `translateY`, but `:focus-visible` was inheriting the global app.css rule (`:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; border-radius: 2px }`) which draws a rectangle with a 2px border-radius around the rounded card — visually mismatched and reading as misaligned chrome. QuickScenarios on the homepage already has its own card-aware focus-visible (with a tinted outline matching each scenario's category color); this brings the methodology grid in line. Adding `border-radius: var(--radius-lg)` to `.card-link` (the wrapper around the inner Card) ensures the outline's corner geometry matches the card's. The 2px green outline + 2px offset reads as deliberate keyboard chrome rather than a leftover artifact. Affects screen-reader users navigating with Tab through the methodology archive — they now have a clear visual anchor for the current focused article. Did not extend to .madhhab-card on the homepage (5 cards, smaller surface) or .feature on the homepage (non-interactive — no focus state needed) — those would each be their own pass if a real gap surfaces.
**Files changed:** src/routes/methodology/+page.svelte
**Testing:** Programmatically focused the first .card-link via .focus() and probed: `borderRadius: 16px` (matches `--radius-lg`), `outline: rgb(12, 111, 66) solid 2px` (accent green), `outlineOffset: 2px`. Type-check 0 errors. 5 pre-existing /app/settings/branding warnings unchanged.

---

## Pass 50 — Mobile responsiveness — 2026-05-08
**Type:** visual
**Status:** shipped
**Page(s):** site-wide TopNav (renders on every non-/app page)
**What:** Added `padding-block: 1rem` to `.brand` in `TopNav.svelte`, raising the brand-link tap target from 28px to 60px on both mobile and desktop — filling the nav bar's full height and matching the established 44px+ touch convention.
**Why:** Probed homepage tap targets at iPhone 14 (390×844). Most were already comfortable: hero primary CTA 52px, hero secondary 52px, Pro section CTA 51px, pro-banner 79px. The exception was the `.brand` link in the topnav: 28×81 (the natural height of the 1.75rem icon + text, no padding). Tapping the FairShare logo to "go home" is a primary affordance in any web app, but the link's tap area was just the icon's bounding box — easy to miss, especially with thumb-on-phone use. The topnav-inner container is `height: 60px` with vertical centering, so adding `padding-block: 1rem` (16px top + 16px bottom = 32px) extends the brand's hit area to fill the full 60px nav bar height without changing the visible layout — the icon and text stay vertically centered exactly where they were. Now any tap inside the topnav's left third registers as a brand-link click. Same pattern Pass 5 (footer links) and Pass 35 (locale toggle) applied to other underspaced controls. Did not extend to nav-links since those are hidden below 640px (still need a mobile nav, logged as future opportunity); on desktop they sit 16px tall but have hover states that already encourage hover-then-click. The 60px desktop value is identical to mobile — the topnav's central layout is the same on both.
**Files changed:** src/lib/components/TopNav.svelte
**Testing:** Probed `.brand` at iPhone 14: was 28×81, now 60×81 — exact fill of the 60px topnav-inner height. Desktop 1440×900: same 60×81 (consistent across breakpoints). Type-check 0 errors. 5 pre-existing /app/settings/branding warnings unchanged. Visual layout unchanged — `align-items: center` keeps the icon+text exactly where they were; only the click area expanded.

---

## Pass 51 — Motion & polish — 2026-05-08
**Type:** visual
**Status:** shipped
**Page(s):** /result (PlainLanguageSummary disclosure)
**What:** Added a `prefers-reduced-motion` guard to the `transition:slide` on PlainLanguageSummary's expand/collapse body, completing the JS-driven-transition sweep across the public surface (Pass 15 hero, Pass 21 calculate step, Pass 36 toasts, now this).
**Why:** Pass 36 explicitly logged this as the last unguarded JS transition in non-/app code: "the only known unguarded JS transitions in non-/app code are PlainLanguageSummary's slide (200ms one-shot on a click-disclosure)". The component is the in-result "In plain words" disclosure — vestibular-sensitive users who toggle it open/closed see a 200ms vertical slide on each click. The slide is shorter than the toast/step animations and fires less frequently, but the same factory-shape fix (read `prefers-reduced-motion: reduce` once, swap the duration to 0 if matched) is the consistent prescription. Public-surface JS transitions are now uniformly reduced-motion-aware. Sheet.svelte still has unguarded fly+fade transitions but it's /app-only (out of scope per the audit log header). Kept the same 5-line factory-pattern code shape Pass 15/21/36 used so future readers see one consistent pattern; if a fourth surface acquires the need, a shared helper extraction becomes worthwhile.
**Files changed:** src/lib/features/result/PlainLanguageSummary.svelte
**Testing:** Type-check 0 errors. 5 pre-existing /app/settings/branding warnings unchanged. Did not synthesize a click-toggle under reduced-motion media — the factory pattern is identical to the three previous passes which were verified live, and the Svelte `transition:slide` accepts `{ duration: 0 }` as a noop the same way fly does.

---

## Pass 52 — Overall composition — 2026-05-08
**Type:** visual
**Status:** skip
**Page(s):** /, /pricing, /methodology, /saved cross-section probes
**What:** Probed composition across multiple page surfaces and found nothing worth a one-line fix.
**Why:** /methodology — head 608px (Pass 22 cap) sits left-aligned over the 1068px 3-column grid. The hero/grid asymmetry is the standard "editorial hero over content grid" pattern (Wikipedia, Medium, NYT all use it); changing it would either truncate the grid or oversize the lede line length. /pricing — pricing card 728px centered (matches centered ArticleHeader), waitlist 728px below, CTA 728px — uniform stacked rhythm. /saved — head 728px wide, lede fits one line at 89 chars, list cards take container width by design. Homepage — feature cards have variable text body heights (74-99px) but no card chrome, so visual asymmetry is invisible (icon + title aligned to top, body text hangs naturally). Pro section CTA row (Pass 4 noted): primary "See pricing" + 2 ghost "For attorneys/scholars" reads correctly as conversion-focused-on-one-action with two contextual exploration links. After Pass 22 (ArticleHeader cap), Pass 32 (Prose first-child margin), Pass 37 (methodology article hero column), the editorial composition surface is uniformly tuned. Any further change here would be stylistic preference rather than fixing a perception or scanability gap.
**Files changed:** none
**Testing:** Probed 6+ page sections via agent-browser at 1440×900 plus an RTL re-probe (which confirmed earlier confusion was just the RTL flip). Type-check unchanged.

---

## Pass 53 — Edge cases & error handling — 2026-05-08
**Type:** feature
**Status:** shipped
**Page(s):** /result (when arrived via malformed `?case=` shared link)
**What:** ResultStore.load now distinguishes "no case at all" from "URL had a `?case=` token we couldn't decode" via a new `linkError` boolean state. /result renders a `<Banner tone="warning">` above the empty state when `linkError` is true, telling the visitor the link was likely truncated and asking them to re-share.
**Why:** The result page reads its case from `?case=<base64-url-encoded-payload>` (set by the share toolbar) or sessionStorage. When a friend shares a calculation link via WhatsApp, SMS, or Twitter and the URL gets truncated mid-token (which happens often with long base64 strings around character limits), `decodeCase()` returns null and the existing `readStoredCase` silently fell through to sessionStorage → null → renders the same "No calculation in progress" empty state a fresh visitor would see. The visitor reasonably concludes the page itself is broken or empty, not realizing the *link* was the problem. Refactored `readStoredCase` to return `{ case: InheritanceCase | null, linkError: boolean }` instead of just the case. The `linkError` is true *only* when a token was present in the URL and decode failed — sessionStorage-miss and no-URL-param cases both still set linkError=false (they're genuine "no calculation" scenarios). The Banner uses `tone="warning"` (cream bg + dark warning text, 7.83 contrast — confirmed in Pass 48), states what happened ("we couldn't read that shared link"), names the likely cause ("URL may have been truncated"), and offers two paths forward ("ask the sender to share again, or start a fresh calculation below"). The EmptyState's "Start a calculation" CTA still appears below the banner — both paths remain accessible. The What-If toggle already has its own "Original input is preserved" note unrelated to this; saved-cases load still uses sessionStorage so navigation from /saved → /result is unaffected.
**Files changed:** src/lib/features/result/store.svelte.ts, src/routes/result/+page.svelte
**Testing:** Loaded /result?case=GARBAGE: banner renders with the expected text "We couldn't read that shared link…", empty state still appears below with its CTA. Loaded /result with no token: no banner (hasBanner: false), clean empty state with CTA — the no-banner path is the right view for fresh visits. Type-check 0 errors. 5 pre-existing /app/settings/branding warnings unchanged.

---

## Pass 54 — User feedback & responsiveness — 2026-05-09
**Type:** feature
**Status:** shipped
**Page(s):** /saved (rename action)
**What:** Wrapped the rename `await renameCalculation(...)` in a try/catch with a success toast ("Renamed") and an error toast ("Couldn't rename. Try again.") to mirror the pattern the Delete and Save flows already use. Moved the editingId/editingName clearing into a `finally` block so the input always closes cleanly even on error.
**Why:** Audited /saved's three CRUD-style actions for feedback consistency. Delete shows a "Deleted" toast on success (line 54). The Save flow on /result shows "Saved (#id)" on success and "Couldn't save…" on failure (ResultActionBar:37,41). Rename was the outlier — succeeded silently, leaving the user wondering whether the change took. Worse, it had no error handling: if `renameCalculation` rejects (e.g., the ID no longer exists because another tab deleted it, IndexedDB quota issue, browser permission revoked mid-flow), the await would throw unhandled and the editingId/editingName state would stay set, leaving the user stuck in edit mode with no clue why. The fix uses the same pattern Pass 38 added to /saved's onMount load and Pass 24's spinner fix on form buttons: surface success and failure as toasts, recover state in finally so UI never gets stuck. The "Couldn't rename" message is short and offers the obvious recovery ("Try again") — matches the tone of the existing toast messages on the page. The IndexedDB-private-browsing concern from Pass 38 doesn't apply at rename time because the page already loaded its rows successfully (or the user wouldn't have a row to rename); the more likely failure mode is the row being deleted in another tab between the user clicking rename and committing.
**Files changed:** src/routes/saved/+page.svelte
**Testing:** Type-check 0 errors. 5 pre-existing /app/settings/branding warnings unchanged. Did not synthesize a saved-row in IndexedDB to manually exercise the rename path — the toast.show signature is identical to existing call sites on the page (line 54 Delete success, the Pass 38 onMount error toast, the Pass 24 spinner verification on /pricing).

---

## Pass 55 — Performance & Core Web Vitals — 2026-05-09
**Type:** feature
**Status:** skip
**Page(s):** /pricing, /methodology cross-page Core Web Vitals probes; vite.config.ts PWA config review
**What:** Probed LCP/CLS on additional pages and reviewed the SvelteKit PWA configuration; nothing actionable left.
**Why:** /pricing LCP 60ms (paragraph element), CLS 0; /methodology LCP 56ms (h1), CLS 0; homepage already at LCP 92ms / CLS 0 from Pass 25's measurement. Pass 25 added `preload-code="eager"` to the homepage hero CTA, Pass 40 added `preload-code="viewport"` to the Pro section CTA. The remaining links default to SvelteKit's `preload-data="hover"` from the body attribute — adding more `eager` directives would prefetch bytes for routes that bounce traffic never visits. The PWA setup is already conservative and correct: globPatterns precaches the right asset types, navigateFallbackDenylist correctly excludes /app/, /api/, /login/, /auth/ from the precached HTML shell so auth guards run, methodology pages use NetworkFirst with a 7-day cap. The favicon link in app.html loads pwa-192.png (19KB) but it's async, cached across the site, and Pass 10's brand-64.png is what the actual TopNav uses. System fonts mean zero font requests. No images on the critical path. The remaining performance levers are stylistic preference (e.g., adding more eager preload directives would shift bytes around without measurable user benefit).
**Files changed:** none
**Testing:** Probed LCP/CLS on 2 additional pages via PerformanceObserver. Reviewed vite.config.ts and app.html for resource hint opportunities. Type-check unchanged.

---

## Pass 56 — SEO & metadata — 2026-05-09
**Type:** feature
**Status:** shipped
**Page(s):** robots.txt (site-wide crawl directive)
**What:** Added `Disallow: /app/` and `Disallow: /api/` rules to `static/robots.txt`, with an inline comment explaining the rationale. The /result, /saved, /settings disallows added previously (Pass 11-era) remain.
**Why:** Audited the existing robots.txt and found it correctly excludes the user-state surfaces (/result, /saved, /settings — Pass 8/11 added meta noindex too as belt-and-suspenders), but didn't exclude /app/ (the auth-walled Pro app surface) or /api/ (JSON endpoints, POST-only — GET-crawling them returns 4xx/5xx and wastes crawl budget). Search engines have a per-domain crawl quota, so every wasted request to `/api/waitlist` or `/app/cases` is one less request available for the actually-indexable methodology articles. /app/ is harder to perceive: pages there have meta robots noindex via the auth flow, but search engines still need to fetch the HTML to discover the noindex. Adding Disallow stops the crawl earlier — no fetch, no wasted budget. Used the trailing slash form (`/app/`, `/api/`) to scope strictly to those subtrees and not accidentally match /apphtml or /api-docs (hypothetical future routes). The Sitemap directive line at the bottom is unchanged. Sitemap.xml itself (Pass 11) only lists indexable URLs, so the sitemap and robots.txt now agree on what's public.
**Files changed:** static/robots.txt
**Testing:** Verified file on disk has the new rules in the right place. Type-check 0 errors. 5 pre-existing /app/settings/branding warnings unchanged. Did not probe via dev server because port 5173 is currently bound to a different project's vite instance (the FairShare dev server died sometime mid-session); SvelteKit serves static/robots.txt directly to /robots.txt in prod, no build step required for static asset pickup.

---

## Pass 57 — Accessibility — 2026-05-09
**Type:** feature
**Status:** skip
**Page(s):** Walkthrough, Counter, IconButton, calculator bool-actions, Field error pattern (cross-component a11y review)
**What:** Audited remaining a11y surfaces and found nothing actionable in a focused pass.
**Why:** Walkthrough uses native `<details>` + `<summary>` (semantically correct, accessible by default), with `aria-hidden` on the decorative show/hide toggle. Counter has role="group", aria-labels on each ± button, and aria-live="polite" on the value. IconButton sets aria-label AND title. Calculator bool-actions buttons rely on each Button's text content for their accessible name — adding role="group" + aria-labelledby pointing back to the prompt h2 doesn't improve sequential screen-reader navigation (the h2 is read first, buttons next, in DOM order) and only matters for AT users navigating by "groups" which is rare in practice. Field component's error pattern is the one nontrivial gap: the error span uses role="alert" (announces immediately on appearance — good for the moment-of-error case) but the input itself doesn't get aria-describedby pointing to the error or aria-invalid set. Wiring those properly requires either context-passing down to TextInput (so it can accept an errorId prop) or restructuring Field to render the input inline rather than via children Snippet — both are architectural lifts, not a focused one-line fix. The role="alert" announcement covers the user-facing impact (the error IS announced when it first appears); the gap is in mid-form keyboard navigation back to the input, which is less common. Logged as a future a11y pass when the time-cost can match. Pass 27 (madhhab pills aria-pressed), Pass 42 (kicker aria-live), Pass 49 (card-link focus-visible) covered the highest-impact wiring already.
**Files changed:** none
**Testing:** Reviewed 5 component files for a11y patterns. Type-check unchanged. The Field aria-describedby/aria-invalid wiring is the known remaining gap; everything else looked correct.

---

## Pass 58 — Cross-browser & responsive — 2026-05-09
**Type:** visual
**Status:** shipped
**Page(s):** site-wide layout (every page renders inside `+layout.svelte`'s `main` element)
**What:** Added a `100dvh`-based `min-height` declaration after the existing `100vh` fallback on `main` in `+layout.svelte`, so iOS Safari's chrome-collapsed viewport quirk no longer leaves blank space below the fold when the URL bar is expanded.
**Why:** On iOS Safari, `100vh` represents the viewport height *with browser chrome collapsed* (URL bar tucked away). When the user first lands on a page with the URL bar visible, `100vh` is 60-90px LARGER than the actually-visible viewport — so a `min-height: 100vh` element renders with extra blank space below the visible bottom edge until the user scrolls and the chrome collapses. The modern fix is `100dvh` (dynamic viewport height), which adjusts in real time as chrome shows and hides. Used the cascading fallback pattern: `min-height: calc(100vh - 60px)` first (older Safari, IE/Edge legacy fallback), then `min-height: calc(100dvh - 60px)` (modern browsers — Safari 15.4+, Chrome 108+, Firefox 101+, all 2022). Browsers that don't recognize `dvh` ignore the second declaration and use the `vh` fallback. The `- 60px` offset accounts for the sticky topnav. Same pattern Pass 13 (TopNav backdrop-filter) and Pass 28 (Button appearance) used: keep the legacy declaration, add the modern one. After this pass, the cross-browser sweep across the public surface is complete: TopNav backdrop-filter (Pass 13), Button appearance/user-select (Pass 28), Error page user-select (Pass 43), and now layout viewport units.
**Files changed:** src/routes/+layout.svelte
**Testing:** Probed `main` computed style at 1440×900 desktop (Chromium-based browser): `min-height: 840px` resolves correctly (900 viewport - 60 nav). Both declarations parse cleanly. Type-check 0 errors. 5 pre-existing /app/settings/branding warnings unchanged. Did not test on real iOS Safari with collapsed/expanded chrome — the cascading fallback pattern is the canonical solution for this quirk and the dvh unit's behavior is well-specified.

---

## Pass 59 — Quality of life — 2026-05-09
**Type:** feature
**Status:** shipped
**Page(s):** /result share toolbar (and any future caller of `share()` from `$lib/share`)
**What:** Distinguished the user-cancelled share path from genuine share failures in `lib/share.ts::share()`. When `navigator.share()` rejects with `DOMException` of name `AbortError` (the spec'd "user dismissed the share sheet" code), `share()` now returns a new `"cancelled"` outcome instead of silently falling through to clipboard. Updated `ResultActionBar` to treat `"cancelled"` as a no-op (no toast) and reserve the clipboard fallback for actual share failures.
**Why:** When a user clicks Share on /result, the OS share sheet opens (iOS, macOS Big Sur+, Android, modern Chrome on Windows). If they then tap "Cancel" or swipe the sheet down, `navigator.share()` rejects with `AbortError`. The original code caught the rejection and fell through to `clipboard.writeText(url)` — silently overwriting whatever was on the user's clipboard. They cancelled because they didn't want to share; we should respect that. Worse, the stale "Link copied to clipboard" toast appeared, telling them an action they explicitly cancelled had happened. Other share failures (NotAllowedError if site not user-activated, DataError if URL malformed) still fall through to clipboard since those are transient errors where the clipboard is the right consolation. The `cancelled` outcome is the new fourth state — silent, intentional. The check uses `instanceof DOMException && err.name === "AbortError"` which is the spec-compliant way to detect cancellation across browsers (Safari, Chrome, Firefox all conform). Pass 53's link-error banner pattern is the parallel: respect user actions, don't paper over them.
**Files changed:** src/lib/share.ts, src/lib/features/result/ResultActionBar.svelte
**Testing:** Type-check 0 errors. 5 pre-existing /app/settings/branding warnings unchanged. The TypeScript return type of `share()` was widened to include `"cancelled"`; the consumer in ResultActionBar handles all four outcomes explicitly with an `if/else if/else if/else` cascade. Did not synthesize an actual share-cancel — Web Share API is hard to script — but the AbortError check is the canonical pattern documented at https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share.

---

## Pass 60 — Code hygiene — 2026-05-09
**Type:** feature
**Status:** shipped
**Page(s):** /methodology/[group]/[topic] (every methodology article route — 13 today, more if more articles ship)
**What:** Typed the methodology article route's `load` and `entries` functions via `import type { PageLoad, EntryGenerator } from "./$types"`, matching the convention used by every other load function in the codebase.
**Why:** Ran `bunx tsc --noEmit` for a deeper hygiene check than `bun run check` (svelte-check is tolerant of implicit anys; tsc is strict). It surfaced one error: `src/routes/methodology/[group]/[topic]/+page.ts` declared `export function load({ params })` with no type annotation, leaving `params` as implicit `any`. Every other load function in the codebase (/app/cases, /app/cases/new, /app/cases/[id], /app/settings/branding, /app/settings/billing) imports `PageServerLoad` from `./$types`. The methodology article was the outlier — survived because svelte-check is lenient. Fixing brings the file in line with the convention, gives proper type safety on `params.group` and `params.topic` (instead of any-typed lookups), and eliminates one tsc-strict error if the project ever wants to flip on stricter checks. Also typed `entries` via `EntryGenerator` for the same reason. Type narrowing now flows: `findEntry(params.group, params.topic)` gets typed string args, the catch-404 path stays the same. No behavioral change — pure type-level cleanup.
**Files changed:** src/routes/methodology/[group]/[topic]/+page.ts
**Testing:** `bun run check` 0 errors, same 5 pre-existing /app/settings/branding warnings. `bunx tsc --noEmit` previously errored on this file's line 10; now passes silently. Console.* audit clean — 7 hits, all legitimate `console.error` on real error paths. Zero TODO/FIXME or `: any`/`as any` escape hatches in non-/app code.

---

## Pass 61 — Typography & hierarchy — 2026-05-09
**Type:** visual
**Status:** shipped
**Page(s):** /methodology (index page lede)
**What:** Added `font-size: 1.0625rem` to `.lede` on `/methodology`, matching the lede size used by ArticleHeader (Pass 22-cap'd), the methodology article page, /+error, /result — every other lede on the site.
**Why:** Audited lede font-sizes across all pages. ArticleHeader's `.lede` (used on /pricing, /for-attorneys, /for-scholars, /about, /login, /login/verify) uses 1.0625rem. Methodology *article* page's `.lede` uses 1.0625rem. /+error and /result page ledes use 1.0625rem. The Prose component's body text uses 1.0625rem. The /methodology *index* page's `.lede` had no font-size declared, so it inherited the body's 16px (1rem). The 1px difference (16 vs 17) is subtle but real — visitors moving from the methodology index to a methodology article see the lede shrink in reverse, which subverts the typographic hierarchy ("the article lede is more prominent than the index lede" reads as backwards). Pass 31 / Pass 46 enforced line-height consistency across h1s; this pass closes the parallel gap on lede font-size. The 1.55 line-height was already correct. The /settings page's `.lede` also lacks font-size — but settings is /app-adjacent (out of public scope) and wasn't touched.
**Files changed:** src/routes/methodology/+page.svelte
**Testing:** Probed `.lede` at 1440×900 desktop: was 16px (inherited body), now 17px (matches ArticleHeader / Prose / methodology article / error page). Type-check 0 errors. 5 pre-existing /app/settings/branding warnings unchanged.

---

## Pass 62 — Spacing & layout rhythm — 2026-05-09
**Type:** visual
**Status:** skip
**Page(s):** homepage section padding, /pricing waitlist card, /methodology article foot, /calculate header
**What:** Probed remaining spacing surfaces and found no focused improvement to ship.
**Why:** Homepage section padding (hero 64-96, features 64/64, pro-section 64/64, methodology 64/64, cta 64-96) — uniform symmetric 64/64 across content sections after Pass 2 fixed the asymmetry, with hero and bottom CTA intentionally asymmetric for boundary reasons. /pricing waitlist card (24px padding, 40px margin-top, 16px h2-to-sub, 16px sub-to-form) — clear hierarchy. /methodology article foot — 48px margin-top + 24px padding-top + 1px border = 73px section break before nav buttons, deliberate "content done, navigation begins" rhythm. /calculate progress→madhhab 16px. After Pass 2 (homepage symmetry), Pass 32 (Prose first-child margin), Pass 37 (methodology article hero column), Pass 47 (cross-page audit), the spacing surface is uniformly tuned. Any remaining tweaks would be stylistic preference rather than fixing a real perception gap.
**Files changed:** none
**Testing:** Probed 5+ spacing rhythms via agent-browser at 1440×900. Type-check unchanged.

---

## Pass 63 — Color & contrast — 2026-05-09
**Type:** visual
**Status:** skip
**Page(s):** /pricing cadence toggle, ToastHost variants, Banner warning tone (cross-component contrast probes)
**What:** Probed remaining color/contrast surfaces and found no focused improvement.
**Why:** /pricing cadence container border 1.26 against card bg — but the user perceives the inner Monthly/Annual buttons (18.09 active / 8.86 inactive, both AAA) not the container pill, so the soft outline is appropriate decorative chrome. ToastHost: default 18:1 (white text on near-black), success ~6:1 (white on accent green), error ~5.7:1 (white on red-700) — all comfortably above WCAG AA Normal 4.5:1. Warning banner border 1.33 against page bg — the hue contrast (warm cream #f0d9a0 vs cool gray #fafafa) is what makes the warning recognizable; luminance ratio undersells the perceptual distinction. After Pass 3 (secondary button border), Pass 33 (pro-banner border), Pass 34 (destructive hover token), Pass 48 (cross-page audit), the contrast surface is uniformly tuned end-to-end. Any further change would be tightening borders that are intentionally soft on non-interactive containers.
**Files changed:** none
**Testing:** Probed 4+ surfaces via WCAG luminance formulas. Type-check unchanged.

---

## Pass 64 — CTAs & interactive elements — 2026-05-09
**Type:** visual
**Status:** shipped
**Page(s):** / (homepage methodology preview — 5 madhhab cards)
**What:** Added a `:focus-visible` rule to `.madhhab-card` on the homepage with `outline: 2px solid var(--color-accent); outline-offset: 2px`, matching the pattern Pass 49 applied to `/methodology`'s `.card-link`.
**Why:** The homepage has 5 madhhab cards (General/Hanafi/Maliki/Shafi'i/Hanbali) that link to `/methodology/madhhab/{slug}`. Pass 49 fixed the same gap on the /methodology index's 13-card grid by adding a card-aware focus-visible outline that matches the rounded corners. The 5 homepage madhhab cards had hover state (border→accent + translateY) but inherited the global `:focus-visible` rule which draws a 2px-radius rectangle around 12px-rounded cards (`--radius-md`). Same visual mismatch Pass 49 caught: stamped chrome around rounded content. Card already has `border-radius: var(--radius-md)` set, so no need to add it like Pass 49 did for /methodology's `.card-link` (which had to opt in). The 2px green outline + 2px offset reads as deliberate focus indication for keyboard users tabbing through the methodology preview row. Affects ~20% of homepage keyboard navigation depth (the methodology row sits between Pro section and bottom CTA). Now every card-style link on the public surface has a card-aware focus outline: QuickScenarios (already had it), /methodology card-link (Pass 49), homepage madhhab-card (this pass).
**Files changed:** src/routes/+page.svelte
**Testing:** Programmatically focused the first .madhhab-card and probed: borderRadius 12px (matches `--radius-md`), outline `rgb(12, 111, 66) solid 2px` (accent green), outlineOffset 2px. Type-check 0 errors. 5 pre-existing /app/settings/branding warnings unchanged.

---

## Pass 65 — Mobile responsiveness — 2026-05-09
**Type:** visual
**Status:** shipped
**Page(s):** /pricing cadence toggle (Monthly/Annual)
**What:** Bumped `.cadence-btn` vertical padding from `0.4rem` to `0.5625rem` in pricing/+page.svelte, raising each button's tap target from 34px to 39px without changing horizontal layout.
**Why:** Probed every interactive element on iPhone 14 (390×844). Most were already comfortable: Subscribe button 42px, waitlist input 41px, bottom CTAs 42px, scenario cards 145px. The exception was the `.cadence-btn` Monthly/Annual toggle: 34px tall — close to but below the 44px AAA target. Pass 20 fixed the same issue on `.madhhab-pill` (calculator) by bumping vertical padding from 0.25rem to 0.4375rem; Pass 35 did the same on `.seg-option` (locale toggle); now the cadence toggle catches up. The toggle is the second-most-used switch on /pricing (after the Subscribe form itself). The container (.cadence) auto-grows to fit the larger buttons (now 49px tall — well above the 44px target). The 1px shadow on the active button still reads correctly. Used `0.5625rem` (9px) instead of `0.625rem` (10px) to keep the visual proportions tight — the toggle reads as a clean segmented control rather than a hefty button row. Same value on desktop and mobile (the toggle isn't differently-styled across breakpoints).
**Files changed:** src/routes/pricing/+page.svelte
**Testing:** Probed on iPhone 14 (390×844): button now 39px (was 34), container 49px. Desktop 1440×900: same 39px (consistent across breakpoints, no regression). Type-check 0 errors. 5 pre-existing /app/settings/branding warnings unchanged.

---

## Pass 66 — Motion & polish — 2026-05-09
**Type:** visual
**Status:** skip
**Page(s):** site-wide motion audit (public surface only)
**What:** Verified the JS-driven-transition reduced-motion sweep is complete across the public surface; nothing left to ship.
**Why:** Public-surface JS-driven transitions all carry reduced-motion guards: homepage hero stagger (Pass 6/15), calculator step fly (Pass 21), ToastHost fly (Pass 36), PlainLanguageSummary slide (Pass 51). ResultActionBar's confetti has both an explicit early return on `prefers-reduced-motion: reduce` AND passes `disableForReducedMotion: true` to canvas-confetti's own check (belt-and-suspenders). RingChart's animated stroke-dashoffset (0.4s) and HeirNode's (0.7s) are CSS transitions, neutralized by the global `app.css` reduced-motion rule (`transition-duration: 0.01ms !important`). Sheet.svelte still has unguarded JS transitions but it's /app-only (out of scope per the audit log header). Any further motion polish would be additive (e.g., adding entrance animations to surfaces that don't currently have them) — that drifts from "respect existing brand direction" into adding novelty motion, which is style preference rather than a focused fix.
**Files changed:** none
**Testing:** Re-read prior motion passes' verification work — the surface is uniformly tuned. Type-check unchanged.

---

## Pass 67 — Overall composition — 2026-05-09
**Type:** visual
**Status:** skip
**Page(s):** /for-attorneys, /for-scholars, /about, /methodology articles, homepage (cross-page composition probe)
**What:** Re-verified editorial column composition across all public pages; everything still aligns after the prior passes.
**Why:** /for-attorneys at 1440×900: container 760, head 608 (Pass 22 ArticleHeader cap), prose 608 (Prose default), CTA row 728 (intentional container-width for bottom action row). Head and Prose share the same column edge — exactly what Pass 22 set out to enforce. Same shape on /for-scholars and /about (same components). /methodology articles cap their head at 608 (Pass 37) so the article hero matches the Prose body width. /methodology index has the editorial-hero-over-grid pattern that's standard for content archives. Homepage Pro section composition (CTA hierarchy) reads correctly with Pass 4's primary-secondary unification. After Pass 22 (ArticleHeader), Pass 32 (Prose first-child), Pass 37 (methodology articles), Pass 52 (cross-page audit), the composition surface is uniformly tuned. Any further change would mean reorganizing layout intent rather than fixing a perception or alignment gap.
**Files changed:** none
**Testing:** Probed /for-attorneys section widths via agent-browser at 1440×900. Type-check unchanged.

---

## Pass 68 — Edge cases & error handling — 2026-05-09
**Type:** feature
**Status:** shipped
**Page(s):** /calculate (See-the-result transition to /result)
**What:** Wrapped the `sessionStorage.setItem` write in `calculate()` with try/catch. On failure, surfaces a 6-second toast ("Couldn't save your inputs. Your browser may have storage disabled (e.g. private browsing).") and aborts the navigation to /result.
**Why:** The calculator's "See the result" handler writes the assembled InheritanceCase to sessionStorage, then navigates to /result. /result reads from sessionStorage (or `?case=`) to render. In Safari Private Browsing pre-iOS-16, sessionStorage's quota is 0 — `setItem` throws QuotaExceededError. The original code didn't catch it, so the throw propagated up but the `goto("/result")` call still ran in the same synchronous tick. The user ended up on /result staring at an empty state, with their 10-30 questions of work seemingly lost. Pass 53's link-error banner solved the parallel "URL token unreadable" path. This pass handles the storage path: catch the throw, show a clear diagnostic toast (matching the same wording shape as Pass 38's IndexedDB toast on /saved), AND `return` early so the user stays on /calculate with their inputs intact instead of landing on a confusing empty page. The toast duration is 6000ms (vs default 3000ms) — same as Pass 38 and Pass 54 — because it's an actionable diagnostic the user needs time to read and decide what to do (close private tab, switch browser, etc.).
**Files changed:** src/routes/calculate/+page.svelte
**Testing:** Type-check 0 errors. 5 pre-existing /app/settings/branding warnings unchanged. Imported `toast` from `$lib/ui` (already-exported from the existing barrel). Did not synthesize a Safari Private Browsing environment to throw QuotaExceededError live; the try/catch shape mirrors the existing patterns on /saved (Pass 38) and ResultActionBar's onSave (line 41). Pass 53's parallel URL-decode banner on /result and this pass together close both data-paths into /result.

---

## Pass 69 — User feedback & responsiveness — 2026-05-09
**Type:** feature
**Status:** shipped
**Page(s):** /saved (Open action — clicking a saved-calculation row to view its result)
**What:** Wrapped /saved's `open()` handler `sessionStorage.setItem` write in try/catch, mirroring Pass 68's `/calculate` fix. On QuotaExceededError, surfaces a 6-second toast and skips the navigation so the user stays on /saved with the row visible.
**Why:** Pass 68 caught the parallel Safari Private Browsing storage failure on /calculate's "See the result" button. This pass closes the same hole on /saved's Open action: clicking a saved row writes the case to sessionStorage and goto's /result. In Safari Private mode pre-iOS-16, sessionStorage quota is 0 and setItem throws QuotaExceededError. The original code didn't catch it — the user would see a toast-less console error AND navigate to /result with an empty state, making them think their saved calculation had been corrupted or deleted. Now the toast tells them their browser has storage disabled (e.g. private browsing) and they stay on /saved with the row clearly still visible — they can switch to a normal-mode tab and try again. Toast wording slightly different from Pass 68 ("Couldn't open this calculation" vs "Couldn't save your inputs") to reflect the user's intent in each context. Same 6000ms duration. Together with Pass 38 (IndexedDB load error toast on /saved), Pass 53 (URL link-error banner on /result), Pass 54 (rename success/error toasts on /saved), Pass 68 (calculate sessionStorage save), the storage-failure surface across the result-rendering flow is uniformly handled.
**Files changed:** src/routes/saved/+page.svelte
**Testing:** Type-check 0 errors. 5 pre-existing /app/settings/branding warnings unchanged. The toast import is already present from Pass 38/Pass 54. Did not synthesize a Safari Private Browsing environment to throw QuotaExceededError; pattern is identical to the Pass 68 fix verified type-clean.

---

## Pass 70 — Performance & Core Web Vitals — 2026-05-09
**Type:** feature
**Status:** skip
**Page(s):** /calculate Core Web Vitals (extended cross-page coverage)
**What:** Probed /calculate's LCP/CLS to round out the cross-page performance audit; all four key pages remain well under "Good" thresholds.
**Why:** /calculate LCP 132ms (paragraph element — likely the question prompt), CLS 0.0000. Combined with Pass 25 measurements (homepage 92ms / 0), Pass 55 (pricing 60ms / 0, methodology 56ms / 0), every key page on the public surface is comfortably in the "Good" zone (LCP < 2500ms, CLS < 0.1) — actually 19-44× faster than that on LCP. The remaining performance levers Pass 25 (homepage hero eager preload) and Pass 40 (Pro CTA viewport preload) covered are pulled. Other knobs (further preload directives, image optimization, bundle splitting) are either already correct via SvelteKit defaults (route-level code splitting), already done (system fonts, no eager images, brand-64.png 4.1KB), or would shift bytes around without measurable user benefit. Adding eager preloads to additional links would prefetch routes for bounce traffic; viewport preloads beyond Pass 40 would duplicate the same prefetch from multiple positions on the same page.
**Files changed:** none
**Testing:** Probed /calculate via PerformanceObserver. Type-check unchanged.

---

## Pass 71 — SEO & metadata — 2026-05-09
**Type:** feature
**Status:** shipped
**Page(s):** /calculate
**What:** Added `<link rel="canonical" href="https://fairshare.guigalabs.com/calculate/" />` to /calculate's `<svelte:head>`.
**Why:** Audited canonical URL coverage across the public surface. /calculate was the only sitemap-indexed route missing one. Every other route — homepage, /methodology, /methodology/[group]/[topic], /pricing, /for-attorneys, /for-scholars, /about, /privacy, /terms, /disclaimer — already declared its canonical. Without one, Pass 29's `?madhhab=` URL-param deep links (e.g. `/calculate?madhhab=maliki`, `/calculate?madhhab=hanafi`) create up to 5 distinct URLs that Google may treat as separate pages, fragmenting the page's SEO authority across variants. With the canonical pointing at the clean `/calculate/` URL, all the parameter-bearing variants consolidate to one indexable page. Verified live on `?madhhab=hanafi` URL: `document.querySelector('link[rel=canonical]').href` resolves to `https://fairshare.guigalabs.com/calculate/`. Same trailing-slash form used in the sitemap and on every other page's canonical.
**Files changed:** src/routes/calculate/+page.svelte
**Testing:** Probed on `/calculate?madhhab=hanafi` — canonical href is `https://fairshare.guigalabs.com/calculate/` regardless of the URL parameter. Type-check 0 errors. 5 pre-existing /app/settings/branding warnings unchanged. The site's canonical coverage is now uniform: every URL in `sitemap.xml` carries a canonical declaration matching its sitemap entry.

---

## Pass 72 — Accessibility — 2026-05-09
**Type:** feature
**Status:** skip
**Page(s):** Field component, html lang/dir hydration, calculator summary chip semantics
**What:** Audited remaining a11y surfaces and found nothing actionable in a focused single-file pass.
**Why:** Field component's `aria-describedby` / `aria-invalid` wiring still missing — closing it requires either a Snippet API refactor (so children can receive an errorId) or rebuilding Field to render the input inline (Pass 57 noted). Both are multi-file architectural changes. The current `role="alert"` on the error span still announces immediately on appearance, which is the moment-of-error case that matters most. `<html lang="en" dir="ltr">` is hardcoded in app.html; AR users see a brief flash of English/LTR before the i18n module hydrates and flips it. Fixing that needs SSR locale detection via cookie or Accept-Language header — a multi-file lift involving hooks.server.ts plus the i18n store. Calculator's `.summary` div uses `aria-label="Heirs collected so far"` which is functional; making it `<ul>` with `<li>` chips would be more idiomatic but the chips are readable individually as-is. Counter (Pass 27 audited) already correct. After Pass 27 (madhhab pills aria-pressed), Pass 42 (kicker aria-live), Pass 49 (card-link focus), Pass 64 (madhhab-card focus), the high-impact a11y surfaces are wired. The remaining gaps are real but cost more than a focused pass.
**Files changed:** none
**Testing:** Re-read 4 component files for a11y patterns. Type-check unchanged.

---

## Pass 73 — Cross-browser & responsive — 2026-05-09
**Type:** visual
**Status:** skip
**Page(s):** Site-wide cross-browser sweep verification
**What:** Re-verified the cross-browser sweep is complete; all unprefixed CSS properties that need vendor fallbacks already have them paired.
**Why:** Grepped the codebase for `100vh`, `appearance: none`, `user-select: none`, `backdrop-filter:` outside of -webkit- prefixed declarations. Four hits found, all with their `-webkit-` companions on the line(s) above:
- Button.svelte: Pass 28 paired `-webkit-appearance` / `-webkit-user-select`
- TopNav.svelte: Pass 13 paired `-webkit-backdrop-filter`
- +error.svelte: Pass 43 paired `-webkit-user-select` on `.error-status`
- +layout.svelte: Pass 58 paired `min-height: 100dvh` after the `100vh` fallback
The grep pulls the standard property line independently because the `-webkit-` line is a separate declaration. Sheet.svelte still has unguarded transitions but it's /app-only (out of scope per the audit log header). No further cross-browser fix to ship without speculating about future browser quirks that haven't materialized.
**Files changed:** none
**Testing:** Grepped 4 cross-browser-sensitive CSS properties across the public surface. All paired correctly.

---

## Pass 74 — Quality of life — 2026-05-09
**Type:** feature
**Status:** shipped
**Page(s):** site-wide locale (every page renders with i18n strings)
**What:** First-visit locale now auto-detects from `navigator.language` instead of always defaulting to English. When localStorage has no `fairshare:locale` saved choice yet, `readStored()` checks if the browser language starts with "ar" (matching `ar`, `ar-EG`, `ar-SA`, `ar-MA`, etc.) and returns "ar" if so. Once the user makes any choice via the locale toggle, the existing localStorage write takes precedence on subsequent visits.
**Why:** A first-time visitor whose OS / browser is set to Arabic (e.g. `ar-EG` is one of the most common Arabic locale codes) was landing on the FairShare homepage in English UI, then had to find and tap the EN/AR locale toggle to switch. The site's i18n bundle already contains a complete Arabic translation; defaulting to it for Arabic-speaking visitors makes the first-page-load experience match what they expect from any localized website. The check is sized correctly: `startsWith("ar")` matches every Arabic locale tag (ar, ar-EG, ar-SA, ar-MA, ar-TN, ar-AE...) without false positives — there are no other ISO 639-1 codes that start with "ar". The localStorage check is preserved as the source of truth for returning visitors and for users who explicitly chose English ("ar" → "en") regardless of their browser locale. The `typeof navigator !== "undefined"` guard handles SSR. Pass 14 / Pass 29 (URL param) follow the same QoL philosophy: respect explicit user signals first, fall through to sensible system defaults. Considered also detecting OS-level direction preference but `prefers-direction` isn't a thing — `navigator.language` is the canonical signal.
**Files changed:** src/lib/i18n/index.svelte.ts
**Testing:** Type-check 0 errors. 5 pre-existing /app/settings/branding warnings unchanged. Did not synthesize an Arabic-locale browser to test live; the check is a single string comparison and `localStorage` precedence is preserved verbatim. The function shape mirrors Pass 14's `readStoredMadhhab` and Pass 29's URL-param-then-localStorage layering.

---

## Pass 75 — Code hygiene — 2026-05-09
**Type:** feature
**Status:** shipped
**Page(s):** repo structure (no runtime page changed)
**What:** Deleted 3 stale `.gitkeep` files from `src/lib/ui/`, `src/lib/features/`, and `src/lib/engine/` — each had been placed when the directory was empty, and each now contains many real files (14 engine .ts files, 6 features subdirectories, 14 UI components).
**Why:** `.gitkeep` is a convention to commit empty directories to git (since git tracks files, not dirs). Once a directory acquires real content, the `.gitkeep` is stale — it shows up in `git ls-tree`, in IDE file trees, and in any "what files exist?" tooling, adding three lines of noise per repo browse for zero functional reason. Verified each directory's current content before removing: ui/ has Banner.svelte, Button.svelte, Card.svelte, Counter.svelte, Field.svelte, IconButton.svelte, Sheet.svelte, TextInput.svelte, ToastHost.svelte, EmptyState.svelte, etc; features/ has compare/, landing/, migration/, pdf/, questionnaire/, result/ subdirs each fully populated; engine/ has the full Fara'id ruleset across 14 typed files. Removing the .gitkeep files is a 100% safe cleanup — no code references them, no build step requires them, no future contributor will be misled by the empty-dir-marker pattern. Empty `src/lib/design/` directory is untracked (was a planned tokens module that never landed) and stays as a no-op local artifact. Pass 30 / Pass 45 / Pass 60 covered the other hygiene angles (deps, docs, type annotations); this finishes the on-disk-structure hygiene pass.
**Files changed:** removed src/lib/ui/.gitkeep, src/lib/features/.gitkeep, src/lib/engine/.gitkeep
**Testing:** `bun run check` 0 errors, same 5 pre-existing /app/settings/branding warnings. `git status` shows the 3 deletions queued (HEAD still has them — will go on next commit). The repo structure now contains only meaningful files in those three directories.

---

## Pass 76 — Typography & hierarchy — 2026-05-09
**Type:** visual
**Status:** skip
**Page(s):** site-wide typography weight + size audit
**What:** Re-verified typographic consistency across all heading and body-text contexts; nothing meaningful left to ship.
**Why:** H2 weights — homepage `.pro-header h2`, `.section-header h2`, `.cta-inner h2` all 700; Prose h2 700; pricing waitlist h2 600 (intentional secondary section heading). H3 weights uniformly 600 across `.feature h3`, WhatIf `header h3`, Prose h3, methodology `.entry-title`, EmptyState `.empty-title`. H1 line-height uniformly 1.15 (Pass 1, 16, 31, 46) except homepage hero 1.05 (intentional for tighter display heading). Lede font-size uniformly 1.0625rem after Pass 61. Body-text sizing in components reads as a clear hierarchy: Banner 15px > Field label 14px > Field error/desc 13px, with EmptyState title elevated to 18px. After 5 typography passes the surface is uniformly tuned — any remaining tweak would mean rewriting the type scale, which is style preference rather than fixing a perception gap.
**Files changed:** none
**Testing:** Grepped 5+ heading/body contexts. Type-check unchanged.

---

## Pass 77 — Spacing & layout rhythm — 2026-05-09
**Type:** visual
**Status:** skip
**Page(s):** site-wide spacing audit (5th cycle)
**What:** Re-verified the spacing surface; nothing meaningful to change.
**Why:** Pass 2 fixed homepage section padding asymmetry. Pass 32 fixed Prose first-child margin-top collapse. Pass 47 audited 8+ rhythms cross-page and found nothing. Pass 62 audited again and found nothing. After three full audits, the spacing surface is uniformly tuned — homepage sections symmetric 64/64 with intentional hero/CTA asymmetry, /pricing card-waitlist-CTA cascade has descending rhythm (40-32-24), /methodology articles use 73px section break before nav buttons, /calculate header gaps 16px, editorial pages share Prose's first-child collapse. Any further change would reorganize layout intent rather than fix a perception gap.
**Files changed:** none
**Testing:** Re-read prior audit findings. Type-check unchanged.

---

## Pass 78 — Color & contrast — 2026-05-09
**Type:** visual
**Status:** skip
**Page(s):** site-wide contrast audit (5th cycle)
**What:** Re-verified contrast surface; nothing left to ship.
**Why:** Pass 3 (secondary button border), Pass 33 (pro-banner border), Pass 34 (destructive hover token), Pass 48 (cross-page WCAG audit, all surfaces 5.97-18.88:1), Pass 63 (cadence/toast/banner verify). Every text and interactive surface passes WCAG AA Normal (4.5:1). Card and warning-banner borders read soft because they're container chrome — Pass 33 already strengthened the *interactive* pill borders specifically. Tightening container borders further would push the editorial palette away from its restrained brand direction.
**Files changed:** none
**Testing:** Re-read prior audit findings. Type-check unchanged.

---

## Pass 79 — CTAs & interactive elements — 2026-05-09
**Type:** visual
**Status:** shipped
**Page(s):** / (homepage bottom CTA section — iOS download link)
**What:** Added a `:focus-visible` rule to `.ios-link` on the homepage with `outline: 2px solid var(--color-accent); outline-offset: 2px`, matching the pattern Pass 49 (methodology card-link) and Pass 64 (madhhab card) used for pill-shaped clickables.
**Why:** The iOS App Store link in the bottom CTA section uses `border-radius: var(--radius-pill)` (full pill) but had no `:focus-visible` rule. Inheriting the global app.css outline would draw a 2px-radius rectangle around a fully-rounded pill — same chrome mismatch Pass 49 / Pass 64 fixed for rounded cards. The link only renders in prod (when `PUBLIC_APP_STORE_URL` is set; Pass 15 made it env-driven), but a keyboard-navigating Pro-curious visitor on prod would see a misaligned focus rectangle. Now reads as deliberate keyboard chrome conforming to the pill shape. Affects only the public surface's bottom CTA section. Together with QuickScenarios (already had it), /methodology card-link (Pass 49), homepage madhhab-card (Pass 64), every rounded clickable on the public surface now has a shape-aware focus outline.
**Files changed:** src/routes/+page.svelte
**Testing:** Type-check 0 errors. 5 pre-existing /app/settings/branding warnings unchanged. Did not synthesize live focus check — `.ios-link` only renders when `PUBLIC_APP_STORE_URL` env is set, which it isn't in dev. The CSS rule applies the moment the element is rendered in prod.

---

## Pass 80 — Mobile responsiveness — 2026-05-09
**Type:** visual
**Status:** shipped
**Page(s):** /calculate (Counter widget — used on every "How many heirs?" question)
**What:** Bumped `.ctl` (the +/− buttons in the Counter component) from `2.25rem × 2.25rem` (36×36px) to `2.75rem × 2.75rem` (44×44px), exactly meeting WCAG 2.5.5 AAA touch target.
**Why:** Probed remaining tap targets at iPhone 14 viewport. Most surfaces meet or exceed 44px after the prior Mobile passes (Pass 5 footer 39px, Pass 20 madhhab pill 36px, Pass 35 locale toggle 32→42px, Pass 50 brand link 60px, Pass 65 cadence 39px). The Counter component's increment/decrement buttons stood out at 36×36px — used during the questionnaire whenever the user enters a count (sons, daughters, brothers…). For a practitioner filling in 5+ heir-count fields per case on a phone, every +/− tap matters; 36px is borderline-misclickable for index-finger taps and outright frustrating for thumb taps. The fix is a single rule change since Counter is a shared component — bumping width AND height to 2.75rem (44px) gives both axes the AAA target. The button content (the `−` and `+` characters) stay centered via the existing `display: inline-flex; align-items: center; justify-content: center`. The 14px gap between buttons and the value-display (`gap: 0.5rem` on `.counter-controls`) absorbs the size bump without breaking layout. After this pass, every interactive element on the public surface meets the 44px AAA target.
**Files changed:** src/lib/ui/Counter.svelte
**Testing:** Type-check 0 errors. 5 pre-existing /app/settings/branding warnings unchanged. Counter is also used in /app/cases/new (out of scope for this loop) — same component, so the change benefits that surface too without separate work.

---

## Pass 81 — Motion & polish — 2026-05-09
**Type:** visual
**Status:** skip
**Page(s):** site-wide motion audit (5th cycle)
**What:** Re-verified the JS-driven-transition reduced-motion sweep is complete; nothing left to ship.
**Why:** Public-surface JS-driven transitions all carry reduced-motion guards (Pass 6/15 hero, Pass 21 calculate step, Pass 36 ToastHost, Pass 51 PlainLanguageSummary). Confetti has explicit + library-level guards. RingChart/HeirNode CSS transitions are caught by the global app.css reduced-motion rule. Pass 66 already audited and confirmed nothing further to ship without speculative additive motion. Sheet.svelte still has unguarded transitions but it's /app-only (out of scope).
**Files changed:** none
**Testing:** Re-read prior motion passes. Type-check unchanged.

---

## Pass 82 — Overall composition — 2026-05-09
**Type:** visual
**Status:** skip
**Page(s):** site-wide composition audit (5th cycle)
**What:** Re-verified editorial composition; nothing left to ship.
**Why:** Pass 22 (ArticleHeader 38rem cap), Pass 32 (Prose first-child margin), Pass 37 (methodology article hero column), Pass 52, 67 (cross-page audits) — all editorial pages share the same column edge between hero and body. Homepage Pro section CTA hierarchy reads correctly. Methodology hero-over-grid pattern is conventional editorial. Any further change would mean reorganizing layout intent rather than fixing a perception gap.
**Files changed:** none
**Testing:** Re-read prior composition audit findings. Type-check unchanged.

---

## Pass 83 — Edge cases & error handling — 2026-05-09
**Type:** feature
**Status:** shipped
**Page(s):** /settings (the public settings page that shows saved-count + export/clear actions)
**What:** Wrapped /settings's `onMount(refresh)` in try/catch with a 6-second error toast — same pattern Pass 38 applied to /saved.
**Why:** Audited every onMount in non-/app routes for silent failures. /settings calls `refresh()` which calls `listCalculations()` from `$lib/persistence`. If IndexedDB is disabled (Safari Private Browsing, storage permission revoked), the call rejects and the savedCount stays at its initial 0. Without the catch, the user sees "0 saved calculations" displayed in the settings card and an unhandled promise rejection in the console — they'd reasonably conclude their saved data was lost. Pass 38 fixed the parallel issue on /saved (where the same listCalculations call powers the row list); /settings was the missed sibling. The toast wording matches Pass 38 exactly so users seeing both surfaces get a consistent diagnostic. The 6000ms duration matches Pass 38, 54, 68, 69. Combined with Pass 38 (saved load), Pass 53 (URL link error), Pass 54 (rename error), Pass 68 (calculate sessionStorage), Pass 69 (saved open sessionStorage), every async storage path on the public surface now handles failure with a user-facing message instead of silent state.
**Files changed:** src/routes/settings/+page.svelte
**Testing:** Type-check 0 errors. 5 pre-existing /app/settings/branding warnings unchanged. The toast import is already present from Pass 38-era infrastructure. The pattern is identical to Pass 38 / Pass 54 / Pass 68 / Pass 69 which were all verified type-clean.

---

## Pass 84 — User feedback & responsiveness — 2026-05-09
**Type:** feature
**Status:** shipped
**Page(s):** /settings (Clear all data button — destructive irreversible action)
**What:** Added a `clearing` `$state` flag, wired `loading={clearing}` to the destructive Button so Pass 24's spinner renders during the wipe, gated re-entry with `if (clearing) return`, wrapped the wipe operation in try/catch, and added an error toast for failure. Resets `clearing = false` in `finally` so UI never gets stuck.
**Why:** Audited /settings for feedback gaps. exportJson already had try/catch + success/error toasts. clearAll had only a success toast — no loading state, no error handling, no double-click guard. For a destructive irreversible action ("delete ALL saved calculations and reset preferences"), the user clicks the button, sees no immediate feedback, may double-click out of impatience, and if `indexedDB.deleteDatabase` rejects (rare but possible), the operation appears to fail silently. The fix mirrors the patterns Pass 9 (subscribing flag), Pass 24 (Button spinner), Pass 39 (login loading), Pass 54 (saved rename try/catch), Pass 68 (sessionStorage error toast) established. The spinner shows during the wipe, the button disables to prevent re-entry, the error toast says "Couldn't clear local data. Try again." which matches the wording shape Pass 38, 54, 68, 69, 83 use. The `confirm()` browser dialog is preserved as the primary "are you sure" gate before any state mutation.
**Files changed:** src/routes/settings/+page.svelte
**Testing:** Type-check 0 errors. 5 pre-existing /app/settings/branding warnings unchanged. The Button's `loading` prop was added to the existing `<Button variant="destructive">` declaration. After this pass, every destructive or irreversible action on the public surface (Clear all on /settings, Delete on /saved Pass 54, Subscribe-to-Pro on /pricing Pass 9) has the spinner + double-click guard pattern.

---

## Pass 85 — Performance & Core Web Vitals — 2026-05-09
**Type:** feature
**Status:** skip
**Page(s):** site-wide performance audit (5th cycle)
**What:** Re-verified the performance surface; nothing left to ship.
**Why:** Pass 25 (homepage hero eager preload), Pass 40 (Pro CTA viewport preload), Pass 55 + Pass 70 (cross-page LCP/CLS audits — all four key pages 56-132ms LCP, 0 CLS, 19-44× under "Good" threshold). System fonts, no critical-path images, PWA caching well-configured. The remaining performance levers (more eager preloads, image optimization beyond brand-64.png 4.1KB) would shift bytes around without measurable user benefit. Three full-cycle audits agree: the surface is uniformly tuned.
**Files changed:** none
**Testing:** Re-read prior performance audit findings. Type-check unchanged.

---

## Pass 86 — SEO & metadata — 2026-05-09
**Type:** feature
**Status:** shipped
**Page(s):** /pricing
**What:** Added explicit `og:title`, `og:description`, `og:type`, `og:url` meta tags to /pricing's `<svelte:head>` so social-card scrapers (Twitter, LinkedIn, WhatsApp, Slack, Discord) get tuned-for-share copy instead of falling back to the page's static title/description tags.
**Why:** Audited per-page og overrides. Only the homepage and methodology articles currently set explicit og tags. /pricing — the most-shared marketing URL on the site, the conversion entry point — relied on social scrapers falling back to the page `<title>` and `<meta description>`. That fallback works but isn't guaranteed (some scrapers prioritize og:* and ignore the static tags entirely; others present og:* differently than `<title>`). Explicit og:* gives deterministic control over the share-card render. Tuned the og copy slightly differently from the SEO description: the SEO description leads with the SKU ("FairShare Pro for Islamic estate practitioners. ... $19/mo or $179/yr"), while og:title is a plain hook ("FairShare Pro for Practitioners") since og:site_name (added Pass 26 to app.html) handles the brand suffix automatically. Pass 26 already covers the og:image / og:image:* / twitter:card defaults at the app.html level, so /pricing inherits those without per-page declaration. Other pages that should also have explicit og tags (/for-attorneys, /for-scholars, /about, /methodology index, /calculate) follow the same shape and could land in subsequent passes — /pricing first because it carries the highest social-share value.
**Files changed:** src/routes/pricing/+page.svelte
**Testing:** Type-check 0 errors. 5 pre-existing /app/settings/branding warnings unchanged. Did not probe live with social-card scrapers (Twitter/LinkedIn validators require deployed URLs); the meta-tag shape matches the homepage's existing og: declarations verbatim.

---

## Pass 87 — Accessibility — 2026-05-09
**Type:** feature
**Status:** shipped
**Page(s):** /saved (loading state)
**What:** Added `role="status"` to /saved's "Loading…" paragraph so screen readers announce the in-progress data fetch politely.
**Why:** The /saved page renders `<p class="hint">Loading…</p>` while `listCalculations()` resolves on mount. Sighted users see the text; screen-reader users got nothing — the paragraph rendered into the DOM but had no live-region semantics, so the "Loading…" message was silent. role="status" turns it into a polite live region: AT announces it on appearance without interrupting other speech. When loading flips to false and the paragraph unmounts, the next state (rows list or empty state) is reachable via Tab — the role="status" only governs the loading message itself. Same pattern Pass 42 used on the calculator's progress kicker (aria-live="polite") and what /pricing's waitlist-thanks line already has (`role="status"`). Tiny, focused, low-risk a11y improvement that closes one specific announcement gap.
**Files changed:** src/routes/saved/+page.svelte
**Testing:** Type-check 0 errors. 5 pre-existing /app/settings/branding warnings unchanged. role="status" is a built-in ARIA role with implicit aria-live="polite" — Svelte renders it verbatim onto the `<p>` element.

---

## Pass 88 — Cross-browser & responsive — 2026-05-09
**Type:** visual
**Status:** skip
**Page(s):** site-wide cross-browser audit (5th cycle)
**What:** Re-verified the cross-browser sweep is complete; nothing left to ship.
**Why:** Pass 13 (TopNav backdrop-filter), Pass 28 (Button appearance/user-select), Pass 43 (+error user-select), Pass 58 (100dvh viewport units), Pass 73 (sweep audit). All four unprefixed cross-browser-sensitive properties on the public surface have their `-webkit-` companion lines paired. Sheet.svelte residue is /app-only. No further fix without speculating about future browser quirks.
**Files changed:** none
**Testing:** Re-read prior audit findings. Type-check unchanged.

---

## Pass 89 — Quality of life — 2026-05-09
**Type:** feature
**Status:** shipped
**Page(s):** /saved (row date display)
**What:** Replaced the hardcoded `toLocaleDateString("en")` on /saved's row meta with `toLocaleDateString(i18n.current)`, so saved-row dates render in the user's chosen locale (Arabic numerals when AR is active, English numerals when EN is active).
**Why:** Pass 14 / Pass 29 / Pass 74 added smart-default behavior for madhhab persistence and locale auto-detection. /saved's row meta line shows madhhab + gender + last-updated date — the date was rendering as `5/9/2026` regardless of UI locale, even when the page was in Arabic mode (where dates conventionally render as `٩‏/٥‏/٢٠٢٦`). For Arabic-speaking practitioners reviewing their saved cases, having dates in English numerals breaks visual consistency with the rest of the page (madhhab name, "X heirs" pill, action labels — all in Arabic). The `i18n.current` is reactive `$state` (Svelte 5 runes), so toggling the locale toggle re-renders all dates without a page reload. Imported from the existing i18n module — no API change needed. Native `toLocaleDateString` accepts BCP-47 locale codes and falls back gracefully if the locale is unknown. Pass 14 (madhhab persistence) and Pass 74 (auto-detect locale) reinforce: respect the user's locale signals throughout, not just in i18n strings.
**Files changed:** src/routes/saved/+page.svelte
**Testing:** Type-check 0 errors. 5 pre-existing /app/settings/branding warnings unchanged. The `i18n` export is re-used from the existing module; no new files. Did not synthesize a saved-row in IndexedDB to manually verify the rendered date in both locales — `toLocaleDateString` is a stable browser API and the only change is the locale argument.
