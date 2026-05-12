<script lang="ts">
  import "../app.css";
  import TopNav from "$lib/components/TopNav.svelte";
  import SiteFooter from "$lib/components/SiteFooter.svelte";
  import { ToastHost } from "$lib/ui";
  import { browser } from "$app/environment";
  import { page } from "$app/state";
  import { pageUrl, stripLocale, localePath } from "$lib/i18n/url";
  import type { Snippet } from "svelte";
  import type { LayoutData } from "./$types";

  let { data, children }: { data: LayoutData; children: Snippet } = $props();

  // Keep <html lang> and <html dir> in sync on client navigations. SSR
  // gets this right via hooks.server.ts (transformPageChunk); this effect
  // handles SPA-style nav between EN and AR after hydration.
  $effect(() => {
    if (!browser) return;
    const root = document.documentElement;
    root.setAttribute("lang", data.lang);
    root.setAttribute("dir", data.lang === "ar" ? "rtl" : "ltr");
  });

  // Build hreflang URLs from the current pathname so they stay correct on
  // every route, including dynamic methodology drill-downs.
  const enPath = $derived(stripLocale(page.url.pathname));
  const enUrl = $derived(pageUrl(enPath));
  const arUrl = $derived(pageUrl(localePath(enPath, "ar")));
</script>

<svelte:head>
  <link rel="manifest" href="/manifest.webmanifest" />
  <link rel="alternate" hreflang="en" href={enUrl} />
  <link rel="alternate" hreflang="ar" href={arUrl} />
  <link rel="alternate" hreflang="x-default" href={enUrl} />
</svelte:head>

<a href="#main" class="skip">Skip to main content</a>
<TopNav />
<main id="main" tabindex="-1">
  {@render children()}
</main>
<SiteFooter />
<ToastHost />

<style>
  main {
    /* 100vh fallback for browsers without dvh; 100dvh is the modern fix
     * for iOS Safari's chrome-collapsed viewport quirk. */
    min-height: calc(100vh - 60px);
    min-height: calc(100dvh - 60px);
  }
  /* Accessibility: visible skip-link on focus, hidden otherwise. */
  .skip {
    position: absolute;
    inset-inline-start: 0.5rem;
    top: 0.5rem;
    padding: 0.5rem 0.875rem;
    border-radius: var(--radius-pill);
    background: var(--color-accent);
    color: var(--color-bg);
    font-weight: 500;
    transform: translateY(-150%);
    transition: transform 0.15s;
    z-index: 100;
    text-decoration: none;
  }
  .skip:focus {
    transform: translateY(0);
  }
  /* Don't move focus ring outline to <main> when programmatically focused */
  main:focus {
    outline: none;
  }
</style>
