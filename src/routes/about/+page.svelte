<script lang="ts">
  import Prose from "$lib/components/Prose.svelte";
  import { Button } from "$lib/ui";
</script>

<svelte:head>
  <title>About · FairShare</title>
  <meta
    name="description"
    content="FairShare is an offline-first Islamic inheritance calculator from Guiga Labs. Five madhabs side by side, every share linked to its Quranic source, no accounts, no tracking."
  />
  <link rel="canonical" href="https://fairshare.guigalabs.com/about/" />
</svelte:head>

<section class="container">
  <header class="head">
    <p class="kicker">About</p>
    <h1>FairShare</h1>
  </header>

  <Prose>
    {#snippet children()}
      <p>
        FairShare is a free, offline-first calculator for Islamic inheritance (<em>Fara'id</em>),
        built by <a href="https://guigalabs.com">Guiga Labs</a>. It's available as a web app at
        <a href="https://fairshare.guigalabs.com">fairshare.guigalabs.com</a> and as a native iOS
        app.
      </p>

      <h2>Why we built it</h2>
      <p>
        Islamic inheritance is one of the most precisely specified legal systems in the Quran. More
        verses are devoted to it than to prayer, fasting, or zakat. But existing calculators either
        silently follow a single school of thought, fail on well-known edge cases (Awl, Radd,
        Umariatan), or hide the reasoning behind opaque numbers.
      </p>
      <p>
        FairShare exists to do two things at once: produce the <em>right</em> answer for each of
        the five Sunni schools (General, Hanafi, Maliki, Shafi'i, Hanbali), and <em>show its
        work</em>. Every share is linked to the Quranic verse that prescribes it.
      </p>

      <h2>How the calculator works</h2>
      <p>
        Every calculation runs entirely in your browser. The inheritance engine is a pure
        TypeScript port of the Swift package that powers the iOS app, with BigInt-backed exact
        fractions to guarantee parity with the iOS calculations. We test against 28+ classical
        scenarios, including the named edge cases, to catch regressions.
      </p>
      <p>
        Saved calculations live in your browser's IndexedDB. Nothing is uploaded anywhere. There
        are no accounts, no analytics SDKs, no advertising. The only outbound network request
        FairShare ever makes is downloading the page itself.
      </p>

      <h2>The team</h2>
      <p>
        FairShare is built by <strong>Mohammed Guiga</strong>, a software engineer based in
        California. The project is open to contributions and feedback. For press kits, see
        <a href="https://guigalabs.com/fairshare/press">guigalabs.com/fairshare/press</a>.
      </p>

      <h2>Important caveat</h2>
      <p>
        FairShare is an educational tool, not a religious or legal authority. Real estate
        distributions involve facts (debts, wasiyyah, jurisdictional law) that no calculator can
        capture. Please consult a qualified mufti and a licensed attorney for any actual
        distribution. See the <a href="/disclaimer">full disclaimer</a> for details.
      </p>
    {/snippet}
  </Prose>

  <div class="cta">
    <Button href="/calculate">Try the calculator</Button>
    <Button href="/methodology" variant="secondary">Read the methodology</Button>
  </div>
</section>

<style>
  .container {
    max-width: 760px;
    margin: 0 auto;
    padding: 2rem 1rem 4rem;
  }
  .head {
    margin-bottom: 2rem;
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
    font-weight: 700;
    letter-spacing: -0.02em;
  }
  .cta {
    margin-top: 2.5rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }
</style>
