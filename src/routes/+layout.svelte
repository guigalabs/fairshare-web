<script lang="ts">
  import "../app.css";
  import "$lib/ui/theme.svelte"; // initialise theme controller
  import TopNav from "$lib/components/TopNav.svelte";
  import SiteFooter from "$lib/components/SiteFooter.svelte";
  import { ToastHost } from "$lib/ui";

  let { children } = $props();
</script>

<svelte:head>
  <link rel="manifest" href="/manifest.webmanifest" />
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
    min-height: calc(100vh - 60px);
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
