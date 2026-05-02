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
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
  }
  .card--padded {
    padding: 1.5rem;
  }
  .card--elevated {
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04), 0 4px 16px rgba(0, 0, 0, 0.06);
  }
</style>
