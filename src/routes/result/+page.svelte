<script lang="ts">
  import { onMount } from "svelte";
  import { Banner, Button, Card, EmptyState } from "$lib/ui";
  import ShareRow from "$lib/features/result/ShareRow.svelte";
  import FamilyTree from "$lib/features/result/FamilyTree.svelte";
  import Walkthrough from "$lib/features/result/Walkthrough.svelte";
  import WhatIf from "$lib/features/result/WhatIf.svelte";
  import ResultActionBar from "$lib/features/result/ResultActionBar.svelte";
  import PlainLanguageSummary from "$lib/features/result/PlainLanguageSummary.svelte";
  import { ResultStore } from "$lib/features/result/store.svelte";
  import { t } from "$lib/i18n/index.svelte";

  const store = new ResultStore();

  onMount(() => {
    store.load();
  });

  const result = $derived(store.result);
  const c = $derived(store.effectiveCase);
</script>

<svelte:head>
  <title>{t("result.title")} · FairShare</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<section class="container">
  {#if !store.baseCase}
    {#if store.linkError}
      <Banner tone="warning">
        {#snippet children()}
          <strong>{t("result.linkError.title")}</strong>
          {t("result.linkError.desc")}
        {/snippet}
      </Banner>
    {/if}
    <EmptyState title={t("result.empty.title")} description={t("result.empty.desc")}>
      {#snippet action()}
        <Button href="/calculate" size="lg">{t("result.empty.cta")}</Button>
      {/snippet}
    </EmptyState>
  {:else if !result || !c}
    <p class="loading">{t("result.calculating")}</p>
  {:else}
    {@const safeC = c}
    {@const safeResult = result}
    <header class="head">
      <p class="kicker">{t("result.kicker")}</p>
      <h1>
        {t("result.heirsHeading", {
          gender:
            safeC.subjectGender === "male" ? t("result.subject.male") : t("result.subject.female"),
          madhhab: t(`madhhab.${safeC.madhhab}.name`),
        })}
      </h1>
      <p class="subject-meta">
        {safeC.heirs.length === 1
          ? t("result.heirsCount.one", { count: safeC.heirs.length })
          : t("result.heirsCount.other", { count: safeC.heirs.length })}
        {#if store.whatIfActive}
          <span class="whatif-flag">{t("result.whatif.flag")}</span>
        {/if}
      </p>
    </header>

    <div class="action-row">
      <ResultActionBar inputCase={safeC} result={safeResult} />
    </div>

    <Banner tone="scholar">
      {#snippet children()}
        <strong>{t("result.educational")}</strong>
        {t("result.educational.rest")}
      {/snippet}
    </Banner>

    <div class="grid">
      <div class="left">
        <Card>
          {#snippet children()}
            <h2 class="section-title">{t("result.shares")}</h2>
            <div class="shares">
              {#each safeResult.shares as s (s.heirType)}
                <ShareRow share={s} />
              {/each}
            </div>
            {#if safeResult.shares.length === 0}
              <p class="empty">{t("result.shares.empty")}</p>
            {/if}
          {/snippet}
        </Card>

        <Card>
          {#snippet children()}
            <h2 class="section-title">{t("result.tree")}</h2>
            <FamilyTree result={safeResult} subjectGender={safeC.subjectGender} />
          {/snippet}
        </Card>
      </div>

      <aside class="right">
        <WhatIf {store} />
        <PlainLanguageSummary result={safeResult} subjectGender={safeC.subjectGender} />
        <Walkthrough result={safeResult} />
      </aside>
    </div>
  {/if}
</section>

<style>
  .container {
    max-width: 1100px;
    margin: 0 auto;
    padding: 2rem 1rem 4rem;
  }
  .head {
    margin-bottom: 1.5rem;
  }
  .kicker {
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--color-text-muted);
  }
  .head h1 {
    margin-top: 0.375rem;
    font-size: 1.875rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1.15;
    text-transform: capitalize;
  }
  .subject-meta {
    margin-top: 0.5rem;
    color: var(--color-text-muted);
    font-size: 0.9375rem;
  }
  .whatif-flag {
    color: var(--color-accent);
    font-weight: 500;
  }

  .action-row {
    margin-bottom: 1rem;
  }

  .grid {
    margin-top: 1.5rem;
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
  @media (min-width: 900px) {
    .grid {
      grid-template-columns: 1.4fr 1fr;
    }
  }
  .left,
  .right {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .section-title {
    font-size: 1.0625rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: var(--color-text);
  }
  .shares {
    display: flex;
    flex-direction: column;
  }
  .empty {
    color: var(--color-text-muted);
    padding: 0.75rem 0;
  }
  .loading {
    text-align: center;
    color: var(--color-text-muted);
    padding: 4rem 1rem;
  }
</style>
