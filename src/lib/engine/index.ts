// Public engine API. Mirrors FairShareEngine's public surface.

export type { Gender, Madhhab, HeirType, HeirEntry, InheritanceCase } from "./types";
export { MADHHABS, HEIR_TYPES, genderOf, heirEntry, inheritanceCase } from "./types";

export { Fraction } from "./fraction";

export type {
  HeirShare,
  BlockedHeir,
  SpecialCase,
  CalculationStep,
  CalculationResult,
} from "./result";
export { makeShare } from "./result";

export type { ValidationError } from "./validator";
export { validate, isCriticalError } from "./validator";

export { calculate } from "./inheritanceEngine";

export type { QuestionStep } from "./questionFlow";
export { QuestionFlow } from "./questionFlow";
