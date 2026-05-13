<script lang="ts">
  import Prose from "$lib/components/Prose.svelte";
  import { Button } from "$lib/ui";
  import ArrowLeft from "@lucide/svelte/icons/arrow-left";
  import ArrowRight from "@lucide/svelte/icons/arrow-right";
  import { BODIES } from "$lib/content/methodology-bodies";
  import { groupTitle, entryTitle, entryDescription } from "$lib/content/methodology";
  import { i18n, t } from "$lib/i18n/index.svelte";
  import { loc, pageUrl, localizeBodyHtml } from "$lib/i18n/url";
  import { page } from "$app/state";
  import { serialiseJsonLd, articleSchema, breadcrumbSchema } from "$lib/seo/jsonld";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
  const entry = $derived(data.entry);
  // Canonical follows the actual route (EN at /methodology/..., AR at
  // /ar/methodology/...). Both have self-referential canonicals so Google
  // indexes each language separately.
  const url = $derived(pageUrl(page.url.pathname));
  const bodies = $derived(BODIES[`${entry.group}/${entry.slug}`] ?? { en: "", ar: "" });
  const body = $derived(bodies[i18n.current] || bodies.en);
  const showFallbackBanner = $derived(i18n.current === "ar" && !bodies.ar);

  // Publication date for all methodology articles. Bumping this re-asserts
  // freshness to search engines and surfaces a visible "Last updated"
  // line for readers. Move per-entry into methodology.ts if articles
  // start diverging in age.
  const PUBLISHED_ISO = "2026-05-01T00:00:00.000Z";
  const lastUpdatedDisplay = $derived(
    new Date(PUBLISHED_ISO).toLocaleDateString(i18n.current === "ar" ? "ar" : "en", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  );

  const article = $derived(
    articleSchema({
      url,
      title: entryTitle(entry),
      description: entryDescription(entry),
      publishedISO: PUBLISHED_ISO,
    }),
  );
  const breadcrumb = $derived(
    breadcrumbSchema([
      { name: "FairShare", url: pageUrl(loc("/")) },
      { name: t("methodology.title"), url: pageUrl(loc("/methodology")) },
      { name: groupTitle(entry.group), url },
      { name: entryTitle(entry), url },
    ]),
  );
</script>

<svelte:head>
  <title>{entryTitle(entry)} · FairShare</title>
  <meta name="description" content={entryDescription(entry)} />
  <link rel="canonical" href={url} />
  <meta property="og:title" content={entryTitle(entry)} />
  <meta property="og:description" content={entryDescription(entry)} />
  <meta property="og:type" content="article" />
  <meta property="og:url" content={url} />
  {@html serialiseJsonLd(article)}
  {@html serialiseJsonLd(breadcrumb)}
</svelte:head>

<article class="container">
  <nav class="crumbs" aria-label={t("methodology.breadcrumbAria")}>
    <a href={loc("/methodology")}>{t("methodology.title")}</a>
    <span aria-hidden="true">›</span>
    <span>{groupTitle(entry.group)}</span>
  </nav>

  <header class="head">
    <p class="kicker">{groupTitle(entry.group)}</p>
    <h1>{entryTitle(entry)}</h1>
    <p class="meta">
      <span>{t("methodology.minRead", { count: entry.readingMinutes })}</span>
      <span aria-hidden="true">·</span>
      <time datetime={PUBLISHED_ISO}
        >{t("methodology.lastUpdated", { date: lastUpdatedDisplay })}</time
      >
    </p>
    <p class="lede">{entryDescription(entry)}</p>
  </header>

  {#if showFallbackBanner}
    <p class="fallback-banner">{t("methodology.translationInProgress")}</p>
  {/if}

  <Prose>
    {#snippet children()}
      {#if i18n.current === "ar"}
        {@html localizeBodyHtml(bodies.ar || bodies.en || "", "ar")}
      {:else}
        {@html bodies.en || ""}
      {/if}
    {/snippet}
  </Prose>

  <footer class="foot">
    <Button href={loc("/methodology")} variant="secondary">
      <ArrowLeft size={16} aria-hidden="true" />
      {t("methodology.allArticles")}
    </Button>
    <Button href={loc("/calculate")}>
      {t("methodology.tryInCalculator")}
      <ArrowRight size={16} aria-hidden="true" />
    </Button>
  </footer>
</article>

<style>
  .container {
    max-width: 760px;
    margin: 0 auto;
    padding: 2rem 1rem 4rem;
  }
  .crumbs {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
    color: var(--color-text-muted);
    font-size: 0.875rem;
  }
  .crumbs a {
    color: var(--color-accent);
    text-decoration: none;
  }
  .crumbs a:hover {
    text-decoration: underline;
  }
  .head {
    margin: 1rem 0 2rem;
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
    font-size: clamp(1.625rem, 3.5vw, 2.25rem);
    font-weight: 700;
    letter-spacing: -0.02em;
  }
  .meta {
    margin-top: 0.5rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    color: var(--color-text-muted);
    font-size: 0.875rem;
  }
  .lede {
    margin-top: 1rem;
    color: var(--color-text-secondary);
    line-height: 1.55;
    font-size: 1.0625rem;
  }
  .fallback-banner {
    margin: 1rem 0 1.5rem;
    padding: 0.75rem 1rem;
    border: 1px solid color-mix(in srgb, var(--color-warning, #d97706) 30%, transparent);
    background: color-mix(in srgb, var(--color-warning, #d97706) 8%, transparent);
    border-radius: 0.5rem;
    font-size: 0.875rem;
    color: var(--color-text-secondary);
  }
  .foot {
    margin-top: 3rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--color-border);
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 0.75rem;
  }
</style>
