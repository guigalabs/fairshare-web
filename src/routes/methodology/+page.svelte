<script lang="ts">
  import { Card } from "$lib/ui";
  import {
    METHODOLOGY,
    entriesByGroup,
    groupTitle,
    entryTitle,
    entryDescription,
    type MethodologyGroup,
  } from "$lib/content/methodology";
  import { serialiseJsonLd, breadcrumbSchema } from "$lib/seo/jsonld";
  import { t } from "$lib/i18n/index.svelte";

  const GROUPS: MethodologyGroup[] = ["madhhab", "rules", "special-cases"];
  const breadcrumb = breadcrumbSchema([
    { name: "FairShare", url: "https://fairshare.guigalabs.com/" },
    { name: "Methodology", url: "https://fairshare.guigalabs.com/methodology/" },
  ]);
</script>

<svelte:head>
  <title>{t("methodology.title")} · FairShare</title>
  <meta name="description" content={t("methodology.metaDescription")} />
  <link rel="canonical" href="https://fairshare.guigalabs.com/methodology/" />
  {@html serialiseJsonLd(breadcrumb)}
</svelte:head>

<section class="container">
  <header class="head">
    <p class="kicker">{t("methodology.title")}</p>
    <h1>{t("methodology.heading", { count: METHODOLOGY.length })}</h1>
    <p class="lede">{t("methodology.lede")}</p>
  </header>

  {#each GROUPS as group (group)}
    <section class="group">
      <h2 class="group-title">{groupTitle(group)}</h2>
      <ul class="grid">
        {#each entriesByGroup(group) as e (e.slug)}
          <li>
            <a href="/methodology/{e.group}/{e.slug}" class="card-link">
              <Card>
                {#snippet children()}
                  <h3 class="entry-title">{entryTitle(e)}</h3>
                  <p class="entry-desc">{entryDescription(e)}</p>
                  <p class="entry-meta">
                    {t("methodology.minRead", { count: e.readingMinutes })}
                  </p>
                {/snippet}
              </Card>
            </a>
          </li>
        {/each}
      </ul>
    </section>
  {/each}

  <p class="all-meta">{t("methodology.allMeta", { count: METHODOLOGY.length })}</p>
</section>

<style>
  .container {
    max-width: 1100px;
    margin: 0 auto;
    padding: 2rem 1rem 4rem;
  }
  .head {
    margin-bottom: 2.5rem;
    max-width: 38rem;
  }
  .kicker {
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--color-accent);
  }
  .head h1 {
    margin-top: 0.5rem;
    font-size: clamp(1.75rem, 4vw, 2.5rem);
    line-height: 1.15;
    font-weight: 700;
    letter-spacing: -0.02em;
  }
  .lede {
    margin-top: 1rem;
    color: var(--color-text-secondary);
    line-height: 1.55;
    font-size: 1.0625rem;
  }
  .group {
    margin-top: 2.5rem;
  }
  .group-title {
    font-size: 1rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--color-text-muted);
    margin-bottom: 1rem;
  }
  .grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.75rem;
    list-style: none;
    padding: 0;
  }
  @media (min-width: 640px) {
    .grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  @media (min-width: 1000px) {
    .grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }
  .card-link {
    text-decoration: none;
    color: inherit;
    display: block;
    height: 100%;
    border-radius: var(--radius-lg);
    transition: transform 0.15s;
  }
  .card-link:hover {
    transform: translateY(-2px);
  }
  .card-link:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }
  .entry-title {
    font-size: 1.0625rem;
    font-weight: 600;
    color: var(--color-text);
  }
  .entry-desc {
    margin-top: 0.5rem;
    color: var(--color-text-secondary);
    font-size: 0.9375rem;
    line-height: 1.55;
  }
  .entry-meta {
    margin-top: 0.875rem;
    font-size: 0.8125rem;
    color: var(--color-text-muted);
  }
  .all-meta {
    margin-top: 3rem;
    text-align: center;
    color: var(--color-text-muted);
    font-size: 0.875rem;
  }
</style>
