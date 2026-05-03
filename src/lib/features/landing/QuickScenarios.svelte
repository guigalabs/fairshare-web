<script lang="ts">
  import Sparkles from "@lucide/svelte/icons/sparkles";
  import Users from "@lucide/svelte/icons/users";
  import { SCENARIOS, heirCountOf, representativeHeirTypesOf, type Scenario } from "./scenarios";
  import { iconFor } from "$lib/features/result/heirHelpers";
  import { encodeCase } from "$lib/share";
  import { inheritanceCase } from "$engine";
  import { t } from "$lib/i18n/index.svelte";

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
    return `/result?case=${encodeCase(c)}`;
  }
</script>

<section class="quick-scenarios" aria-labelledby="quick-scenarios-title">
  <div class="header">
    <Sparkles size={14} aria-hidden="true" />
    <h2 id="quick-scenarios-title">{t("scenarios.title")}</h2>
  </div>

  <div class="scroller">
    {#each SCENARIOS as s (s.id)}
      {@const tint = TINTS[s.tintCategory]}
      {@const reps = representativeHeirTypesOf(s)}
      {@const count = heirCountOf(s)}
      <a class="card" href={urlFor(s.id)} style:--tint={tint}>
        <span class="accent" aria-hidden="true"></span>

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
          <span class="name">{s.name}</span>
          <span class="desc">{s.description}</span>
        </div>

        <span class="pill">
          <Users size={11} aria-hidden="true" />
          {count}
          {count === 1 ? "heir" : "heirs"}
        </span>
      </a>
    {/each}
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

  .scroller {
    display: flex;
    gap: 0.875rem;
    overflow-x: auto;
    padding: 0.875rem 0.25rem 1rem;
    scroll-snap-type: x proximity;
    -webkit-overflow-scrolling: touch;
  }
  .scroller::-webkit-scrollbar {
    display: none;
  }
  .scroller {
    scrollbar-width: none;
  }

  .card {
    position: relative;
    flex: 0 0 170px;
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
    padding: 0.875rem;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 14px;
    text-decoration: none;
    color: var(--color-text);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
    transition:
      transform 120ms ease,
      box-shadow 120ms ease,
      border-color 120ms ease;
    scroll-snap-align: start;
  }
  .card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
    border-color: color-mix(in srgb, var(--tint) 30%, var(--color-border));
  }
  .card:focus-visible {
    outline: 2px solid var(--tint);
    outline-offset: 2px;
  }

  .accent {
    position: absolute;
    top: 0;
    inset-inline: 0;
    height: 2.5px;
    border-radius: 14px 14px 0 0;
    background: linear-gradient(
      to right,
      color-mix(in srgb, var(--tint) 60%, transparent),
      color-mix(in srgb, var(--tint) 15%, transparent)
    );
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
    border: 1.5px solid var(--color-surface);
    margin-inline-start: -6px;
    font-size: 0.6875rem;
    font-weight: 700;
  }
  .icon-bubble:first-child {
    margin-inline-start: 0;
  }
  .icon-bubble.more {
    background: color-mix(in srgb, var(--tint) 8%, transparent);
  }

  .text {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-height: 40px;
  }
  .name {
    font-size: 0.875rem;
    font-weight: 600;
    line-height: 1.2;
    color: var(--color-text);
  }
  .desc {
    font-size: 0.6875rem;
    line-height: 1.35;
    color: var(--color-text-muted);
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .pill {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    align-self: flex-start;
    padding: 0.1875rem 0.5rem;
    background: color-mix(in srgb, var(--tint) 8%, transparent);
    color: var(--tint);
    font-size: 0.6875rem;
    font-weight: 600;
    border-radius: 999px;
  }
</style>
