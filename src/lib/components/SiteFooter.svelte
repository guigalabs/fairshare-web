<script lang="ts">
  import { page } from "$app/state";
  import Coffee from "@lucide/svelte/icons/coffee";

  const year = new Date().getFullYear();

  // Configurable via PUBLIC_BMC_URL at build time; defaults to the placeholder
  // page so the link doesn't 404 in dev.
  const BMC_URL = import.meta.env.PUBLIC_BMC_URL ?? "https://www.buymeacoffee.com/guigalabs";

  // Don't render on the Pro app — the donation prompt belongs only on the
  // free consumer surface (the iOS-mirror calculator and its companion pages).
  const isProApp = $derived(page.url.pathname.startsWith("/app"));
</script>

{#if !isProApp}
  <footer class="footer">
    <div class="footer-inner">
      <div class="footer-row">
        <span class="footer-brand">FairShare</span>
        <nav class="footer-links" aria-label="Footer">
          <a href="/calculate">Calculate</a>
          <a href="/methodology">Methodology</a>
          <a href="/saved">Saved</a>
          <a href="/about">About</a>
          <a href="/disclaimer">Disclaimer</a>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
        </nav>
      </div>
      <div class="footer-tip">
        <a class="bmc" href={BMC_URL} target="_blank" rel="noopener noreferrer">
          <Coffee size={14} aria-hidden="true" />
          <span>Buy me a coffee</span>
        </a>
        <span class="footer-tip-note"
          >FairShare is free. Tips fund engine work and Quranic review.</span
        >
      </div>
      <p class="footer-meta">
        &copy; {year} Guiga Labs. Educational use only. Please consult a qualified scholar before acting
        on any calculation.
      </p>
    </div>
  </footer>
{/if}

<style>
  .footer {
    margin-top: 5rem;
    border-top: 1px solid var(--color-border);
    background: var(--color-bg);
  }
  .footer-inner {
    max-width: 1100px;
    margin: 0 auto;
    padding: 2.5rem 1rem;
  }
  .footer-row {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    align-items: flex-start;
    justify-content: space-between;
  }
  @media (min-width: 640px) {
    .footer-row {
      flex-direction: row;
      align-items: center;
    }
  }
  .footer-brand {
    font-weight: 700;
    color: var(--color-text);
  }
  .footer-links {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem 1.25rem;
  }
  .footer-links a {
    color: var(--color-text-muted);
    text-decoration: none;
    font-size: 0.9375rem;
  }
  .footer-links a:hover {
    color: var(--color-text);
  }
  .footer-tip {
    margin-top: 1.5rem;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.75rem 1rem;
  }
  .bmc {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.375rem 0.75rem;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-pill);
    background: var(--color-bg-elevated);
    color: var(--color-text);
    text-decoration: none;
    font-size: 0.8125rem;
    font-weight: 500;
    transition:
      border-color 0.15s,
      transform 0.15s;
  }
  .bmc:hover {
    border-color: var(--color-accent);
    transform: translateY(-1px);
  }
  .footer-tip-note {
    font-size: 0.8125rem;
    color: var(--color-text-muted);
    line-height: 1.4;
  }
  .footer-meta {
    margin-top: 1.5rem;
    font-size: 0.8125rem;
    color: var(--color-text-subtle);
    line-height: 1.5;
    max-width: 38rem;
  }
</style>
