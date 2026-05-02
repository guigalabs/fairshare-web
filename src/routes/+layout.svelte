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

<TopNav />
<main id="main">
  {@render children()}
</main>
<SiteFooter />
<ToastHost />

<style>
  main {
    min-height: calc(100vh - 60px);
  }
</style>
