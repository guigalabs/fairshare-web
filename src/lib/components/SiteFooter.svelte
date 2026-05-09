<script lang="ts">
  import { page } from "$app/state";

  const year = new Date().getFullYear();

  // Don't render on the Pro app: the marketing footer belongs only on the
  // public consumer surface.
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
          <a href="/pricing" class="footer-pro">Pro</a>
          <a href="/about">About</a>
          <a href="/disclaimer">Disclaimer</a>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
        </nav>
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
    padding-block: 0.5rem;
  }
  .footer-links a:hover {
    color: var(--color-text);
  }
  .footer-links a.footer-pro {
    color: var(--color-accent);
    font-weight: 500;
  }
  .footer-meta {
    margin-top: 1.5rem;
    font-size: 0.8125rem;
    color: var(--color-text-subtle);
    line-height: 1.5;
    max-width: 38rem;
  }
</style>
