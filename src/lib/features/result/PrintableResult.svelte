<script lang="ts">
  import type { CalculationResult, InheritanceCase } from "$engine";
  import { i18n, t } from "$lib/i18n/index.svelte";
  import { labelFor } from "$lib/features/questionnaire/heirLabels";
  import { generatePlainLanguage } from "./plainLanguage";
  import FamilyTree from "./FamilyTree.svelte";

  let { inputCase, result }: { inputCase: InheritanceCase; result: CalculationResult } = $props();

  const sentences = $derived(generatePlainLanguage(result, inputCase.subjectGender));

  const subject = $derived(
    inputCase.subjectGender === "male" ? t("result.subject.male") : t("result.subject.female"),
  );
  const generated = $derived(new Date().toLocaleString(i18n.current));
</script>

<!--
  Off-screen one-pager rendered for PDF capture. Sized to A4 portrait at 96dpi
  (794×1123). The result page reuses this component as a hidden fixture; the
  PDF builder calls html-to-image on the matching root element and embeds the
  PNG into a single A4 page.
-->
<div
  class="sheet"
  dir={i18n.current === "ar" ? "rtl" : "ltr"}
  lang={i18n.current}
  data-pdf-root="result"
>
  <header class="head">
    <div class="brand">
      <div class="brand-mark"></div>
      <span class="brand-name">FairShare</span>
    </div>
    <div class="head-meta">
      <p class="kicker">{t("result.kicker")}</p>
      <p class="date">{generated}</p>
    </div>
  </header>

  <section class="title">
    <h1>
      {t("result.heirsHeading", {
        gender: subject,
        madhhab: t(`madhhab.${inputCase.madhhab}.name`),
      })}
    </h1>
    <p class="subtitle">
      {inputCase.heirs.length === 1
        ? t("result.heirsCount.one", { count: inputCase.heirs.length })
        : t("result.heirsCount.other", { count: inputCase.heirs.length })}
    </p>
  </section>

  <div class="grid">
    <section class="shares">
      <h2>{t("result.shares")}</h2>
      <table>
        <tbody>
          {#each result.shares as s (s.heirType)}
            <tr>
              <td class="name">{labelFor(s.heirType, s.count)}</td>
              <td class="frac">{s.fraction.toString()}</td>
              <td class="pct">{s.percentage.toFixed(2)}%</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </section>

    <section class="tree">
      <h2>{t("result.tree")}</h2>
      <div class="tree-wrap">
        <FamilyTree {result} subjectGender={inputCase.subjectGender} />
      </div>
    </section>
  </div>

  {#if sentences.length > 0}
    <section class="plain">
      <h2>{t("plain.title")}</h2>
      <ul>
        {#each sentences as s (s.id)}
          <li>{s.text}</li>
        {/each}
      </ul>
    </section>
  {/if}

  <footer class="foot">
    <p class="disclaimer">
      <strong>{t("result.educational")}</strong>
      {t("result.educational.rest")}
    </p>
    <p class="url">https://fairshare.guigalabs.com</p>
  </footer>
</div>

<style>
  .sheet {
    /* A4 portrait at 96dpi. */
    width: 794px;
    min-height: 1123px;
    background: #ffffff;
    color: #1a1a1a;
    padding: 56px 64px;
    box-sizing: border-box;
    font-family:
      ui-sans-serif,
      system-ui,
      -apple-system,
      "Segoe UI",
      sans-serif;
    font-size: 13px;
    line-height: 1.5;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    border-bottom: 1px solid #e5e5e5;
    padding-bottom: 18px;
  }
  .brand {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .brand-mark {
    width: 28px;
    height: 28px;
    border-radius: 7px;
    background: linear-gradient(135deg, #0a8754, #388f9e);
  }
  .brand-name {
    font-size: 18px;
    font-weight: 700;
    letter-spacing: -0.01em;
  }
  .head-meta {
    text-align: end;
  }
  .kicker {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #0a8754;
  }
  .date {
    margin-top: 2px;
    color: #666;
    font-size: 11px;
  }

  .title h1 {
    font-size: 24px;
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1.15;
    margin: 0;
  }
  .title .subtitle {
    margin-top: 6px;
    color: #666;
    font-size: 13px;
  }

  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 28px;
    align-items: start;
  }

  h2 {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #0a8754;
    margin: 0 0 10px 0;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-variant-numeric: tabular-nums;
  }
  td {
    padding: 7px 0;
    border-bottom: 1px solid #ececec;
  }
  td.name {
    font-weight: 500;
  }
  td.frac {
    text-align: end;
    color: #444;
    font-weight: 600;
  }
  td.pct {
    text-align: end;
    width: 64px;
    color: #888;
    font-size: 12px;
  }

  .tree-wrap {
    /* Constrain the family-tree component so it fits inside the right column
       without horizontal overflow, and shrink the internal node sizes a touch
       for print density. */
    transform-origin: top center;
    margin-inline: auto;
  }

  .plain ul {
    margin: 0;
    padding-inline-start: 18px;
    list-style: disc;
  }
  .plain li {
    margin-bottom: 6px;
    color: #2a2a2a;
  }

  .foot {
    margin-top: auto;
    padding-top: 16px;
    border-top: 1px solid #e5e5e5;
    color: #666;
    font-size: 11px;
  }
  .disclaimer strong {
    color: #1a1a1a;
  }
  .url {
    margin-top: 4px;
    font-family: ui-monospace, SFMono-Regular, monospace;
    font-size: 10px;
  }
</style>
