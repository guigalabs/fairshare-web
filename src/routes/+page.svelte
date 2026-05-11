<script lang="ts">
  import { fly } from "svelte/transition";
  import { cubicOut } from "svelte/easing";
  import { env } from "$env/dynamic/public";
  import { Button, Card, Banner, Field, Sheet, TextInput, reducedMotion } from "$lib/ui";
  import InstallPwaButton from "$lib/components/InstallPwaButton.svelte";
  import QuickScenarios from "$lib/features/landing/QuickScenarios.svelte";
  import ArrowRight from "@lucide/svelte/icons/arrow-right";
  import BookOpen from "@lucide/svelte/icons/book-open";
  import ShieldCheck from "@lucide/svelte/icons/shield-check";
  import WifiOff from "@lucide/svelte/icons/wifi-off";
  import { t } from "$lib/i18n/index.svelte";
  import { serialiseJsonLd, softwareApplicationSchema } from "$lib/seo/jsonld";

  const appSchema = softwareApplicationSchema();

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

  const enter = (delay: number) =>
    reducedMotion
      ? { y: 0, duration: 0, easing: cubicOut, delay: 0 }
      : { y: 16, duration: 500, easing: cubicOut, delay };

  // School / feature lookup tables. Translatable labels resolve via t() at
  // render time so locale switches re-render without rebuilding the table.
  const MADHHABS = [
    { nameKey: "madhhab.general.name", descKey: "madhhab.general.desc", slug: "general" },
    { nameKey: "madhhab.hanafi.name", descKey: "madhhab.hanafi.desc", slug: "hanafi" },
    { nameKey: "madhhab.maliki.name", descKey: "madhhab.maliki.desc", slug: "maliki" },
    { nameKey: "madhhab.shafii.name", descKey: "madhhab.shafii.desc", slug: "shafii" },
    { nameKey: "madhhab.hanbali.name", descKey: "madhhab.hanbali.desc", slug: "hanbali" },
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

  type ProAudience = "practitioners" | "attorneys" | "scholars";
  let proAudience = $state<ProAudience>("practitioners");

  const PRO_TAB_PREFIX: Record<ProAudience, string> = {
    practitioners: "landing.pro",
    attorneys: "landing.pro.attorneys",
    scholars: "landing.pro.scholars",
  };

  const proPrefix = $derived(PRO_TAB_PREFIX[proAudience]);
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
  {@html serialiseJsonLd(appSchema)}
</svelte:head>

<!-- Hero -->
<section class="hero">
  <div class="hero-bg" aria-hidden="true"></div>
  <div class="hero-inner">
    <a class="pro-banner" href="/pricing" in:fly={enter(0)}>
      <span class="pro-banner-text">{t("landing.pro.banner")}</span>
      <span class="pro-banner-cta">
        {t("landing.pro.cta")}
        <ArrowRight size={14} aria-hidden="true" />
      </span>
    </a>
    <p class="kicker" in:fly={enter(60)}>{t("landing.kicker")}</p>
    <h1 class="hero-title" in:fly={enter(120)}>
      {t("landing.title")}
    </h1>
    <p class="hero-sub" in:fly={enter(240)}>
      {t("landing.subtitle")}
    </p>
    <div class="hero-ctas" in:fly={enter(360)}>
      <Button href="/calculate" size="lg" data-sveltekit-preload-code="eager">
        {t("landing.cta.primary")}
        <ArrowRight size={18} aria-hidden="true" />
      </Button>
      <Button href="/methodology" variant="secondary" size="lg">
        {t("landing.cta.secondary")}
      </Button>
      <a
        class="app-store-badge"
        href={APP_STORE_URL ?? "#"}
        onclick={onIosClick}
        aria-label={t("landing.appStore.aria")}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path
            d="M17.05 12.04c-.03-2.85 2.33-4.22 2.44-4.29-1.33-1.94-3.4-2.21-4.13-2.24-1.76-.18-3.43 1.04-4.32 1.04-.91 0-2.27-1.02-3.74-.99-1.92.03-3.69 1.12-4.68 2.84-2 3.46-.51 8.58 1.43 11.4.95 1.38 2.07 2.92 3.55 2.87 1.43-.06 1.97-.92 3.69-.92 1.72 0 2.21.92 3.72.89 1.54-.03 2.5-1.39 3.43-2.78 1.08-1.59 1.53-3.14 1.55-3.22-.03-.01-2.97-1.14-3-4.6zM14.31 4.4c.79-.96 1.32-2.29 1.18-3.62-1.13.05-2.51.76-3.32 1.71-.73.85-1.36 2.21-1.19 3.51 1.27.1 2.55-.65 3.33-1.6z"
          />
        </svg>
        <span class="app-store-text">
          <span class="app-store-eyebrow">{t("landing.appStore.eyebrow")}</span>
          <span class="app-store-label">{t("landing.appStore.label")}</span>
        </span>
      </a>
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
<section class="features container">
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

<!-- FairShare Pro pitch -->
<section class="pro-section">
  <div class="pro-inner">
    <div class="pro-header">
      <p class="pro-kicker">{t("landing.pro.kicker")}</p>
      <h2>{t(`${proPrefix}.heading`)}</h2>
      <p class="pro-lede">{t(`${proPrefix}.lede`)}</p>
    </div>

    <ul class="pro-features">
      <li>
        <strong>{t(`${proPrefix}.f1.title`)}</strong>
        <span>{t(`${proPrefix}.f1.body`)}</span>
      </li>
      <li>
        <strong>{t(`${proPrefix}.f2.title`)}</strong>
        <span>{t(`${proPrefix}.f2.body`)}</span>
      </li>
      <li>
        <strong>{t(`${proPrefix}.f3.title`)}</strong>
        <span>{t(`${proPrefix}.f3.body`)}</span>
      </li>
      <li>
        <strong>{t(`${proPrefix}.f4.title`)}</strong>
        <span>{t(`${proPrefix}.f4.body`)}</span>
      </li>
    </ul>

    <div class="pro-price">
      <span class="pro-amount">$19<span class="pro-unit">/mo</span></span>
      <span class="pro-or">{t("landing.pro.orAnnual")}</span>
    </div>

    <div class="pro-ctas" role="group" aria-label={t("landing.pro.tabsAria")}>
      <Button href="/pricing" size="lg" data-sveltekit-preload-code="viewport">
        {t("landing.pro.cta.primary")}
      </Button>
      <button
        type="button"
        class="pro-tab"
        class:pro-tab--active={proAudience === "attorneys"}
        aria-pressed={proAudience === "attorneys"}
        onclick={() => (proAudience = proAudience === "attorneys" ? "practitioners" : "attorneys")}
      >
        {t("landing.pro.cta.attorneys")}
      </button>
      <button
        type="button"
        class="pro-tab"
        class:pro-tab--active={proAudience === "scholars"}
        aria-pressed={proAudience === "scholars"}
        onclick={() => (proAudience = proAudience === "scholars" ? "practitioners" : "scholars")}
      >
        {t("landing.pro.cta.scholars")}
      </button>
    </div>
  </div>
</section>

<!-- Methodology preview -->
<section class="methodology container">
  <div class="section-header">
    <h2>{t("landing.schools.title")}</h2>
    <p>{t("landing.schools.lede")}</p>
  </div>
  <div class="madhhab-grid">
    {#each MADHHABS as m (m.slug)}
      <a class="madhhab-card" href="/methodology/madhhab/{m.slug}">
        <span class="madhhab-name">{t(m.nameKey)}</span>
        <span class="madhhab-desc">{t(m.descKey)}</span>
      </a>
    {/each}
  </div>
</section>

<!-- CTA -->
<section class="cta container">
  <div class="cta-inner">
    <h2>{t("landing.cta2.title")}</h2>
    <p>{t("landing.cta2.body")}</p>
    <div class="cta-buttons">
      <Button href="/calculate" size="lg">{t("landing.cta2.primary")}</Button>
      <Button href="/methodology" variant="secondary" size="lg"
        >{t("landing.cta2.secondary")}</Button
      >
      <a
        class="app-store-badge"
        href={APP_STORE_URL ?? "#"}
        onclick={onIosClick}
        aria-label={t("landing.appStore.aria")}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path
            d="M17.05 12.04c-.03-2.85 2.33-4.22 2.44-4.29-1.33-1.94-3.4-2.21-4.13-2.24-1.76-.18-3.43 1.04-4.32 1.04-.91 0-2.27-1.02-3.74-.99-1.92.03-3.69 1.12-4.68 2.84-2 3.46-.51 8.58 1.43 11.4.95 1.38 2.07 2.92 3.55 2.87 1.43-.06 1.97-.92 3.69-.92 1.72 0 2.21.92 3.72.89 1.54-.03 2.5-1.39 3.43-2.78 1.08-1.59 1.53-3.14 1.55-3.22-.03-.01-2.97-1.14-3-4.6zM14.31 4.4c.79-.96 1.32-2.29 1.18-3.62-1.13.05-2.51.76-3.32 1.71-.73.85-1.36 2.21-1.19 3.51 1.27.1 2.55-.65 3.33-1.6z"
          />
        </svg>
        <span class="app-store-text">
          <span class="app-store-eyebrow">{t("landing.appStore.eyebrow")}</span>
          <span class="app-store-label">{t("landing.appStore.label")}</span>
        </span>
      </a>
    </div>
    <div class="cta-extras">
      <InstallPwaButton />
    </div>
  </div>
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
  .pro-banner {
    display: inline-flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 0.5rem 0.75rem;
    margin-bottom: 1.5rem;
    padding: 0.5rem 0.875rem;
    border: 1px solid var(--color-border-strong);
    border-radius: var(--radius-pill);
    background: var(--color-bg-elevated);
    color: var(--color-text-secondary);
    text-decoration: none;
    font-size: 0.8125rem;
    line-height: 1.35;
    transition:
      border-color 0.15s,
      color 0.15s,
      transform 0.15s;
  }
  .pro-banner:hover {
    border-color: var(--color-accent);
    color: var(--color-text);
    transform: translateY(-1px);
  }
  .pro-banner-cta {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    font-weight: 600;
    color: var(--color-accent);
    white-space: nowrap;
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
    font-weight: 700;
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
  .app-store-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.625rem;
    padding: 0.75rem 1.125rem;
    background: #000;
    color: #fff;
    border-radius: 0.5rem;
    text-decoration: none;
    line-height: 1;
    transition: transform 0.15s;
  }
  .app-store-badge:hover {
    transform: translateY(-1px);
  }
  .app-store-badge:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 3px;
  }
  .app-store-text {
    display: inline-flex;
    flex-direction: column;
    text-align: start;
    gap: 0.125rem;
  }
  .app-store-eyebrow {
    font-size: 0.625rem;
    font-weight: 400;
    letter-spacing: 0.04em;
    opacity: 0.85;
  }
  .app-store-label {
    font-size: 1rem;
    font-weight: 600;
    letter-spacing: -0.01em;
  }
  .hero-meta {
    margin-top: 1.5rem;
    font-size: 0.8125rem;
    color: var(--color-text-muted);
  }
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
    padding-bottom: 4rem;
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

  /* Pro pitch */
  .pro-section {
    margin-top: 5rem;
    padding: 4rem 1rem;
    background:
      radial-gradient(
        ellipse at 70% 0%,
        color-mix(in srgb, var(--color-accent) 12%, transparent),
        transparent 60%
      ),
      var(--color-bg-elevated);
    border-block: 1px solid var(--color-border);
  }
  .pro-inner {
    max-width: 1100px;
    margin: 0 auto;
  }
  .pro-header {
    max-width: 38rem;
    margin-bottom: 2.5rem;
  }
  .pro-kicker {
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--color-accent);
  }
  .pro-header h2 {
    margin-top: 0.5rem;
    font-size: clamp(1.75rem, 4vw, 2.5rem);
    line-height: 1.15;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--color-text);
  }
  .pro-lede {
    margin-top: 0.875rem;
    color: var(--color-text-secondary);
    line-height: 1.55;
    font-size: 1.0625rem;
  }
  .pro-features {
    list-style: none;
    padding: 0;
    margin: 0 0 2rem;
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
  @media (min-width: 720px) {
    .pro-features {
      grid-template-columns: 1fr 1fr;
      gap: 1.25rem 2rem;
    }
  }
  .pro-features li {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding-inline-start: 1rem;
    border-inline-start: 2px solid var(--color-accent);
  }
  .pro-features strong {
    color: var(--color-text);
    font-weight: 600;
    font-size: 1rem;
  }
  .pro-features span {
    color: var(--color-text-secondary);
    line-height: 1.5;
    font-size: 0.9375rem;
  }
  .pro-price {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 0.625rem;
    margin-bottom: 1.5rem;
  }
  .pro-amount {
    font-size: clamp(1.875rem, 4vw, 2.5rem);
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--color-text);
  }
  .pro-unit {
    font-size: 0.9375rem;
    font-weight: 500;
    color: var(--color-text-secondary);
    margin-inline-start: 0.25rem;
  }
  .pro-or {
    font-size: 0.9375rem;
    color: var(--color-text-muted);
  }
  .pro-ctas {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.75rem;
  }
  .pro-tab {
    display: inline-flex;
    align-items: center;
    padding: 0.625rem 1.125rem;
    border-radius: var(--radius-pill);
    border: 1px solid transparent;
    background: transparent;
    color: var(--color-text-muted);
    font-size: 0.9375rem;
    font-weight: 500;
    font-family: inherit;
    cursor: pointer;
    transition:
      background-color 0.15s,
      color 0.15s,
      border-color 0.15s;
  }
  .pro-tab:hover {
    color: var(--color-text);
    background: var(--color-bg-elevated);
  }
  .pro-tab:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }
  .pro-tab--active {
    color: var(--color-accent);
    background: color-mix(in srgb, var(--color-accent) 8%, transparent);
    border-color: color-mix(in srgb, var(--color-accent) 35%, transparent);
  }

  /* Methodology */
  .methodology {
    padding-top: 4rem;
    padding-bottom: 4rem;
  }
  .section-header {
    max-width: 38rem;
    margin-bottom: 2rem;
  }
  .section-header h2 {
    font-size: clamp(1.625rem, 3vw, 2.125rem);
    line-height: 1.15;
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
  .madhhab-card:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
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
    max-width: 48rem;
    margin: 0 auto;
    text-align: center;
  }
  .cta-inner > h2,
  .cta-inner > p {
    max-width: 36rem;
    margin-inline: auto;
  }
  .cta-inner h2 {
    font-size: clamp(1.625rem, 3vw, 2.125rem);
    line-height: 1.15;
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
</style>
