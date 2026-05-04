# fairshare-web

Web port of [FairShare iOS](https://github.com/guigalabs/fairshare-ios) — an Islamic
inheritance (Fara'id) calculator. Five madhabs, full Quranic citations, bilingual EN/AR
with full RTL, family-tree visualization, PDF export. Free, offline-first, no accounts.

Deployed at **https://fairshare.guigalabs.com**.

## Stack

- **SvelteKit 2 + Svelte 5** (runes)
- **Vite 8 + TypeScript strict + Tailwind v4** (`@tailwindcss/vite`)
- **`@sveltejs/adapter-cloudflare`** → Cloudflare Pages (free routes prerendered, `/api/**` and future `/app/**` run as Pages Functions)
- **Bun** (dev runtime + package manager)
- **Engine**: TypeScript port of `FairShareEngine` Swift package, with BigInt-backed exact
  fractions and a snapshot parity test against the Swift side.
- **Persistence**: Dexie (IndexedDB).
- **i18n**: Paraglide JS for EN/AR with locale-segmented routes.
- **PDF export**: `pdf-lib` + `@pdf-lib/fontkit` (embedded Noto Naskh Arabic).
- **PWA**: `@vite-pwa/sveltekit` — installable, offline-capable calculator.
- **Tests**: Vitest (unit), Playwright (e2e + axe-core a11y).
- **Format**: Prettier + svelte/tailwind plugins.

## Develop

```bash
bun install
bun run dev              # http://localhost:5173
bun run check            # type-check via svelte-check
bun run test             # vitest unit tests
bun run test:e2e         # playwright e2e (boots its own preview server)
bun run test:a11y        # axe-core via playwright
bun run build            # output to .svelte-kit/cloudflare
bun run preview          # serve the build locally (prerendered routes only)
bun run fmt              # prettier --write .
```

## Deploy

```bash
bunx wrangler pages deploy .svelte-kit/cloudflare --project-name=fairshare-web
```

`/api/**` and (future) `/app/**` routes run as Cloudflare Pages Functions. KV
bindings are declared in `wrangler.toml`; create namespaces with:

```bash
bunx wrangler kv namespace create WAITLIST_KV
bunx wrangler kv namespace create WAITLIST_KV --preview
```

Paste the returned IDs into `wrangler.toml`.

## See also

- Plan: `~/.claude/plans/twinkly-plotting-torvalds.md`
- iOS source: `~/src/guigalabs/fairshare-ios`
- Engine source-of-truth: `~/src/guigalabs/fairshare-ios/FairShareEngine/`
