<script lang="ts">
  import type { Snippet } from "svelte";
  import { t } from "$lib/i18n/index.svelte";

  let {
    tone = "info",
    children,
    dismissible = false,
    onDismiss,
  }: {
    tone?: "info" | "warning" | "scholar";
    children: Snippet;
    dismissible?: boolean;
    onDismiss?: () => void;
  } = $props();
</script>

<div class="banner banner--{tone}" role={tone === "warning" ? "alert" : "note"}>
  <div class="banner-body">
    {@render children()}
  </div>
  {#if dismissible}
    <button type="button" class="banner-dismiss" onclick={onDismiss} aria-label={t("ui.dismiss")}>
      ×
    </button>
  {/if}
</div>

<style>
  .banner {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 0.75rem 1rem;
    border: 1px solid var(--color-border-strong);
    background: var(--color-bg);
    font-size: 0.9375rem;
    line-height: 1.5;
    color: var(--color-text-secondary);
  }
  .banner--warning {
    background: var(--color-warning-bg);
    border: 2px solid var(--color-warning-border);
    color: var(--color-warning-text);
  }
  .banner--scholar {
    border-inline-start: 4px solid var(--color-accent);
    background: var(--color-wash);
  }
  .banner-body {
    flex: 1;
    min-width: 0;
  }
  .banner-dismiss {
    flex-shrink: 0;
    background: transparent;
    border: none;
    color: inherit;
    font-size: 1.25rem;
    line-height: 1;
    cursor: pointer;
    padding: 0 0.25rem;
    opacity: 0.7;
  }
  .banner-dismiss:hover {
    opacity: 1;
  }
</style>
