<script lang="ts">
  import type { Gender, HeirEntry } from "$engine";
  import { formatCents, perHeirAmount, type Cents } from "$lib/money";
  import { runForAllMadhabs } from "./runForAllMadhabs";
  import { t } from "$lib/i18n/index.svelte";

  let {
    subjectGender,
    heirs,
    net,
    currency,
  }: {
    subjectGender: Gender;
    heirs: HeirEntry[];
    net: Cents;
    currency: string;
  } = $props();

  const results = $derived(runForAllMadhabs({ subjectGender, heirs }));

  /** Union of every heirType that appears in any madhhab's shares, preserving order. */
  const heirTypes = $derived.by(() => {
    const seen = new Set<string>();
    const order: string[] = [];
    for (const r of results) {
      for (const s of r.result.shares) {
        if (!seen.has(s.heirType)) {
          seen.add(s.heirType);
          order.push(s.heirType);
        }
      }
    }
    return order;
  });
</script>

<div class="compare">
  <table>
    <thead>
      <tr>
        <th>Heir</th>
        {#each results as r (r.madhhab)}
          <th>{r.madhhab}</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each heirTypes as type (type)}
        <tr>
          <td class="heir-name">{type}</td>
          {#each results as r (r.madhhab)}
            {@const share = r.result.shares.find((s) => s.heirType === type)}
            <td>
              {#if share}
                <span class="frac"
                  >{share.fraction.numerator.toString()}/{share.fraction.denominator.toString()}</span
                >
                {#if net > 0n}
                  <span class="amt"
                    >{currency} {formatCents(perHeirAmount(net, share.fraction))}</span
                  >
                {/if}
              {:else}
                <span class="blocked" aria-label={t("ui.noShare")}>·</span>
              {/if}
            </td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  .compare {
    overflow-x: auto;
  }
  table {
    width: 100%;
    min-width: 640px;
    border-collapse: collapse;
    font-variant-numeric: tabular-nums;
  }
  th,
  td {
    padding: 0.5rem 0.75rem;
    border-bottom: 1px solid var(--color-border);
    text-align: left;
    vertical-align: top;
  }
  th {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--color-text-muted);
    text-transform: capitalize;
  }
  .heir-name {
    font-weight: 500;
  }
  .frac {
    display: inline-block;
    color: var(--color-text);
  }
  .amt {
    display: block;
    margin-top: 0.125rem;
    font-size: 0.8125rem;
    color: var(--color-text-muted);
  }
  .blocked {
    color: var(--color-text-muted);
  }
</style>
