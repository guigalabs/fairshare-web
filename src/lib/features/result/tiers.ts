// Group HeirShares into the same vertical tiers the iOS family tree uses.
// Ancestors render above the subject, descendants below.

import type { HeirShare, HeirType } from "$engine";

export interface HeirTier {
  label: string;
  category: "grandparents" | "parents" | "spouse" | "children" | "grandchildren" | "siblings" | "extended";
  heirs: HeirShare[];
}

const ANCESTOR_DEFS: Array<{ label: string; category: HeirTier["category"]; types: HeirType[] }> = [
  {
    label: "Grandparents",
    category: "grandparents",
    types: ["paternalGrandfather", "paternalGrandmother", "maternalGrandmother"],
  },
  { label: "Parents", category: "parents", types: ["father", "mother"] },
];

const DESCENDANT_DEFS: Array<{ label: string; category: HeirTier["category"]; types: HeirType[] }> = [
  { label: "Spouse", category: "spouse", types: ["husband", "wife"] },
  { label: "Children", category: "children", types: ["son", "daughter"] },
  { label: "Grandchildren", category: "grandchildren", types: ["sonsSon", "sonsDaughter"] },
  {
    label: "Siblings",
    category: "siblings",
    types: [
      "fullBrother",
      "fullSister",
      "paternalHalfBrother",
      "paternalHalfSister",
      "maternalHalfBrother",
      "maternalHalfSister",
    ],
  },
  {
    label: "Extended",
    category: "extended",
    types: [
      "fullBrothersSon",
      "paternalHalfBrothersSon",
      "fullPaternalUncle",
      "paternalHalfUncle",
      "fullPaternalUnclesSon",
      "paternalHalfUnclesSon",
    ],
  },
];

function group(
  shares: readonly HeirShare[],
  defs: typeof ANCESTOR_DEFS,
): HeirTier[] {
  return defs
    .map((def) => ({
      label: def.label,
      category: def.category,
      heirs: shares.filter((s) => def.types.includes(s.heirType)),
    }))
    .filter((t) => t.heirs.length > 0);
}

export function buildAncestorTiers(shares: readonly HeirShare[]): HeirTier[] {
  return group(shares, ANCESTOR_DEFS);
}

export function buildDescendantTiers(shares: readonly HeirShare[]): HeirTier[] {
  return group(shares, DESCENDANT_DEFS);
}
