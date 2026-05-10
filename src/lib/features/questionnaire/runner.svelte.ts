// Reactive wrapper around the engine's QuestionFlow. Lives in $state so the
// /calculate UI can re-render whenever the user advances or rewinds.
//
// The wrapped class is plain TS in the engine; here we keep a parallel
// "history" stack so Back returns to the previous step without losing the
// answers (simple snapshot of currentStep + heirs at each point).

import type { Madhhab, HeirEntry, Gender } from "$engine";
import { QuestionFlow, type QuestionStep } from "$engine";

interface Snapshot {
  step: QuestionStep;
  heirs: HeirEntry[];
  subjectGender: Gender | undefined;
}

export class QuestionnaireRunner {
  flow = $state<QuestionFlow>(new QuestionFlow("general"));
  history = $state<Snapshot[]>([]);

  // Surfaced reactively so UI re-renders.
  step = $state<QuestionStep>("subjectType");
  heirs = $state<HeirEntry[]>([]);
  subjectGender = $state<Gender | undefined>(undefined);

  constructor(madhhab: Madhhab = "general") {
    this.flow = new QuestionFlow(madhhab);
    this.snapshot();
  }

  reset(madhhab: Madhhab = "general"): void {
    this.flow = new QuestionFlow(madhhab);
    this.history = [];
    this.snapshot();
  }

  /**
   * Switch madhhab without losing answers. Most steps are identical across
   * schools, so the user stays where they were. The history stack is kept
   * intact — Back replays under the new madhhab, which is the desired behavior.
   */
  setMadhhab(madhhab: Madhhab): void {
    if (this.flow.madhhab === madhhab) return;
    this.flow = this.flow.cloneWithMadhhab(madhhab);
    this.snapshot();
  }

  private snapshot(): void {
    this.step = this.flow.currentStep;
    this.heirs = [...this.flow.collectedHeirs];
    this.subjectGender = this.flow.subjectGender;
  }

  private push(): void {
    this.history.push({
      step: this.flow.currentStep,
      heirs: [...this.flow.collectedHeirs],
      subjectGender: this.flow.subjectGender,
    });
  }

  answerBool(value: boolean): void {
    this.push();
    this.flow.answerBool(this.flow.currentStep, value);
    this.flow.nextStep();
    this.snapshot();
  }

  answerInt(value: number): void {
    this.push();
    this.flow.answerInt(this.flow.currentStep, value);
    this.flow.nextStep();
    this.snapshot();
  }

  /** Skip a question (advance without recording an answer). */
  skip(): void {
    this.push();
    this.flow.nextStep();
    this.snapshot();
  }

  /** Restore the previous snapshot. */
  back(): void {
    const prev = this.history.pop();
    if (!prev) return;
    // Rebuild flow from scratch up to the snapshot. Simpler than mutating
    // private state: replay nothing, just adopt the snapshot.
    const replay = new QuestionFlow(this.flow.madhhab);
    // Manually set fields the snapshot tracks. Internal answer flags stay
    // false (acceptable because the user is about to re-answer the question
    // anyway, which re-sets them).
    replay.collectedHeirs = [...prev.heirs];
    replay.subjectGender = prev.subjectGender;
    replay.currentStep = prev.step;
    this.flow = replay;
    this.snapshot();
  }

  get canGoBack(): boolean {
    return this.history.length > 0;
  }

  get done(): boolean {
    return this.flow.currentStep === "done";
  }

  buildCase() {
    return this.flow.buildCase();
  }
}
