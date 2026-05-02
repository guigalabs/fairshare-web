<script lang="ts">
  import { i18n, LOCALES } from "$lib/i18n/index.svelte";
  import Languages from "@lucide/svelte/icons/languages";
</script>

<div class="seg" role="radiogroup" aria-label="Language">
  <Languages size={14} aria-hidden="true" class="seg-icon" />
  {#each LOCALES as loc (loc)}
    <label class="seg-option" class:seg-option--active={i18n.current === loc}>
      <input
        type="radio"
        name="locale"
        value={loc}
        checked={i18n.current === loc}
        onchange={() => i18n.set(loc)}
      />
      <span>{loc.toUpperCase()}</span>
    </label>
  {/each}
</div>

<style>
  .seg {
    display: inline-flex;
    align-items: center;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-pill);
    padding: 0.25rem 0.375rem;
    background: var(--color-bg-elevated);
    gap: 0.25rem;
  }
  :global(.seg-icon) {
    margin-inline-end: 0.125rem;
    color: var(--color-text-muted);
  }
  .seg-option {
    display: inline-flex;
    align-items: center;
    padding: 0.25rem 0.5rem;
    border-radius: var(--radius-pill);
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--color-text-muted);
    cursor: pointer;
    transition:
      background-color 0.15s,
      color 0.15s;
  }
  .seg-option:hover {
    color: var(--color-text);
  }
  .seg-option--active {
    background: var(--color-accent);
    color: #fff;
  }
  .seg-option--active:hover {
    color: #fff;
  }
  .seg-option input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }
</style>
