import type { HeirEntry, HeirType, Gender } from "./types";
import { Fraction } from "./fraction";
import { makeShare, type HeirShare } from "./result";

// 1:1 port of Engine/ResidualShares.swift.

function has(t: HeirType, present: ReadonlySet<HeirType>): boolean {
  return present.has(t);
}

function countOf(t: HeirType, heirs: readonly HeirEntry[]): number {
  return heirs.reduce((acc, e) => acc + (e.type === t ? e.count : 0), 0);
}

const RESIDUARY_PRIORITY: HeirType[] = [
  "son",
  "sonsSon",
  "father",
  "paternalGrandfather",
  "fullBrother",
  "paternalHalfBrother",
  "fullBrothersSon",
  "paternalHalfBrothersSon",
  "fullPaternalUncle",
  "paternalHalfUncle",
  "fullPaternalUnclesSon",
  "paternalHalfUnclesSon",
];

const TASIB_PAIRS: Array<[HeirType, HeirType]> = [
  ["son", "daughter"],
  ["sonsSon", "sonsDaughter"],
  ["fullBrother", "fullSister"],
  ["paternalHalfBrother", "paternalHalfSister"],
];

function applyTasibBilGhayr(
  shares: readonly HeirShare[],
  remainder: Fraction,
  activeHeirs: readonly HeirEntry[],
  present: ReadonlySet<HeirType>,
): HeirShare[] | null {
  for (const [male, female] of TASIB_PAIRS) {
    if (!has(male, present) || !has(female, present)) continue;

    const maleCount = countOf(male, activeHeirs);
    const femaleCount = countOf(female, activeHeirs);
    const totalParts = maleCount * 2 + femaleCount;

    const maleShare = remainder.multiply(new Fraction(maleCount * 2, totalParts));
    const femaleShare = remainder.multiply(new Fraction(femaleCount, totalParts));

    const result = shares.filter((s) => s.heirType !== female && s.heirType !== male);
    result.push(makeShare(male, maleCount, maleShare));
    result.push(makeShare(female, femaleCount, femaleShare));
    return result;
  }
  return null;
}

function applyTasibMaAlGhayr(
  shares: HeirShare[],
  fixedShares: readonly HeirShare[],
  activeHeirs: readonly HeirEntry[],
  present: ReadonlySet<HeirType>,
): HeirShare[] | null {
  const hasFemaleDescendant = has("daughter", present) || has("sonsDaughter", present);
  if (!hasFemaleDescendant) return null;

  if (has("fullSister", present)) {
    const count = countOf("fullSister", activeHeirs);
    const otherFixed = fixedShares
      .filter((s) => s.heirType !== "fullSister")
      .reduce<Fraction>((acc, s) => acc.add(s.fraction), Fraction.ZERO);
    const sisterRemainder = Fraction.ONE.subtract(otherFixed);
    const result = shares.filter((s) => s.heirType !== "fullSister");
    if (sisterRemainder.gt(Fraction.ZERO)) {
      result.push(makeShare("fullSister", count, sisterRemainder));
    }
    return result;
  }

  if (has("paternalHalfSister", present)) {
    const count = countOf("paternalHalfSister", activeHeirs);
    const otherFixed = fixedShares
      .filter((s) => s.heirType !== "paternalHalfSister")
      .reduce<Fraction>((acc, s) => acc.add(s.fraction), Fraction.ZERO);
    const sisterRemainder = Fraction.ONE.subtract(otherFixed);
    const result = shares.filter((s) => s.heirType !== "paternalHalfSister");
    if (sisterRemainder.gt(Fraction.ZERO)) {
      result.push(makeShare("paternalHalfSister", count, sisterRemainder));
    }
    return result;
  }

  return null;
}

export function assignResidualShares(
  fixedShares: readonly HeirShare[],
  activeHeirs: readonly HeirEntry[],
  _subjectGender: Gender,
): HeirShare[] {
  const totalFixed = fixedShares.reduce<Fraction>((acc, s) => acc.add(s.fraction), Fraction.ZERO);
  const remainder = Fraction.ONE.subtract(totalFixed);
  const present = new Set(activeHeirs.map((e) => e.type));
  let shares: HeirShare[] = [...fixedShares];

  // Tasib bil ghayr (males pull females into residuary, 2:1)
  if (remainder.gt(Fraction.ZERO)) {
    const r = applyTasibBilGhayr(shares, remainder, activeHeirs, present);
    if (r) return r;
  }

  // Tasib ma al ghayr (sisters made residuary by female descendants)
  const m = applyTasibMaAlGhayr(shares, fixedShares, activeHeirs, present);
  if (m) return m;

  if (remainder.lte(Fraction.ZERO)) return [...fixedShares];

  // Tasib bin nafs (male residuary heirs in priority order)
  for (const heirType of RESIDUARY_PRIORITY) {
    if (!has(heirType, present)) continue;
    const count = countOf(heirType, activeHeirs);

    if (heirType === "father") {
      const idx = shares.findIndex((s) => s.heirType === "father");
      if (idx >= 0) {
        const existing = shares[idx];
        const newFraction = existing.fraction.add(remainder);
        shares[idx] = makeShare("father", existing.count, newFraction);
      } else {
        shares.push(makeShare("father", count, remainder));
      }
      return shares;
    }

    if (heirType === "paternalGrandfather") {
      const idx = shares.findIndex((s) => s.heirType === "paternalGrandfather");
      if (idx >= 0) {
        const existing = shares[idx];
        const newFraction = existing.fraction.add(remainder);
        shares[idx] = makeShare("paternalGrandfather", existing.count, newFraction);
      } else {
        shares.push(makeShare("paternalGrandfather", count, remainder));
      }
      return shares;
    }

    shares.push(makeShare(heirType, count, remainder));
    return shares;
  }

  return shares;
}
