<script lang="ts">
  import ArticleHeader from "$lib/components/ArticleHeader.svelte";
  import Prose from "$lib/components/Prose.svelte";
  import { Button } from "$lib/ui";
</script>

<svelte:head>
  <title>FairShare for Islamic Estate Attorneys</title>
  <meta
    name="description"
    content="A workspace for Islamic estate attorneys: case folders per family, named heirs, debts and wasiyyah deductions, branded PDFs, side-by-side madhab comparison."
  />
  <link rel="canonical" href="https://fairshare.guigalabs.com/for-attorneys/" />
</svelte:head>

<section class="container">
  <ArticleHeader
    kicker="For Practitioners"
    title="Built for Islamic estate attorneys"
    lede="Replace the spreadsheet-and-Word workflow you've been using to compute Fara'id distributions for clients. Every case in one place, with the math, citations, and deliverables a practising attorney needs."
  />

  <Prose>
    {#snippet children()}
      <h2>What's included</h2>
      <ul>
        <li>
          <strong>Case folders per family.</strong> Group multiple estates under one client (the Hassan
          family's grandfather and grandmother), with notes, tags, and a hearing date on each case.
        </li>
        <li>
          <strong>Named heirs.</strong> Capture each son, daughter, and spouse by name and identifier
          so they appear on the distribution document, not just as "sons: 3."
        </li>
        <li>
          <strong>Estate amounts and deductions.</strong> Enter the gross estate, funeral expenses, debts,
          and bequests; the calculator validates the 1/3 wasiyyah cap and applies Fara'id to the net estate.
        </li>
        <li>
          <strong>Branded PDFs.</strong> Upload your firm logo and letterhead, add an editable advisory
          paragraph and signature block, and download a deliverable you can hand a client.
        </li>
        <li>
          <strong>Side-by-side madhab comparison.</strong> When a family is mixed-school or you need to
          counsel on the difference, render Hanafi, Maliki, Shafi'i, Hanbali, and General results in one
          view.
        </li>
        <li>
          <strong>Search, filter, export.</strong> Find any case in seconds. Export your data as JSON
          or CSV at any time.
        </li>
      </ul>

      <h2>Why FairShare and not a spreadsheet</h2>
      <p>
        The Fara'id engine is built in TypeScript with BigInt-backed exact fractions, so every share
        is computed precisely without floating-point drift. The named edge cases (Awl, Radd, Hajb,
        Umariatan, Musharakah, Grandfather-with-siblings) are all detected automatically. Every
        share is linked to the verse in Surah An-Nisa that prescribes it (4:11, 4:12, 4:176).
      </p>

      <h2>For diaspora clients</h2>
      <p>
        FairShare is bilingual EN/AR with full RTL. The branded PDF can carry both your English
        advisory text and an Arabic disclaimer for clients who'll share it with family back home.
      </p>

      <h2>Who's it for</h2>
      <p>
        Solo practitioners and small firms doing Islamic estate planning, wasiyyah drafting, and
        inheritance dispute work. Institutional pricing is available for madrassas and Sharia
        finance firms; contact us directly.
      </p>
    {/snippet}
  </Prose>

  <div class="cta">
    <Button href="/pricing">See pricing</Button>
    <Button href="/calculate" variant="secondary">Try the free calculator</Button>
  </div>
</section>

<style>
  .container {
    max-width: 760px;
    margin: 0 auto;
    padding: 2rem 1rem 4rem;
  }
  .cta {
    margin-top: 2.5rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }
</style>
