<script lang="ts">
  import type { Snippet } from "svelte";

  let { title, description, action }: { title: string; description?: string; action?: Snippet } =
    $props();
</script>

<div class="empty">
  <h3 class="empty-title">{title}</h3>
  {#if description}
    <p class="empty-desc">{description}</p>
  {/if}
  {#if action}
    <div class="empty-action">{@render action()}</div>
  {/if}
</div>

<style>
  .empty {
    text-align: center;
    padding: 3rem 1.5rem;
    color: var(--color-text-secondary);
  }
  .empty-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--color-text);
  }
  .empty-desc {
    margin-top: 0.5rem;
    color: var(--color-text-muted);
    line-height: 1.55;
  }
  .empty-action {
    margin-top: 1.5rem;
  }
</style>
