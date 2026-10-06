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
    white-space: nowrap;
    font-family: var(--font-sans);
    font-weight: 600;
    border: 2px solid var(--color-edge);
    border-radius: 0;
    box-shadow: var(--shadow-sm);
    transition:
      transform 90ms ease,
      box-shadow 90ms ease,
      background-color 90ms ease;
    text-decoration: none;
    cursor: pointer;
    -webkit-appearance: none;
    appearance: none;
    line-height: 1.2;
    -webkit-user-select: none;
    user-select: none;
  }
  .btn:hover:not(:disabled) {
    transform: translate(-1px, -1px);
    box-shadow: var(--shadow);
  }
  /* The press: the button travels into its own shadow. */
  .btn:active:not(:disabled) {
    transform: translate(3px, 3px);
    box-shadow: 0 0 0 var(--color-edge);
  }
  .btn:disabled,
  .btn[aria-busy="true"] {
    opacity: 0.45;
    cursor: not-allowed;
    box-shadow: none;
  }
  .btn--full {
    width: 100%;
  }

  /* sizes */
  .btn--sm {
    padding: 0.5rem 0.875rem;
    font-size: 0.875rem;
  }
  .btn--md {
    padding: 0.6875rem 1.25rem;
    font-size: 0.9375rem;
  }
  .btn--lg {
    padding: 0.875rem 1.625rem;
    font-size: 1rem;
  }

  /* variants */
  .btn--primary {
    background: var(--color-accent);
    color: #fff;
  }
  .btn--secondary {
    background: var(--color-bg);
    color: var(--color-text);
    font-family: var(--font-mono);
    font-weight: 500;
    letter-spacing: 0.04em;
    font-size: 0.8125rem;
  }
  :global(html[dir="rtl"]) .btn--secondary {
    font-family: var(--font-arabic);
    letter-spacing: 0;
    font-size: 0.9375rem;
  }
  .btn--ghost {
    background: transparent;
    color: var(--color-text);
    border-color: transparent;
    box-shadow: none;
  }
  .btn--ghost:hover:not(:disabled) {
    border-color: var(--color-edge);
    box-shadow: var(--shadow-sm);
  }
  .btn--destructive {
    background: var(--color-error);
    color: #fff;
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
