// 1:1 port of FairShare iOS PlainLanguageGenerator (PlainLanguageSummaryView.swift).
// Produces natural-language sentences that explain a CalculationResult to a
// non-scholar reader, including the reason each heir's share is what it is.

import type { CalculationResult, Gender, HeirShare, HeirType } from "$engine";
import { labelFor } from "$lib/features/questionnaire/heirLabels";
import { colorFor } from "./heirHelpers";

export interface SummarySentence {
  id: string;
  text: string;
  color: string;
}

const KNOWN_FRACTIONS: Array<[number, string]> = [
  [50, "1/2"],
  [25, "1/4"],
  [12.5, "1/8"],
  [66.67, "2/3"],
  [33.33, "1/3"],
  [16.67, "1/6"],
];

function formatPercentage(numerator: bigint, denominator: bigint): string {
  const pct = (Number(numerator) / Number(denominator)) * 100;
  return Number.isInteger(pct) ? `${pct.toFixed(0)}%` : `${pct.toFixed(1)}%`;
}

function fractionString(numerator: bigint, denominator: bigint): string {
  const pct = (Number(numerator) / Number(denominator)) * 100;
  for (const [target, frac] of KNOWN_FRACTIONS) {
    if (Math.abs(pct - target) < 0.5) return frac;
  }
  return `${numerator}/${denominator}`;
}

const CHILD_TYPES: ReadonlySet<HeirType> = new Set(["son", "daughter", "sonsSon", "sonsDaughter"]);
const DIRECT_CHILD_TYPES: ReadonlySet<HeirType> = new Set(["son", "daughter"]);

function reasonFor(share: HeirShare, all: readonly HeirShare[]): string {
  const hasChildren = all.some((s) => CHILD_TYPES.has(s.heirType));
  const hasDirectChildren = all.some((s) => DIRECT_CHILD_TYPES.has(s.heirType));

  switch (share.heirType) {
    case "wife":
    case "husband":
      return hasChildren
        ? "fixed share when there are children"
        : "fixed share with no children present";
    case "son":
      return "residuary heir, takes what remains";
    case "daughter": {
      const hasSon = all.some((s) => s.heirType === "son");
      return hasSon
        ? "shares the remainder with brothers at 2:1 ratio"
        : "fixed share as sole female descendant";
    }
    case "father":
      return hasDirectChildren
        ? "fixed share when children are present"
        : "residuary heir when no children present";
    case "mother":
      return hasDirectChildren
        ? "fixed share when children are present"
        : "fixed share with no children or siblings";
    default:
      return "as prescribed by Islamic law";
  }
}

export function generatePlainLanguage(
  result: CalculationResult,
  _subjectGender?: Gender,
): SummarySentence[] {
  const sentences: SummarySentence[] = [];

  const sorted = [...result.shares].sort((a, b) => {
    const ap = Number(a.fraction.numerator) / Number(a.fraction.denominator);
    const bp = Number(b.fraction.numerator) / Number(b.fraction.denominator);
    return bp - ap;
  });

  for (const share of sorted) {
    const name = labelFor(share.heirType, 1);
    const pct = formatPercentage(share.fraction.numerator, share.fraction.denominator);
    const frac = fractionString(share.fraction.numerator, share.fraction.denominator);
    const reason = reasonFor(share, result.shares);

    const text =
      share.count > 1
        ? `The ${share.count} ${name.toLowerCase()}s share ${pct} (${frac}); ${reason}.`
        : `The ${name} receives ${pct} (${frac}); ${reason}.`;

    sentences.push({
      id: share.heirType,
      text,
      color: colorFor(share.heirType),
    });
  }

  for (const blocked of result.blockedHeirs) {
    const name = labelFor(blocked.heirType, 1);
    const blockerName = labelFor(blocked.blockedBy, 1);
    sentences.push({
      id: `blocked_${blocked.heirType}`,
      text: `The ${name} receives nothing, blocked by the ${blockerName}.`,
      color: "var(--color-text-muted)",
    });
  }

  return sentences;
}

export function specialRuleNote(result: CalculationResult): string | null {
  if (result.appliedAwl) {
    return "Shares were proportionally reduced (Awl) because the total exceeded the estate.";
  }
  if (result.appliedRadd) {
    return "Leftover estate was redistributed (Radd) among eligible heirs.";
  }
  return null;
}
