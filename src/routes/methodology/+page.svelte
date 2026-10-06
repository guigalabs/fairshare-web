<script lang="ts">
  import {
    METHODOLOGY,
    entriesByGroup,
    groupTitle,
    entryTitle,
    entryDescription,
    type MethodologyGroup,
  } from "$lib/content/methodology";
  import { serialiseJsonLd, breadcrumbSchema, faqSchema } from "$lib/seo/jsonld";
  import { t } from "$lib/i18n/index.svelte";
  import { loc, pageUrl } from "$lib/i18n/url";
  import { page } from "$app/state";

  const GROUPS: MethodologyGroup[] = ["madhhab", "rules", "special-cases"];
  const breadcrumb = breadcrumbSchema([
    { name: "FairShare", url: "https://fairshare.guigalabs.com/" },
    { name: "Methodology", url: "https://fairshare.guigalabs.com/methodology/" },
  ]);

  // Questions answered by the linked methodology articles. Kept short
  // enough for AI engines to extract verbatim, and consistent with the
  // article bodies they link to. Plain <h3>+<p> below (not a JS
  // accordion) so crawlers see the answers directly.
  const FAQS = [
    {
      q: "What is Fara'id?",
      a: "Fara'id is the Islamic law of inheritance. It uses fixed shares set out in the Quran (Surah An-Nisa 4:11, 4:12, and 4:176) to decide how a Muslim's estate is divided among their heirs.",
    },
    {
      q: "How many fixed Quranic shares are there?",
      a: "Six: one-half (1/2), one-quarter (1/4), one-eighth (1/8), two-thirds (2/3), one-third (1/3), and one-sixth (1/6). The fixed shares article lists which heirs get each one.",
    },
    {
      q: "Which schools of thought does FairShare support?",
      a: "The four classical Sunni madhabs: Hanafi, Maliki, Shafi'i, and Hanbali. There's also a General option that follows the points the four schools agree on. Pick it if you don't follow a specific madhab.",
    },
    {
      q: "What is Awl?",
      a: "Sometimes the fixed shares add up to more than the whole estate. Awl reduces every share in proportion so the total fits the estate.",
    },
    {
      q: "What is Radd?",
      a: "When the fixed shares add up to less than the estate and there are no residuary heirs (Asabah), Radd gives the surplus back to the fixed-share heirs other than the spouse, in proportion to their shares.",
    },
    {
      q: "Is FairShare a replacement for a mufti or attorney?",
      a: "No. FairShare is for learning and checking your understanding. A real distribution depends on things a calculator can't see, like debts, a wasiyyah, and local law. For an actual estate, talk to a qualified mufti and a licensed attorney.",
    },
  ];
  const faqs = faqSchema(FAQS.map(({ q, a }) => ({ q, a })));
</script>

<svelte:head>
  <title>{t("methodology.pageTitle")}</title>
  <meta name="description" content={t("methodology.metaDescription")} />
  <link rel="canonical" href={pageUrl(page.url.pathname)} />
  {@html serialiseJsonLd(breadcrumb)}
  {@html serialiseJsonLd(faqs)}
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
            <a href={loc(`/methodology/${e.group}/${e.slug}`)} class="entry">
              <h3 class="entry-title">{entryTitle(e)}</h3>
              <p class="entry-desc">{entryDescription(e)}</p>
              <p class="entry-meta">
                {t("methodology.minRead", { count: e.readingMinutes })}
              </p>
            </a>
          </li>
        {/each}
      </ul>
    </section>
  {/each}

  <section class="faq" aria-labelledby="faq-heading">
    <h2 id="faq-heading" class="faq-heading">Common questions</h2>
    {#each FAQS as item (item.q)}
      <div class="faq-item">
        <h3 class="faq-q">{item.q}</h3>
        <p class="faq-a">{item.a}</p>
      </div>
    {/each}
  </section>
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
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-text-muted);
  }
  .head h1 {
    margin-top: 0.5rem;
    font-size: clamp(1.75rem, 4vw, 2.5rem);
    line-height: 1.15;
    font-weight: 600;
    letter-spacing: -0.01em;
  }
  .lede {
    margin-top: 1rem;
    color: var(--color-text-secondary);
    line-height: 1.55;
    font-size: 1.0625rem;
  }
  .group {
    margin-top: 3rem;
    display: grid;
    gap: 0.75rem 3rem;
  }
  @media (min-width: 860px) {
    .group {
      grid-template-columns: 14rem 1fr;
    }
  }
  .group-title {
    font-size: 1.375rem;
    color: var(--color-text);
  }
  .grid {
    display: grid;
    grid-template-columns: 1fr;
    column-gap: 2.5rem;
    list-style: none;
    margin: 0;
    padding: 0;
    border-top: 1px solid var(--color-border-strong);
  }
  @media (min-width: 640px) {
    .grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  .grid li {
    border-bottom: 1px solid var(--color-border);
  }
  .entry {
    display: block;
    height: 100%;
    padding: 1.125rem 0 1.25rem;
    text-decoration: none;
    color: inherit;
  }
  .entry:hover .entry-title {
    color: var(--color-accent);
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 0.18em;
  }
  .entry-title {
    font-size: 1.1875rem;
    color: var(--color-text);
  }
  .entry-desc {
    margin-top: 0.375rem;
    color: var(--color-text-secondary);
    font-size: 0.9375rem;
    line-height: 1.55;
  }
  .entry-meta {
    margin-top: 0.625rem;
    font-size: 0.8125rem;
    color: var(--color-text-muted);
  }
  .faq {
    margin-top: 3.5rem;
    max-width: 56rem;
  }
  .faq-heading {
    font-size: 1.5rem;
    font-weight: 600;
    letter-spacing: -0.01em;
    margin-bottom: 1.5rem;
  }
  .faq-item {
    padding: 1rem 0;
    border-top: 1px solid var(--color-border);
  }
  .faq-item:last-child {
    border-bottom: 1px solid var(--color-border);
  }
  .faq-q {
    font-size: 1.0625rem;
    font-weight: 600;
    color: var(--color-text);
  }
  .faq-a {
    margin-top: 0.5rem;
    color: var(--color-text-secondary);
    font-size: 0.9375rem;
    line-height: 1.6;
  }
</style>
