import type { QuestionStep } from "$engine";
import { t } from "$lib/i18n/index.svelte";

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

interface StepKeys {
  prompt: string;
  help?: string;
  trueKey?: string;
  falseKey?: string;
  countLabelKey?: string;
  countMax?: number;
}

const KEYS: Record<QuestionStep, StepKeys> = {
  subjectType: {
    prompt: "step.subjectType.prompt",
    help: "step.subjectType.help",
    trueKey: "step.subjectType.true",
    falseKey: "step.subjectType.false",
  },
  subjectGender: {
    prompt: "step.subjectGender.prompt",
    help: "step.subjectGender.help",
  },
  hasSpouse: {
    prompt: "step.hasSpouse.prompt",
    help: "step.hasSpouse.help",
  },
  wifeCount: {
    prompt: "step.wifeCount.prompt",
    countLabelKey: "step.wifeCount.label",
    countMax: 4,
  },
  hasChildren: {
    prompt: "step.hasChildren.prompt",
    help: "step.hasChildren.help",
  },
  sonCount: {
    prompt: "step.sonCount.prompt",
    countLabelKey: "step.sonCount.label",
  },
  daughterCount: {
    prompt: "step.daughterCount.prompt",
    countLabelKey: "step.daughterCount.label",
  },
  hasGrandchildrenThroughSons: {
    prompt: "step.hasGrandchildrenThroughSons.prompt",
    help: "step.hasGrandchildrenThroughSons.help",
  },
  sonsSonCount: {
    prompt: "step.sonsSonCount.prompt",
    countLabelKey: "step.sonsSonCount.label",
  },
  sonsDaughterCount: {
    prompt: "step.sonsDaughterCount.prompt",
    countLabelKey: "step.sonsDaughterCount.label",
  },
  fatherAlive: { prompt: "step.fatherAlive.prompt" },
  motherAlive: { prompt: "step.motherAlive.prompt" },
  paternalGrandfatherAlive: {
    prompt: "step.paternalGrandfatherAlive.prompt",
    help: "step.paternalGrandfatherAlive.help",
  },
  hasGrandmothers: {
    prompt: "step.hasGrandmothers.prompt",
    help: "step.hasGrandmothers.help",
  },
  hasFullSiblings: {
    prompt: "step.hasFullSiblings.prompt",
    help: "step.hasFullSiblings.help",
  },
  fullBrotherCount: {
    prompt: "step.fullBrotherCount.prompt",
    countLabelKey: "step.fullBrotherCount.label",
  },
  fullSisterCount: {
    prompt: "step.fullSisterCount.prompt",
    countLabelKey: "step.fullSisterCount.label",
  },
  hasPaternalHalfSiblings: {
    prompt: "step.hasPaternalHalfSiblings.prompt",
    help: "step.hasPaternalHalfSiblings.help",
  },
  paternalHalfBrotherCount: {
    prompt: "step.paternalHalfBrotherCount.prompt",
    countLabelKey: "step.paternalHalfBrotherCount.label",
  },
  paternalHalfSisterCount: {
    prompt: "step.paternalHalfSisterCount.prompt",
    countLabelKey: "step.paternalHalfSisterCount.label",
  },
  hasMaternalHalfSiblings: {
    prompt: "step.hasMaternalHalfSiblings.prompt",
    help: "step.hasMaternalHalfSiblings.help",
  },
  maternalHalfBrotherCount: {
    prompt: "step.maternalHalfBrotherCount.prompt",
    countLabelKey: "step.maternalHalfBrotherCount.label",
  },
  maternalHalfSisterCount: {
    prompt: "step.maternalHalfSisterCount.prompt",
    countLabelKey: "step.maternalHalfSisterCount.label",
  },
  done: { prompt: "step.done.prompt" },
};

const BOOL_STEPS = new Set<QuestionStep>([
  "subjectType",
  "hasSpouse",
  "hasChildren",
  "hasGrandchildrenThroughSons",
  "fatherAlive",
  "motherAlive",
  "paternalGrandfatherAlive",
  "hasGrandmothers",
  "hasFullSiblings",
  "hasPaternalHalfSiblings",
  "hasMaternalHalfSiblings",
]);

export function copyFor(step: QuestionStep): StepCopy {
  const k = KEYS[step];
  const out: StepCopy = { prompt: t(k.prompt) };
  if (k.help) out.help = t(k.help);
  if (k.countLabelKey) out.countLabel = t(k.countLabelKey);
  if (k.countMax !== undefined) out.countMax = k.countMax;
  if (BOOL_STEPS.has(step)) {
    out.trueLabel = t(k.trueKey ?? "calculate.yes");
    out.falseLabel = t(k.falseKey ?? "calculate.no");
  }
  return out;
}

/** Heuristic: which UI shape does this step want? */
export function shapeFor(step: QuestionStep): "bool" | "int" | "gender" | "done" {
  if (step === "done") return "done";
  if (step === "subjectGender") return "gender";
  if (KEYS[step].countLabelKey !== undefined) return "int";
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
