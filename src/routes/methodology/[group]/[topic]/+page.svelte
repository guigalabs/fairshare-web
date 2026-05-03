<script lang="ts">
  import Prose from "$lib/components/Prose.svelte";
  import { Button } from "$lib/ui";
  import ArrowLeft from "@lucide/svelte/icons/arrow-left";
  import ArrowRight from "@lucide/svelte/icons/arrow-right";
  import { BODIES } from "$lib/content/methodology-bodies";
  import { groupTitle } from "$lib/content/methodology";
  import { serialiseJsonLd, articleSchema, breadcrumbSchema } from "$lib/seo/jsonld";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
  const entry = $derived(data.entry);
  const url = $derived(`https://fairshare.guigalabs.com/methodology/${entry.group}/${entry.slug}/`);
  const body = $derived(BODIES[`${entry.group}/${entry.slug}`] ?? "");

  const article = $derived(
    articleSchema({
      url,
      title: entry.title,
      description: entry.description,
      publishedISO: "2026-05-01T00:00:00.000Z",
    }),
  );
  const breadcrumb = $derived(
    breadcrumbSchema([
      { name: "FairShare", url: "https://fairshare.guigalabs.com/" },
      { name: "Methodology", url: "https://fairshare.guigalabs.com/methodology/" },
      { name: groupTitle(entry.group), url },
      { name: entry.title, url },
    ]),
  );
</script>

<svelte:head>
  <title>{entry.title} · FairShare</title>
  <meta name="description" content={entry.description} />
  <link rel="canonical" href={url} />
  <meta property="og:title" content={entry.title} />
  <meta property="og:description" content={entry.description} />
  <meta property="og:type" content="article" />
  <meta property="og:url" content={url} />
  {@html serialiseJsonLd(article)}
  {@html serialiseJsonLd(breadcrumb)}
</svelte:head>

<article class="container">
  <nav class="crumbs" aria-label="Breadcrumb">
    <a href="/methodology">Methodology</a>
    <span aria-hidden="true">›</span>
    <span>{groupTitle(entry.group)}</span>
  </nav>

  <header class="head">
    <p class="kicker">{groupTitle(entry.group)}</p>
    <h1>{entry.title}</h1>
    <p class="meta">{entry.readingMinutes} min read</p>
    <p class="lede">{entry.description}</p>
  </header>

  <Prose>
    {#snippet children()}
      {@html body}
    {/snippet}
  </Prose>

  <footer class="foot">
    <Button href="/methodology" variant="secondary">
      <ArrowLeft size={16} aria-hidden="true" />
      All articles
    </Button>
    <Button href="/calculate">
      Try in calculator
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
    color: var(--color-text-muted);
    font-size: 0.875rem;
  }
  .lede {
    margin-top: 1rem;
    color: var(--color-text-secondary);
    line-height: 1.55;
    font-size: 1.0625rem;
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
