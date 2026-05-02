<script lang="ts">
  import RingChart from "./RingChart.svelte";
  import type { HeirShare } from "$engine";
  import { labelFor } from "$lib/features/questionnaire/heirLabels";

  let { share }: { share: HeirShare } = $props();
</script>

<div class="row">
  <RingChart percentage={share.percentage} />
  <div class="row-text">
    <p class="row-name">{labelFor(share.heirType, share.count)}</p>
    <p class="row-meta">
      <span class="fraction">{share.fraction.toString()}</span>
      <span class="dot">·</span>
      <span class="pct">{share.percentage.toFixed(2)}%</span>
    </p>
  </div>
</div>

<style>
  .row {
    display: flex;
    align-items: center;
    gap: 0.875rem;
    padding: 0.875rem 0;
    border-bottom: 1px solid var(--color-border);
  }
  .row:last-child {
    border-bottom: 0;
  }
  .row-text {
    flex: 1;
    min-width: 0;
  }
  .row-name {
    font-weight: 500;
    color: var(--color-text);
  }
  .row-meta {
    margin-top: 0.125rem;
    font-size: 0.875rem;
    color: var(--color-text-muted);
  }
  .fraction {
    font-variant-numeric: tabular-nums;
    font-feature-settings: "frac";
    color: var(--color-text-secondary);
    font-weight: 500;
  }
  .dot {
    margin: 0 0.25rem;
    color: var(--color-text-subtle);
  }
  .pct {
    font-variant-numeric: tabular-nums;
  }
</style>
