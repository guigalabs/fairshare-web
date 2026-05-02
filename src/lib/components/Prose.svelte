<script lang="ts">
  import type { Snippet } from "svelte";
  let { children }: { children: Snippet } = $props();
</script>

<div class="prose">
  {@render children()}
</div>

<style>
  .prose {
    color: var(--color-text);
    font-size: 1.0625rem;
    line-height: 1.7;
    max-width: 38rem;
  }
  .prose :global(> * + *) {
    margin-top: 1.25rem;
  }
  .prose :global(h2) {
    margin-top: 2.5rem;
    font-size: 1.5rem;
    font-weight: 700;
    letter-spacing: -0.01em;
    color: var(--color-text);
  }
  .prose :global(h3) {
    margin-top: 1.75rem;
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--color-text);
  }
  .prose :global(strong) {
    color: var(--color-text);
    font-weight: 600;
  }
  .prose :global(em) {
    color: var(--color-text-secondary);
  }
  .prose :global(ul),
  .prose :global(ol) {
    padding-inline-start: 1.5rem;
  }
  .prose :global(ul) {
    list-style: disc;
  }
  .prose :global(ol) {
    list-style: decimal;
  }
  .prose :global(li + li) {
    margin-top: 0.375rem;
  }
  .prose :global(a) {
    color: var(--color-accent);
    text-decoration: underline;
    text-underline-offset: 4px;
    text-decoration-color: color-mix(in srgb, var(--color-accent) 40%, transparent);
  }
  .prose :global(a:hover) {
    text-decoration-color: var(--color-accent);
  }
  .prose :global(blockquote) {
    border-inline-start: 3px solid var(--color-accent);
    padding-inline-start: 1rem;
    color: var(--color-text-secondary);
    font-style: italic;
  }
  .prose :global(code) {
    font-family: ui-monospace, SFMono-Regular, monospace;
    font-size: 0.95em;
    background: var(--color-bg-elevated);
    padding: 0.125rem 0.375rem;
    border-radius: 4px;
  }
</style>
