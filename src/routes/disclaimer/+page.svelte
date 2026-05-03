<script lang="ts">
  import Prose from "$lib/components/Prose.svelte";
  import { Banner } from "$lib/ui";
</script>

<svelte:head>
  <title>Disclaimer · FairShare</title>
  <meta
    name="description"
    content="Important disclaimer for FairShare. The app is an educational reference, not a substitute for a qualified mufti or licensed attorney."
  />
  <link rel="canonical" href="https://fairshare.guigalabs.com/disclaimer/" />
</svelte:head>

<section class="container">
  <header class="head">
    <p class="kicker">Disclaimer</p>
    <h1>Educational use only.</h1>
  </header>

  <Banner tone="warning">
    {#snippet children()}
      <strong>FairShare is not a substitute for a qualified scholar or attorney.</strong> Please read
      the full disclaimer below before relying on any calculation.
    {/snippet}
  </Banner>

  <Prose>
    {#snippet children()}
      <h2>The calculator is educational</h2>
      <p>
        FairShare illustrates how an estate would be distributed under the classical rules of
        <em>Fara'id</em> for the five schools we support. It implements the rules accurately (the engine
        is tested against the canonical worked examples), but a real estate distribution involves facts
        the calculator cannot know:
      </p>
      <ul>
        <li>
          <strong>Outstanding debts.</strong> Debts are paid before any inheritance is distributed. The
          calculator assumes a clean estate.
        </li>
        <li>
          <strong>Bequests (wasiyyah).</strong> Up to one-third of the estate may be willed outside the
          Fara'id distribution. The calculator does not handle bequests.
        </li>
        <li>
          <strong>Jurisdictional law.</strong> Local civil and tax law often shapes how an estate is actually
          settled, regardless of the religious calculation.
        </li>
        <li>
          <strong>Family-specific facts.</strong> Adopted children, missing heirs, simultaneous deaths,
          divorces in waiting period: all require scholarly judgement.
        </li>
      </ul>

      <h2>What you should do</h2>
      <p>For any actual estate distribution, please consult two professionals:</p>
      <ol>
        <li>
          A <strong>qualified mufti</strong> familiar with your family's specific circumstances and the
          school of thought you follow.
        </li>
        <li>
          A <strong>licensed attorney</strong> in your jurisdiction for the legal and tax aspects of estate
          settlement.
        </li>
      </ol>
      <p>
        FairShare is most useful for understanding <em>why</em> a distribution looks the way it does.
        The verse-level citations and side-by-side school comparison let you see the reasoning. Treat
        the output as a teaching aid, not a binding decree.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        FairShare is provided "as is", without warranty of any kind. Guiga Labs is not liable for
        any loss or harm arising from reliance on the calculator's output. Use of the app implies
        acceptance of these limits.
      </p>

      <h2>Sectarian scope</h2>
      <p>
        FairShare currently covers the four Sunni schools (Hanafi, Maliki, Shafi'i, Hanbali) and a
        "General" majority Sunni position. The Ja'fari (Shia) inheritance system is substantially
        different and is not yet supported.
      </p>
    {/snippet}
  </Prose>
</section>

<style>
  .container {
    max-width: 760px;
    margin: 0 auto;
    padding: 2rem 1rem 4rem;
  }
  .head {
    margin-bottom: 1.5rem;
  }
  .kicker {
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--color-warning-text);
  }
  .head h1 {
    margin-top: 0.5rem;
    font-size: clamp(1.75rem, 4vw, 2.5rem);
    font-weight: 700;
    letter-spacing: -0.02em;
  }
</style>
