<script lang="ts">
  import { fly } from "svelte/transition";
  import { cubicOut } from "svelte/easing";
  import { Button, Card, Banner } from "$lib/ui";
  import InstallPwaButton from "$lib/components/InstallPwaButton.svelte";
  import QuickScenarios from "$lib/features/landing/QuickScenarios.svelte";
  import ArrowRight from "@lucide/svelte/icons/arrow-right";
  import BookOpen from "@lucide/svelte/icons/book-open";
  import ShieldCheck from "@lucide/svelte/icons/shield-check";
  import WifiOff from "@lucide/svelte/icons/wifi-off";
  import { t } from "$lib/i18n/index.svelte";

  const APP_STORE_URL = "https://apps.apple.com/app/id000000000"; // TODO: real App Store ID

  const enter = (delay: number) => ({ y: 16, duration: 500, easing: cubicOut, delay });

  // School / feature lookup tables. Translatable labels reach into t() inline
  // so the template's reactive read picks them up on locale change.
  const MADHHABS = [
    { name: "General", description: "Majority Sunni opinion", slug: "general" },
    { name: "Hanafi", description: "Largest Sunni school", slug: "hanafi" },
    { name: "Maliki", description: "North & West Africa", slug: "maliki" },
    { name: "Shafi'i", description: "Egypt, Levant, Southeast Asia", slug: "shafii" },
    { name: "Hanbali", description: "Arabian peninsula", slug: "hanbali" },
  ];

  const FEATURES = [
    { Icon: BookOpen, titleKey: "landing.feature1.title", bodyKey: "landing.feature1.body" },
    { Icon: ShieldCheck, titleKey: "landing.feature2.title", bodyKey: "landing.feature2.body" },
    { Icon: WifiOff, titleKey: "landing.feature3.title", bodyKey: "landing.feature3.body" },
  ];

  const TRUST_KEYS = [
    { stat: "5", labelKey: "landing.trust.schools" },
    { stat: "0", labelKey: "landing.trust.data" },
    { stat: "EN/AR", labelKey: "landing.trust.bilingual" },
    { stat: "100%", labelKey: "landing.trust.offline" },
  ];
</script>

<svelte:head>
  <title>FairShare · Islamic Inheritance Calculator (Fara'id)</title>
  <meta
    name="description"
    content="Calculate Fara'id (Islamic inheritance) shares with confidence. Five madhabs side by side, every share linked to its Quranic source. Free, offline-first, bilingual EN/AR."
  />
  <link rel="canonical" href="https://fairshare.guigalabs.com/" />

  <meta property="og:title" content="FairShare · Islamic Inheritance Calculator" />
  <meta
    property="og:description"
    content="Five madhabs side by side, every share linked to its Quranic source. Free, offline-first."
  />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://fairshare.guigalabs.com" />
</svelte:head>

<!-- Hero -->
<section class="hero">
  <div class="hero-bg" aria-hidden="true"></div>
  <div class="hero-inner">
    <p class="kicker" in:fly={enter(0)}>{t("landing.kicker")}</p>
    <h1 class="hero-title" in:fly={enter(120)}>
      {t("landing.title")}
    </h1>
    <p class="hero-sub" in:fly={enter(240)}>
      {t("landing.subtitle")}
    </p>
    <div class="hero-ctas" in:fly={enter(360)}>
      <Button href="/calculate" size="lg">
        {t("landing.cta.primary")}
        <ArrowRight size={18} aria-hidden="true" />
      </Button>
      <Button href="/methodology" variant="secondary" size="lg">
        {t("landing.cta.secondary")}
      </Button>
    </div>
    <p class="hero-meta" in:fly={enter(480)}>
      {t("landing.meta")}
    </p>
  </div>
</section>

<!-- Trust strip -->
<section class="strip">
  <div class="strip-inner">
    {#each TRUST_KEYS as item (item.labelKey)}
      <div class="strip-item">
        <p class="strip-stat">{item.stat}</p>
        <p class="strip-label">{t(item.labelKey)}</p>
      </div>
    {/each}
  </div>
</section>

<!-- Quick scenarios — one-tap presets that deep-link to /result -->
<QuickScenarios />

<!-- Disclaimer banner -->
<section class="container">
  <Banner tone="scholar">
    {#snippet children()}
      <strong>{t("landing.disclaimer.bold")}</strong>
      {t("landing.disclaimer.rest")}
    {/snippet}
  </Banner>
</section>

<!-- Features -->
<section class="container features">
  <div class="features-grid">
    {#each FEATURES as f (f.titleKey)}
      <Card>
        {#snippet children()}
          <div class="feature">
            <div class="feature-icon" aria-hidden="true">
              <f.Icon size={20} />
            </div>
            <h3>{t(f.titleKey)}</h3>
            <p>{t(f.bodyKey)}</p>
          </div>
        {/snippet}
      </Card>
    {/each}
  </div>
</section>

<!-- Methodology preview -->
<section class="container methodology">
  <div class="section-header">
    <h2>{t("landing.schools.title")}</h2>
    <p>{t("landing.schools.lede")}</p>
  </div>
  <div class="madhhab-grid">
    {#each MADHHABS as m (m.slug)}
      <a class="madhhab-card" href="/methodology/madhhab/{m.slug}">
        <span class="madhhab-name">{m.name}</span>
        <span class="madhhab-desc">{m.description}</span>
      </a>
    {/each}
  </div>
</section>

<!-- CTA -->
<section class="container cta">
  <div class="cta-inner">
    <h2>{t("landing.cta2.title")}</h2>
    <p>{t("landing.cta2.body")}</p>
    <div class="cta-buttons">
      <Button href="/calculate" size="lg">{t("landing.cta2.primary")}</Button>
      <Button href="/methodology" variant="ghost" size="lg">{t("landing.cta2.secondary")}</Button>
    </div>
    <div class="cta-extras">
      <a class="ios-link" href={APP_STORE_URL}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path
            d="M17.05 12.04c-.03-2.85 2.33-4.22 2.44-4.29-1.33-1.94-3.4-2.21-4.13-2.24-1.76-.18-3.43 1.04-4.32 1.04-.91 0-2.27-1.02-3.74-.99-1.92.03-3.69 1.12-4.68 2.84-2 3.46-.51 8.58 1.43 11.4.95 1.38 2.07 2.92 3.55 2.87 1.43-.06 1.97-.92 3.69-.92 1.72 0 2.21.92 3.72.89 1.54-.03 2.5-1.39 3.43-2.78 1.08-1.59 1.53-3.14 1.55-3.22-.03-.01-2.97-1.14-3-4.6zM14.31 4.4c.79-.96 1.32-2.29 1.18-3.62-1.13.05-2.51.76-3.32 1.71-.73.85-1.36 2.21-1.19 3.51 1.27.1 2.55-.65 3.33-1.6z"
          />
        </svg>
        {t("landing.cta2.ios")}
      </a>
      <InstallPwaButton />
    </div>
  </div>
</section>

<style>
  .container {
    max-width: 1100px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }

  /* Hero */
  .hero {
    position: relative;
    overflow: hidden;
    padding: 4rem 1rem 3rem;
  }
  @media (min-width: 768px) {
    .hero {
      padding: 6rem 1rem 4rem;
    }
  }
  .hero-bg {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: radial-gradient(
      ellipse at 50% 30%,
      color-mix(in srgb, var(--color-accent) 5%, transparent),
      transparent 55%
    );
  }
  .hero-inner {
    position: relative;
    max-width: 760px;
    margin: 0 auto;
    text-align: center;
  }
  .kicker {
    font-size: 0.8125rem;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--color-accent);
  }
  .hero-title {
    margin-top: 1rem;
    font-size: clamp(2rem, 5vw, 3.5rem);
    font-weight: 800;
    letter-spacing: -0.025em;
    line-height: 1.05;
    color: var(--color-text);
  }
  .hero-sub {
    margin-top: 1.5rem;
    font-size: clamp(1.0625rem, 2vw, 1.25rem);
    color: var(--color-text-secondary);
    line-height: 1.55;
    max-width: 36rem;
    margin-inline: auto;
  }
  .hero-ctas {
    margin-top: 2.25rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.75rem;
  }
  .hero-meta {
    margin-top: 1.5rem;
    font-size: 0.8125rem;
    color: var(--color-text-muted);
  }

  /* Trust strip */
  .strip {
    border-block: 1px solid var(--color-border);
    background: var(--color-bg-elevated);
    padding: 1.5rem 1rem;
  }
  .strip-inner {
    max-width: 1100px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    text-align: center;
  }
  @media (min-width: 640px) {
    .strip-inner {
      grid-template-columns: repeat(4, 1fr);
    }
  }
  .strip-stat {
    font-size: 1.5rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--color-text);
  }
  .strip-label {
    margin-top: 0.125rem;
    font-size: 0.8125rem;
    color: var(--color-text-muted);
  }

  /* Features */
  .features {
    padding-top: 4rem;
  }
  .features-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  @media (min-width: 768px) {
    .features-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }
  .feature {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .feature-icon {
    width: 2.25rem;
    height: 2.25rem;
    border-radius: var(--radius-md);
    background: color-mix(in srgb, var(--color-accent) 12%, transparent);
    color: var(--color-accent);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.5rem;
  }
  .feature h3 {
    font-size: 1.0625rem;
    font-weight: 600;
    color: var(--color-text);
  }
  .feature p {
    color: var(--color-text-secondary);
    line-height: 1.55;
  }

  /* Methodology */
  .methodology {
    padding-top: 4rem;
  }
  .section-header {
    max-width: 38rem;
    margin-bottom: 2rem;
  }
  .section-header h2 {
    font-size: clamp(1.625rem, 3vw, 2.125rem);
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--color-text);
  }
  .section-header p {
    margin-top: 0.875rem;
    color: var(--color-text-secondary);
    line-height: 1.55;
  }
  .madhhab-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
  @media (min-width: 768px) {
    .madhhab-grid {
      grid-template-columns: repeat(5, 1fr);
    }
  }
  .madhhab-card {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 1rem;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-bg-elevated);
    text-decoration: none;
    color: var(--color-text);
    transition:
      border-color 0.15s,
      transform 0.15s;
  }
  .madhhab-card:hover {
    border-color: var(--color-accent);
    transform: translateY(-1px);
  }
  .madhhab-name {
    font-weight: 600;
  }
  .madhhab-desc {
    font-size: 0.8125rem;
    color: var(--color-text-muted);
  }

  /* CTA */
  .cta {
    padding: 4rem 1rem 6rem;
  }
  .cta-inner {
    max-width: 36rem;
    margin: 0 auto;
    text-align: center;
  }
  .cta-inner h2 {
    font-size: clamp(1.625rem, 3vw, 2.125rem);
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--color-text);
  }
  .cta-inner p {
    margin-top: 1rem;
    color: var(--color-text-secondary);
    line-height: 1.55;
  }
  .cta-buttons {
    margin-top: 2rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.75rem;
  }
  .cta-extras {
    margin-top: 1.25rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    justify-content: center;
    align-items: center;
  }
  .ios-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: var(--radius-pill);
    color: var(--color-text-secondary);
    text-decoration: none;
    font-size: 0.875rem;
    transition: color 0.15s;
  }
  .ios-link:hover {
    color: var(--color-text);
  }
</style>
