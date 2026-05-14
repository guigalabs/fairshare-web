import type { HeirEntry, HeirType, Madhhab, Gender } from "./types";
import { Fraction } from "./fraction";
import { makeShare, type HeirShare } from "./result";

// 1:1 port of Engine/FixedShares.swift.

const SIBLING_TYPES: ReadonlySet<HeirType> = new Set([
  "fullBrother",
  "fullSister",
  "paternalHalfBrother",
  "paternalHalfSister",
  "maternalHalfBrother",
  "maternalHalfSister",
]);

function has(t: HeirType, present: ReadonlySet<HeirType>): boolean {
  return present.has(t);
}

function hasAny(types: HeirType[], present: ReadonlySet<HeirType>): boolean {
  return types.some((t) => present.has(t));
}

function countOf(t: HeirType, heirs: readonly HeirEntry[]): number {
  return heirs.reduce((acc, e) => acc + (e.type === t ? e.count : 0), 0);
}

function hasDescendants(present: ReadonlySet<HeirType>): boolean {
  return hasAny(["son", "daughter", "sonsSon", "sonsDaughter"], present);
}

function siblingCount(heirs: readonly HeirEntry[]): number {
  return heirs.reduce((acc, e) => acc + (SIBLING_TYPES.has(e.type) ? e.count : 0), 0);
}

function maternalSiblingCount(heirs: readonly HeirEntry[]): number {
  return heirs.reduce(
    (acc, e) =>
      acc + (e.type === "maternalHalfBrother" || e.type === "maternalHalfSister" ? e.count : 0),
    0,
  );
}

function fixedShare(
  heirType: HeirType,
  count: number,
  present: ReadonlySet<HeirType>,
  heirs: readonly HeirEntry[],
  originalHeirs: readonly HeirEntry[],
): Fraction | null {
  switch (heirType) {
    case "husband":
      return hasDescendants(present) ? Fraction.ONE_FOURTH : Fraction.ONE_HALF;

    case "wife":
      return hasDescendants(present) ? Fraction.ONE_EIGHTH : Fraction.ONE_FOURTH;

    case "father":
      return hasDescendants(present) ? Fraction.ONE_SIXTH : null;

    case "mother":
      if (hasDescendants(present)) return Fraction.ONE_SIXTH;
      // Q4:11 reduces the mother to 1/6 on the *presence* of 2+ siblings,
      // even when those siblings are blocked from inheriting (hajb nuqsan vs
      // hajb hirman). Use the pre-blocking heir list so blocked siblings count.
      if (siblingCount(originalHeirs) >= 2) return Fraction.ONE_SIXTH;
      return Fraction.ONE_THIRD;

    case "daughter":
      if (has("son", present)) return null;
      if (count >= 2) return Fraction.TWO_THIRDS;
      return Fraction.ONE_HALF;

    case "sonsDaughter": {
      if (has("sonsSon", present)) return null;
      const dCount = countOf("daughter", heirs);
      if (dCount === 1) return Fraction.ONE_SIXTH;
      if (count >= 2) return Fraction.TWO_THIRDS;
      return Fraction.ONE_HALF;
    }

    case "paternalGrandfather":
      return hasDescendants(present) ? Fraction.ONE_SIXTH : null;

    case "paternalGrandmother":
    case "maternalGrandmother": {
      const both = has("paternalGrandmother", present) && has("maternalGrandmother", present);
      return both ? new Fraction(1, 12) : Fraction.ONE_SIXTH;
    }

    case "fullSister":
      if (has("fullBrother", present)) return null;
      if (count >= 2) return Fraction.TWO_THIRDS;
      return Fraction.ONE_HALF;

    case "paternalHalfSister": {
      if (has("paternalHalfBrother", present)) return null;
      const fullSisterCt = countOf("fullSister", heirs);
      if (fullSisterCt === 1) return Fraction.ONE_SIXTH;
      if (count >= 2) return Fraction.TWO_THIRDS;
      return Fraction.ONE_HALF;
    }

    case "maternalHalfBrother":
    case "maternalHalfSister": {
      const totalMaternal = maternalSiblingCount(heirs);
      if (totalMaternal >= 2) {
        return Fraction.ONE_THIRD.multiply(new Fraction(count, totalMaternal));
      }
      return Fraction.ONE_SIXTH;
    }

    // Purely residuary
    case "son":
    case "sonsSon":
    case "fullBrother":
    case "paternalHalfBrother":
    case "fullBrothersSon":
    case "paternalHalfBrothersSon":
    case "fullPaternalUncle":
    case "paternalHalfUncle":
    case "fullPaternalUnclesSon":
    case "paternalHalfUnclesSon":
      return null;
  }
}

export function assignFixedShares(
  heirs: readonly HeirEntry[],
  _subjectGender: Gender,
  _madhhab: Madhhab,
  originalHeirs: readonly HeirEntry[] = heirs,
): HeirShare[] {
  const present = new Set(heirs.map((e) => e.type));
  const shares: HeirShare[] = [];
  for (const e of heirs) {
    const f = fixedShare(e.type, e.count, present, heirs, originalHeirs);
    if (f) shares.push(makeShare(e.type, e.count, f));
  }
  return shares;
}
