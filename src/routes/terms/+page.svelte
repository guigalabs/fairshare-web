<script lang="ts">
  import Prose from "$lib/components/Prose.svelte";

  const LAST_UPDATED = "2026-05-01";
</script>

<svelte:head>
  <title>Terms of use · FairShare</title>
  <meta
    name="description"
    content="Terms of use for FairShare web. Free educational tool, no warranty, see the disclaimer for limits on reliance."
  />
  <link rel="canonical" href="https://fairshare.guigalabs.com/terms/" />
</svelte:head>

<section class="container">
  <header class="head">
    <p class="kicker">Terms</p>
    <h1>Terms of use</h1>
    <p class="meta">Last updated: {LAST_UPDATED}</p>
  </header>

  <Prose>
    {#snippet children()}
      <h2>Free educational tool</h2>
      <p>
        FairShare web is provided free of charge as an educational reference for Islamic
        inheritance (Fara'id). There are no fees, no subscriptions, and no in-app purchases.
      </p>

      <h2>Permitted use</h2>
      <p>
        You may use FairShare for personal, educational, or professional reference. You may share
        links to specific calculations, embed screenshots in articles or social media, and
        reference the methodology pages with attribution to
        <a href="https://fairshare.guigalabs.com">fairshare.guigalabs.com</a>.
      </p>

      <h2>Acceptable use</h2>
      <p>
        Don't try to break the app for other users (no automated abuse, no attempts to circumvent
        rate limits or interfere with the static delivery infrastructure). The calculator is
        offline-first by design, so there's nothing to abuse on a server, but the same principle
        applies to bandwidth-level abuse against the CDN.
      </p>

      <h2>No warranty</h2>
      <p>
        FairShare is provided "as is", without warranty of any kind, express or implied. While
        the inheritance engine is tested against the canonical classical scenarios, we make no
        guarantee that it will produce the correct distribution for every conceivable family
        configuration or every interpretation within the schools we support.
      </p>
      <p>
        See the <a href="/disclaimer">disclaimer</a> for the full statement on educational scope
        and the recommendation to consult a qualified scholar before acting on any calculation.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, Guiga Labs is not liable for any direct, indirect,
        incidental, or consequential loss arising from use of FairShare or reliance on its
        output.
      </p>

      <h2>Open source components</h2>
      <p>
        FairShare is built on open source software (SvelteKit, Vite, Tailwind, Dexie, pdf-lib,
        and others). These are licensed under their own terms; nothing in these terms restricts
        your rights under those licences.
      </p>

      <h2>Changes</h2>
      <p>
        We may update these terms from time to time. The "Last updated" date above tracks the
        most recent change.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms or the app generally:
        <a href="mailto:hello@guigalabs.com">hello@guigalabs.com</a>.
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
  .meta {
    margin-top: 0.5rem;
    color: var(--color-text-muted);
    font-size: 0.875rem;
  }
</style>
