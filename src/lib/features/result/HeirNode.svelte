<script lang="ts">
  import { onMount } from "svelte";
  import type { HeirShare } from "$engine";
  import { colorFor, iconFor } from "./heirHelpers";
  import { labelFor } from "$lib/features/questionnaire/heirLabels";

  let { share }: { share: HeirShare } = $props();

  const SIZE = 52;
  const STROKE = 3;
  const RADIUS = (SIZE - STROKE) / 2;
  const CIRC = 2 * Math.PI * RADIUS;

  const tint = $derived(colorFor(share.heirType));
  const Icon = $derived(iconFor(share.heirType));

  // Animate ring fill from 0 to share.percentage on mount.
  let ringProgress = $state(0);
  onMount(() => {
    const target = Math.min(Math.max(share.percentage, 0), 100);
    requestAnimationFrame(() => {
      // small delay so the ring "draws" rather than appearing pre-filled
      setTimeout(() => (ringProgress = target), 150 + Math.random() * 250);
    });
  });

  const offset = $derived(CIRC * (1 - ringProgress / 100));
</script>

<div class="node">
  <div class="node-circle" style="--tint: {tint};">
    <svg width={SIZE} height={SIZE} viewBox="0 0 {SIZE} {SIZE}" aria-hidden="true">
      <!-- Track -->
      <circle
        cx={SIZE / 2}
        cy={SIZE / 2}
        r={RADIUS}
        fill="none"
        stroke="color-mix(in srgb, {tint} 12%, transparent)"
        stroke-width={STROKE}
      />
      <!-- Progress ring -->
      <circle
        cx={SIZE / 2}
        cy={SIZE / 2}
        r={RADIUS}
        fill="none"
        stroke={tint}
        stroke-width={STROKE}
        stroke-linecap="round"
        stroke-dasharray={CIRC}
        stroke-dashoffset={offset}
        transform="rotate(-90 {SIZE / 2} {SIZE / 2})"
        style="transition: stroke-dashoffset 0.7s cubic-bezier(0.33, 1, 0.68, 1);"
      />
    </svg>
    <div class="node-fill">
      <Icon size={18} aria-hidden="true" color={tint} />
    </div>
    {#if share.count > 1}
      <span class="count-badge">×{share.count}</span>
    {/if}
  </div>

  <p class="node-name">{labelFor(share.heirType, share.count)}</p>

  <div class="node-meta">
    <span class="pct">{share.percentage.toFixed(1)}%</span>
    {#if share.fraction.numerator > 0n && share.fraction.denominator > 1n}
      <span class="frac">{share.fraction.toString()}</span>
    {/if}
  </div>
</div>

<style>
  .node {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.375rem;
    min-width: 4.5rem;
  }
  .node-circle {
    position: relative;
    width: 52px;
    height: 52px;
  }
  .node-circle svg {
    position: absolute;
    inset: 0;
  }
  .node-fill {
    position: absolute;
    inset: 4px;
    border-radius: 9999px;
    background: color-mix(in srgb, var(--tint) 8%, var(--color-bg-elevated));
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .count-badge {
    position: absolute;
    top: -4px;
    inset-inline-end: -4px;
    background: var(--tint);
    color: #fff;
    font-size: 9px;
    font-weight: 700;
    padding: 1px 5px;
    border-radius: 9999px;
    line-height: 1;
    font-variant-numeric: tabular-nums;
  }
  .node-name {
    font-size: 0.6875rem;
    font-weight: 500;
    color: var(--color-text);
    text-align: center;
    line-height: 1.2;
    max-width: 6rem;
  }
  .node-meta {
    display: flex;
    align-items: baseline;
    gap: 0.25rem;
  }
  .pct {
    font-size: 0.6875rem;
    font-weight: 700;
    color: var(--tint);
    font-variant-numeric: tabular-nums;
  }
  .frac {
    font-size: 0.5625rem;
    font-weight: 600;
    color: color-mix(in srgb, var(--tint) 60%, transparent);
    font-variant-numeric: tabular-nums;
  }
  /* Local CSS var read for .pct/.frac (sit outside .node-circle scope) */
  .node {
    --tint: currentColor;
  }
  .node-circle {
    --tint: var(--tint);
  }
</style>
