<script lang="ts">
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";
  import { fly } from "svelte/transition";
  import { cubicOut } from "svelte/easing";
  import { Button, Card, Banner, Counter, toast, reducedMotion } from "$lib/ui";
  import ChevronLeft from "@lucide/svelte/icons/chevron-left";
  import ChevronRight from "@lucide/svelte/icons/chevron-right";
  import RotateCcw from "@lucide/svelte/icons/rotate-ccw";
  import { QuestionnaireRunner } from "$lib/features/questionnaire/runner.svelte";
  import { copyFor, shapeFor, progressOf } from "$lib/features/questionnaire/labels";
  import { labelFor } from "$lib/features/questionnaire/heirLabels";
  import { MADHHABS, type Madhhab } from "$engine";
  import { t } from "$lib/i18n/index.svelte";
  import { serialiseJsonLd, howToSchema } from "$lib/seo/jsonld";

  // HowTo schema for the calculator flow. Steps are deliberately
  // high-level — the actual questionnaire branches dynamically based on
  // family composition, so enumerating every question would misrepresent
  // it. Three steps capture the user-visible arc: school → questionnaire
  // → result with citations.
  const calculatorHowTo = howToSchema({
    name: "Calculate Islamic inheritance shares (Fara'id)",
    description:
      "Compute Fara'id shares for any family, with each share linked to its Quranic source. Free, offline, and bilingual EN/AR.",
    steps: [
      {
        name: "Choose a school of thought (madhhab)",
        text: "Pick one of the five Sunni schools — General (majority), Hanafi, Maliki, Shafi'i, or Hanbali — or accept the General default.",
      },
      {
        name: "Walk through the family questionnaire",
        text: "Answer short questions about the deceased's surviving family: spouse, parents, children, siblings, and other named heirs.",
      },
      {
        name: "Review the computed shares",
        text: "Read each heir's share and the Quranic verse (4:11, 4:12, 4:176) or classical rule it derives from. Export or share the result.",
      },
    ],
  });

  // A `?madhhab=` URL param takes precedence over the stored value so a
  // colleague-shared link can pin the right school.
  const MADHHAB_STORAGE_KEY = "fairshare:madhhab";
  function readInitialMadhhab(): Madhhab {
    if (!browser) return "general";
    const fromUrl = new URLSearchParams(window.location.search).get("madhhab");
    if (fromUrl && MADHHABS.includes(fromUrl as Madhhab)) return fromUrl as Madhhab;
    const stored = localStorage.getItem(MADHHAB_STORAGE_KEY);
    return MADHHABS.includes(stored as Madhhab) ? (stored as Madhhab) : "general";
  }

  const initialMadhhab = readInitialMadhhab();
  let madhhab = $state<Madhhab>(initialMadhhab);
  const runner = new QuestionnaireRunner(initialMadhhab);

  const stepEnter = reducedMotion
    ? { y: 0, duration: 0, easing: cubicOut }
    : { y: 12, duration: 240, easing: cubicOut };

  let counterValue = $state(0);

  const step = $derived(runner.step);
  const copy = $derived(copyFor(step));
  const shape = $derived(shapeFor(step));
  const progress = $derived(Math.round(progressOf(step) * 100));
  const heirs = $derived(runner.heirs);

  function changeMadhhab(value: Madhhab) {
    madhhab = value;
    if (browser) {
      try {
        localStorage.setItem(MADHHAB_STORAGE_KEY, value);
      } catch {
        // Safari Private Browsing pre-iOS-16 has a localStorage quota of 0.
        // The selection still applies to this session; we just can't persist it.
      }
    }
    runner.setMadhhab(value);
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
    // Safari Private Browsing pre-iOS-16 has a sessionStorage quota of 0, so
    // setItem throws QuotaExceededError. Without the catch, the user would
    // land on /result's empty state with no explanation.
    if (typeof sessionStorage !== "undefined") {
      const c = runner.buildCase();
      try {
        sessionStorage.setItem(
          "fairshare:case",
          JSON.stringify({
            subjectGender: c.subjectGender,
            heirs: c.heirs,
            madhhab: c.madhhab,
          }),
        );
      } catch {
        toast.show(
          "Couldn't save your inputs. Your browser may have storage disabled (e.g. private browsing).",
          "error",
          6000,
        );
        return;
      }
    }
    goto("/result");
  }
</script>

<svelte:head>
  <title>Calculate Islamic Inheritance Shares · FairShare</title>
  <meta name="description" content={t("calculate.metaDescription")} />
  <link rel="canonical" href="https://fairshare.guigalabs.com/calculate/" />
  {@html serialiseJsonLd(calculatorHowTo)}
</svelte:head>

<section class="container">
  <header class="head">
    <p class="kicker" aria-live="polite">
      {t("calculate.kicker", { progress: Math.min(progress, 99) })}
    </p>
    <h1>{t("calculate.title")}</h1>
    <div
      class="progress"
      role="progressbar"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow={progress}
      aria-label={t("calculate.progressAriaLabel")}
    >
      <div class="progress-bar" style="--p: {progress}%"></div>
    </div>
    <div class="madhhab-row">
      <span class="madhhab-label" id="madhhab-label">{t("calculate.school")}</span>
      <div class="madhhab-pills" role="group" aria-labelledby="madhhab-label">
        {#each MADHHABS as m (m)}
          <button
            type="button"
            class="madhhab-pill"
            class:madhhab-pill--active={madhhab === m}
            aria-pressed={madhhab === m}
            onclick={() => changeMadhhab(m)}
          >
            {t(`madhhab.${m}.name`)}
          </button>
        {/each}
      </div>
    </div>
  </header>

  {#if heirs.length > 0}
    <div class="summary" aria-label={t("calculate.heirsAriaLabel")}>
      {#each heirs as e (e.type)}
        <span class="chip">{labelFor(e.type, e.count)}</span>
      {/each}
    </div>
  {/if}

  {#key step}
    <div class="step" in:fly={stepEnter}>
      <Card>
        {#snippet children()}
          <h2 class="prompt">{copy.prompt}</h2>
          {#if copy.help}
            <p class="help">{copy.help}</p>
          {/if}

          {#if shape === "bool"}
            <div class="bool-actions">
              <Button onclick={answerYes} fullWidth>
                {copy.trueLabel ?? t("calculate.yes")}
              </Button>
              <Button variant="secondary" onclick={answerNo} fullWidth>
                {copy.falseLabel ?? t("calculate.no")}
              </Button>
            </div>
          {:else if shape === "int"}
            <div class="int-input">
              <Counter
                bind:value={counterValue}
                min={0}
                max={copy.countMax ?? 20}
                label={copy.countLabel ?? t("calculate.count")}
                description={copy.countDescription}
              />
              <Button onclick={submitCount} fullWidth>{t("calculate.continue")}</Button>
            </div>
          {:else if shape === "gender"}
            <div class="bool-actions">
              <Button onclick={() => pickGender(0)} fullWidth>{t("calculate.male")}</Button>
              <Button variant="secondary" onclick={() => pickGender(1)} fullWidth>
                {t("calculate.female")}
              </Button>
            </div>
          {:else}
            <Banner tone="scholar">
              {#snippet children()}
                {t("calculate.done")}
              {/snippet}
            </Banner>
            <div class="done-actions">
              <Button onclick={calculate} size="lg" fullWidth>{t("calculate.seeResult")}</Button>
              <Button onclick={startOver} variant="ghost" fullWidth>
                <RotateCcw size={16} aria-hidden="true" />
                {t("calculate.startOver")}
              </Button>
            </div>
          {/if}
        {/snippet}
      </Card>

      <div class="nav">
        <Button variant="ghost" onclick={() => runner.back()} disabled={!runner.canGoBack}>
          <ChevronLeft size={16} aria-hidden="true" />
          {t("calculate.back")}
        </Button>
        {#if shape === "bool" || shape === "gender"}
          <span class="nav-hint">{t("calculate.hint.bool")}</span>
        {:else if shape === "int"}
          <span class="nav-hint">{t("calculate.hint.int")}</span>
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
    line-height: 1.15;
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
    padding: 0.4375rem 0.6875rem;
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
    color: var(--color-bg);
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
