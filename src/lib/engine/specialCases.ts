import type { HeirEntry, HeirType, InheritanceCase, Madhhab } from "./types";
import { Fraction } from "./fraction";
import { makeShare, type HeirShare, type SpecialCase } from "./result";

// 1:1 port of Engine/SpecialCases.swift.
// Three cases: Umariatan, Musharkah (Shafi'i + Maliki only), and Grandfather
// with Siblings (non-Hanafi only).

function has(t: HeirType, present: ReadonlySet<HeirType>): boolean {
  return present.has(t);
}

function hasAny(types: HeirType[], present: ReadonlySet<HeirType>): boolean {
  return types.some((t) => present.has(t));
}

function countOf(t: HeirType, heirs: readonly HeirEntry[]): number {
  return heirs.reduce((acc, e) => acc + (e.type === t ? e.count : 0), 0);
}

const SIBLING_TYPES: HeirType[] = [
  "fullBrother",
  "fullSister",
  "paternalHalfBrother",
  "paternalHalfSister",
  "maternalHalfBrother",
  "maternalHalfSister",
];

function maxFraction(a: Fraction, b: Fraction): Fraction {
  return a.gt(b) ? a : b;
}

function checkUmariatan(
  shares: HeirShare[],
  activeHeirs: readonly HeirEntry[],
  present: ReadonlySet<HeirType>,
): { result: SpecialCase; shares: HeirShare[] } | null {
  if (!has("mother", present) || !has("father", present)) return null;
  const hasHusband = has("husband", present);
  const hasWife = has("wife", present);
  if (!hasHusband && !hasWife) return null;

  if (hasAny(["son", "daughter", "sonsSon", "sonsDaughter"], present)) return null;

  const sibCount = activeHeirs
    .filter((e) => SIBLING_TYPES.includes(e.type))
    .reduce((acc, e) => acc + e.count, 0);
  if (sibCount >= 2) return null;

  const otherHeirs = activeHeirs.filter(
    (e) =>
      e.type !== "mother" &&
      e.type !== "father" &&
      e.type !== "husband" &&
      e.type !== "wife",
  );
  if (otherHeirs.length > 0) return null;

  const out: HeirShare[] = hasHusband
    ? [
        makeShare("husband", 1, Fraction.ONE_HALF),
        makeShare("mother", 1, Fraction.ONE_SIXTH),
        makeShare("father", 1, Fraction.ONE_THIRD),
      ]
    : [
        makeShare("wife", 1, Fraction.ONE_FOURTH),
        makeShare("mother", 1, Fraction.ONE_FOURTH),
        makeShare("father", 1, Fraction.ONE_HALF),
      ];

  shares.length = 0;
  shares.push(...out);
  return { result: "umariatan", shares };
}

function checkMusharkah(
  shares: HeirShare[],
  activeHeirs: readonly HeirEntry[],
  present: ReadonlySet<HeirType>,
  madhhab: Madhhab,
): { result: SpecialCase; shares: HeirShare[] } | null {
  if (madhhab !== "shafii" && madhhab !== "maliki") return null;
  if (!has("husband", present)) return null;
  if (
    !has("mother", present) &&
    !has("paternalGrandmother", present) &&
    !has("maternalGrandmother", present)
  )
    return null;

  const maternalCount =
    countOf("maternalHalfBrother", activeHeirs) + countOf("maternalHalfSister", activeHeirs);
  if (maternalCount < 2) return null;

  const hasFullSiblings = has("fullBrother", present) || has("fullSister", present);
  if (!hasFullSiblings) return null;

  const totalFixed = shares.reduce<Fraction>((acc, s) => acc.add(s.fraction), Fraction.ZERO);
  if (totalFixed.lt(Fraction.ONE)) return null;

  const fullBrotherCount = countOf("fullBrother", activeHeirs);
  const fullSisterCount = countOf("fullSister", activeHeirs);
  const totalSharers = maternalCount + fullBrotherCount + fullSisterCount;

  const sharedPortion = Fraction.ONE_THIRD;

  // Remove existing maternal sibling shares + full sibling shares
  let next = shares.filter(
    (s) =>
      s.heirType !== "maternalHalfBrother" &&
      s.heirType !== "maternalHalfSister" &&
      s.heirType !== "fullBrother" &&
      s.heirType !== "fullSister",
  );

  const mhb = countOf("maternalHalfBrother", activeHeirs);
  if (mhb > 0) {
    const f = sharedPortion.multiply(new Fraction(mhb, totalSharers));
    next.push(makeShare("maternalHalfBrother", mhb, f));
  }
  const mhs = countOf("maternalHalfSister", activeHeirs);
  if (mhs > 0) {
    const f = sharedPortion.multiply(new Fraction(mhs, totalSharers));
    next.push(makeShare("maternalHalfSister", mhs, f));
  }
  if (fullBrotherCount > 0) {
    const f = sharedPortion.multiply(new Fraction(fullBrotherCount, totalSharers));
    next.push(makeShare("fullBrother", fullBrotherCount, f));
  }
  if (fullSisterCount > 0) {
    const f = sharedPortion.multiply(new Fraction(fullSisterCount, totalSharers));
    next.push(makeShare("fullSister", fullSisterCount, f));
  }

  shares.length = 0;
  shares.push(...next);
  return { result: "musharkah", shares };
}

function checkGrandfatherWithSiblings(
  shares: HeirShare[],
  activeHeirs: readonly HeirEntry[],
  present: ReadonlySet<HeirType>,
  madhhab: Madhhab,
): { result: SpecialCase; shares: HeirShare[] } | null {
  if (madhhab === "hanafi") return null;
  if (!has("paternalGrandfather", present) || has("father", present)) return null;
  const hasSiblings = hasAny(
    ["fullBrother", "fullSister", "paternalHalfBrother", "paternalHalfSister"],
    present,
  );
  if (!hasSiblings) return null;

  const otherFixedShares = shares.filter(
    (s) =>
      s.heirType !== "paternalGrandfather" &&
      s.heirType !== "fullBrother" &&
      s.heirType !== "fullSister" &&
      s.heirType !== "paternalHalfBrother" &&
      s.heirType !== "paternalHalfSister",
  );
  const otherTotal = otherFixedShares.reduce<Fraction>((acc, s) => acc.add(s.fraction), Fraction.ZERO);
  const remainderAfterOthers = Fraction.ONE.subtract(otherTotal);

  const fullBrotherCount = countOf("fullBrother", activeHeirs);
  const fullSisterCount = countOf("fullSister", activeHeirs);
  const patHalfBrotherCount = countOf("paternalHalfBrother", activeHeirs);
  const patHalfSisterCount = countOf("paternalHalfSister", activeHeirs);

  const siblingParts =
    fullBrotherCount * 2 + fullSisterCount + patHalfBrotherCount * 2 + patHalfSisterCount;
  const totalParts = siblingParts + 2;

  const option1 = remainderAfterOthers.multiply(new Fraction(2, totalParts));
  const option2 = remainderAfterOthers.multiply(Fraction.ONE_THIRD);
  const option3 = Fraction.ONE_SIXTH;
  const grandfatherShare = maxFraction(option1, maxFraction(option2, option3));

  let next = shares.filter(
    (s) =>
      s.heirType !== "paternalGrandfather" &&
      s.heirType !== "fullBrother" &&
      s.heirType !== "fullSister" &&
      s.heirType !== "paternalHalfBrother" &&
      s.heirType !== "paternalHalfSister",
  );
  next.push(makeShare("paternalGrandfather", 1, grandfatherShare));

  const siblingRemainder = remainderAfterOthers.subtract(grandfatherShare);
  if (siblingRemainder.gt(Fraction.ZERO) && siblingParts > 0) {
    const perPart = siblingRemainder.divide(new Fraction(siblingParts));
    if (fullBrotherCount > 0) {
      const f = perPart.multiply(new Fraction(fullBrotherCount * 2));
      next.push(makeShare("fullBrother", fullBrotherCount, f));
    }
    if (fullSisterCount > 0) {
      const f = perPart.multiply(new Fraction(fullSisterCount));
      next.push(makeShare("fullSister", fullSisterCount, f));
    }
    if (patHalfBrotherCount > 0) {
      const f = perPart.multiply(new Fraction(patHalfBrotherCount * 2));
      next.push(makeShare("paternalHalfBrother", patHalfBrotherCount, f));
    }
    if (patHalfSisterCount > 0) {
      const f = perPart.multiply(new Fraction(patHalfSisterCount));
      next.push(makeShare("paternalHalfSister", patHalfSisterCount, f));
    }
  }

  shares.length = 0;
  shares.push(...next);
  return { result: "grandFatherWithSiblings", shares };
}

/**
 * Mutates `shares` in place. Returns the special case applied (if any).
 */
export function checkAndApplySpecialCases(
  c: InheritanceCase,
  shares: HeirShare[],
  activeHeirs: readonly HeirEntry[],
  madhhab: Madhhab,
): SpecialCase | undefined {
  const present = new Set(activeHeirs.map((e) => e.type));

  let r = checkUmariatan(shares, activeHeirs, present);
  if (r) return r.result;
  r = checkMusharkah(shares, activeHeirs, present, madhhab);
  if (r) return r.result;
  r = checkGrandfatherWithSiblings(shares, activeHeirs, present, madhhab);
  if (r) return r.result;
  return undefined;
}
