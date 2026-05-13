<script lang="ts">
  import Sparkles from "@lucide/svelte/icons/sparkles";
  import Users from "@lucide/svelte/icons/users";
  import ChevronDown from "@lucide/svelte/icons/chevron-down";
  import { SCENARIOS, heirCountOf, representativeHeirTypesOf, type Scenario } from "./scenarios";
  import { iconFor } from "$lib/features/result/heirHelpers";
  import { encodeCase } from "$lib/share";
  import { inheritanceCase } from "$engine";
  import { t } from "$lib/i18n/index.svelte";
  import { loc } from "$lib/i18n/url";

  // Mirrors HeirHelpers categories — kept inline so we can include the green
  // "accent" tint that doesn't map to any heir category.
  const TINTS: Record<NonNullable<Scenario["tintCategory"]>, string> = {
    spouse: "#D95971",
    parents: "#C79438",
    grandparents: "#AE8551",
    children: "#388F9E",
    siblings: "#7A61B8",
    extended: "#738CA6",
    accent: "var(--color-accent)",
  };

  function urlFor(id: string): string {
    const s = SCENARIOS.find((x) => x.id === id)!;
    const c = inheritanceCase(s.subjectGender, s.heirs, s.madhhab);
    return `${loc("/result")}?case=${encodeCase(c)}`;
  }

  let open = $state(false);
  let trigger = $state<HTMLButtonElement | undefined>(undefined);
  let menu = $state<HTMLDivElement | undefined>(undefined);

  function toggle() {
    open = !open;
  }

  function onDocClick(e: MouseEvent) {
    const target = e.target as Node;
    if (trigger?.contains(target) || menu?.contains(target)) return;
    open = false;
  }

  function onKey(e: KeyboardEvent) {
    if (e.key === "Escape") {
      open = false;
      trigger?.focus();
    }
  }

  $effect(() => {
    if (!open) return;
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  });
</script>

<section class="quick-scenarios" aria-labelledby="quick-scenarios-title">
  <div class="header">
    <Sparkles size={14} aria-hidden="true" />
    <h2 id="quick-scenarios-title">{t("scenarios.title")}</h2>
  </div>

  <div class="wrap">
    <button
      bind:this={trigger}
      type="button"
      class="trigger"
      class:open
      aria-haspopup="menu"
      aria-expanded={open}
      onclick={toggle}
    >
      <span>{t("scenarios.pick")}</span>
      <ChevronDown size={16} aria-hidden="true" />
    </button>

    {#if open}
      <div bind:this={menu} class="menu" role="menu">
        {#each SCENARIOS as s (s.id)}
          {@const tint = TINTS[s.tintCategory]}
          {@const reps = representativeHeirTypesOf(s)}
          {@const count = heirCountOf(s)}
          <a class="item" role="menuitem" href={urlFor(s.id)} style:--tint={tint}>
            <div class="icons" aria-hidden="true">
              {#each reps as type, i (i)}
                {@const Icon = iconFor(type)}
                <span class="icon-bubble">
                  <Icon size={12} />
                </span>
              {/each}
              {#if count > reps.length}
                <span class="icon-bubble more">+{count - reps.length}</span>
              {/if}
            </div>

            <div class="text">
              <span class="name">{t(s.nameKey)}</span>
              <span class="desc">{t(s.descKey)}</span>
            </div>

            <span class="pill">
              <Users size={11} aria-hidden="true" />
              {count}
              {t(count === 1 ? "scenarios.heir" : "scenarios.heirs")}
            </span>
          </a>
        {/each}
      </div>
    {/if}
  </div>
</section>

<style>
  .quick-scenarios {
    max-width: 1100px;
    margin: 0 auto;
    padding: 1.5rem 1rem 0.5rem;
  }

  .header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--color-accent);
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding-inline: 0.25rem;
  }
  .header h2 {
    font: inherit;
    margin: 0;
  }

  .wrap {
    position: relative;
    margin-top: 0.875rem;
    max-width: 28rem;
  }

  .trigger {
    width: 100%;
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: var(--color-bg-elevated);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    color: var(--color-text);
    font-size: 0.9375rem;
    font-weight: 500;
    cursor: pointer;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
    transition:
      border-color 120ms ease,
      box-shadow 120ms ease;
  }
  .trigger:hover {
    border-color: var(--color-border-strong);
  }
  .trigger:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }
  .trigger :global(svg:last-child) {
    transition: transform 160ms ease;
    color: var(--color-text-muted);
  }
  .trigger.open :global(svg:last-child) {
    transform: rotate(180deg);
  }

  .menu {
    position: absolute;
    top: calc(100% + 0.375rem);
    inset-inline-start: 0;
    inset-inline-end: 0;
    z-index: 20;
    display: flex;
    flex-direction: column;
    padding: 0.375rem;
    background: var(--color-bg-elevated);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
    max-height: min(70vh, 26rem);
    overflow-y: auto;
  }

  .item {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 0.75rem;
    padding: 0.625rem 0.75rem;
    border-radius: 8px;
    text-decoration: none;
    color: var(--color-text);
  }
  .item:hover,
  .item:focus-visible {
    background: color-mix(in srgb, var(--tint) 7%, transparent);
    outline: none;
  }

  .icons {
    display: flex;
    align-items: center;
  }
  .icon-bubble {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 999px;
    background: color-mix(in srgb, var(--tint) 12%, transparent);
    color: var(--tint);
    border: 1.5px solid var(--color-bg-elevated);
    margin-inline-start: -6px;
    font-size: 0.6875rem;
    font-weight: 700;
  }
  .icon-bubble:first-child {
    margin-inline-start: 0;
  }
  .icon-bubble.more {
    background: color-mix(in srgb, var(--tint) 14%, transparent);
    color: var(--color-text);
  }

  .text {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }
  .name {
    font-size: 0.875rem;
    font-weight: 600;
    line-height: 1.2;
  }
  .desc {
    font-size: 0.75rem;
    line-height: 1.35;
    color: var(--color-text-muted);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .pill {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.1875rem 0.5rem;
    background: color-mix(in srgb, var(--tint) 12%, transparent);
    color: var(--color-text);
    font-size: 0.6875rem;
    font-weight: 600;
    border-radius: 999px;
    flex-shrink: 0;
  }
  .pill :global(svg) {
    color: var(--tint);
  }
</style>
