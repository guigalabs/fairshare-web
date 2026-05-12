<script lang="ts">
  import { page } from "$app/state";
  import { Button } from "$lib/ui";
  import { t } from "$lib/i18n/index.svelte";
  import { loc } from "$lib/i18n/url";

  const status = $derived(page.status);
  const is404 = $derived(status === 404);
  const titleKey = $derived(is404 ? "error.title.404" : "error.title.generic");
  const ledeKey = $derived(is404 ? "error.lede.404" : "error.lede.generic");
</script>

<svelte:head>
  <title>{is404 ? "Page not found" : "Something went wrong"} · FairShare</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<section class="error-section">
  <div class="error-inner">
    <p class="error-status" aria-hidden="true">{status}</p>
    <p class="error-kicker">{t("error.kicker")}</p>
    <h1 class="error-title">{t(titleKey)}</h1>
    <p class="error-lede">{t(ledeKey)}</p>
    <div class="error-ctas">
      <Button href={loc("/")} size="lg">{t("error.cta.home")}</Button>
      <Button href={loc("/calculate")} variant="secondary" size="lg">
        {t("error.cta.calculate")}
      </Button>
    </div>
    <a href={loc("/methodology")} class="error-tertiary">{t("error.cta.methodology")}</a>
  </div>
</section>

<style>
  .error-section {
    padding: 6rem 1rem 4rem;
  }
  .error-inner {
    max-width: 36rem;
    margin: 0 auto;
    text-align: center;
  }
  .error-status {
    margin: 0;
    font-size: clamp(4rem, 12vw, 7rem);
    font-weight: 800;
    line-height: 0.9;
    letter-spacing: -0.04em;
    color: color-mix(in srgb, var(--color-accent) 18%, transparent);
    -webkit-user-select: none;
    user-select: none;
  }
  .error-kicker {
    margin-top: 1rem;
    font-size: 0.8125rem;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--color-accent);
  }
  .error-title {
    margin-top: 0.75rem;
    font-size: clamp(1.875rem, 4vw, 2.75rem);
    line-height: 1.15;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--color-text);
  }
  .error-lede {
    margin-top: 1rem;
    color: var(--color-text-secondary);
    line-height: 1.55;
    font-size: 1.0625rem;
  }
  .error-ctas {
    margin-top: 2rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.75rem;
  }
  .error-tertiary {
    display: inline-block;
    margin-top: 1.25rem;
    color: var(--color-text-muted);
    font-size: 0.9375rem;
    text-decoration: none;
    padding-block: 0.5rem;
  }
  .error-tertiary:hover {
    color: var(--color-text);
  }
</style>
