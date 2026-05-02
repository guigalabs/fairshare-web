<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    label,
    description,
    error,
    children,
  }: {
    label: string;
    description?: string;
    error?: string;
    children: Snippet;
  } = $props();
</script>

<label class="field">
  <span class="field-label">{label}</span>
  {#if description}
    <span class="field-desc">{description}</span>
  {/if}
  <div class="field-input">
    {@render children()}
  </div>
  {#if error}
    <span class="field-error" role="alert">{error}</span>
  {/if}
</label>

<style>
  .field {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
  }
  .field-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-text);
  }
  .field-desc {
    font-size: 0.8125rem;
    color: var(--color-text-muted);
  }
  .field-input {
    margin-top: 0.125rem;
  }
  .field-error {
    margin-top: 0.25rem;
    font-size: 0.8125rem;
    color: var(--color-error);
  }
</style>
