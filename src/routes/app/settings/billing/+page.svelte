<script lang="ts">
  import { Button } from "$lib/ui";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>Billing · FairShare Pro</title>
</svelte:head>

<section class="head">
  <h1>Billing</h1>
</section>

{#if data.isPro && data.subscription}
  <div class="card">
    <h2>FairShare Pro</h2>
    <dl class="kv">
      <dt>Plan</dt>
      <dd>Pro · {data.subscription.cadence}</dd>
      <dt>Status</dt>
      <dd>{data.subscription.status}</dd>
      {#if data.subscription.currentPeriodEnd}
        <dt>Current period ends</dt>
        <dd>{new Date(data.subscription.currentPeriodEnd).toLocaleDateString()}</dd>
      {/if}
    </dl>
    <p class="muted">
      Manage your card, change cadence, or cancel from the Paddle customer portal.
    </p>
    <p class="actions">
      <Button href="https://customer-portal.paddle.com" target="_blank" rel="noopener">
        Open billing portal
      </Button>
    </p>
  </div>
{:else}
  <div class="card">
    <h2>You're on the free plan</h2>
    <p>
      The free site (the calculator at /calculate) stays free forever. Subscribe to Pro for case
      folders, branded PDFs, side-by-side madhab compare, and JSON export.
    </p>
    <p class="actions">
      <Button href="/pricing">See Pro plans</Button>
    </p>
  </div>
{/if}

<style>
  .head h1 {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-text);
    margin-bottom: 1.5rem;
  }
  .card {
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: 1.25rem 1.5rem;
    background: var(--color-bg-elevated);
    max-width: 560px;
  }
  .card h2 {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
    color: var(--color-text);
  }
  .kv {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 0.5rem 1.5rem;
    margin: 0 0 1rem 0;
  }
  .kv dt {
    color: var(--color-text-secondary);
  }
  .kv dd {
    margin: 0;
    color: var(--color-text);
  }
  .muted {
    color: var(--color-text-muted);
    font-size: 0.875rem;
    margin-top: 1rem;
  }
  .actions {
    margin-top: 1rem;
    display: flex;
    gap: 0.75rem;
  }
</style>
