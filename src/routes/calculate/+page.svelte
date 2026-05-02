<script lang="ts">
  import { goto } from "$app/navigation";
  import { fly } from "svelte/transition";
  import { cubicOut } from "svelte/easing";
  import { Button, Card, Banner, Counter } from "$lib/ui";
  import ChevronLeft from "@lucide/svelte/icons/chevron-left";
  import ChevronRight from "@lucide/svelte/icons/chevron-right";
  import RotateCcw from "@lucide/svelte/icons/rotate-ccw";
  import { QuestionnaireRunner } from "$lib/features/questionnaire/runner.svelte";
  import { copyFor, shapeFor, progressOf } from "$lib/features/questionnaire/labels";
  import { labelFor } from "$lib/features/questionnaire/heirLabels";
  import { MADHHABS, type Madhhab } from "$engine";

  const runner = new QuestionnaireRunner();

  let counterValue = $state(0);
  let madhhab = $state<Madhhab>("general");

  const step = $derived(runner.step);
  const copy = $derived(copyFor(step));
  const shape = $derived(shapeFor(step));
  const progress = $derived(Math.round(progressOf(step) * 100));
  const heirs = $derived(runner.heirs);

  function changeMadhhab(value: Madhhab) {
    madhhab = value;
    runner.reset(value);
    counterValue = 0;
  }

  function answerYes() {
    runner.answerBool(true);
    counterValue = 0;
  }
  function answerNo() {
    runner.answerBool(false);
    counterValue = 0;
  }
  function submitCount() {
    runner.answerInt(counterValue);
    counterValue = 0;
  }
  function pickGender(g: 0 | 1) {
    runner.answerInt(g);
  }

  function startOver() {
    runner.reset(madhhab);
    counterValue = 0;
  }

  function calculate() {
    // The result page reads from sessionStorage in this phase. Shareable URLs
    // come in B6.
    if (typeof sessionStorage !== "undefined") {
      const c = runner.buildCase();
      sessionStorage.setItem(
        "fairshare:case",
        JSON.stringify({
          subjectGender: c.subjectGender,
          heirs: c.heirs,
          madhhab: c.madhhab,
        }),
      );
    }
    goto("/result");
  }
</script>

<svelte:head>
  <title>Calculate — FairShare</title>
  <meta
    name="description"
    content="Walk through a short questionnaire to compute Islamic inheritance shares for any family."
  />
</svelte:head>

<section class="container">
  <header class="head">
    <p class="kicker">Step {Math.min(progress, 99)}%</p>
    <h1>Calculate</h1>
    <div
      class="progress"
      role="progressbar"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow={progress}
      aria-label="Questionnaire progress"
    >
      <div class="progress-bar" style="--p: {progress}%"></div>
    </div>
    <div class="madhhab-row">
      <span class="madhhab-label">School:</span>
      <div class="madhhab-pills">
        {#each MADHHABS as m (m)}
          <button
            type="button"
            class="madhhab-pill"
            class:madhhab-pill--active={madhhab === m}
            onclick={() => changeMadhhab(m)}
          >
            {m === "shafii" ? "Shafi'i" : m[0].toUpperCase() + m.slice(1)}
          </button>
        {/each}
      </div>
    </div>
  </header>

  {#if heirs.length > 0}
    <div class="summary" aria-label="Heirs collected so far">
      {#each heirs as e (e.type)}
        <span class="chip">{labelFor(e.type, e.count)}</span>
      {/each}
    </div>
  {/if}

  {#key step}
    <div class="step" in:fly={{ y: 12, duration: 240, easing: cubicOut }}>
      <Card>
        {#snippet children()}
          <h2 class="prompt">{copy.prompt}</h2>
          {#if copy.help}
            <p class="help">{copy.help}</p>
          {/if}

          {#if shape === "bool"}
            <div class="bool-actions">
              <Button onclick={answerYes} fullWidth>{copy.trueLabel ?? "Yes"}</Button>
              <Button variant="secondary" onclick={answerNo} fullWidth>
                {copy.falseLabel ?? "No"}
              </Button>
            </div>
          {:else if shape === "int"}
            <div class="int-input">
              <Counter
                bind:value={counterValue}
                min={0}
                max={copy.countMax ?? 20}
                label={copy.countLabel ?? "Count"}
                description={copy.countDescription}
              />
              <Button onclick={submitCount} fullWidth>Continue</Button>
            </div>
          {:else if shape === "gender"}
            <div class="bool-actions">
              <Button onclick={() => pickGender(0)} fullWidth>Male</Button>
              <Button variant="secondary" onclick={() => pickGender(1)} fullWidth>
                Female
              </Button>
            </div>
          {:else}
            <Banner tone="scholar">
              {#snippet children()}
                You're done. Review the heirs above and run the calculation.
              {/snippet}
            </Banner>
            <div class="done-actions">
              <Button onclick={calculate} size="lg" fullWidth>See the result</Button>
              <Button onclick={startOver} variant="ghost" fullWidth>
                <RotateCcw size={16} aria-hidden="true" />
                Start over
              </Button>
            </div>
          {/if}
        {/snippet}
      </Card>

      <div class="nav">
        <Button variant="ghost" onclick={runner.back} disabled={!runner.canGoBack}>
          <ChevronLeft size={16} aria-hidden="true" />
          Back
        </Button>
        {#if shape === "bool" || shape === "gender"}
          <span class="nav-hint">Pick an option to continue</span>
        {:else if shape === "int"}
          <span class="nav-hint">Tap continue when ready</span>
        {/if}
        <span class="nav-spacer">
          <ChevronRight size={16} class="invisible" aria-hidden="true" />
        </span>
      </div>
    </div>
  {/key}
</section>

<style>
  .container {
    max-width: 720px;
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
  }
  .progress {
    margin-top: 1rem;
    height: 4px;
    background: var(--color-border);
    border-radius: var(--radius-pill);
    overflow: hidden;
  }
  .progress-bar {
    width: var(--p);
    height: 100%;
    background: var(--color-accent);
    transition: width 0.25s ease-out;
  }
  .madhhab-row {
    margin-top: 1rem;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem 0.75rem;
    font-size: 0.875rem;
  }
  .madhhab-label {
    color: var(--color-text-muted);
  }
  .madhhab-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
  }
  .madhhab-pill {
    padding: 0.25rem 0.625rem;
    border-radius: var(--radius-pill);
    border: 1px solid var(--color-border);
    background: var(--color-bg-elevated);
    color: var(--color-text-secondary);
    font-size: 0.8125rem;
    cursor: pointer;
    transition:
      background-color 0.15s,
      color 0.15s,
      border-color 0.15s;
  }
  .madhhab-pill--active {
    background: var(--color-accent);
    border-color: var(--color-accent);
    color: #fff;
  }

  .summary {
    margin-bottom: 1.25rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.375rem;
  }
  .chip {
    font-size: 0.8125rem;
    padding: 0.25rem 0.625rem;
    border-radius: var(--radius-pill);
    background: var(--color-bg-elevated);
    border: 1px solid var(--color-border);
    color: var(--color-text-secondary);
  }

  .step {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .prompt {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-text);
  }
  .help {
    margin-top: 0.5rem;
    color: var(--color-text-muted);
    font-size: 0.9375rem;
    line-height: 1.55;
  }

  .bool-actions {
    margin-top: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  @media (min-width: 640px) {
    .bool-actions {
      flex-direction: row;
    }
  }

  .int-input {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .done-actions {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    color: var(--color-text-muted);
    font-size: 0.8125rem;
  }
  .nav-hint {
    text-align: center;
  }
  .nav-spacer {
    width: 5rem;
  }
</style>
