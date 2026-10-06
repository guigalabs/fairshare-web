<script lang="ts">
  import { page } from "$app/state";
  import Menu from "@lucide/svelte/icons/menu";
  import X from "@lucide/svelte/icons/x";
  import LocaleToggle from "$lib/components/LocaleToggle.svelte";
  import { t } from "$lib/i18n/index.svelte";
  import { loc, stripLocale } from "$lib/i18n/url";

  // Strip the locale prefix before pattern-matching so /ar/calculate counts
  // as "calculate" for the active-link highlight.
  const path = $derived(stripLocale(page.url.pathname).replace(/\/$/, "") || "/");
  const isCalc = $derived(path === "/calculate" || path.startsWith("/calculate/"));
  const isMethodology = $derived(path.startsWith("/methodology"));
  const isPro = $derived(
    path === "/pricing" || path.startsWith("/for-attorneys") || path.startsWith("/for-scholars"),
  );

  let menuOpen = $state(false);

  // Close the menu when the route changes, otherwise tapping a link leaves
  // the drawer overlapping the new page.
  $effect(() => {
    void path;
    menuOpen = false;
  });
</script>

<header class="topnav">
  <div class="topnav-inner">
    <a href={loc("/")} class="brand" aria-label={t("nav.brand")}>
      <img
        src="/icons/brand-64.png"
        alt=""
        class="brand-mark"
        width="32"
        height="32"
        decoding="async"
        aria-hidden="true"
      />
      <span class="brand-name">{t("nav.brand")}</span>
      <span class="brand-suffix" aria-hidden="true">/ fairshare.guigalabs.com</span>
    </a>

    <nav class="nav-links" aria-label={t("ui.primaryNav")}>
      <a
        href={loc("/calculate")}
        class="nav-link"
        class:nav-link--active={isCalc}
        aria-current={isCalc ? "page" : undefined}
      >
        {t("nav.calculate")}
      </a>
      <a
        href={loc("/methodology")}
        class="nav-link"
        class:nav-link--active={isMethodology}
        aria-current={isMethodology ? "page" : undefined}
      >
        {t("nav.methodology")}
      </a>
      <a
        href={loc("/pricing")}
        class="nav-link"
        class:nav-link--active={isPro}
        aria-current={isPro ? "page" : undefined}
      >
        {t("nav.pro")}
      </a>
    </nav>

    <div class="nav-end">
      <LocaleToggle />
      <button
        type="button"
        class="menu-button"
        aria-label={menuOpen ? t("nav.close") : t("nav.menu")}
        aria-expanded={menuOpen}
        aria-controls="mobile-nav"
        onclick={() => (menuOpen = !menuOpen)}
      >
        {#if menuOpen}
          <X size={20} aria-hidden="true" />
        {:else}
          <Menu size={20} aria-hidden="true" />
        {/if}
      </button>
    </div>
  </div>

  {#if menuOpen}
    <nav id="mobile-nav" class="mobile-nav" aria-label={t("ui.primaryNav")}>
      <a
        href={loc("/calculate")}
        class="mobile-link"
        class:mobile-link--active={isCalc}
        aria-current={isCalc ? "page" : undefined}
      >
        {t("nav.calculate")}
      </a>
      <a
        href={loc("/methodology")}
        class="mobile-link"
        class:mobile-link--active={isMethodology}
        aria-current={isMethodology ? "page" : undefined}
      >
        {t("nav.methodology")}
      </a>
      <a
        href={loc("/pricing")}
        class="mobile-link"
        class:mobile-link--active={isPro}
        aria-current={isPro ? "page" : undefined}
      >
        {t("nav.pro")}
      </a>
    </nav>
  {/if}
</header>

<style>
  .topnav {
    position: sticky;
    top: 0;
    z-index: 30;
    background: var(--color-bg);
  }
  .topnav-inner {
    max-width: 1200px;
    margin: 0 auto;
    min-height: 66px;
    padding: 0 2rem;
    display: flex;
    align-items: center;
    gap: 2rem;
    border-bottom: 2px solid var(--color-edge);
  }
  .brand {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    min-width: 0;
    padding-block: 1rem;
    text-decoration: none;
    color: var(--color-text);
    white-space: nowrap;
  }
  .brand-mark {
    width: 1.375rem;
    height: 1.375rem;
    object-fit: cover;
    display: block;
  }
  .brand-name {
    font-family: var(--font-mono);
    font-size: 0.8125rem;
    font-weight: 500;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }
  .brand-suffix {
    font-family: var(--font-mono);
    font-size: 0.8125rem;
    letter-spacing: 0.04em;
    color: var(--color-text-muted);
  }
  .nav-links {
    display: none;
    gap: 1.625rem;
    margin-inline-start: auto;
  }
  .nav-link {
    font-family: var(--font-mono);
    font-size: 0.8125rem;
    letter-spacing: 0.04em;
    text-transform: lowercase;
    color: var(--color-text-muted);
    text-decoration: none;
    white-space: nowrap;
  }
  :global(html[dir="rtl"]) .nav-link {
    font-family: var(--font-arabic);
    font-size: 0.9375rem;
    letter-spacing: 0;
  }
  .nav-link:hover {
    color: var(--color-text);
  }
  .nav-link--active {
    color: var(--color-text);
    text-decoration: underline;
    text-decoration-color: var(--color-accent);
    text-decoration-thickness: 2px;
    text-underline-offset: 6px;
  }
  .nav-end {
    margin-inline-start: auto;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .menu-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border: 2px solid var(--color-edge);
    background: var(--color-bg);
    color: var(--color-text);
    cursor: pointer;
  }
  .mobile-nav {
    display: flex;
    flex-direction: column;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0.25rem 1.25rem 0.75rem;
    border-bottom: 2px solid var(--color-edge);
    background: var(--color-bg);
  }
  .mobile-link {
    padding: 0.875rem 0;
    font-family: var(--font-mono);
    font-size: 0.9375rem;
    letter-spacing: 0.04em;
    text-transform: lowercase;
    color: var(--color-text);
    text-decoration: none;
    border-bottom: 1px solid var(--color-border);
  }
  :global(html[dir="rtl"]) .mobile-link {
    font-family: var(--font-arabic);
    letter-spacing: 0;
  }
  .mobile-link:last-child {
    border-bottom: 0;
  }
  .mobile-link--active {
    color: var(--color-accent);
  }

  @media (max-width: 860px) {
    .brand-suffix {
      display: none;
    }
  }
  @media (max-width: 639px) {
    .topnav-inner {
      padding: 0 1.125rem;
      gap: 1rem;
    }
  }
  @media (min-width: 640px) {
    .nav-links {
      display: flex;
    }
    .nav-end {
      margin-inline-start: 0.5rem;
    }
    .menu-button {
      display: none;
    }
    .mobile-nav {
      display: none;
    }
  }
</style>
