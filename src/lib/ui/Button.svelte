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
    {#if loading}
      <span class="btn-spinner" aria-hidden="true"></span>
    {/if}
    {@render children()}
  </button>
{/if}

<style>
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    font-family: var(--font-sans);
    font-weight: 500;
    border-radius: var(--radius-md);
    transition:
      background-color 0.12s,
      color 0.12s,
      border-color 0.12s,
      box-shadow 0.12s;
    text-decoration: none;
    cursor: pointer;
    -webkit-appearance: none;
    appearance: none;
    border: 1px solid transparent;
    line-height: 1.2;
    -webkit-user-select: none;
    user-select: none;
  }
  .btn:active {
    box-shadow: inset 0 1px 2px rgba(22, 41, 31, 0.2);
  }
  .btn:disabled,
  .btn[aria-busy="true"] {
    opacity: 0.55;
    cursor: not-allowed;
    box-shadow: none;
  }
  .btn--full {
    width: 100%;
  }

  /* sizes */
  .btn--sm {
    padding: 0.4375rem 0.75rem;
    font-size: 0.875rem;
  }
  .btn--md {
    padding: 0.625rem 1.125rem;
    font-size: 0.9375rem;
  }
  .btn--lg {
    padding: 0.8125rem 1.375rem;
    font-size: 1rem;
  }

  /* variants */
  .btn--primary {
    background: var(--color-accent);
    color: #fff;
  }
  .btn--primary:hover {
    background: var(--color-accent-hover);
  }
  .btn--secondary {
    background: var(--color-bg);
    color: var(--color-text);
    border-color: var(--color-border-strong);
  }
  .btn--secondary:hover {
    border-color: var(--color-text);
  }
  .btn--ghost {
    background: transparent;
    color: var(--color-text);
  }
  .btn--ghost:hover {
    background: var(--color-wash);
  }
  .btn--destructive {
    background: var(--color-error);
    color: #fff;
  }
  .btn--destructive:hover {
    background: var(--color-error-hover);
  }

  .btn-spinner {
    width: 0.875em;
    height: 0.875em;
    border: 2px solid currentColor;
    border-top-color: transparent;
    border-radius: 50%;
    animation: btn-spin 0.6s linear infinite;
    flex-shrink: 0;
  }
  @keyframes btn-spin {
    to {
      transform: rotate(1turn);
    }
  }
</style>
