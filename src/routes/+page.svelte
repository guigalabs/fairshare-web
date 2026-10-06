<script lang="ts">
  import { env } from "$env/dynamic/public";
  import { Button, Field, Sheet, TextInput } from "$lib/ui";
  import HeroLedger from "$lib/features/landing/HeroLedger.svelte";
  import { t } from "$lib/i18n/index.svelte";
  import {
    serialiseJsonLd,
    softwareApplicationSchema,
    organizationSchema,
    websiteSchema,
  } from "$lib/seo/jsonld";
  import { loc, pageUrl } from "$lib/i18n/url";
  import { page } from "$app/state";

  const appSchema = softwareApplicationSchema();
  const orgSchema = organizationSchema();
  const siteSchema = websiteSchema();
  const canonical = $derived(pageUrl(page.url.pathname));

  // Until the iOS app ships, the badge opens a waitlist modal instead of
  // linking to the App Store. Once PUBLIC_APP_STORE_URL is set, click flows
  // straight to Apple.
  const APP_STORE_URL = env.PUBLIC_APP_STORE_URL || null;

  let iosSheetOpen = $state(false);
  let iosEmail = $state("");
  let iosStatus = $state<"idle" | "pending" | "ok" | "error">("idle");

  function onIosClick(e: MouseEvent) {
    if (APP_STORE_URL) return; // let the link navigate normally
    e.preventDefault();
    iosSheetOpen = true;
  }

  async function submitIosWaitlist(e: SubmitEvent) {
    e.preventDefault();
    if (iosStatus === "pending") return;
    iosStatus = "pending";
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: iosEmail, source: "ios" }),
      });
      iosStatus = res.ok ? "ok" : "error";
    } catch {
      iosStatus = "error";
    }
  }

  const SCHOOLS = ["general", "hanafi", "maliki", "shafii", "hanbali"];

  // The six fixed fractions of Surah an-Nisa, with the verses that set them.
  const SHARES = [
    { frac: "1/2", key: "half", verses: "4:11, 4:12, 4:176" },
    { frac: "1/4", key: "quarter", verses: "4:12" },
    { frac: "1/8", key: "eighth", verses: "4:12" },
    { frac: "2/3", key: "twoThirds", verses: "4:11, 4:176" },
    { frac: "1/3", key: "third", verses: "4:11, 4:12" },
    { frac: "1/6", key: "sixth", verses: "4:11, 4:12" },
  ];

  const PRO_FEATURES = ["f1", "f2", "f3", "f4"];
  const ASKS = ["q1", "q2", "q3", "q4"];
</script>

<svelte:head>
  <title>{t("landing.pageTitle")}</title>
  <meta name="description" content={t("landing.metaDescription")} />
  <link rel="canonical" href={canonical} />

  <meta property="og:title" content={t("landing.ogTitle")} />
  <meta property="og:description" content={t("landing.ogDescription")} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={canonical} />
  {@html serialiseJsonLd(appSchema)}
  {@html serialiseJsonLd(orgSchema)}
  {@html serialiseJsonLd(siteSchema)}
</svelte:head>

<div class="page">
  <section class="hero">
    <div class="hero-copy">
      <p class="eyebrow">{t("home.eyebrow.what")}</p>
      <h1 class="display">{t("home.title")}</h1>
      <p class="lead serif">{t("home.lede")}</p>
      <div class="cta-row">
        <Button href={loc("/calculate")} size="lg" data-sveltekit-preload-code="eager">
          {t("landing.cta.primary")} →
        </Button>
        <p class="mono note">{t("home.meta")}</p>
      </div>
      <p class="mono note">
        <a class="textlink" href={loc("/methodology")}>{t("home.cta.secondary")}</a>
        <a class="textlink" href={APP_STORE_URL ?? "#"} onclick={onIosClick}>
          {APP_STORE_URL ? t("home.ios.store") : t("home.ios.waitlist")}
        </a>
      </p>
    </div>
    <HeroLedger />
  </section>

  <section class="asks" aria-labelledby="asks-title">
    <h2 id="asks-title" class="eyebrow">{t("home.eyebrow.asks")}</h2>
    <ul class="asks-list">
      {#each ASKS as q (q)}
        <li class="mono">“{t(`home.asks.${q}`)}”</li>
      {/each}
    </ul>
  </section>

  <section class="shares" aria-labelledby="shares-title">
    <div class="section-head">
      <p class="eyebrow">{t("home.eyebrow.shares")}</p>
      <h2 id="shares-title" class="heading">{t("home.shares.title")}</h2>
      <p class="body serif">{t("home.shares.lede")}</p>
    </div>
    <dl class="grid--3 grid">
      {#each SHARES as s (s.key)}
        <div class="cell">
          <dt class="share-num"><bdi dir="ltr">{s.frac}</bdi></dt>
          <dd>
            <p class="body serif">{t(`home.shares.${s.key}`)}</p>
            <p class="mono verse">{t("home.shares.surah")} <bdi dir="ltr">{s.verses}</bdi></p>
          </dd>
        </div>
      {/each}
    </dl>
  </section>

  <section class="schools split" aria-labelledby="schools-title">
    <div class="section-head section-head--flush">
      <p class="eyebrow">{t("home.eyebrow.schools")}</p>
      <h2 id="schools-title" class="heading">{t("home.schools.title")}</h2>
      <p class="body serif">{t("home.schools.lede")}</p>
    </div>
    <ul class="school-list">
      {#each SCHOOLS as slug (slug)}
        <li>
          <a href={loc(`/methodology/madhhab/${slug}`)}>
            <span class="school-name">{t(`madhhab.${slug}.name`)}</span>
            <span class="mono school-desc">{t(`madhhab.${slug}.desc`)}</span>
          </a>
        </li>
      {/each}
    </ul>
  </section>

  <section class="pro" aria-labelledby="pro-title">
    <div class="section-head">
      <p class="eyebrow">{t("home.eyebrow.pro")}</p>
      <h2 id="pro-title" class="heading">{t("home.pro.title")}</h2>
      <p class="body serif">{t("home.pro.lede")}</p>
      <div class="pro-actions">
        <Button href={loc("/pricing")} variant="secondary" data-sveltekit-preload-code="viewport">
          {t("landing.pro.cta")} →
        </Button>
        <a class="mono textlink" href={loc("/for-attorneys")}>{t("landing.pro.cta.attorneys")}</a>
        <a class="mono textlink" href={loc("/for-scholars")}>{t("landing.pro.cta.scholars")}</a>
      </div>
    </div>
    <dl class="grid--4 grid">
      {#each PRO_FEATURES as f (f)}
        <div class="cell">
          <dt class="subhead">{t(`landing.pro.${f}.title`)}</dt>
          <dd class="body serif">{t(`landing.pro.${f}.body`)}</dd>
        </div>
      {/each}
    </dl>
  </section>

  <section class="disclaimer">
    <p class="mono">
      <strong>{t("landing.disclaimer.bold")}</strong>
      {t("landing.disclaimer.rest")}
    </p>
  </section>
</div>

<Sheet bind:open={iosSheetOpen} title={t("iosWaitlist.title")}>
  {#snippet children()}
    <p class="ios-sheet-lede">{t("iosWaitlist.lede")}</p>
    {#if iosStatus === "ok"}
      <p class="ios-sheet-thanks" role="status">{t("iosWaitlist.thanks")}</p>
    {:else}
      <form class="ios-sheet-form" onsubmit={submitIosWaitlist}>
        <Field
          label={t("iosWaitlist.emailLabel")}
          error={iosStatus === "error" ? t("iosWaitlist.error") : undefined}
        >
          {#snippet children()}
            <TextInput
              type="email"
              autocomplete="email"
              required
              bind:value={iosEmail}
              placeholder="you@example.com"
            />
          {/snippet}
        </Field>
        <Button type="submit" loading={iosStatus === "pending"} fullWidth>
          {t("iosWaitlist.submit")}
        </Button>
      </form>
    {/if}
  {/snippet}
</Sheet>

<style>
  .page {
    max-width: 1200px;
    margin: 0 auto;
  }

  /* Type roles */
  .display {
    font-weight: 800;
    font-size: clamp(2.5rem, 7.2vw, 4.5rem);
    line-height: 0.98;
    letter-spacing: -0.025em;
  }
  .heading {
    font-size: clamp(1.875rem, 4.5vw, 2.625rem);
    line-height: 1.04;
  }
  .subhead {
    font-weight: 600;
    font-size: 1.25rem;
    line-height: 1.32;
  }
  .lead {
    font-size: 1.25rem;
    line-height: 1.55;
    color: var(--color-text-muted);
    max-width: 40rem;
  }
  .body {
    font-size: 1.0625rem;
    line-height: 1.62;
    color: var(--color-text-muted);
  }
  .mono {
    font-size: 0.8125rem;
    line-height: 1.5;
  }
  :global(html[dir="rtl"]) .mono {
    font-family: var(--font-arabic);
    letter-spacing: 0;
    font-size: 0.875rem;
  }
  .note {
    color: var(--color-text-muted);
  }
  p.note:has(.textlink) {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem 1.5rem;
  }
  .textlink {
    color: inherit;
    text-decoration: underline;
    text-decoration-color: color-mix(in oklab, currentColor 45%, transparent);
  }
  .textlink:hover {
    color: var(--color-text);
    text-decoration-color: currentColor;
  }

  /* Hero */
  .hero {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 3rem;
    padding: 3.5rem 2rem 4.5rem;
    border-bottom: 1px solid var(--color-border);
  }
  @media (min-width: 960px) {
    .hero {
      grid-template-columns: minmax(0, 1.15fr) minmax(300px, 0.85fr);
      gap: 3.5rem;
      align-items: center;
      padding: 6rem 2rem 6.75rem;
    }
  }
  .hero-copy {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    min-width: 0;
  }
  .cta-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1rem 1.375rem;
    margin-top: 0.5rem;
  }
  .cta-row .note {
    max-width: 18rem;
  }

  /* What it answers */
  .asks {
    display: flex;
    flex-direction: column;
    gap: 0.875rem;
    padding: 2.5rem 2rem 2.75rem;
    border-bottom: 1px solid var(--color-border);
  }
  .asks h2 {
    letter-spacing: 0.04em;
    line-height: 1.4;
  }
  .asks-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 0.5rem 2.5rem;
    color: var(--color-text);
  }
  @media (min-width: 760px) {
    .asks-list {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  /* Section heads */
  .section-head {
    display: flex;
    flex-direction: column;
    gap: 0.875rem;
    padding: 4rem 2rem 2.5rem;
    max-width: 46rem;
  }
  .section-head--flush {
    padding: 0;
  }

  /* Ruled grids: hairline dividers between cells, no boxes. */
  .grid {
    margin: 0;
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    border-top: 1px solid var(--color-border);
    border-bottom: 1px solid var(--color-border);
  }
  .cell {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 2rem 2rem 2.25rem;
    border-bottom: 1px solid var(--color-border);
  }
  .cell dd {
    margin: 0;
  }
  @media (min-width: 700px) {
    .grid--3,
    .grid--4 {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .cell:nth-child(odd) {
      border-inline-end: 1px solid var(--color-border);
    }
  }
  @media (min-width: 1080px) {
    .grid--3 {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
    .grid--4 {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
    .cell:nth-child(odd) {
      border-inline-end: 0;
    }
    .grid--3 .cell:not(:nth-child(3n)),
    .grid--4 .cell:not(:nth-child(4n)) {
      border-inline-end: 1px solid var(--color-border);
    }
    .grid--4 .cell {
      border-bottom: 0;
    }
    .grid--3 .cell:nth-child(n + 4) {
      border-bottom: 0;
    }
  }
  .share-num {
    font-family: var(--font-display);
    font-weight: 900;
    font-size: 4rem;
    line-height: 0.82;
    letter-spacing: -0.04em;
    color: var(--color-text);
  }
  .verse {
    margin-top: 0.75rem;
    color: var(--color-accent);
  }

  /* Schools */
  .split {
    display: grid;
    gap: 2.5rem;
    padding: 4rem 2rem;
    border-bottom: 1px solid var(--color-border);
  }
  @media (min-width: 860px) {
    .split {
      grid-template-columns: minmax(0, 5fr) minmax(0, 6fr);
      gap: 4.5rem;
    }
  }
  .school-list {
    list-style: none;
    margin: 0;
    padding: 0;
    border-top: 2px solid var(--color-edge);
  }
  .school-list a {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: space-between;
    gap: 0.25rem 1rem;
    padding: 1rem 0;
    border-bottom: 1px solid var(--color-border);
    color: var(--color-text);
    text-decoration: none;
  }
  .school-name {
    font-weight: 600;
    font-size: 1.25rem;
  }
  .school-desc {
    color: var(--color-text-muted);
  }
  .school-list a:hover .school-name {
    color: var(--color-accent);
    text-decoration: underline;
    text-decoration-thickness: 2px;
  }

  /* Pro */
  .pro-actions {
    margin-top: 0.75rem;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1rem 1.5rem;
  }
  .pro-actions .textlink {
    color: var(--color-text);
  }

  /* Disclaimer */
  .disclaimer {
    padding: 2.5rem 2rem 0;
  }
  .disclaimer p {
    max-width: 52rem;
    padding: 0.875rem 1rem;
    border: 1px solid var(--color-border-strong);
    color: var(--color-text-muted);
    line-height: 1.65;
  }
  .disclaimer strong {
    color: var(--color-text);
    font-weight: 500;
  }

  @media (max-width: 639px) {
    .hero,
    .asks,
    .split,
    .disclaimer {
      padding-inline: 1.125rem;
    }
    .section-head {
      padding: 3rem 1.125rem 2rem;
    }
    .section-head--flush {
      padding: 0;
    }
    .cell {
      padding: 1.75rem 1.125rem 2rem;
    }
  }

  /* iOS waitlist sheet */
  .ios-sheet-lede {
    margin-bottom: 1rem;
    color: var(--color-text-secondary);
    line-height: 1.55;
  }
  .ios-sheet-form {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  .ios-sheet-thanks {
    color: var(--color-accent);
    font-weight: 500;
    padding: 1rem 0;
  }
</style>
