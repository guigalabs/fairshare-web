<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";

  let { value = $bindable(""), ...rest }: HTMLInputAttributes & { value?: string } = $props();
</script>

<input class="input" bind:value {...rest} />

<style>
  .input {
    width: 100%;
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--color-border-strong);
    border-radius: var(--radius-md);
    background: var(--color-bg);
    color: var(--color-text);
    font-size: 0.9375rem;
  }
  .input:focus {
    outline: none;
    border-color: var(--color-accent);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-accent) 25%, transparent);
  }
</style>
