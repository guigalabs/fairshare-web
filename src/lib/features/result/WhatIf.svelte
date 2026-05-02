<script lang="ts">
  import { labelFor } from "$lib/features/questionnaire/heirLabels";
  import type { ResultStore } from "./store.svelte";

  let { store }: { store: ResultStore } = $props();
</script>

<section class="whatif">
  <header>
    <h3>What if?</h3>
    <p>Toggle a heir off to see how the distribution would change. Original input is preserved.</p>
  </header>
  <ul class="toggles">
    {#each store.allHeirs as e (e.type)}
      <li>
        <label class="toggle" class:toggle--off={store.isDisabled(e.type)}>
          <input
            type="checkbox"
            checked={!store.isDisabled(e.type)}
            onchange={() => store.toggle(e.type)}
          />
          <span>{labelFor(e.type, e.count)}</span>
        </label>
      </li>
    {/each}
  </ul>
  {#if store.whatIfActive}
    <button type="button" class="reset" onclick={() => store.clearWhatIf()}>
      Reset to original
    </button>
  {/if}
</section>

<style>
  .whatif {
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    background: var(--color-bg-elevated);
    padding: 1.25rem;
  }
  header h3 {
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-text);
  }
  header p {
    margin-top: 0.25rem;
    font-size: 0.875rem;
    color: var(--color-text-muted);
  }
  .toggles {
    margin-top: 0.875rem;
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
  }
  .toggle {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.375rem 0.625rem;
    border-radius: var(--radius-md);
    cursor: pointer;
    color: var(--color-text);
    font-size: 0.9375rem;
  }
  .toggle:hover {
    background: var(--color-bg);
  }
  .toggle input {
    accent-color: var(--color-accent);
  }
  .toggle--off span {
    color: var(--color-text-muted);
    text-decoration: line-through;
  }
  .reset {
    margin-top: 0.875rem;
    background: none;
    border: none;
    color: var(--color-accent);
    cursor: pointer;
    padding: 0;
    font-size: 0.875rem;
    font-weight: 500;
  }
</style>
