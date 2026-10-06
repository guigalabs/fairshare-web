<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";

  let { value = $bindable(""), ...rest }: HTMLInputAttributes & { value?: string } = $props();
</script>

<input class="input" bind:value {...rest} />

<style>
  .input {
    width: 100%;
    padding: 0.5rem 0.75rem;
    border: 2px solid var(--color-edge);
    border-radius: var(--radius-md);
    background: var(--color-bg);
    color: var(--color-text);
    font-size: 0.9375rem;
  }
  .input:focus {
    outline: none;
    box-shadow: var(--shadow-accent);
  }
</style>
