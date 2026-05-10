<script lang="ts">
  import type { CalculationResult, Gender } from "$engine";
  import HeirNode from "./HeirNode.svelte";
  import { buildAncestorTiers, buildDescendantTiers, type HeirTier } from "./tiers";
  import { colorFor } from "./heirHelpers";
  import { labelFor } from "$lib/features/questionnaire/heirLabels";
  import { t } from "$lib/i18n/index.svelte";
  import User from "@lucide/svelte/icons/user";

  let { result, subjectGender }: { result: CalculationResult; subjectGender: Gender } = $props();

  const ancestors = $derived(buildAncestorTiers(result.shares));
  const descendants = $derived(buildDescendantTiers(result.shares));

  function tierTint(tier: HeirTier): string {
    return tier.heirs.length > 0 ? colorFor(tier.heirs[0].heirType) : "#999";
  }
</script>

<div class="tree" role="img" aria-labelledby="tree-title" aria-describedby="tree-desc">
  <span id="tree-title" class="sr-only">{t("result.tree.aria.title")}</span>
  <span id="tree-desc" class="sr-only">
    {result.shares
      .map((s) =>
        t("result.tree.aria.line", {
          type: labelFor(s.heirType, 1),
          fraction: s.fraction.toString(),
          percent: s.percentage.toFixed(1),
        }),
      )
      .join("; ")}
  </span>

  {#each ancestors as tier (tier.category)}
    {@const tint = tierTint(tier)}
    <div class="tier" style="--tint: {tint};">
      <div class="trunk"></div>
      <span class="tier-label">{t(tier.labelKey)}</span>
      <div class="branch">
        {#if tier.heirs.length === 1}
          <div class="single-drop"></div>
        {:else}
          <svg
            class="branch-svg"
            viewBox="0 0 100 18"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <line x1="50" y1="0" x2="50" y2="9" />
            <line x1="6" y1="9" x2="94" y2="9" />
          </svg>
          <div class="drops">
            {#each tier.heirs as h (h.heirType)}
              <span class="drop" style="--tint: {colorFor(h.heirType)};"></span>
            {/each}
          </div>
        {/if}
        <div class="nodes">
          {#each tier.heirs as share (share.heirType)}
            <HeirNode {share} />
          {/each}
        </div>
      </div>
    </div>
  {/each}

  {#if ancestors.length > 0}
    <div class="trunk"></div>
  {/if}

  <div
    class="subject"
    aria-label={subjectGender === "male"
      ? t("result.tree.aria.subjectMale")
      : t("result.tree.aria.subjectFemale")}
  >
    <div class="subject-glow"></div>
    <div class="subject-ring"></div>
    <div class="subject-fill">
      <User size={20} color="var(--color-accent)" aria-hidden="true" />
    </div>
    <p class="subject-label">{t("result.tree.deceased")}</p>
  </div>

  {#each descendants as tier (tier.category)}
    {@const tint = tierTint(tier)}
    <div class="tier" style="--tint: {tint};">
      <div class="trunk"></div>
      <span class="tier-label">{t(tier.labelKey)}</span>
      <div class="branch">
        {#if tier.heirs.length === 1}
          <div class="single-drop"></div>
        {:else}
          <svg
            class="branch-svg"
            viewBox="0 0 100 18"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <line x1="50" y1="0" x2="50" y2="9" />
            <line x1="6" y1="9" x2="94" y2="9" />
          </svg>
          <div class="drops">
            {#each tier.heirs as h (h.heirType)}
              <span class="drop" style="--tint: {colorFor(h.heirType)};"></span>
            {/each}
          </div>
        {/if}
        <div class="nodes">
          {#each tier.heirs as share (share.heirType)}
            <HeirNode {share} />
          {/each}
        </div>
      </div>
    </div>
  {/each}
</div>

<style>
  .tree {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding: 1.5rem 0.5rem;
    --connector: color-mix(in srgb, var(--color-accent) 25%, transparent);
  }
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
  .trunk {
    width: 1.5px;
    height: 20px;
    background: var(--connector);
  }
  .tier {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }
  .tier-label {
    margin: 0 0 0.5rem;
    font-size: 0.625rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: color-mix(in srgb, var(--tint) 85%, transparent);
    background: color-mix(in srgb, var(--tint) 8%, transparent);
    border: 0.75px solid color-mix(in srgb, var(--tint) 15%, transparent);
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-family: ui-rounded, system-ui, sans-serif;
  }
  .branch {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }
  .single-drop {
    width: 1.5px;
    height: 24px;
    background: var(--connector);
  }
  .branch-svg {
    width: 100%;
    max-width: 28rem;
    height: 14px;
  }
  .branch-svg line {
    stroke: var(--connector);
    stroke-width: 1.5;
    stroke-linecap: round;
  }
  .drops {
    display: flex;
    justify-content: space-around;
    width: 100%;
    max-width: 28rem;
    margin-top: -2px;
  }
  .drop {
    width: 1.5px;
    height: 6px;
    background: var(--connector);
  }
  .nodes {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    gap: 1rem;
    flex-wrap: wrap;
    margin-top: 0.5rem;
    padding: 0 0.5rem;
  }

  /* Subject (deceased) */
  .subject {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    position: relative;
    padding: 0.75rem;
  }
  .subject-glow {
    position: absolute;
    inset: -0.5rem;
    width: 5rem;
    height: 5rem;
    inset-inline-start: 50%;
    margin-inline-start: -2.5rem;
    border-radius: 9999px;
    background: radial-gradient(
      circle,
      color-mix(in srgb, var(--color-accent) 10%, transparent),
      color-mix(in srgb, var(--color-accent) 3%, transparent) 50%,
      transparent 70%
    );
    pointer-events: none;
    z-index: 0;
  }
  .subject-ring {
    width: 46px;
    height: 46px;
    border-radius: 9999px;
    border: 1.5px solid color-mix(in srgb, var(--color-accent) 25%, transparent);
    position: absolute;
    top: calc(0.75rem + 4px);
    pointer-events: none;
    z-index: 1;
  }
  .subject-fill {
    width: 40px;
    height: 40px;
    border-radius: 9999px;
    background: linear-gradient(
      135deg,
      color-mix(in srgb, var(--color-accent) 14%, transparent),
      color-mix(in srgb, var(--color-accent) 6%, transparent)
    );
    border: 1.5px solid color-mix(in srgb, var(--color-accent) 18%, transparent);
    margin: 7px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
    position: relative;
  }
  .subject-label {
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--color-text);
    font-family: ui-rounded, system-ui, sans-serif;
    z-index: 2;
    position: relative;
  }
</style>
