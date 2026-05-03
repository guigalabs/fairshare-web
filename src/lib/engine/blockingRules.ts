import type { HeirEntry, HeirType, Madhhab } from "./types";
import type { BlockedHeir } from "./result";

// 1:1 port of Engine/BlockingRules.swift.
// Implements حجب حرمان (total blocking).

function has(t: HeirType, present: ReadonlySet<HeirType>): boolean {
  return present.has(t);
}

function countOf(t: HeirType, heirs: readonly HeirEntry[]): number {
  return heirs.reduce((acc, e) => acc + (e.type === t ? e.count : 0), 0);
}

function blocked(heirType: HeirType, blockedBy: HeirType, reason: string): BlockedHeir {
  return { heirType, blockedBy, reason };
}

function blockingResult(
  heirType: HeirType,
  present: ReadonlySet<HeirType>,
  heirs: readonly HeirEntry[],
  madhhab: Madhhab,
): BlockedHeir | null {
  switch (heirType) {
    // Grandfather
    case "paternalGrandfather":
      if (has("father", present))
        return blocked(heirType, "father", "Father blocks paternal grandfather");
      return null;

    // Grandmothers
    case "paternalGrandmother":
      if (has("mother", present))
        return blocked(heirType, "mother", "Mother blocks paternal grandmother");
      if (has("father", present))
        return blocked(heirType, "father", "Father blocks paternal grandmother");
      return null;

    case "maternalGrandmother":
      if (has("mother", present))
        return blocked(heirType, "mother", "Mother blocks maternal grandmother");
      if (madhhab === "hanafi" && has("father", present))
        return blocked(heirType, "father", "Father blocks maternal grandmother (Hanafi)");
      return null;

    // Full siblings
    case "fullBrother":
      if (has("father", present)) return blocked(heirType, "father", "Father blocks full brother");
      if (has("son", present)) return blocked(heirType, "son", "Son blocks full brother");
      if (has("sonsSon", present))
        return blocked(heirType, "sonsSon", "Son's son blocks full brother");
      if (madhhab === "hanafi" && has("paternalGrandfather", present) && !has("father", present))
        return blocked(heirType, "paternalGrandfather", "Grandfather blocks full brother (Hanafi)");
      return null;

    case "fullSister":
      if (has("father", present)) return blocked(heirType, "father", "Father blocks full sister");
      if (has("son", present)) return blocked(heirType, "son", "Son blocks full sister");
      if (has("sonsSon", present))
        return blocked(heirType, "sonsSon", "Son's son blocks full sister");
      if (madhhab === "hanafi" && has("paternalGrandfather", present) && !has("father", present))
        return blocked(heirType, "paternalGrandfather", "Grandfather blocks full sister (Hanafi)");
      return null;

    // Paternal half siblings
    case "paternalHalfBrother":
      if (has("father", present))
        return blocked(heirType, "father", "Father blocks paternal half-brother");
      if (has("son", present)) return blocked(heirType, "son", "Son blocks paternal half-brother");
      if (has("sonsSon", present))
        return blocked(heirType, "sonsSon", "Son's son blocks paternal half-brother");
      if (has("fullBrother", present))
        return blocked(heirType, "fullBrother", "Full brother blocks paternal half-brother");
      if (madhhab === "hanafi" && has("paternalGrandfather", present) && !has("father", present))
        return blocked(
          heirType,
          "paternalGrandfather",
          "Grandfather blocks paternal half-brother (Hanafi)",
        );
      return null;

    case "paternalHalfSister":
      if (has("father", present))
        return blocked(heirType, "father", "Father blocks paternal half-sister");
      if (has("son", present)) return blocked(heirType, "son", "Son blocks paternal half-sister");
      if (has("sonsSon", present))
        return blocked(heirType, "sonsSon", "Son's son blocks paternal half-sister");
      if (has("fullBrother", present))
        return blocked(heirType, "fullBrother", "Full brother blocks paternal half-sister");
      {
        const fullSisterCount = countOf("fullSister", heirs);
        if (fullSisterCount >= 2 && !has("paternalHalfBrother", present))
          return blocked(
            heirType,
            "fullSister",
            "Two or more full sisters block paternal half-sister",
          );
      }
      if (madhhab === "hanafi" && has("paternalGrandfather", present) && !has("father", present))
        return blocked(
          heirType,
          "paternalGrandfather",
          "Grandfather blocks paternal half-sister (Hanafi)",
        );
      return null;

    // Maternal half siblings
    case "maternalHalfBrother":
    case "maternalHalfSister":
      if (has("father", present))
        return blocked(heirType, "father", "Father blocks maternal half-sibling");
      if (has("paternalGrandfather", present) && !has("father", present))
        return blocked(heirType, "paternalGrandfather", "Grandfather blocks maternal half-sibling");
      if (has("son", present)) return blocked(heirType, "son", "Son blocks maternal half-sibling");
      if (has("daughter", present))
        return blocked(heirType, "daughter", "Daughter blocks maternal half-sibling");
      if (has("sonsSon", present))
        return blocked(heirType, "sonsSon", "Son's son blocks maternal half-sibling");
      if (has("sonsDaughter", present))
        return blocked(heirType, "sonsDaughter", "Son's daughter blocks maternal half-sibling");
      return null;

    // Son's daughter
    case "sonsDaughter":
      if (has("son", present)) return blocked(heirType, "son", "Son blocks son's daughter");
      {
        const daughterCount = countOf("daughter", heirs);
        if (daughterCount >= 2 && !has("sonsSon", present))
          return blocked(
            heirType,
            "daughter",
            "Two or more daughters block son's daughter (no son's son to make her residuary)",
          );
      }
      return null;

    // Son's son
    case "sonsSon":
      if (has("son", present)) return blocked(heirType, "son", "Son blocks son's son");
      return null;

    // Brother's sons
    case "fullBrothersSon":
      if (has("father", present))
        return blocked(heirType, "father", "Father blocks full brother's son");
      if (has("son", present)) return blocked(heirType, "son", "Son blocks full brother's son");
      if (has("sonsSon", present))
        return blocked(heirType, "sonsSon", "Son's son blocks full brother's son");
      if (has("fullBrother", present))
        return blocked(heirType, "fullBrother", "Full brother blocks full brother's son");
      if (has("paternalHalfBrother", present))
        return blocked(
          heirType,
          "paternalHalfBrother",
          "Paternal half-brother blocks full brother's son",
        );
      if (has("paternalGrandfather", present) && !has("father", present))
        return blocked(heirType, "paternalGrandfather", "Grandfather blocks full brother's son");
      return null;

    case "paternalHalfBrothersSon":
      if (has("father", present))
        return blocked(heirType, "father", "Father blocks paternal half-brother's son");
      if (has("son", present))
        return blocked(heirType, "son", "Son blocks paternal half-brother's son");
      if (has("sonsSon", present))
        return blocked(heirType, "sonsSon", "Son's son blocks paternal half-brother's son");
      if (has("fullBrother", present))
        return blocked(heirType, "fullBrother", "Full brother blocks paternal half-brother's son");
      if (has("paternalHalfBrother", present))
        return blocked(
          heirType,
          "paternalHalfBrother",
          "Paternal half-brother blocks paternal half-brother's son",
        );
      if (has("fullBrothersSon", present))
        return blocked(
          heirType,
          "fullBrothersSon",
          "Full brother's son blocks paternal half-brother's son",
        );
      if (has("paternalGrandfather", present) && !has("father", present))
        return blocked(
          heirType,
          "paternalGrandfather",
          "Grandfather blocks paternal half-brother's son",
        );
      return null;

    // Uncles + uncle's sons (deep chain)
    case "fullPaternalUncle":
      if (has("father", present))
        return blocked(heirType, "father", "Father blocks full paternal uncle");
      if (has("son", present)) return blocked(heirType, "son", "Son blocks full paternal uncle");
      if (has("sonsSon", present))
        return blocked(heirType, "sonsSon", "Son's son blocks full paternal uncle");
      if (has("paternalGrandfather", present))
        return blocked(heirType, "paternalGrandfather", "Grandfather blocks full paternal uncle");
      if (has("fullBrother", present))
        return blocked(heirType, "fullBrother", "Full brother blocks full paternal uncle");
      if (has("paternalHalfBrother", present))
        return blocked(
          heirType,
          "paternalHalfBrother",
          "Paternal half-brother blocks full paternal uncle",
        );
      if (has("fullBrothersSon", present))
        return blocked(
          heirType,
          "fullBrothersSon",
          "Full brother's son blocks full paternal uncle",
        );
      if (has("paternalHalfBrothersSon", present))
        return blocked(
          heirType,
          "paternalHalfBrothersSon",
          "Paternal half-brother's son blocks full paternal uncle",
        );
      return null;

    case "paternalHalfUncle":
      if (has("father", present))
        return blocked(heirType, "father", "Father blocks paternal half-uncle");
      if (has("son", present)) return blocked(heirType, "son", "Son blocks paternal half-uncle");
      if (has("sonsSon", present))
        return blocked(heirType, "sonsSon", "Son's son blocks paternal half-uncle");
      if (has("paternalGrandfather", present))
        return blocked(heirType, "paternalGrandfather", "Grandfather blocks paternal half-uncle");
      if (has("fullBrother", present))
        return blocked(heirType, "fullBrother", "Full brother blocks paternal half-uncle");
      if (has("paternalHalfBrother", present))
        return blocked(
          heirType,
          "paternalHalfBrother",
          "Paternal half-brother blocks paternal half-uncle",
        );
      if (has("fullBrothersSon", present))
        return blocked(
          heirType,
          "fullBrothersSon",
          "Full brother's son blocks paternal half-uncle",
        );
      if (has("paternalHalfBrothersSon", present))
        return blocked(
          heirType,
          "paternalHalfBrothersSon",
          "Paternal half-brother's son blocks paternal half-uncle",
        );
      if (has("fullPaternalUncle", present))
        return blocked(
          heirType,
          "fullPaternalUncle",
          "Full paternal uncle blocks paternal half-uncle",
        );
      return null;

    case "fullPaternalUnclesSon":
      if (has("father", present))
        return blocked(heirType, "father", "Father blocks full paternal uncle's son");
      if (has("son", present))
        return blocked(heirType, "son", "Son blocks full paternal uncle's son");
      if (has("sonsSon", present))
        return blocked(heirType, "sonsSon", "Son's son blocks full paternal uncle's son");
      if (has("paternalGrandfather", present))
        return blocked(
          heirType,
          "paternalGrandfather",
          "Grandfather blocks full paternal uncle's son",
        );
      if (has("fullBrother", present))
        return blocked(heirType, "fullBrother", "Full brother blocks full paternal uncle's son");
      if (has("paternalHalfBrother", present))
        return blocked(
          heirType,
          "paternalHalfBrother",
          "Paternal half-brother blocks full paternal uncle's son",
        );
      if (has("fullBrothersSon", present))
        return blocked(
          heirType,
          "fullBrothersSon",
          "Full brother's son blocks full paternal uncle's son",
        );
      if (has("paternalHalfBrothersSon", present))
        return blocked(
          heirType,
          "paternalHalfBrothersSon",
          "Paternal half-brother's son blocks full paternal uncle's son",
        );
      if (has("fullPaternalUncle", present))
        return blocked(
          heirType,
          "fullPaternalUncle",
          "Full paternal uncle blocks full paternal uncle's son",
        );
      if (has("paternalHalfUncle", present))
        return blocked(
          heirType,
          "paternalHalfUncle",
          "Paternal half-uncle blocks full paternal uncle's son",
        );
      return null;

    case "paternalHalfUnclesSon":
      if (has("father", present))
        return blocked(heirType, "father", "Father blocks paternal half-uncle's son");
      if (has("son", present))
        return blocked(heirType, "son", "Son blocks paternal half-uncle's son");
      if (has("sonsSon", present))
        return blocked(heirType, "sonsSon", "Son's son blocks paternal half-uncle's son");
      if (has("paternalGrandfather", present))
        return blocked(
          heirType,
          "paternalGrandfather",
          "Grandfather blocks paternal half-uncle's son",
        );
      if (has("fullBrother", present))
        return blocked(heirType, "fullBrother", "Full brother blocks paternal half-uncle's son");
      if (has("paternalHalfBrother", present))
        return blocked(
          heirType,
          "paternalHalfBrother",
          "Paternal half-brother blocks paternal half-uncle's son",
        );
      if (has("fullBrothersSon", present))
        return blocked(
          heirType,
          "fullBrothersSon",
          "Full brother's son blocks paternal half-uncle's son",
        );
      if (has("paternalHalfBrothersSon", present))
        return blocked(
          heirType,
          "paternalHalfBrothersSon",
          "Paternal half-brother's son blocks paternal half-uncle's son",
        );
      if (has("fullPaternalUncle", present))
        return blocked(
          heirType,
          "fullPaternalUncle",
          "Full paternal uncle blocks paternal half-uncle's son",
        );
      if (has("paternalHalfUncle", present))
        return blocked(
          heirType,
          "paternalHalfUncle",
          "Paternal half-uncle blocks paternal half-uncle's son",
        );
      if (has("fullPaternalUnclesSon", present))
        return blocked(
          heirType,
          "fullPaternalUnclesSon",
          "Full paternal uncle's son blocks paternal half-uncle's son",
        );
      return null;

    // Non-blockable heirs
    case "father":
    case "mother":
    case "husband":
    case "wife":
    case "son":
    case "daughter":
      return null;
  }
}

export interface BlockingResult {
  readonly active: readonly HeirEntry[];
  readonly blocked: readonly BlockedHeir[];
}

export function applyBlocking(
  heirs: readonly HeirEntry[],
  _subjectGender: unknown, // unused by Swift impl, kept for parity
  madhhab: Madhhab,
): BlockingResult {
  const present = new Set(heirs.map((e) => e.type));
  const blockedHeirs: BlockedHeir[] = [];
  const active = heirs.filter((e) => {
    const r = blockingResult(e.type, present, heirs, madhhab);
    if (r) {
      blockedHeirs.push(r);
      return false;
    }
    return true;
  });
  return { active, blocked: blockedHeirs };
}
