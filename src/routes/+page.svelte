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

<section class="hero">
  <div class="wrap hero-grid">
    <div class="hero-copy">
      <h1>{t("home.title")}</h1>
      <p class="lede">{t("home.lede")}</p>
      <div class="hero-actions">
        <Button href={loc("/calculate")} size="lg" data-sveltekit-preload-code="eager">
          {t("landing.cta.primary")}
        </Button>
        <a class="text-link" href={loc("/methodology")}>{t("home.cta.secondary")}</a>
      </div>
      <p class="hero-meta">
        {t("home.meta")}
        <a class="text-link" href={APP_STORE_URL ?? "#"} onclick={onIosClick}>
          {APP_STORE_URL ? t("home.ios.store") : t("home.ios.waitlist")}
        </a>
      </p>
    </div>
    <HeroLedger />
  </div>
</section>

<section class="shares" aria-labelledby="shares-title">
  <div class="wrap">
    <div class="section-intro">
      <h2 id="shares-title">{t("home.shares.title")}</h2>
      <p>{t("home.shares.lede")}</p>
    </div>
    <dl class="share-grid">
      {#each SHARES as s (s.key)}
        <div class="share">
          <dt class="frac share-frac">{s.frac}</dt>
          <dd>
            <p>{t(`home.shares.${s.key}`)}</p>
            <p class="share-verse">{t("home.shares.surah")} <bdi dir="ltr">{s.verses}</bdi></p>
          </dd>
        </div>
      {/each}
    </dl>
  </div>
</section>

<section class="schools" aria-labelledby="schools-title">
  <div class="wrap split">
    <div class="section-intro">
      <h2 id="schools-title">{t("home.schools.title")}</h2>
      <p>{t("home.schools.lede")}</p>
    </div>
    <ul class="school-list">
      {#each SCHOOLS as slug (slug)}
        <li>
          <a href={loc(`/methodology/madhhab/${slug}`)}>
            <span class="school-name">{t(`madhhab.${slug}.name`)}</span>
            <span class="school-desc">{t(`madhhab.${slug}.desc`)}</span>
          </a>
        </li>
      {/each}
    </ul>
  </div>
</section>

<section class="pro" aria-labelledby="pro-title">
  <div class="wrap split">
    <div class="section-intro">
      <h2 id="pro-title">{t("home.pro.title")}</h2>
      <p>{t("home.pro.lede")}</p>
      <div class="pro-actions">
        <Button href={loc("/pricing")} variant="secondary" data-sveltekit-preload-code="viewport">
          {t("landing.pro.cta")}
        </Button>
        <a class="text-link" href={loc("/for-attorneys")}>{t("landing.pro.cta.attorneys")}</a>
        <a class="text-link" href={loc("/for-scholars")}>{t("landing.pro.cta.scholars")}</a>
      </div>
    </div>
    <dl class="pro-list">
      {#each PRO_FEATURES as f (f)}
        <div>
          <dt>{t(`landing.pro.${f}.title`)}</dt>
          <dd>{t(`landing.pro.${f}.body`)}</dd>
        </div>
      {/each}
    </dl>
  </div>
</section>

<section class="wrap disclaimer">
  <p><strong>{t("landing.disclaimer.bold")}</strong> {t("landing.disclaimer.rest")}</p>
</section>

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
  .wrap {
    max-width: 1120px;
    margin: 0 auto;
    padding-inline: 1.25rem;
  }

  /* Hero */
  .hero {
    padding: 3rem 0 4rem;
  }
  @media (min-width: 960px) {
    .hero {
      padding: 5rem 0 6rem;
    }
  }
  .hero-grid {
    display: grid;
    gap: 3rem;
  }
  @media (min-width: 960px) {
    .hero-grid {
      grid-template-columns: 1fr minmax(0, 32rem);
      gap: 4rem;
      align-items: start;
    }
  }
  .hero-copy {
    max-width: 34rem;
  }
  @media (min-width: 960px) {
    .hero-copy {
      padding-top: 1.5rem;
    }
  }
  .hero h1 {
    font-size: clamp(2.375rem, 5vw, 3.75rem);
    line-height: 1.04;
    letter-spacing: -0.01em;
  }
  .lede {
    margin-top: 1.5rem;
    font-size: 1.125rem;
    line-height: 1.6;
    color: var(--color-text-secondary);
    max-width: 32rem;
  }
  .hero-actions {
    margin-top: 2rem;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1rem 1.5rem;
  }
  .hero-meta {
    margin-top: 1.5rem;
    font-size: 0.875rem;
    color: var(--color-text-muted);
  }
  .text-link {
    color: var(--color-text);
    font-weight: 500;
    text-decoration: underline;
    text-decoration-color: var(--color-border-strong);
  }
  .text-link:hover {
    text-decoration-color: currentColor;
  }
  .hero-meta .text-link {
    font-weight: 400;
    color: var(--color-text-secondary);
  }

  /* Shared section intro */
  .section-intro h2 {
    font-size: clamp(1.75rem, 3vw, 2.25rem);
    line-height: 1.12;
  }
  .section-intro p {
    margin-top: 0.875rem;
    color: var(--color-text-secondary);
    line-height: 1.6;
    max-width: 36rem;
  }
  .split {
    display: grid;
    gap: 2.5rem;
  }
  @media (min-width: 860px) {
    .split {
      grid-template-columns: minmax(0, 5fr) minmax(0, 6fr);
      gap: 5rem;
    }
  }

  /* Six shares */
  .shares {
    background: var(--color-wash);
    padding: 4.5rem 0;
  }
  .share-grid {
    margin-top: 2.75rem;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    border-top: 1px solid var(--color-border-strong);
  }
  @media (min-width: 720px) {
    .share-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }
  @media (min-width: 1040px) {
    .share-grid {
      grid-template-columns: repeat(6, minmax(0, 1fr));
    }
  }
  .share {
    padding: 1.5rem 1.25rem 1.5rem 0;
    border-bottom: 1px solid var(--color-border);
  }
  @media (min-width: 1040px) {
    .share {
      border-bottom: 0;
      padding-inline: 0 1.5rem;
    }
    .share + .share {
      padding-inline-start: 1.25rem;
      border-inline-start: 1px solid var(--color-border);
    }
  }
  .share-frac {
    font-size: clamp(3rem, 6vw, 4.25rem);
    line-height: 1;
    font-weight: 500;
    color: var(--color-accent);
  }
  .share dd {
    margin: 1rem 0 0;
    font-size: 0.9375rem;
    line-height: 1.5;
  }
  .share-verse {
    margin-top: 0.5rem;
    font-size: 0.8125rem;
    color: var(--color-text-muted);
  }

  /* Schools */
  .schools {
    padding: 5rem 0;
  }
  .school-list {
    list-style: none;
    margin: 0;
    padding: 0;
    border-top: 1px solid var(--color-border-strong);
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
    font-family: var(--font-serif);
    font-size: 1.375rem;
  }
  :global(html[dir="rtl"]) .school-name {
    font-family: var(--font-arabic-display);
  }
  .school-desc {
    font-size: 0.9375rem;
    color: var(--color-text-muted);
  }
  .school-list a:hover .school-name {
    color: var(--color-accent);
  }

  /* Pro */
  .pro {
    padding: 4.5rem 0 5rem;
    border-top: 1px solid var(--color-border);
  }
  .pro-actions {
    margin-top: 1.75rem;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1rem 1.5rem;
  }
  .pro-list {
    margin: 0;
    display: grid;
    gap: 1.75rem;
  }
  @media (min-width: 560px) {
    .pro-list {
      grid-template-columns: 1fr 1fr;
      gap: 2rem 2.5rem;
    }
  }
  .pro-list dt {
    font-weight: 600;
  }
  .pro-list dd {
    margin: 0.375rem 0 0;
    font-size: 0.9375rem;
    line-height: 1.55;
    color: var(--color-text-secondary);
  }

  /* Disclaimer */
  .disclaimer {
    padding-block: 2rem 0;
  }
  .disclaimer p {
    max-width: 48rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--color-border);
    font-size: 0.875rem;
    line-height: 1.6;
    color: var(--color-text-muted);
  }
  .disclaimer strong {
    color: var(--color-text-secondary);
    font-weight: 600;
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
