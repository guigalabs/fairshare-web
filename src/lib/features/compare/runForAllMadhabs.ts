import {
  calculate,
  MADHHABS,
  type CalculationResult,
  type Gender,
  type HeirEntry,
  type Madhhab,
} from "$engine";

export interface MadhhabResult {
  madhhab: Madhhab;
  result: CalculationResult;
}

/**
 * Run the engine for every madhhab against the same case. The engine is
 * pure, so this is cheap to do client-side at render time.
 */
export function runForAllMadhabs(args: {
  subjectGender: Gender;
  heirs: readonly HeirEntry[];
}): MadhhabResult[] {
  return MADHHABS.map((madhhab) => ({
    madhhab,
    result: calculate({
      subjectGender: args.subjectGender,
      heirs: [...args.heirs],
      madhhab,
    }),
  }));
}
