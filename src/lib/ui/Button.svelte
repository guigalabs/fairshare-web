<script lang="ts" module>
  export type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";
  export type ButtonSize = "sm" | "md" | "lg";
</script>

<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLButtonAttributes, HTMLAnchorAttributes } from "svelte/elements";

  type Common = {
    variant?: ButtonVariant;
    size?: ButtonSize;
    fullWidth?: boolean;
    loading?: boolean;
    children: Snippet;
  };

  type Props =
    | (Common & { href: string } & HTMLAnchorAttributes)
    | (Common & { href?: undefined } & HTMLButtonAttributes);

  let {
    variant = "primary",
    size = "md",
    fullWidth = false,
    loading = false,
    children,
    href,
    ...rest
  }: Props = $props();

  const cls = $derived(
    [
      "btn",
      `btn--${variant}`,
      `btn--${size}`,
      fullWidth && "btn--full",
      loading && "btn--loading",
      rest.class,
    ]
      .filter(Boolean)
      .join(" "),
  );
</script>

{#if href !== undefined}
  <a {...rest as HTMLAnchorAttributes} {href} class={cls}>
    {@render children()}
  </a>
{:else}
  <button
    {...rest as HTMLButtonAttributes}
    class={cls}
    type={(rest as HTMLButtonAttributes).type ?? "button"}
    disabled={loading || (rest as HTMLButtonAttributes).disabled}
    aria-busy={loading || undefined}
  >
    {@render children()}
  </button>
{/if}

<style>
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    font-weight: 500;
    border-radius: var(--radius-pill);
    transition:
      background-color 0.15s,
      color 0.15s,
      border-color 0.15s,
      transform 0.15s;
    text-decoration: none;
    cursor: pointer;
    appearance: none;
    border: 1px solid transparent;
    line-height: 1;
    user-select: none;
  }
  .btn:hover {
    transform: scale(1.02);
  }
  .btn:active {
    transform: scale(0.98);
  }
  .btn:disabled,
  .btn[aria-busy="true"] {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
  .btn--full {
    width: 100%;
  }

  /* sizes */
  .btn--sm {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }
  .btn--md {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
  }
  .btn--lg {
    padding: 1rem 2rem;
    font-size: 1.0625rem;
  }

  /* variants */
  .btn--primary {
    background: var(--color-accent);
    /* Inverted text — works in both light (white-on-dark) and dark
     * (dark-on-off-white) since accent is monochromatic on each theme. */
    color: var(--color-bg);
  }
  .btn--primary:hover {
    background: var(--color-accent-hover);
  }
  .btn--secondary {
    background: var(--color-bg-elevated);
    color: var(--color-text);
    border-color: var(--color-border);
  }
  .btn--secondary:hover {
    border-color: var(--color-text);
  }
  .btn--ghost {
    background: transparent;
    color: var(--color-text);
  }
  .btn--ghost:hover {
    background: var(--color-bg-elevated);
  }
  .btn--destructive {
    background: var(--color-error);
    color: #fff;
  }
</style>
