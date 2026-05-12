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
          <a href={loc("/pricing")} class="footer-pro">{t("nav.pro")}</a>
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
