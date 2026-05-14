import { describe, expect, it } from "vitest";
import { QuestionFlow, type QuestionStep } from "./questionFlow";

// Helper: drive the flow to its next non-trivial step by answering each
// question with the given map. Stops at `done` or when no answer is provided.
function runFlow(
  answers: Partial<Record<QuestionStep, boolean | number>>,
  madhhab: "general" | "hanafi" | "shafii" | "maliki" | "hanbali" = "general",
): { flow: QuestionFlow; visited: QuestionStep[] } {
  const flow = new QuestionFlow(madhhab);
  const visited: QuestionStep[] = [];
  let step = flow.currentStep;
  while (step !== "done") {
    visited.push(step);
    const a = answers[step];
    if (a === undefined) break;
    if (typeof a === "boolean") flow.answerBool(step, a);
    else flow.answerInt(step, a);
    step = flow.nextStep();
  }
  return { flow, visited };
}

describe("QuestionFlow — sibling questions for mother's-share reduction (Q4:11)", () => {
  it("asks about siblings when mother and father are alive (even though siblings are blocked)", () => {
    // Male deceased, wife, no children, father alive, mother alive.
    // Siblings will be blocked from inheriting by the father, BUT their
    // count still determines whether the mother gets 1/3 or 1/6.
    const { visited } = runFlow({
      subjectType: true,
      subjectGender: 0, // male
      hasSpouse: true,
      wifeCount: 1,
      hasChildren: false,
      fatherAlive: true,
      motherAlive: true,
    });
    expect(visited).toContain("hasFullSiblings");
  });

  it("Hanafi: still asks about siblings when grandfather is alive but father is not", () => {
    // Siblings are blocked by the grandfather in Hanafi, but their presence
    // still affects mother's share.
    const { visited } = runFlow(
      {
        subjectType: true,
        subjectGender: 0,
        hasSpouse: false,
        hasChildren: false,
        fatherAlive: false,
        motherAlive: true,
        paternalGrandfatherAlive: true,
        hasGrandmothers: false,
      },
      "hanafi",
    );
    expect(visited).toContain("hasFullSiblings");
  });

  it("does not ask about siblings when there are no parents who would inherit a different share", () => {
    // Father alive, mother NOT alive: siblings are blocked from inheriting
    // and there is no mother whose share depends on them.
    const { visited } = runFlow({
      subjectType: true,
      subjectGender: 0,
      hasSpouse: false,
      hasChildren: false,
      fatherAlive: true,
      motherAlive: false,
    });
    expect(visited).not.toContain("hasFullSiblings");
  });

  it("does not ask about siblings when descendants are present (mother already 1/6)", () => {
    // Descendants already reduce mother to 1/6 regardless of siblings,
    // and siblings would be blocked by the son.
    const { visited } = runFlow({
      subjectType: true,
      subjectGender: 0,
      hasSpouse: false,
      hasChildren: true,
      sonCount: 1,
      daughterCount: 0,
      hasGrandchildrenThroughSons: false,
      fatherAlive: true,
      motherAlive: true,
    });
    expect(visited).not.toContain("hasFullSiblings");
  });
});
