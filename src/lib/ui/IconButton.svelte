<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLButtonAttributes } from "svelte/elements";

  type Props = HTMLButtonAttributes & {
    label: string;
    children: Snippet;
    size?: "sm" | "md" | "lg";
  };

  let { label, size = "md", children, ...rest }: Props = $props();
</script>

<button
  {...rest}
  class="icon-btn icon-btn--{size}"
  type={rest.type ?? "button"}
  aria-label={label}
  title={label}
>
  {@render children()}
</button>

<style>
  .icon-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-pill);
    color: var(--color-text);
    background: transparent;
    border: none;
    cursor: pointer;
    transition:
      background-color 0.15s,
      color 0.15s;
  }
  .icon-btn:hover {
    background: var(--color-bg-elevated);
  }
  .icon-btn--sm {
    padding: 0.25rem;
  }
  .icon-btn--md {
    padding: 0.5rem;
  }
  .icon-btn--lg {
    padding: 0.75rem;
  }
</style>
