import type { HeirType, InheritanceCase } from "./types";

// 1:1 port of Engine/Validator.swift.

export type ValidationError =
  | { readonly kind: "noHeirs" }
  | { readonly kind: "invalidCount"; readonly heirType: HeirType }
  | { readonly kind: "duplicateHeirType"; readonly heirType: HeirType }
  | { readonly kind: "tooManyWives"; readonly count: number }
  | { readonly kind: "tooManyHusbands"; readonly count: number }
  | { readonly kind: "genderMismatch"; readonly heir: HeirType }
  | { readonly kind: "conflictingHeirs"; readonly a: HeirType; readonly b: HeirType };

export function validate(c: InheritanceCase): ValidationError[] {
  const errors: ValidationError[] = [];
  const heirs = c.heirs;
  const gender = c.subjectGender;

  if (heirs.length === 0) {
    errors.push({ kind: "noHeirs" });
    return errors;
  }

  for (const e of heirs) {
    if (e.count <= 0) errors.push({ kind: "invalidCount", heirType: e.type });
  }

  const seen = new Set<HeirType>();
  for (const e of heirs) {
    if (seen.has(e.type)) errors.push({ kind: "duplicateHeirType", heirType: e.type });
    seen.add(e.type);
  }

  const wifeEntry = heirs.find((e) => e.type === "wife");
  if (wifeEntry && wifeEntry.count > 4) {
    errors.push({ kind: "tooManyWives", count: wifeEntry.count });
  }
  const husbandEntry = heirs.find((e) => e.type === "husband");
  if (husbandEntry && husbandEntry.count > 1) {
    errors.push({ kind: "tooManyHusbands", count: husbandEntry.count });
  }

  const present = new Set(heirs.map((e) => e.type));
  if (gender === "male" && present.has("husband")) {
    errors.push({ kind: "genderMismatch", heir: "husband" });
  }
  if (gender === "female" && present.has("wife")) {
    errors.push({ kind: "genderMismatch", heir: "wife" });
  }
  if (present.has("husband") && present.has("wife")) {
    errors.push({ kind: "conflictingHeirs", a: "husband", b: "wife" });
  }

  return errors;
}

export function isCriticalError(err: ValidationError): boolean {
  return err.kind === "noHeirs" || err.kind === "genderMismatch" || err.kind === "conflictingHeirs";
}
