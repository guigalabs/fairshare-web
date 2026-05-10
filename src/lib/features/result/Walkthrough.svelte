<script lang="ts">
  import type { CalculationResult } from "$engine";
  import { t } from "$lib/i18n/index.svelte";
  import { labelFor } from "$lib/features/questionnaire/heirLabels";

  let { result }: { result: CalculationResult } = $props();
  let open = $state(false);
</script>

<details class="walk" bind:open>
  <summary>
    <span class="walk-title">{t("walkthrough.title")}</span>
    <span class="walk-toggle" aria-hidden="true">
      {open ? t("walkthrough.hide") : t("walkthrough.show")}
    </span>
  </summary>

  <ol class="steps">
    {#each result.steps as step, i (i)}
      <li class="step">
        <span class="rule">{step.ruleApplied}</span>
        <p class="desc">{step.description}</p>
        {#if step.verseKey}
          <p class="verse">{t("walkthrough.surah", { verse: step.verseKey })}</p>
        {/if}
      </li>
    {/each}
  </ol>

  {#if result.blockedHeirs.length > 0}
    <div class="blocked">
      <h4>{t("walkthrough.blocked")}</h4>
      <ul>
        {#each result.blockedHeirs as b (b.heirType)}
          <li>
            {t("walkthrough.blockedLine", {
              heir: labelFor(b.heirType, 1),
              by: labelFor(b.blockedBy, 1),
              reason: b.reason,
            })}
          </li>
        {/each}
      </ul>
    </div>
  {/if}

  <div class="meta">
    <p>{t("walkthrough.commonDenom", { value: result.commonDenominator.toString() })}</p>
    {#if result.adjustedDenominator}
      <p>{t("walkthrough.adjustedDenom", { value: result.adjustedDenominator.toString() })}</p>
    {/if}
    {#if result.appliedAwl}<p class="flag">{t("walkthrough.awl")}</p>{/if}
    {#if result.appliedRadd}<p class="flag">{t("walkthrough.radd")}</p>{/if}
    {#if result.appliedSpecialCase}
      <p class="flag">{t("walkthrough.special", { name: result.appliedSpecialCase })}</p>
    {/if}
  </div>
</details>

<style>
  .walk {
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    background: var(--color-bg-elevated);
    overflow: hidden;
  }
  summary {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.25rem;
    cursor: pointer;
    list-style: none;
  }
  summary::-webkit-details-marker {
    display: none;
  }
  .walk-title {
    font-weight: 600;
    color: var(--color-text);
  }
  .walk-toggle {
    font-size: 0.875rem;
    color: var(--color-accent);
  }
  .steps {
    margin: 0;
    padding: 0 1.25rem 1.25rem;
    list-style: none;
    counter-reset: step;
  }
  .step {
    position: relative;
    padding: 0.875rem 0 0.875rem 2rem;
    border-top: 1px solid var(--color-border);
    counter-increment: step;
  }
  .step::before {
    content: counter(step);
    position: absolute;
    inset-inline-start: 0;
    top: 1rem;
    width: 1.5rem;
    height: 1.5rem;
    border-radius: var(--radius-pill);
    background: var(--color-accent);
    color: var(--color-bg);
    font-size: 0.75rem;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .rule {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--color-accent);
    font-weight: 600;
  }
  .desc {
    margin-top: 0.25rem;
    color: var(--color-text);
    line-height: 1.55;
  }
  .verse {
    margin-top: 0.25rem;
    font-size: 0.8125rem;
    color: var(--color-text-muted);
    font-style: italic;
  }
  .blocked {
    margin: 0 1.25rem 1.25rem;
    padding: 0.75rem 1rem;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-bg);
  }
  .blocked h4 {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-text);
    margin-bottom: 0.375rem;
  }
  .blocked ul {
    list-style: disc;
    padding-inline-start: 1.25rem;
    color: var(--color-text-secondary);
    font-size: 0.875rem;
  }
  .blocked li {
    margin: 0.125rem 0;
  }
  .meta {
    margin: 0 1.25rem 1.25rem;
    padding-top: 0.75rem;
    border-top: 1px solid var(--color-border);
    font-size: 0.875rem;
    color: var(--color-text-muted);
  }
  .meta p {
    margin: 0.25rem 0;
  }
  .flag {
    color: var(--color-accent);
    font-weight: 500;
  }
</style>
