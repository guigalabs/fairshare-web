import type { HeirType } from "./types";
import type { Fraction } from "./fraction";

// 1:1 port of CalculationResult.swift.

export interface HeirShare {
  readonly heirType: HeirType;
  readonly count: number;
  readonly fraction: Fraction;
  readonly percentage: number;
}

export interface BlockedHeir {
  readonly heirType: HeirType;
  readonly blockedBy: HeirType;
  readonly reason: string;
}

export type SpecialCase = "umariatan" | "grandFatherWithSiblings" | "musharkah";

export interface CalculationStep {
  readonly description: string;
  readonly ruleApplied: string;
  readonly verseKey?: string;
}

export interface CalculationResult {
  readonly shares: readonly HeirShare[];
  readonly commonDenominator: bigint;
  readonly adjustedDenominator?: bigint;
  readonly appliedAwl: boolean;
  readonly appliedRadd: boolean;
  readonly blockedHeirs: readonly BlockedHeir[];
  readonly appliedSpecialCase?: SpecialCase;
  readonly steps: readonly CalculationStep[];
}

export function makeShare(heirType: HeirType, count: number, fraction: Fraction): HeirShare {
  return { heirType, count, fraction, percentage: fraction.percentage };
}
