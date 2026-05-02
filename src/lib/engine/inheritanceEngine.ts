import type { HeirType, InheritanceCase } from "./types";
import { Fraction } from "./fraction";
import {
  type CalculationResult,
  type CalculationStep,
  type HeirShare,
} from "./result";
import { isCriticalError, validate } from "./validator";
import { applyBlocking } from "./blockingRules";
import { assignFixedShares } from "./fixedShares";
import { checkAndApplySpecialCases } from "./specialCases";
import { assignResidualShares } from "./residualShares";
import { applyAwl, applyRadd } from "./adjustments";

// 1:1 port of Engine/InheritanceEngine.swift — orchestrator.

const RESIDUARY_TYPES: ReadonlySet<HeirType> = new Set([
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
]);

function commonDenominatorOf(shares: readonly HeirShare[]): bigint {
  if (shares.length === 0) return 1n;
  return shares.reduce<bigint>(
    (acc, s) => Fraction.lcmInt(acc, s.fraction.denominator),
    1n,
  );
}

function sharesEqual(a: readonly HeirShare[], b: readonly HeirShare[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i].heirType !== b[i].heirType) return false;
    if (a[i].count !== b[i].count) return false;
    if (!a[i].fraction.equals(b[i].fraction)) return false;
  }
  return true;
}

export function calculate(c: InheritanceCase): CalculationResult {
  const steps: CalculationStep[] = [];

  // 1. Validate
  const errors = validate(c);
  const critical = errors.filter(isCriticalError);
  if (critical.length > 0) {
    steps.push({
      description: `Validation failed with ${critical.length} critical error(s)`,
      ruleApplied: "validation",
    });
    return {
      shares: [],
      commonDenominator: 1n,
      appliedAwl: false,
      appliedRadd: false,
      blockedHeirs: [],
      steps,
    };
  }

  // 2. Blocking
  const { active: activeHeirs, blocked: blockedHeirs } = applyBlocking(
    c.heirs,
    c.subjectGender,
    c.madhhab,
  );

  if (blockedHeirs.length > 0) {
    const desc = blockedHeirs.map((b) => `${b.heirType} by ${b.blockedBy}`).join(", ");
    steps.push({
      description: `Blocked ${blockedHeirs.length} heir(s): ${desc}`,
      ruleApplied: "blocking",
    });
  }

  // 3. Fixed shares
  let shares: HeirShare[] = assignFixedShares(activeHeirs, c.subjectGender, c.madhhab);
  if (shares.length > 0) {
    const desc = shares.map((s) => `${s.heirType}: ${s.fraction.toString()}`).join(", ");
    steps.push({
      description: `Assigned fixed shares: ${desc}`,
      ruleApplied: "fixed_shares",
      verseKey: "4:11-12",
    });
  }

  // 4. Special cases
  const specialCase = checkAndApplySpecialCases(c, shares, activeHeirs, c.madhhab);
  if (specialCase) {
    steps.push({
      description: `Applied special case: ${specialCase}`,
      ruleApplied: "special_case",
    });
  }

  // 5. Residual shares (skip if a special case already handled them — except
  // grandfather-with-siblings which still needs residuary treatment per Swift)
  if (specialCase === undefined || specialCase === "grandFatherWithSiblings") {
    const pre = [...shares];
    shares = assignResidualShares(shares, activeHeirs, c.subjectGender);
    if (!sharesEqual(shares, pre)) {
      steps.push({ description: "Assigned residual shares", ruleApplied: "residual_shares" });
    }
  }

  // 6. Common denominator
  const commonDenominator = commonDenominatorOf(shares);

  // 7. Awl / radd
  const total = shares.reduce<Fraction>((acc, s) => acc.add(s.fraction), Fraction.ZERO);
  let adjustedDenominator: bigint | undefined;
  let appliedAwl = false;
  let appliedRadd = false;

  if (total.gt(Fraction.ONE)) {
    const r = applyAwl(shares, commonDenominator);
    shares = r.shares;
    adjustedDenominator = r.adjustedDenominator;
    appliedAwl = true;
    steps.push({
      description: `Applied awl: denominator adjusted from ${commonDenominator} to ${r.adjustedDenominator}`,
      ruleApplied: "awl",
    });
  } else if (total.lt(Fraction.ONE)) {
    const hasResiduaryWithShare = shares.some((s) => RESIDUARY_TYPES.has(s.heirType));
    const hasFemaleDescendant = activeHeirs.some(
      (e) => e.type === "daughter" || e.type === "sonsDaughter",
    );
    const sisterAsResiduary =
      hasFemaleDescendant &&
      shares.some((s) => s.heirType === "fullSister" || s.heirType === "paternalHalfSister");

    if (!hasResiduaryWithShare && !sisterAsResiduary) {
      const pre = shares;
      shares = applyRadd(shares, c.madhhab);
      if (!sharesEqual(shares, pre)) {
        appliedRadd = true;
        steps.push({
          description: "Applied radd: surplus redistributed proportionally",
          ruleApplied: "radd",
        });
      }
    }
  }

  return {
    shares,
    commonDenominator,
    adjustedDenominator,
    appliedAwl,
    appliedRadd,
    blockedHeirs,
    appliedSpecialCase: specialCase,
    steps,
  };
}
