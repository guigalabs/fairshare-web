<script lang="ts">
  import { calculate, inheritanceCase, type HeirType } from "$engine";
  import { SCENARIOS } from "./scenarios";
  import { colorFor, categoryFor } from "$lib/features/result/heirHelpers";
  import { encodeCase } from "$lib/share";
  import { t } from "$lib/i18n/index.svelte";
  import { loc } from "$lib/i18n/url";

  // Four families that each show something different: plain residue,
  // parents alongside children, the 'Umariyyatan ruling, and 'awl.
  const IDS = ["spouse_children", "nuclear_family", "parents_only", "daughters_only"];
  const examples = IDS.map((id) => SCENARIOS.find((s) => s.id === id)!);

  // Verse that names each heir's share (or residue, for sons and father).
  const VERSE: Partial<Record<HeirType, string>> = {
    husband: "4:12",
    wife: "4:12",
    son: "4:11",
    daughter: "4:11",
    father: "4:11",
    mother: "4:11",
    fullSister: "4:176",
    fullBrother: "4:176",
    maternalHalfBrother: "4:12",
    maternalHalfSister: "4:12",
  };

  let active = $state(0);

  const scenario = $derived(examples[active]);
  const kase = $derived(inheritanceCase(scenario.subjectGender, scenario.heirs, scenario.madhhab));
  const result = $derived(calculate(kase));
  const href = $derived(`${loc("/result")}?case=${encodeCase(kase)}`);

  // Two heirs from the same category (son + daughter) would share a color in
  // the bar, so lighten every repeat.
  const rows = $derived.by(() => {
    const seen = new Map<string, number>();
    return result.shares.map((s) => {
      const cat = categoryFor(s.heirType);
      const n = seen.get(cat) ?? 0;
      seen.set(cat, n + 1);
      const base = colorFor(s.heirType);
      return {
        share: s,
        color: n === 0 ? base : `color-mix(in srgb, ${base} 55%, white)`,
      };
    });
  });

  const noteKey = $derived(
    result.appliedAwl
      ? "home.ledger.note.awl"
      : result.appliedSpecialCase === "umariatan"
        ? "home.ledger.note.umariyyatan"
        : result.appliedRadd
          ? "home.ledger.note.radd"
          : "home.ledger.note.residue",
  );

  function pct(p: number): string {
    return `${Number.isInteger(p) ? p : p.toFixed(1)}%`;
  }

  function onKeydown(e: KeyboardEvent) {
    const rtl = document.documentElement.dir === "rtl";
    const next = rtl ? "ArrowLeft" : "ArrowRight";
    const prev = rtl ? "ArrowRight" : "ArrowLeft";
    if (e.key !== next && e.key !== prev) return;
    e.preventDefault();
    active = (active + (e.key === next ? 1 : examples.length - 1)) % examples.length;
    (e.currentTarget as HTMLElement)
      .querySelectorAll<HTMLButtonElement>("[role=tab]")
      [active]?.focus();
  }
</script>

<figure class="ledger" aria-labelledby="ledger-title">
  <figcaption class="ledger-head">
    <span id="ledger-title" class="ledger-title">{t("home.ledger.title")}</span>
    <div
      class="tabs"
      role="tablist"
      aria-label={t("home.ledger.tabsAria")}
      tabindex="-1"
      onkeydown={onKeydown}
    >
      {#each examples as s, i (s.id)}
        <button
          type="button"
          role="tab"
          id="ledger-tab-{s.id}"
          aria-selected={i === active}
          aria-controls="ledger-panel"
          tabindex={i === active ? 0 : -1}
          class="tab"
          onclick={() => (active = i)}
        >
          {t(s.nameKey)}
        </button>
      {/each}
    </div>
  </figcaption>

  <div id="ledger-panel" role="tabpanel" aria-labelledby="ledger-tab-{scenario.id}">
    <p class="family">{t("home.ledger.leaves", { family: t(scenario.descKey) })}</p>

    <table class="table">
      <thead>
        <tr>
          <th scope="col">{t("home.ledger.col.heir")}</th>
          <th scope="col" class="num">{t("home.ledger.col.share")}</th>
          <th scope="col" class="num">{t("home.ledger.col.percent")}</th>
          <th scope="col" class="num">{t("home.ledger.col.source")}</th>
        </tr>
      </thead>
      <tbody>
        {#each rows as { share, color } (share.heirType)}
          <tr>
            <th scope="row">
              <span class="swatch" style:background={color} aria-hidden="true"></span>
              {t(`heir.${share.heirType}`)}
              {#if share.count > 1}<span class="count">× {share.count}</span>{/if}
            </th>
            <td class="num frac">{share.fraction.numerator}/{share.fraction.denominator}</td>
            <td class="num pct">{pct(share.percentage)}</td>
            <td class="num verse">{VERSE[share.heirType] ?? ""}</td>
          </tr>
        {/each}
      </tbody>
    </table>

    <div class="bar" aria-hidden="true">
      {#each rows as { share, color } (share.heirType)}
        <span class="seg" style:flex-grow={share.percentage} style:background={color}></span>
      {/each}
    </div>

    <p class="note">{t(noteKey)}</p>
    <a class="open" {href}>{t("home.ledger.open")}</a>
  </div>
</figure>

<style>
  .ledger {
    margin: 0;
    background: var(--color-bg);
    border: 1px solid var(--color-border-strong);
    border-radius: var(--radius-lg);
    padding: 1.25rem 1.25rem 1.375rem;
  }
  @media (min-width: 640px) {
    .ledger {
      padding: 1.5rem 1.75rem 1.75rem;
    }
  }
  .ledger-head {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding-bottom: 0.875rem;
    border-bottom: 1px solid var(--color-border);
  }
  .ledger-title {
    font-size: 0.875rem;
    color: var(--color-text-muted);
  }
  .tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem 1rem;
  }
  .tab {
    padding: 0.25rem 0;
    border: 0;
    border-bottom: 2px solid transparent;
    background: none;
    font: inherit;
    font-size: 0.875rem;
    color: var(--color-text-muted);
    white-space: nowrap;
    cursor: pointer;
  }
  .tab:hover {
    color: var(--color-text);
  }
  .tab[aria-selected="true"] {
    color: var(--color-text);
    font-weight: 500;
    border-bottom-color: var(--color-accent);
  }

  .family {
    margin-top: 1.125rem;
    font-family: var(--font-serif);
    font-size: 1.1875rem;
    line-height: 1.35;
  }
  :global(html[dir="rtl"]) .family {
    font-family: var(--font-arabic-display);
  }

  .table {
    width: 100%;
    margin-top: 0.75rem;
    border-collapse: collapse;
    table-layout: fixed;
    font-size: 0.9375rem;
  }
  .table thead th:nth-child(2) {
    width: 4.25rem;
  }
  .table thead th:nth-child(3) {
    width: 5.75rem;
  }
  .table thead th:nth-child(4) {
    width: 3.75rem;
  }
  .table thead th {
    padding: 0.5rem 0;
    font-size: 0.8125rem;
    font-weight: 400;
    color: var(--color-text-muted);
    text-align: start;
    border-bottom: 1px solid var(--color-border);
  }
  .table tbody th,
  .table td {
    padding: 0.625rem 0;
    border-bottom: 1px solid var(--color-border);
    vertical-align: baseline;
  }
  .table tbody th {
    font-weight: 500;
    text-align: start;
  }
  .table .num {
    text-align: end;
    padding-inline-start: 1rem;
    white-space: nowrap;
  }
  .swatch {
    display: inline-block;
    width: 0.625rem;
    height: 0.625rem;
    border-radius: 2px;
    margin-inline-end: 0.5rem;
  }
  .count {
    font-weight: 400;
    color: var(--color-text-muted);
    margin-inline-start: 0.25rem;
  }
  td.frac {
    font-size: 1.375rem;
    line-height: 1;
  }
  .pct {
    font-variant-numeric: tabular-nums;
    color: var(--color-text-secondary);
  }
  .verse {
    font-size: 0.8125rem;
    color: var(--color-text-muted);
    font-variant-numeric: tabular-nums;
  }

  .bar {
    display: flex;
    gap: 2px;
    height: 0.875rem;
    margin-top: 1.25rem;
  }
  .seg {
    flex-basis: 0;
    min-width: 3px;
    transition: flex-grow 0.35s ease;
  }
  .seg:first-child {
    border-start-start-radius: 2px;
    border-end-start-radius: 2px;
  }
  .seg:last-child {
    border-start-end-radius: 2px;
    border-end-end-radius: 2px;
  }

  .note {
    margin-top: 1rem;
    font-size: 0.9375rem;
    line-height: 1.5;
    color: var(--color-text-secondary);
  }
  .open {
    display: inline-block;
    margin-top: 0.875rem;
    font-weight: 500;
    color: var(--color-accent);
  }
  .open:hover {
    color: var(--color-accent-hover);
  }
</style>
