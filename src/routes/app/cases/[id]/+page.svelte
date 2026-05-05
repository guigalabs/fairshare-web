<script lang="ts">
  import { page } from "$app/state";
  import { calculate, type HeirEntry, type Madhhab } from "$engine";
  import CompareMadhabs from "$lib/features/compare/CompareMadhabs.svelte";
  import { downloadBlob } from "$lib/features/pdf/exportPdf";
  import { buildPractitionerPdf } from "$lib/features/pdf/proPdf";
  import { Button } from "$lib/ui";
  import { t } from "$lib/i18n/index.svelte";
  import { bequestsValid, formatCents, netEstate, parseCents, perHeirAmount } from "$lib/money";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();
  const compare = $derived(page.url.searchParams.get("compare") === "1");
  let pdfBusy = $state(false);

  async function downloadPdf() {
    if (pdfBusy) return;
    pdfBusy = true;
    try {
      const branding = data.branding
        ? {
            letterhead: data.branding.letterheadText,
            customDisclaimerEn: data.branding.customDisclaimerEn,
            customDisclaimerAr: data.branding.customDisclaimerAr,
            primaryColor: data.branding.primaryColor,
            signatureBlock: data.branding.signatureBlock,
            // Logo bytes are fetched from R2 via /api/branding/logo (deferred);
            // text-only branding still appears on every PDF.
          }
        : undefined;
      const blob = await buildPractitionerPdf({
        case: {
          deceasedName: c.deceasedName,
          dateOfDeath: c.dateOfDeath,
          placeOfDeath: c.placeOfDeath,
          jurisdiction: c.jurisdiction,
          deceasedIdentifier: c.deceasedIdentifier,
          madhhab: c.madhhab,
          subjectGender: c.subjectGender,
          currency: c.currency,
          grossEstate: grossCents,
          funeralExpenses: funeralCents,
          debts: debtsList,
          bequests: bequestsList,
          specialFlags: (c.specialFlags ?? {}) as Record<string, string>,
          advisoryNotes: c.advisoryNotes,
          heirs: c.heirs as HeirEntry[],
        },
        result,
        net,
        debtsTotal,
        bequestsTotal,
        branding,
      });
      const safe = c.deceasedName.replace(/[^a-z0-9-]+/gi, "-").toLowerCase();
      downloadBlob(blob, `fairshare-${safe || "case"}.pdf`);
    } finally {
      pdfBusy = false;
    }
  }
  const c = $derived(data.case);

  const grossCents = $derived(c.grossEstate ? (parseCents(c.grossEstate) ?? 0n) : 0n);
  const funeralCents = $derived(parseCents(c.funeralExpenses ?? "0") ?? 0n);
  const debtsList = $derived((c.debts ?? []) as Array<{ creditor: string; amount: string }>);
  const bequestsList = $derived(
    (c.bequests ?? []) as Array<{ beneficiary: string; amount: string }>,
  );
  const debtsTotal = $derived(debtsList.reduce((acc, d) => acc + (parseCents(d.amount) ?? 0n), 0n));
  const bequestsTotal = $derived(
    bequestsList.reduce((acc, b) => acc + (parseCents(b.amount) ?? 0n), 0n),
  );
  const net = $derived(
    netEstate({
      gross: grossCents,
      funeral: funeralCents,
      debts: debtsTotal,
      bequests: bequestsTotal,
    }),
  );
  const validBequests = $derived(
    bequestsValid({
      gross: grossCents,
      funeral: funeralCents,
      debts: debtsTotal,
      bequests: bequestsTotal,
    }),
  );

  const result = $derived(
    calculate({
      subjectGender: c.subjectGender as "male" | "female",
      heirs: c.heirs as HeirEntry[],
      madhhab: c.madhhab as Madhhab,
    }),
  );
</script>

<svelte:head>
  <title>{c.deceasedName} · FairShare Pro</title>
</svelte:head>

<section class="head">
  <div>
    <p class="kicker">{c.madhhab}</p>
    <h1>{c.deceasedName}</h1>
    <p class="meta">
      {#if c.dateOfDeath}DOD: {c.dateOfDeath}{/if}
      {#if c.jurisdiction}· {c.jurisdiction}{/if}
    </p>
  </div>
  <div class="actions">
    <Button onclick={downloadPdf} loading={pdfBusy}>{t("app.cases.detail.pdf")}</Button>
    {#if compare}
      <Button href="/app/cases/{c.id}" variant="secondary"
        >{t("app.cases.detail.singleMadhhab")}</Button
      >
    {:else}
      <Button href="/app/cases/{c.id}?compare=1" variant="secondary"
        >{t("app.cases.detail.compare")}</Button
      >
    {/if}
    <Button href="/app/cases" variant="ghost">{t("app.cases.detail.back")}</Button>
  </div>
</section>

{#if grossCents > 0n}
  <div class="card">
    <h2>{t("app.cases.detail.estate")}</h2>
    <dl class="kv">
      <dt>Gross</dt>
      <dd>{c.currency} {formatCents(grossCents)}</dd>
      <dt>Funeral</dt>
      <dd>− {c.currency} {formatCents(funeralCents)}</dd>
      <dt>Debts ({debtsList.length})</dt>
      <dd>− {c.currency} {formatCents(debtsTotal)}</dd>
      <dt>Bequests ({bequestsList.length})</dt>
      <dd class:warn={!validBequests}>
        − {c.currency}
        {formatCents(bequestsTotal)}
        {#if !validBequests}<span class="warn-label"> (exceeds 1/3 cap)</span>{/if}
      </dd>
      <dt class="net">Net</dt>
      <dd class="net">{c.currency} {formatCents(net)}</dd>
    </dl>
  </div>
{/if}

<div class="card">
  <h2>{t("app.cases.detail.shares")}</h2>
  {#if compare}
    <CompareMadhabs
      subjectGender={c.subjectGender as "male" | "female"}
      heirs={c.heirs as HeirEntry[]}
      {net}
      currency={c.currency}
    />
  {:else}
    <table class="shares">
      <thead>
        <tr
          ><th>Heir</th><th>Share</th>{#if net > 0n}<th>Amount</th>{/if}</tr
        >
      </thead>
      <tbody>
        {#each result.shares as s}
          <tr>
            <td>{s.heirType}{s.count > 1 ? ` ×${s.count}` : ""}</td>
            <td>{s.fraction.numerator.toString()}/{s.fraction.denominator.toString()}</td>
            {#if net > 0n}
              <td>{c.currency} {formatCents(perHeirAmount(net, s.fraction))}</td>
            {/if}
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</div>

<style>
  .head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 2rem;
    gap: 1rem;
    flex-wrap: wrap;
  }
  .actions {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
  .kicker {
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--color-accent);
  }
  .head h1 {
    margin-top: 0.25rem;
    font-size: 1.75rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--color-text);
  }
  .meta {
    margin-top: 0.5rem;
    font-size: 0.875rem;
    color: var(--color-text-muted);
  }
  .card {
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: 1.25rem 1.5rem;
    background: var(--color-bg-elevated);
    margin-bottom: 1.5rem;
  }
  .card h2 {
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-text);
    margin-bottom: 0.875rem;
  }
  .kv {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 0.5rem 1.5rem;
    margin: 0;
  }
  .kv dt {
    color: var(--color-text-secondary);
  }
  .kv dd {
    margin: 0;
    color: var(--color-text);
    font-variant-numeric: tabular-nums;
  }
  .kv .net {
    font-weight: 700;
    border-top: 1px solid var(--color-border);
    padding-top: 0.5rem;
    margin-top: 0.5rem;
  }
  .kv .warn {
    color: var(--color-error);
  }
  .warn-label {
    font-size: 0.75rem;
  }
  .shares {
    width: 100%;
    border-collapse: collapse;
    font-variant-numeric: tabular-nums;
  }
  .shares th,
  .shares td {
    text-align: left;
    padding: 0.5rem 0.75rem;
    border-bottom: 1px solid var(--color-border);
  }
  .shares th {
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--color-text-muted);
  }
</style>
