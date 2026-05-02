import type { HeirType } from "$engine";

// Display strings for HeirType — used in summary chips and result rows.

const LABELS: Record<HeirType, string> = {
  father: "Father",
  mother: "Mother",
  husband: "Husband",
  wife: "Wife",
  son: "Son",
  daughter: "Daughter",
  paternalGrandfather: "Paternal grandfather",
  paternalGrandmother: "Paternal grandmother",
  maternalGrandmother: "Maternal grandmother",
  fullBrother: "Full brother",
  fullSister: "Full sister",
  paternalHalfBrother: "Paternal half-brother",
  paternalHalfSister: "Paternal half-sister",
  maternalHalfBrother: "Maternal half-brother",
  maternalHalfSister: "Maternal half-sister",
  sonsSon: "Son's son",
  sonsDaughter: "Son's daughter",
  fullBrothersSon: "Full brother's son",
  paternalHalfBrothersSon: "Paternal half-brother's son",
  fullPaternalUncle: "Full paternal uncle",
  paternalHalfUncle: "Paternal half-uncle",
  fullPaternalUnclesSon: "Full paternal uncle's son",
  paternalHalfUnclesSon: "Paternal half-uncle's son",
};

export function labelFor(type: HeirType, count: number): string {
  if (count === 1) return LABELS[type];
  return `${count} × ${LABELS[type]}`;
}
