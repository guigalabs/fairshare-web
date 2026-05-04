<script lang="ts">
  import { Button, EmptyState } from "$lib/ui";
  import { t } from "$lib/i18n/index.svelte";
</script>

<svelte:head>
  <title>Cases · FairShare Pro</title>
</svelte:head>

<section class="head">
  <h1>{t("app.cases.title")}</h1>
</section>

<EmptyState title={t("app.cases.empty.title")} description={t("app.cases.empty.desc")}>
  {#snippet action()}
    <Button href="/app/cases/new">{t("app.cases.empty.cta")}</Button>
  {/snippet}
</EmptyState>

<style>
  .head {
    margin-bottom: 1.5rem;
  }
  .head h1 {
    font-size: 1.5rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--color-text);
  }
</style>
