<script lang="ts">
  import { fly } from "svelte/transition";
  import { cubicOut } from "svelte/easing";
  import { Button, Card, Banner } from "$lib/ui";
  import InstallPwaButton from "$lib/components/InstallPwaButton.svelte";
  import ArrowRight from "@lucide/svelte/icons/arrow-right";
  import BookOpen from "@lucide/svelte/icons/book-open";
  import ShieldCheck from "@lucide/svelte/icons/shield-check";
  import WifiOff from "@lucide/svelte/icons/wifi-off";

  const enter = (delay: number) => ({ y: 16, duration: 500, easing: cubicOut, delay });

  const TRUST = [
    { stat: "5", label: "schools of thought" },
    { stat: "0", label: "data collected" },
    { stat: "EN/AR", label: "bilingual + RTL" },
    { stat: "100%", label: "offline" },
  ];

  const MADHHABS = [
    { name: "General", description: "Majority Sunni opinion", slug: "general" },
    { name: "Hanafi", description: "Largest Sunni school", slug: "hanafi" },
    { name: "Maliki", description: "North & West Africa", slug: "maliki" },
    { name: "Shafi'i", description: "Egypt, Levant, Southeast Asia", slug: "shafii" },
    { name: "Hanbali", description: "Arabian peninsula", slug: "hanbali" },
  ];

  const FEATURES = [
    {
      Icon: BookOpen,
      title: "Every share, with its source",
      body: "Every fraction is linked to the verse in Surah An-Nisa that prescribes it (4:11, 4:12, 4:176).",
    },
    {
      Icon: ShieldCheck,
      title: "Edge cases, handled",
      body: "Awl, Radd, Hajb, Umariatan, Musharakah, and the Grandfather-with-siblings case all detected automatically.",
    },
    {
      Icon: WifiOff,
      title: "Local, private, free",
      body: "Calculations run entirely in your browser. No accounts, no analytics, no ads. Installable as a PWA.",
    },
  ];
</script>

<svelte:head>
  <title>FairShare — Islamic Inheritance Calculator (Fara'id)</title>
  <meta
    name="description"
    content="Calculate Fara'id (Islamic inheritance) shares with confidence. Five madhabs side by side, every share linked to its Quranic source. Free, offline-first, bilingual EN/AR."
  />
  <link rel="canonical" href="https://fairshare.guigalabs.com/" />

  <meta property="og:title" content="FairShare — Islamic Inheritance Calculator" />
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
    <p class="kicker" in:fly={enter(0)}>Fara'id · Islamic Inheritance</p>
    <h1 class="hero-title" in:fly={enter(120)}>
      Inheritance, calculated&nbsp;faithfully.
    </h1>
    <p class="hero-sub" in:fly={enter(240)}>
      A free, offline calculator for Islamic inheritance. Five madhabs side by side, every share
      linked to its Quranic source.
    </p>
    <div class="hero-ctas" in:fly={enter(360)}>
      <Button href="/calculate" size="lg">
        Start a calculation
        <ArrowRight size={18} aria-hidden="true" />
      </Button>
      <Button href="/methodology" variant="secondary" size="lg">Read the methodology</Button>
    </div>
    <p class="hero-meta" in:fly={enter(480)}>
      Free · No accounts · No tracking · Works offline
    </p>
  </div>
</section>

<!-- Trust strip -->
<section class="strip">
  <div class="strip-inner">
    {#each TRUST as item (item.label)}
      <div class="strip-item">
        <p class="strip-stat">{item.stat}</p>
        <p class="strip-label">{item.label}</p>
      </div>
    {/each}
  </div>
</section>

<!-- Disclaimer banner -->
<section class="container">
  <Banner tone="scholar">
    {#snippet children()}
      <strong>Educational use only.</strong> FairShare illustrates how an estate would be
      distributed under the classical rules of Fara'id. For an actual estate, please consult a
      qualified mufti and a licensed attorney for the legal and tax aspects in your jurisdiction.
    {/snippet}
  </Banner>
</section>

<!-- Features -->
<section class="container features">
  <div class="features-grid">
    {#each FEATURES as f (f.title)}
      <Card>
        {#snippet children()}
          <div class="feature">
            <div class="feature-icon" aria-hidden="true">
              <f.Icon size={20} />
            </div>
            <h3>{f.title}</h3>
            <p>{f.body}</p>
          </div>
        {/snippet}
      </Card>
    {/each}
  </div>
</section>

<!-- Methodology preview -->
<section class="container methodology">
  <div class="section-header">
    <h2>Five schools, side by side.</h2>
    <p>
      The Hanafi, Maliki, Shafi'i, and Hanbali schools agree on most rulings but diverge in the
      named edge cases. FairShare's Compare view shows you exactly where they differ for any
      family scenario.
    </p>
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
    <h2>Try it for yourself.</h2>
    <p>
      Five-minute walkthrough, no signup, fully private. The calculator runs entirely in your
      browser — install it as an app for offline use at funerals, hospitals, or family
      gatherings.
    </p>
    <div class="cta-buttons">
      <Button href="/calculate" size="lg">Start a calculation</Button>
      <Button href="/methodology" variant="ghost" size="lg">Browse methodology</Button>
    </div>
    <div class="cta-install">
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
      color-mix(in srgb, var(--color-accent) 12%, transparent),
      transparent 60%
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
  .cta-install {
    margin-top: 1rem;
    display: flex;
    justify-content: center;
  }
</style>
