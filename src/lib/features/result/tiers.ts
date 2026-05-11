// Group HeirShares into the same vertical tiers the iOS family tree uses.
// Ancestors render above the subject, descendants below.

import type { HeirShare, HeirType } from "$engine";

export type TierCategory =
  | "grandparents"
  | "parents"
  | "spouse"
  | "children"
  | "grandchildren"
  | "siblings"
  | "extended";

export interface HeirTier {
  /** Translation key to resolve via t() at render time. */
  labelKey: string;
  category: TierCategory;
  heirs: HeirShare[];
}

const ANCESTOR_DEFS: Array<{ category: TierCategory; types: HeirType[] }> = [
  {
    category: "grandparents",
    types: ["paternalGrandfather", "paternalGrandmother", "maternalGrandmother"],
  },
  { category: "parents", types: ["father", "mother"] },
];

const DESCENDANT_DEFS: Array<{ category: TierCategory; types: HeirType[] }> = [
  { category: "spouse", types: ["husband", "wife"] },
  { category: "children", types: ["son", "daughter"] },
  { category: "grandchildren", types: ["sonsSon", "sonsDaughter"] },
  {
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

function group(shares: readonly HeirShare[], defs: typeof ANCESTOR_DEFS): HeirTier[] {
  return defs
    .map((def) => ({
      labelKey: `tier.${def.category}`,
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
