<script lang="ts">
  let {
    value = $bindable(0),
    min = 0,
    max = 99,
    label,
    description,
  }: {
    value?: number;
    min?: number;
    max?: number;
    label: string;
    description?: string;
  } = $props();

  function dec() {
    if (value > min) value = value - 1;
  }
  function inc() {
    if (value < max) value = value + 1;
  }
</script>

<div class="counter">
  <div class="counter-text">
    <span class="counter-label">{label}</span>
    {#if description}
      <span class="counter-desc">{description}</span>
    {/if}
  </div>
  <div class="counter-controls" role="group" aria-label={label}>
    <button
      type="button"
      onclick={dec}
      disabled={value <= min}
      class="ctl"
      aria-label="Decrease {label}"
    >
      &minus;
    </button>
    <span class="value" aria-live="polite">{value}</span>
    <button
      type="button"
      onclick={inc}
      disabled={value >= max}
      class="ctl"
      aria-label="Increase {label}"
    >
      &plus;
    </button>
  </div>
</div>

<style>
  .counter {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.75rem 0;
  }
  .counter-text {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
    min-width: 0;
  }
  .counter-label {
    font-weight: 500;
    color: var(--color-text);
  }
  .counter-desc {
    font-size: 0.875rem;
    color: var(--color-text-muted);
  }
  .counter-controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .ctl {
    width: 2.25rem;
    height: 2.25rem;
    border-radius: var(--radius-pill);
    border: 1px solid var(--color-border);
    background: var(--color-bg-elevated);
    color: var(--color-text);
    font-size: 1.125rem;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition:
      background-color 0.15s,
      border-color 0.15s,
      color 0.15s;
  }
  .ctl:hover:not(:disabled) {
    background: var(--color-accent);
    border-color: var(--color-accent);
    color: #fff;
  }
  .ctl:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
  .value {
    min-width: 2rem;
    text-align: center;
    font-variant-numeric: tabular-nums;
    font-weight: 600;
    color: var(--color-text);
  }
</style>
