// 1:1 port of FairShare iOS HeirHelpers.swift — colors, names, icons.
// Used by FamilyTree + ShareRow + Walkthrough so the categorisation matches
// the iOS app pixel-for-pixel.

import type { HeirType } from "$engine";
import User from "@lucide/svelte/icons/user";
import Users from "@lucide/svelte/icons/users";
import UsersRound from "@lucide/svelte/icons/users-round";
import Heart from "@lucide/svelte/icons/heart";
import Baby from "@lucide/svelte/icons/baby";
import type { Component } from "svelte";

export type HeirCategory = "spouse" | "parents" | "grandparents" | "children" | "siblings" | "extended";

const COLORS: Record<HeirCategory, string> = {
  spouse: "#D95971", // rose
  parents: "#C79438", // gold
  grandparents: "#AE8551", // amber
  children: "#388F9E", // teal
  siblings: "#7A61B8", // indigo
  extended: "#738CA6", // slate
};

export function categoryFor(type: HeirType): HeirCategory {
  switch (type) {
    case "husband":
    case "wife":
      return "spouse";
    case "father":
    case "mother":
      return "parents";
    case "paternalGrandfather":
    case "paternalGrandmother":
    case "maternalGrandmother":
      return "grandparents";
    case "son":
    case "daughter":
    case "sonsSon":
    case "sonsDaughter":
      return "children";
    case "fullBrother":
    case "fullSister":
    case "paternalHalfBrother":
    case "paternalHalfSister":
    case "maternalHalfBrother":
    case "maternalHalfSister":
    case "fullBrothersSon":
    case "paternalHalfBrothersSon":
      return "siblings";
    case "fullPaternalUncle":
    case "paternalHalfUncle":
    case "fullPaternalUnclesSon":
    case "paternalHalfUnclesSon":
      return "extended";
  }
}

export function colorFor(type: HeirType): string {
  return COLORS[categoryFor(type)];
}

export function iconFor(type: HeirType): Component {
  switch (type) {
    case "husband":
    case "wife":
      return Heart;
    case "son":
    case "daughter":
    case "sonsSon":
    case "sonsDaughter":
      return Baby;
    case "fullPaternalUncle":
    case "paternalHalfUncle":
    case "fullPaternalUnclesSon":
    case "paternalHalfUnclesSon":
      return UsersRound;
    case "fullBrother":
    case "fullSister":
    case "paternalHalfBrother":
    case "paternalHalfSister":
    case "maternalHalfBrother":
    case "maternalHalfSister":
    case "fullBrothersSon":
    case "paternalHalfBrothersSon":
      return Users;
    default:
      // father, mother, all grandparents
      return User;
  }
}
