<script lang="ts">
  import Prose from "$lib/components/Prose.svelte";

  const LAST_UPDATED = "2026-05-01";
</script>

<svelte:head>
  <title>Privacy · FairShare</title>
  <meta
    name="description"
    content="Privacy policy for FairShare web. The app is offline-first, collects no personal data, and stores everything locally on your device."
  />
  <link rel="canonical" href="https://fairshare.guigalabs.com/privacy/" />
</svelte:head>

<section class="container">
  <header class="head">
    <p class="kicker">Privacy</p>
    <h1>Privacy policy</h1>
    <p class="meta">Last updated: {LAST_UPDATED}</p>
  </header>

  <Prose>
    {#snippet children()}
      <h2>Summary</h2>
      <p>
        FairShare web is an offline-first calculator. We do not collect, transmit, or sell any
        personal data. All calculations run entirely in your browser.
      </p>

      <h2>Information we do not collect</h2>
      <p>FairShare does <strong>not</strong> collect, store, or transmit any of the following:</p>
      <ul>
        <li>Personal identifiers (name, email, IP address linkage, device fingerprint)</li>
        <li>Account information (there are no accounts)</li>
        <li>Family-composition details from your calculations</li>
        <li>Geolocation data</li>
        <li>Advertising identifiers</li>
        <li>Health, financial account, or payment information</li>
      </ul>
      <p>
        The web app makes no outbound API calls during normal use. Loading the page itself goes
        through Cloudflare's CDN, which logs basic request metadata (browser user-agent, country,
        referer) for abuse prevention; that data is governed by
        <a href="https://www.cloudflare.com/privacypolicy/">Cloudflare's privacy policy</a> and not accessible
        to us individually.
      </p>

      <h2>Information stored locally</h2>
      <p>
        The following lives <strong>only on your device</strong>, in your browser's storage:
      </p>
      <ul>
        <li>
          <strong>Saved calculations</strong> you explicitly choose to save (heir counts, selected school,
          calculation name). Stored in IndexedDB.
        </li>
        <li>
          <strong>Theme preference</strong> (light / dark / system) and
          <strong>language preference</strong> (English / Arabic). Stored in localStorage.
        </li>
      </ul>
      <p>
        You can delete saved calculations at any time from the Saved page. Clearing your browser's
        site data removes everything FairShare has stored.
      </p>

      <h2>Sharing and PDF export</h2>
      <p>
        When you tap <strong>Share</strong>, your calculation is encoded as a URL fragment and
        passed to your device's native share sheet (or copied to your clipboard). We never see the
        URL; it goes directly between your browser and whoever you share it with.
      </p>
      <p>
        When you tap <strong>Export PDF</strong>, the PDF is generated entirely in your browser and
        downloaded as a file. Nothing is uploaded.
      </p>

      <h2>Third-party SDKs</h2>
      <p>
        FairShare web uses <strong>no third-party analytics, advertising, or tracking SDKs</strong>.
      </p>

      <h2>Children's privacy</h2>
      <p>
        FairShare does not knowingly collect information from anyone, including children under 13.
        The app is suitable for educational use at any age.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        If we change this policy, we will update the "Last updated" date above. Substantive changes
        will be announced on
        <a href="https://guigalabs.com/blog">guigalabs.com/blog</a>.
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
