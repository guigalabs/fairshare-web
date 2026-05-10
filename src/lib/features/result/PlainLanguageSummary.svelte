<script lang="ts">
  import { slide } from "svelte/transition";
  import ChevronDown from "@lucide/svelte/icons/chevron-down";
  import Quote from "@lucide/svelte/icons/quote";
  import Info from "@lucide/svelte/icons/info";
  import type { CalculationResult, Gender } from "$engine";
  import { generatePlainLanguage, specialRuleNote } from "./plainLanguage";

  interface Props {
    result: CalculationResult;
    subjectGender?: Gender;
  }

  let { result, subjectGender }: Props = $props();

  let expanded = $state(true);
  const sentences = $derived(generatePlainLanguage(result, subjectGender));
  const note = $derived(specialRuleNote(result));

  // Svelte transitions are JS-driven and bypass the global CSS reduced-motion
  // override. Honor the user's preference here — same factory pattern Pass 15
  // (homepage hero), Pass 21 (calculate step), and Pass 36 (toasts) used.
  const reducedMotion =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const bodySlide = reducedMotion ? { duration: 0 } : { duration: 200 };

  // Bold percentages and fractions inside a sentence — keeps the math
  // visually anchored without overloading the prose around it.
  function highlight(text: string): string {
    return text
      .replace(/(\d+\.?\d*%)/g, "<strong>$1</strong>")
      .replace(/(\d+\/\d+)/g, "<em>$1</em>");
  }
</script>

<section class="plain-language" aria-labelledby="plain-language-title">
  <button
    class="header"
    type="button"
    aria-expanded={expanded}
    aria-controls="plain-language-body"
    onclick={() => (expanded = !expanded)}
  >
    <Quote size={14} aria-hidden="true" />
    <span id="plain-language-title">In plain words</span>
    <span class="chevron" class:open={expanded} aria-hidden="true">
      <ChevronDown size={14} />
    </span>
  </button>

  {#if expanded}
    <div id="plain-language-body" class="body" transition:slide={bodySlide}>
      <ul>
        {#each sentences as s (s.id)}
          <li>
            <span class="dot" style:background={s.color} aria-hidden="true"></span>
            <span class="text">{@html highlight(s.text)}</span>
          </li>
        {/each}
      </ul>

      {#if note}
        <div class="note">
          <Info size={12} aria-hidden="true" />
          <span>{note}</span>
        </div>
      {/if}
    </div>
  {/if}
</section>

<style>
  .plain-language {
    border: 1px solid var(--color-border);
    border-radius: 14px;
    background: var(--color-surface);
    overflow: hidden;
  }

  .header {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.875rem 1rem;
    background: transparent;
    border: 0;
    cursor: pointer;
    color: var(--color-accent);
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    text-align: start;
  }
  .header:hover {
    background: color-mix(in srgb, var(--color-accent) 4%, transparent);
  }
  .chevron {
    margin-inline-start: auto;
    color: var(--color-text-muted);
    transition: transform 160ms ease;
  }
  .chevron.open {
    transform: rotate(180deg);
  }

  .body {
    padding: 0.25rem 1rem 1rem;
  }

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
  }

  li {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    color: var(--color-text);
    font-size: 0.875rem;
    line-height: 1.5;
  }

  .dot {
    flex-shrink: 0;
    width: 7px;
    height: 7px;
    border-radius: 999px;
    margin-top: 0.5rem;
  }

  .text :global(strong) {
    font-weight: 700;
  }
  .text :global(em) {
    font-style: normal;
    font-weight: 600;
    color: var(--color-text-secondary);
  }

  .note {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    margin-top: 0.875rem;
    padding: 0.625rem 0.75rem;
    background: color-mix(in srgb, #d97706 8%, transparent);
    border-radius: 10px;
    color: var(--color-text-secondary);
    font-size: 0.8125rem;
    line-height: 1.45;
  }
  .note :global(svg) {
    color: #d97706;
    margin-top: 0.1875rem;
    flex-shrink: 0;
  }
</style>
