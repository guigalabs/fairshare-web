<script lang="ts">
  import ArticleHeader from "$lib/components/ArticleHeader.svelte";
  import Prose from "$lib/components/Prose.svelte";
  import { Button } from "$lib/ui";
</script>

<svelte:head>
  <title>FairShare for Scholars and Madrassas</title>
  <meta
    name="description"
    content="FairShare for scholars, imams, and madrassas teaching Fara'id. Side-by-side madhab comparison, full Quranic citations, and a walkthrough that shows the reasoning."
  />
  <link rel="canonical" href="https://fairshare.guigalabs.com/for-scholars/" />
</svelte:head>

<section class="container">
  <ArticleHeader
    kicker="For Scholars & Madrassas"
    title="For scholars, imams, and madrassas"
    lede="A teaching, mediation, and reference tool for those answering inheritance questions in classrooms, mosques, and consultations."
  />

  <Prose>
    {#snippet children()}
      <h2>How it gets used</h2>
      <ul>
        <li>
          <strong>Teaching Fara'id.</strong> Walk students through any family scenario and let the step-by-step
          explanation show how each share is derived — fixed shares first, then 'awl or radd, then residue.
        </li>
        <li>
          <strong>Public Q&A.</strong> When a congregant asks "what's the share of two daughters and a
          wife?" you can run the answer in seconds and have the verse reference at hand.
        </li>
        <li>
          <strong>Mediation and dispute work.</strong> When families disagree on which madhab applies,
          the side-by-side compare view shows the difference plainly without you having to hand-compute
          four parallel scenarios.
        </li>
      </ul>

      <h2>What's included</h2>
      <ul>
        <li>
          <strong>Five madhabs side by side.</strong> General, Hanafi, Maliki, Shafi'i, and Hanbali rulings
          rendered as columns for the same family. The named edge cases (Umariatan, Musharakah, Grandfather-with-siblings)
          are surfaced where they apply.
        </li>
        <li>
          <strong>Quranic citations.</strong> Every fixed share is linked to the verse in Surah An-Nisa
          that prescribes it (4:11, 4:12, 4:176).
        </li>
        <li>
          <strong>Plain-language summary.</strong> Each result includes a paragraph explaining the outcome
          to a non-technical audience — helpful when explaining to a grieving family.
        </li>
        <li>
          <strong>Branded PDFs.</strong> If you teach at a madrassa or run a fatwa service, your logo,
          letterhead, and disclaimer go on every export.
        </li>
        <li>
          <strong>Bilingual EN/AR.</strong> Full RTL, with the Arabic side rendered in Noto Naskh.
        </li>
      </ul>

      <h2>The engine</h2>
      <p>
        FairShare's calculator is a TypeScript port of the Swift package that powers the iOS app. It
        uses BigInt-backed exact fractions, runs entirely in your browser, and is tested against a
        corpus of classical scenarios — including the named edge cases. The methodology pages walk
        through each madhab's rulings in detail.
      </p>

      <h2>Who's it for</h2>
      <p>
        Imams, mufti consultants, scholars working on inheritance questions, and madrassas teaching
        Fara'id. Institutional pricing is available; contact us directly for madrassa licenses.
      </p>
    {/snippet}
  </Prose>

  <div class="cta">
    <Button href="/pricing">See pricing</Button>
    <Button href="/methodology" variant="secondary">Read the methodology</Button>
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
