// Domain types for the FairShare inheritance engine.
//
// 1:1 port of FairShareEngine/Sources/FairShareEngine/Types/*.swift. When the
// Swift side changes, mirror it here and re-run the snapshot parity test.

export type Gender = "male" | "female";

export type Madhhab = "general" | "hanafi" | "maliki" | "shafii" | "hanbali";

export const MADHHABS: readonly Madhhab[] = [
  "general",
  "hanafi",
  "maliki",
  "shafii",
  "hanbali",
] as const;

export type HeirType =
  | "father"
  | "mother"
  | "husband"
  | "wife"
  | "son"
  | "daughter"
  | "paternalGrandfather"
  | "paternalGrandmother"
  | "maternalGrandmother"
  | "fullBrother"
  | "fullSister"
  | "paternalHalfBrother"
  | "paternalHalfSister"
  | "maternalHalfBrother"
  | "maternalHalfSister"
  | "sonsSon"
  | "sonsDaughter"
  | "fullBrothersSon"
  | "paternalHalfBrothersSon"
  | "fullPaternalUncle"
  | "paternalHalfUncle"
  | "fullPaternalUnclesSon"
  | "paternalHalfUnclesSon";

export const HEIR_TYPES: readonly HeirType[] = [
  "father",
  "mother",
  "husband",
  "wife",
  "son",
  "daughter",
  "paternalGrandfather",
  "paternalGrandmother",
  "maternalGrandmother",
  "fullBrother",
  "fullSister",
  "paternalHalfBrother",
  "paternalHalfSister",
  "maternalHalfBrother",
  "maternalHalfSister",
  "sonsSon",
  "sonsDaughter",
  "fullBrothersSon",
  "paternalHalfBrothersSon",
  "fullPaternalUncle",
  "paternalHalfUncle",
  "fullPaternalUnclesSon",
  "paternalHalfUnclesSon",
] as const;

const MALE_HEIRS: ReadonlySet<HeirType> = new Set([
  "father",
  "husband",
  "son",
  "paternalGrandfather",
  "fullBrother",
  "paternalHalfBrother",
  "maternalHalfBrother",
  "sonsSon",
  "fullBrothersSon",
  "paternalHalfBrothersSon",
  "fullPaternalUncle",
  "paternalHalfUncle",
  "fullPaternalUnclesSon",
  "paternalHalfUnclesSon",
]);

export function genderOf(heir: HeirType): Gender {
  return MALE_HEIRS.has(heir) ? "male" : "female";
}

export interface HeirEntry {
  readonly type: HeirType;
  readonly count: number;
}

export function heirEntry(type: HeirType, count = 1): HeirEntry {
  return { type, count };
}

export interface InheritanceCase {
  readonly subjectGender: Gender;
  readonly heirs: readonly HeirEntry[];
  readonly madhhab: Madhhab;
}

export function inheritanceCase(
  subjectGender: Gender,
  heirs: readonly HeirEntry[],
  madhhab: Madhhab = "general",
): InheritanceCase {
  return { subjectGender, heirs, madhhab };
}
