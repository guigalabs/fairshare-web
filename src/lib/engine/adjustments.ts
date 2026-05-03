import type { HeirType, Madhhab } from "./types";
import { Fraction } from "./fraction";
import { makeShare, type HeirShare } from "./result";

// 1:1 port of Engine/Adjustments.swift.

const SPOUSE_TYPES: ReadonlySet<HeirType> = new Set(["husband", "wife"]);

/**
 * Awl: when total fixed shares > estate, scale every share down so they sum to 1.
 * The new denominator equals the sum of original numerators (in the common
 * denominator).
 */
export function applyAwl(
  shares: readonly HeirShare[],
  commonDenominator: bigint,
): { shares: HeirShare[]; adjustedDenominator: bigint } {
  const numerators = shares.map(
    (s) => s.fraction.numerator * (commonDenominator / s.fraction.denominator),
  );
  const totalNumerators = numerators.reduce((acc, n) => acc + n, 0n);

  if (totalNumerators <= commonDenominator) {
    return { shares: [...shares], adjustedDenominator: commonDenominator };
  }

  const adjustedDenominator = totalNumerators;
  const adjustedShares = shares.map((s, i) => {
    const f = new Fraction(numerators[i], adjustedDenominator);
    return makeShare(s.heirType, s.count, f);
  });
  return { shares: adjustedShares, adjustedDenominator };
}

/**
 * Radd: when total < 1 and no residuary heirs, redistribute surplus
 * proportionally among non-spouse fixed-share heirs.
 */
export function applyRadd(shares: readonly HeirShare[], _madhhab: Madhhab): HeirShare[] {
  const totalAll = shares.reduce<Fraction>((acc, s) => acc.add(s.fraction), Fraction.ZERO);
  if (totalAll.gte(Fraction.ONE)) return [...shares];

  const surplus = Fraction.ONE.subtract(totalAll);
  const nonSpouse = shares.filter((s) => !SPOUSE_TYPES.has(s.heirType));
  const totalNonSpouse = nonSpouse.reduce<Fraction>((acc, s) => acc.add(s.fraction), Fraction.ZERO);
  if (totalNonSpouse.lte(Fraction.ZERO)) return [...shares];

  return shares.map((s) => {
    if (SPOUSE_TYPES.has(s.heirType)) return s;
    const proportion = s.fraction.divide(totalNonSpouse);
    const bonus = surplus.multiply(proportion);
    const newFraction = s.fraction.add(bonus);
    return makeShare(s.heirType, s.count, newFraction);
  });
}
