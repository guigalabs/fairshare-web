<script lang="ts">
  import { Button, EmptyState, TextInput } from "$lib/ui";
  import { t } from "$lib/i18n/index.svelte";
  import ImportLocalCasesPrompt from "$lib/features/migration/ImportLocalCasesPrompt.svelte";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();
  let query = $state("");
  $effect(() => {
    query = data.query;
  });
</script>

<svelte:head>
  <title>Cases · FairShare Pro</title>
</svelte:head>

{#if !data.isPro}
  <EmptyState
    title="Subscribe to FairShare Pro"
    description="Server-side cases, branded PDFs, and madhab compare are Pro features. Choose a plan and pick up where you left off."
  >
    {#snippet action()}
      <Button href="/pricing">See pricing</Button>
    {/snippet}
  </EmptyState>
{:else}
  <ImportLocalCasesPrompt />

  <section class="head">
    <h1>{t("app.cases.title")}</h1>
    <Button href="/app/cases/new">{t("app.cases.empty.cta")}</Button>
  </section>

  <form class="filters" method="GET" data-sveltekit-keepfocus>
    <TextInput
      name="q"
      bind:value={query}
      placeholder={t("app.cases.filter.search")}
      aria-label={t("app.cases.filter.search")}
    />
    <select name="client_id" aria-label={t("app.cases.filter.client")}>
      <option value="">{t("app.cases.filter.allClients")}</option>
      {#each data.clients as client (client.id)}
        <option value={client.id}>{client.displayName}</option>
      {/each}
    </select>
    <select name="madhhab" aria-label={t("app.cases.filter.madhhab")}>
      <option value="">{t("app.cases.filter.allMadhabs")}</option>
      <option value="general">General</option>
      <option value="hanafi">Hanafi</option>
      <option value="maliki">Maliki</option>
      <option value="shafii">Shafi'i</option>
      <option value="hanbali">Hanbali</option>
    </select>
    <Button type="submit" variant="secondary">{t("app.cases.filter.apply")}</Button>
  </form>

  {#if data.cases.length === 0}
    <EmptyState title={t("app.cases.empty.title")} description={t("app.cases.empty.desc")}>
      {#snippet action()}
        <Button href="/app/cases/new">{t("app.cases.empty.cta")}</Button>
      {/snippet}
    </EmptyState>
  {:else}
    <ul class="cases">
      {#each data.cases as c (c.id)}
        <li>
          <a href="/app/cases/{c.id}" class="case-link">
            <span class="case-name">{c.deceasedName}</span>
            <span class="case-meta">
              {c.madhhab}
              {#if c.dateOfDeath}· DOD {c.dateOfDeath}{/if}
              {#if c.jurisdiction}· {c.jurisdiction}{/if}
            </span>
          </a>
        </li>
      {/each}
    </ul>
  {/if}
{/if}

<style>
  .head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.5rem;
    gap: 1rem;
  }
  .head h1 {
    font-size: 1.5rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--color-text);
  }
  .filters {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }
  @media (min-width: 720px) {
    .filters {
      grid-template-columns: 2fr 1fr 1fr auto;
    }
  }
  .filters select {
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-bg);
    color: var(--color-text);
    font-size: 0.9375rem;
  }
  .cases {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: 0.5rem;
  }
  .case-link {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 0.875rem 1rem;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-bg-elevated);
    text-decoration: none;
    color: var(--color-text);
    transition: border-color 0.15s;
  }
  .case-link:hover {
    border-color: var(--color-accent);
  }
  .case-name {
    font-weight: 600;
  }
  .case-meta {
    font-size: 0.8125rem;
    color: var(--color-text-muted);
  }
</style>
