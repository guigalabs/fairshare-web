import type { QuestionStep } from "$engine";

// Labels and help text per step. EN only for now; B7 will route these
// through Paraglide for AR.

export interface StepCopy {
  prompt: string;
  help?: string;
  /** For boolean steps. */
  trueLabel?: string;
  falseLabel?: string;
  /** For integer steps. */
  countLabel?: string;
  countDescription?: string;
  countMax?: number;
}

const COPY: Record<QuestionStep, StepCopy> = {
  subjectType: {
    prompt: "Who is this calculation for?",
    help: "Use 'Myself' to walk through your own family. Use 'Someone else' if you're computing on behalf of a relative.",
    trueLabel: "Myself",
    falseLabel: "Someone else",
  },
  subjectGender: {
    prompt: "What is the deceased's gender?",
    help: "Inheritance rules differ between male and female subjects, especially around spouses.",
  },
  hasSpouse: {
    prompt: "Was there a surviving spouse?",
    help: "A husband or wife who outlived the deceased.",
    trueLabel: "Yes",
    falseLabel: "No",
  },
  wifeCount: {
    prompt: "How many wives outlived the deceased?",
    countLabel: "Wives",
    countMax: 4,
  },
  hasChildren: {
    prompt: "Were there any direct children?",
    help: "Sons or daughters of the deceased.",
    trueLabel: "Yes",
    falseLabel: "No",
  },
  sonCount: {
    prompt: "How many sons?",
    countLabel: "Sons",
  },
  daughterCount: {
    prompt: "How many daughters?",
    countLabel: "Daughters",
  },
  hasGrandchildrenThroughSons: {
    prompt: "Were there grandchildren through a deceased son?",
    help: "Children of a son who died before the deceased.",
    trueLabel: "Yes",
    falseLabel: "No",
  },
  sonsSonCount: {
    prompt: "How many grandsons (through a son)?",
    countLabel: "Son's sons",
  },
  sonsDaughterCount: {
    prompt: "How many granddaughters (through a son)?",
    countLabel: "Son's daughters",
  },
  fatherAlive: {
    prompt: "Is the deceased's father alive?",
    trueLabel: "Yes",
    falseLabel: "No",
  },
  motherAlive: {
    prompt: "Is the deceased's mother alive?",
    trueLabel: "Yes",
    falseLabel: "No",
  },
  paternalGrandfatherAlive: {
    prompt: "Is the paternal grandfather alive?",
    help: "Only relevant when the father is deceased.",
    trueLabel: "Yes",
    falseLabel: "No",
  },
  hasGrandmothers: {
    prompt: "Are any grandmothers alive?",
    help: "Maternal or paternal — only those whose intermediate parent has died inherit.",
    trueLabel: "Yes",
    falseLabel: "No",
  },
  hasFullSiblings: {
    prompt: "Were there full siblings?",
    help: "Brothers or sisters who share both parents with the deceased.",
    trueLabel: "Yes",
    falseLabel: "No",
  },
  fullBrotherCount: {
    prompt: "How many full brothers?",
    countLabel: "Full brothers",
  },
  fullSisterCount: {
    prompt: "How many full sisters?",
    countLabel: "Full sisters",
  },
  hasPaternalHalfSiblings: {
    prompt: "Were there paternal half-siblings?",
    help: "Same father, different mother.",
    trueLabel: "Yes",
    falseLabel: "No",
  },
  paternalHalfBrotherCount: {
    prompt: "How many paternal half-brothers?",
    countLabel: "Paternal half-brothers",
  },
  paternalHalfSisterCount: {
    prompt: "How many paternal half-sisters?",
    countLabel: "Paternal half-sisters",
  },
  hasMaternalHalfSiblings: {
    prompt: "Were there maternal half-siblings?",
    help: "Same mother, different father.",
    trueLabel: "Yes",
    falseLabel: "No",
  },
  maternalHalfBrotherCount: {
    prompt: "How many maternal half-brothers?",
    countLabel: "Maternal half-brothers",
  },
  maternalHalfSisterCount: {
    prompt: "How many maternal half-sisters?",
    countLabel: "Maternal half-sisters",
  },
  done: {
    prompt: "Ready to calculate.",
  },
};

export function copyFor(step: QuestionStep): StepCopy {
  return COPY[step];
}

/** Heuristic: which UI shape does this step want? */
export function shapeFor(step: QuestionStep): "bool" | "int" | "gender" | "done" {
  if (step === "done") return "done";
  if (step === "subjectGender") return "gender";
  const c = copyFor(step);
  if (c.countLabel !== undefined) return "int";
  return "bool";
}

/** A friendly progress fraction (0..1). Approximate, since the flow branches. */
export function progressOf(step: QuestionStep): number {
  const order: QuestionStep[] = [
    "subjectType",
    "subjectGender",
    "hasSpouse",
    "wifeCount",
    "hasChildren",
    "sonCount",
    "daughterCount",
    "hasGrandchildrenThroughSons",
    "sonsSonCount",
    "sonsDaughterCount",
    "fatherAlive",
    "motherAlive",
    "paternalGrandfatherAlive",
    "hasGrandmothers",
    "hasFullSiblings",
    "fullBrotherCount",
    "fullSisterCount",
    "hasPaternalHalfSiblings",
    "paternalHalfBrotherCount",
    "paternalHalfSisterCount",
    "hasMaternalHalfSiblings",
    "maternalHalfBrotherCount",
    "maternalHalfSisterCount",
    "done",
  ];
  const i = order.indexOf(step);
  if (i < 0) return 0;
  return i / (order.length - 1);
}
