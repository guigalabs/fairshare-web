<script lang="ts">
  import { Button } from "$lib/ui";
  import { t } from "$lib/i18n/index.svelte";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>{t("app.billing.title")} · FairShare Pro</title>
</svelte:head>

<section class="head">
  <h1>{t("app.billing.title")}</h1>
</section>

{#if data.isPro && data.subscription}
  <div class="card">
    <h2>{t("app.billing.proHeading")}</h2>
    <dl class="kv">
      <dt>{t("app.billing.plan")}</dt>
      <dd>{t("app.billing.planValue", { cadence: data.subscription.cadence ?? "" })}</dd>
      <dt>{t("app.billing.status")}</dt>
      <dd>{data.subscription.status}</dd>
      {#if data.subscription.currentPeriodEnd}
        <dt>{t("app.billing.periodEnds")}</dt>
        <dd>{new Date(data.subscription.currentPeriodEnd).toLocaleDateString()}</dd>
      {/if}
    </dl>
    <p class="muted">{t("app.billing.portalNote")}</p>
    <form method="POST" action="/api/stripe/portal" class="actions">
      <Button type="submit">{t("app.billing.openPortal")}</Button>
    </form>
  </div>
{:else}
  <div class="card">
    <h2>{t("app.billing.freeHeading")}</h2>
    <p>{t("app.billing.freeBody")}</p>
    <p class="actions">
      <Button href="/pricing">{t("app.billing.seePlans")}</Button>
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
