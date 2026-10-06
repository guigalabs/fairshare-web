<script lang="ts">
  import { page } from "$app/state";
  import { t } from "$lib/i18n/index.svelte";
  import { loc, stripLocale } from "$lib/i18n/url";

  const year = new Date().getFullYear();

  // Don't render on the Pro app: the marketing footer belongs only on the
  // public consumer surface. stripLocale so /ar/app/... still hides it.
  const isProApp = $derived(stripLocale(page.url.pathname).startsWith("/app"));
</script>

{#if !isProApp}
  <footer class="footer">
    <div class="footer-inner">
      <div class="footer-row">
        <span class="footer-brand">{t("nav.brand")}</span>
        <nav class="footer-links" aria-label={t("footer.aria")}>
          <a href={loc("/calculate")}>{t("nav.calculate")}</a>
          <a href={loc("/methodology")}>{t("nav.methodology")}</a>
          <a href={loc("/pricing")}>{t("nav.pro")}</a>
          <a href={loc("/about")}>{t("footer.about")}</a>
          <a href={loc("/disclaimer")}>{t("footer.disclaimerLink")}</a>
          <a href={loc("/privacy")}>{t("footer.privacy")}</a>
          <a href={loc("/terms")}>{t("footer.terms")}</a>
        </nav>
      </div>
      <p class="footer-meta">{t("footer.copyrightFull", { year })}</p>
    </div>
  </footer>
{/if}

<style>
  .footer {
    margin-top: 4rem;
  }
  .footer-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1.75rem 2rem 2.5rem;
    border-top: 2px solid var(--color-edge);
    font-family: var(--font-mono);
    font-size: 0.8125rem;
    letter-spacing: 0.04em;
  }
  :global(html[dir="rtl"]) .footer-inner {
    font-family: var(--font-arabic);
    letter-spacing: 0;
    font-size: 0.875rem;
  }
  .footer-row {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
    justify-content: space-between;
  }
  @media (min-width: 760px) {
    .footer-row {
      flex-direction: row;
      align-items: baseline;
    }
  }
  .footer-brand {
    color: var(--color-text);
    font-weight: 500;
    text-transform: uppercase;
  }
  .footer-links {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem 1.5rem;
  }
  .footer-links a {
    color: var(--color-text-muted);
    text-decoration: none;
    text-transform: lowercase;
    padding-block: 0.375rem;
  }
  .footer-links a:hover {
    color: var(--color-text);
    text-decoration: underline;
  }
  .footer-meta {
    margin-top: 1.25rem;
    color: var(--color-text-muted);
    line-height: 1.6;
    max-width: 44rem;
  }
  @media (max-width: 639px) {
    .footer-inner {
      padding-inline: 1.125rem;
    }
  }
</style>
