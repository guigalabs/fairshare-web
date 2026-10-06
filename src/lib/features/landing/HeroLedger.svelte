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

<div class="ledger">
  <p class="caption">{t("home.ledger.title")}</p>
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

  <div id="ledger-panel" role="tabpanel" aria-labelledby="ledger-tab-{scenario.id}">
    <figure class="receipt">
      <figcaption class="receipt-head">
        <span class="receipt-title">{t("home.ledger.receipt")}</span>
        <span class="family">{t("home.ledger.leaves", { family: t(scenario.descKey) })}</span>
      </figcaption>

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
              <td class="num share">{share.fraction.numerator}/{share.fraction.denominator}</td>
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
    </figure>
  </div>
</div>

<style>
  .ledger {
    min-width: 0;
  }
  .caption {
    font-family: var(--font-mono);
    font-size: 0.8125rem;
    letter-spacing: 0.04em;
    color: var(--color-text-muted);
  }
  :global(html[dir="rtl"]) .caption {
    font-family: var(--font-arabic);
    letter-spacing: 0;
    font-size: 0.875rem;
  }
  .tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 0.375rem;
    margin: 0.75rem 0 1.5rem;
  }
  .tab {
    padding: 0.375rem 0.5625rem;
    border: 2px solid var(--color-edge);
    background: var(--color-bg);
    font-family: var(--font-sans);
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--color-text);
    white-space: nowrap;
    cursor: pointer;
    transition:
      transform 90ms ease,
      box-shadow 90ms ease;
  }
  .tab:hover {
    transform: translate(-1px, -1px);
    box-shadow: var(--shadow-sm);
  }
  .tab[aria-selected="true"] {
    background: var(--color-accent);
    color: #fff;
    box-shadow: var(--shadow-sm);
  }

  .receipt {
    margin: 0;
    border: 2px solid var(--color-edge);
    border-top: 8px solid var(--color-accent);
    background: var(--color-bg);
    box-shadow: var(--shadow);
    padding: 1.125rem 1.25rem 1.375rem;
    font-family: var(--font-mono);
    font-size: 0.8125rem;
    letter-spacing: 0.02em;
    /* Hangs slightly off true, like it came out of a printer. */
    transform: rotate(0.6deg);
  }
  :global(html[dir="rtl"]) .receipt {
    transform: rotate(-0.6deg);
    font-family: var(--font-arabic);
    letter-spacing: 0;
    font-size: 0.875rem;
  }
  @media (prefers-reduced-motion: no-preference) {
    .receipt {
      transition: transform 160ms ease;
    }
    .receipt:hover {
      transform: rotate(0deg);
    }
  }
  .receipt-head {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding-bottom: 0.75rem;
    border-bottom: 2px solid var(--color-edge);
  }
  .receipt-title {
    font-weight: 500;
    text-transform: uppercase;
    color: var(--color-text);
  }
  .family {
    color: var(--color-text-muted);
  }

  .table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
  }
  .table thead th {
    padding: 0.625rem 0 0.375rem;
    font-size: 0.6875rem;
    font-weight: 400;
    color: var(--color-text-muted);
    text-align: start;
    text-transform: uppercase;
    border-bottom: 1px solid var(--color-border);
  }
  .table thead th:nth-child(2) {
    width: 4rem;
  }
  .table thead th:nth-child(3) {
    width: 5.25rem;
  }
  .table thead th:nth-child(4) {
    width: 3.5rem;
  }
  .table tbody th,
  .table td {
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--color-border);
    vertical-align: baseline;
  }
  .table tbody th {
    font-weight: 500;
    text-align: start;
    color: var(--color-text);
  }
  .table .num {
    text-align: end;
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
  }
  .swatch {
    display: inline-block;
    width: 0.625rem;
    height: 0.625rem;
    margin-inline-end: 0.5rem;
    border: 1px solid var(--color-edge);
  }
  .count {
    font-weight: 400;
    color: var(--color-text-muted);
    margin-inline-start: 0.25rem;
  }
  .share {
    font-weight: 500;
    color: var(--color-text);
  }
  .pct,
  .verse {
    color: var(--color-text-muted);
  }

  .bar {
    display: flex;
    height: 0.875rem;
    margin-top: 1.125rem;
    border: 2px solid var(--color-edge);
  }
  .seg {
    flex-basis: 0;
    min-width: 3px;
    transition: flex-grow 0.35s ease;
  }
  .seg + .seg {
    border-inline-start: 2px solid var(--color-edge);
  }

  .note {
    margin-top: 1rem;
    line-height: 1.6;
    color: var(--color-text-secondary);
  }
  .open {
    display: inline-block;
    margin-top: 0.875rem;
    font-weight: 500;
    color: var(--color-accent);
    text-decoration: underline;
    text-decoration-color: color-mix(in oklab, currentColor 45%, transparent);
  }
  .open:hover {
    text-decoration-color: currentColor;
  }

  @media (max-width: 480px) {
    .receipt {
      padding-inline: 0.875rem;
    }
    .table thead th:nth-child(3) {
      width: 4.25rem;
    }
  }
</style>
