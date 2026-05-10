<script lang="ts">
  import { page } from "$app/state";
  import Calculator from "@lucide/svelte/icons/calculator";
  import BookOpen from "@lucide/svelte/icons/book-open";
  import Menu from "@lucide/svelte/icons/menu";
  import X from "@lucide/svelte/icons/x";
  import LocaleToggle from "$lib/components/LocaleToggle.svelte";
  import { t } from "$lib/i18n/index.svelte";

  const path = $derived(page.url.pathname.replace(/\/$/, "") || "/");
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
    <a href="/" class="brand" aria-label={t("nav.brand")}>
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

    <nav class="nav-links" aria-label="Primary">
      <a
        href="/calculate"
        class="nav-link"
        class:nav-link--active={isCalc}
        aria-current={isCalc ? "page" : undefined}
      >
        <Calculator size={16} aria-hidden="true" />
        {t("nav.calculate")}
      </a>
      <a
        href="/methodology"
        class="nav-link"
        class:nav-link--active={isMethodology}
        aria-current={isMethodology ? "page" : undefined}
      >
        <BookOpen size={16} aria-hidden="true" />
        {t("nav.methodology")}
      </a>
      <a
        href="/pricing"
        class="nav-link nav-link--pro"
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
    <nav id="mobile-nav" class="mobile-nav" aria-label="Primary">
      <a
        href="/calculate"
        class="mobile-link"
        class:mobile-link--active={isCalc}
        aria-current={isCalc ? "page" : undefined}
      >
        <Calculator size={18} aria-hidden="true" />
        {t("nav.calculate")}
      </a>
      <a
        href="/methodology"
        class="mobile-link"
        class:mobile-link--active={isMethodology}
        aria-current={isMethodology ? "page" : undefined}
      >
        <BookOpen size={18} aria-hidden="true" />
        {t("nav.methodology")}
      </a>
      <a
        href="/pricing"
        class="mobile-link mobile-link--pro"
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
    background: color-mix(in srgb, var(--color-bg) 80%, transparent);
    -webkit-backdrop-filter: saturate(180%) blur(10px);
    backdrop-filter: saturate(180%) blur(10px);
    border-bottom: 1px solid var(--color-border);
  }
  .topnav-inner {
    max-width: 1100px;
    margin: 0 auto;
    height: 60px;
    padding: 0 1rem;
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 1.5rem;
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
    width: 1.75rem;
    height: 1.75rem;
    border-radius: 0.4375rem; /* matches iOS app icon corner radius (~22.37%) */
    object-fit: cover;
    display: block;
  }
  .brand-name {
    font-weight: 700;
    letter-spacing: -0.01em;
  }
  .nav-links {
    display: none;
    justify-content: center;
    gap: 0.25rem;
  }
  .nav-link {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.5rem 0.875rem;
    border-radius: var(--radius-pill);
    font-size: 0.9375rem;
    color: var(--color-text-muted);
    text-decoration: none;
    transition:
      background-color 0.15s,
      color 0.15s;
  }
  .nav-link:hover {
    color: var(--color-text);
    background: var(--color-bg-elevated);
  }
  .nav-link--active {
    color: var(--color-text);
    font-weight: 500;
  }
  .nav-link--pro {
    color: var(--color-accent);
    font-weight: 500;
    border: 1px solid color-mix(in srgb, var(--color-accent) 35%, transparent);
  }
  .nav-link--pro:hover {
    color: var(--color-accent);
    background: color-mix(in srgb, var(--color-accent) 10%, transparent);
  }
  .nav-end {
    display: flex;
    justify-content: end;
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
    border-radius: var(--radius-pill);
    cursor: pointer;
  }
  .menu-button:hover {
    background: var(--color-bg-elevated);
  }
  .mobile-nav {
    display: flex;
    flex-direction: column;
    padding: 0.5rem 1rem 1rem;
    border-top: 1px solid var(--color-border);
    background: var(--color-bg);
  }
  .mobile-link {
    display: inline-flex;
    align-items: center;
    gap: 0.625rem;
    padding: 0.875rem 0.75rem;
    color: var(--color-text);
    text-decoration: none;
    font-size: 1rem;
    border-radius: var(--radius-md);
  }
  .mobile-link:hover {
    background: var(--color-bg-elevated);
  }
  .mobile-link--active {
    font-weight: 600;
  }
  .mobile-link--pro {
    color: var(--color-accent);
    font-weight: 500;
  }

  @media (min-width: 640px) {
    .nav-links {
      display: inline-flex;
    }
    .menu-button {
      display: none;
    }
    .mobile-nav {
      display: none;
    }
  }
</style>
