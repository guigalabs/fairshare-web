// Preset inheritance scenarios for one-tap exploration on the landing page.
// 1:1 port of FairShare iOS ScenarioTemplate (QuickScenariosView.swift).

import type { Gender, HeirEntry, HeirType, Madhhab } from "$engine";
import type { HeirCategory } from "$lib/features/result/heirHelpers";

export interface Scenario {
  id: string;
  name: string;
  description: string;
  subjectGender: Gender;
  madhhab: Madhhab;
  heirs: HeirEntry[];
  /** Category used to pick the card tint — picks one heir group to lead the visual identity. */
  tintCategory: HeirCategory | "accent";
}

export const SCENARIOS: Scenario[] = [
  {
    id: "spouse_children",
    name: "Spouse & Children",
    description: "Wife, 2 sons, 1 daughter",
    subjectGender: "male",
    madhhab: "general",
    heirs: [
      { type: "wife", count: 1 },
      { type: "son", count: 2 },
      { type: "daughter", count: 1 },
    ],
    tintCategory: "spouse",
  },
  {
    id: "nuclear_family",
    name: "Nuclear Family",
    description: "Wife, son, daughter, both parents",
    subjectGender: "male",
    madhhab: "general",
    heirs: [
      { type: "wife", count: 1 },
      { type: "son", count: 1 },
      { type: "daughter", count: 1 },
      { type: "father", count: 1 },
      { type: "mother", count: 1 },
    ],
    tintCategory: "children",
  },
  {
    id: "parents_only",
    name: "Parents Only",
    description: "Wife, father, mother",
    subjectGender: "male",
    madhhab: "general",
    heirs: [
      { type: "wife", count: 1 },
      { type: "father", count: 1 },
      { type: "mother", count: 1 },
    ],
    tintCategory: "parents",
  },
  {
    id: "daughters_only",
    name: "Daughters Only",
    description: "Wife, 3 daughters, both parents",
    subjectGender: "male",
    madhhab: "general",
    heirs: [
      { type: "wife", count: 1 },
      { type: "daughter", count: 3 },
      { type: "father", count: 1 },
      { type: "mother", count: 1 },
    ],
    tintCategory: "siblings",
  },
  {
    id: "siblings",
    name: "Siblings",
    description: "Wife, mother, 2 brothers, 1 sister",
    subjectGender: "male",
    madhhab: "general",
    heirs: [
      { type: "wife", count: 1 },
      { type: "mother", count: 1 },
      { type: "fullBrother", count: 2 },
      { type: "fullSister", count: 1 },
    ],
    tintCategory: "children",
  },
  {
    id: "extended",
    name: "Extended Family",
    description: "Wife, grandfather, mother, grandchildren",
    subjectGender: "male",
    madhhab: "general",
    heirs: [
      { type: "wife", count: 1 },
      { type: "paternalGrandfather", count: 1 },
      { type: "mother", count: 1 },
      { type: "sonsSon", count: 1 },
      { type: "sonsDaughter", count: 2 },
    ],
    tintCategory: "extended",
  },
];

export function heirCountOf(s: Scenario): number {
  return s.heirs.reduce((acc, h) => acc + h.count, 0);
}

export function representativeHeirTypesOf(s: Scenario): HeirType[] {
  return s.heirs.flatMap((h) => Array(h.count).fill(h.type)).slice(0, 4) as HeirType[];
}
