<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    children,
    padded = true,
    elevated = false,
  }: { children: Snippet; padded?: boolean; elevated?: boolean } = $props();
</script>

<div class="card" class:card--padded={padded} class:card--elevated={elevated}>
  {@render children()}
</div>

<style>
  .card {
    background: var(--color-bg-elevated);
    border: 2px solid var(--color-edge);
  }
  .card--padded {
    padding: 1.375rem;
  }
  /* Shadowed cards mean "you can do something here". */
  .card--elevated {
    box-shadow: var(--shadow);
  }
</style>
