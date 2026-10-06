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

  // Close the menu when the route changes — otherwise tapping a link leaves
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
    border-bottom: 1px solid var(--color-border);
  }
  .topnav-inner {
    max-width: 1120px;
    margin: 0 auto;
    height: 60px;
    padding: 0 1.25rem;
    display: flex;
    align-items: center;
    gap: 2.5rem;
  }
  .brand {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding-block: 1rem;
    text-decoration: none;
    color: var(--color-text);
  }
  .brand-mark {
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 0.375rem;
    object-fit: cover;
    display: block;
  }
  .brand-name {
    font-family: var(--font-serif);
    font-size: 1.1875rem;
    font-weight: 600;
    letter-spacing: -0.01em;
  }
  .nav-links {
    display: none;
    align-self: stretch;
    gap: 1.75rem;
  }
  .nav-link {
    display: inline-flex;
    align-items: center;
    font-size: 0.9375rem;
    color: var(--color-text-muted);
    text-decoration: none;
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
  }
  .nav-link:hover {
    color: var(--color-text);
  }
  .nav-link--active {
    color: var(--color-text);
    border-bottom-color: var(--color-accent);
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
    border: 0;
    background: transparent;
    color: var(--color-text);
    border-radius: var(--radius-md);
    cursor: pointer;
  }
  .menu-button:hover {
    background: var(--color-wash);
  }
  .mobile-nav {
    display: flex;
    flex-direction: column;
    padding: 0.25rem 1.25rem 0.75rem;
    border-top: 1px solid var(--color-border);
    background: var(--color-bg);
  }
  .mobile-link {
    padding: 0.875rem 0;
    color: var(--color-text);
    text-decoration: none;
    font-size: 1.0625rem;
    border-bottom: 1px solid var(--color-border);
  }
  .mobile-link:last-child {
    border-bottom: 0;
  }
  .mobile-link--active {
    color: var(--color-accent);
    font-weight: 500;
  }

  @media (min-width: 640px) {
    .nav-links {
      display: flex;
    }
    .menu-button {
      display: none;
    }
    .mobile-nav {
      display: none;
    }
  }
</style>
