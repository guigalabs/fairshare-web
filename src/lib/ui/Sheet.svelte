<script lang="ts">
  import { fade, fly } from "svelte/transition";
  import { onMount } from "svelte";
  import type { Snippet } from "svelte";

  let {
    open = $bindable(false),
    title,
    children,
    onClose,
  }: {
    open?: boolean;
    title: string;
    children: Snippet;
    onClose?: () => void;
  } = $props();

  function close() {
    open = false;
    onClose?.();
  }

  onMount(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && open) close();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });
</script>

{#if open}
  <div
    class="scrim"
    role="presentation"
    transition:fade={{ duration: 150 }}
    onclick={close}
    onkeydown={(e) => e.key === "Enter" && close()}
  ></div>
  <div
    class="sheet"
    role="dialog"
    aria-modal="true"
    aria-label={title}
    transition:fly={{ y: 16, duration: 200 }}
  >
    <header class="sheet-header">
      <h2 class="sheet-title">{title}</h2>
      <button type="button" class="sheet-close" onclick={close} aria-label="Close"> × </button>
    </header>
    <div class="sheet-body">
      {@render children()}
    </div>
  </div>
{/if}

<style>
  .scrim {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    z-index: 49;
  }
  .sheet {
    position: fixed;
    z-index: 50;
    background: var(--color-bg-elevated);
    color: var(--color-text);
    border: 1px solid var(--color-border);
    box-shadow: 0 24px 48px rgba(0, 0, 0, 0.18);
    overflow: hidden;
    display: flex;
    flex-direction: column;

    /* Mobile: bottom sheet */
    inset-inline: 0;
    bottom: 0;
    border-radius: var(--radius-xl) var(--radius-xl) 0 0;
    max-height: 85vh;
  }
  /* Desktop: centered modal */
  @media (min-width: 768px) {
    .sheet {
      inset: auto;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      max-width: 32rem;
      width: calc(100% - 2rem);
      border-radius: var(--radius-xl);
      max-height: 85vh;
    }
  }
  .sheet-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.25rem;
    border-bottom: 1px solid var(--color-border);
  }
  .sheet-title {
    font-size: 1.125rem;
    font-weight: 600;
  }
  .sheet-close {
    background: transparent;
    border: none;
    color: var(--color-text-muted);
    font-size: 1.5rem;
    line-height: 1;
    cursor: pointer;
    padding: 0.25rem 0.5rem;
  }
  .sheet-close:hover {
    color: var(--color-text);
  }
  .sheet-body {
    overflow: auto;
    padding: 1.25rem;
  }
</style>
