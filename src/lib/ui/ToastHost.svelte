<script lang="ts">
  import { fly } from "svelte/transition";
  import { toast } from "./toast.svelte";
</script>

<div class="toast-host" aria-live="polite" aria-atomic="true">
  {#each toast.entries as t (t.id)}
    <div class="toast toast--{t.tone}" role="status" transition:fly={{ y: 16, duration: 200 }}>
      {t.message}
    </div>
  {/each}
</div>

<style>
  .toast-host {
    position: fixed;
    bottom: 1.5rem;
    inset-inline: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    pointer-events: none;
    z-index: 60;
  }
  .toast {
    pointer-events: auto;
    background: var(--color-text);
    color: var(--color-bg);
    padding: 0.75rem 1.125rem;
    border-radius: var(--radius-pill);
    font-size: 0.875rem;
    font-weight: 500;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    max-width: calc(100% - 2rem);
  }
  .toast--success {
    background: var(--color-accent);
    color: #fff;
  }
  .toast--error {
    background: var(--color-error);
    color: #fff;
  }
</style>
