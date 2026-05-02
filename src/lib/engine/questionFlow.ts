import type { Gender, HeirEntry, HeirType, InheritanceCase, Madhhab } from "./types";
import { heirEntry, inheritanceCase } from "./types";

// 1:1 port of Flow/QuestionFlow.swift. Plain TS class — UI layer wraps it
// with reactive state ($state in Svelte) when used from the questionnaire.

export type QuestionStep =
  | "subjectType"
  | "subjectGender"
  | "hasSpouse"
  | "wifeCount"
  | "hasChildren"
  | "sonCount"
  | "daughterCount"
  | "hasGrandchildrenThroughSons"
  | "sonsSonCount"
  | "sonsDaughterCount"
  | "fatherAlive"
  | "motherAlive"
  | "paternalGrandfatherAlive"
  | "hasGrandmothers"
  | "hasFullSiblings"
  | "fullBrotherCount"
  | "fullSisterCount"
  | "hasPaternalHalfSiblings"
  | "paternalHalfBrotherCount"
  | "paternalHalfSisterCount"
  | "hasMaternalHalfSiblings"
  | "maternalHalfBrotherCount"
  | "maternalHalfSisterCount"
  | "done";

export class QuestionFlow {
  readonly madhhab: Madhhab;

  currentStep: QuestionStep = "subjectType";
  isForSelf = true;
  subjectGender: Gender | undefined;
  collectedHeirs: HeirEntry[] = [];

  // Internal answers tracked for branching decisions
  private hasSpouseAnswer = false;
  private hasChildrenAnswer = false;
  private sonCount = 0;
  private daughterCount = 0;
  private hasGrandchildrenThroughSonsAnswer = false;
  private fatherAlive = false;
  private motherAlive = false;
  private grandfatherAlive = false;
  private hasGrandmothersAnswer = false;
  private hasFullSiblingsAnswer = false;
  private hasPaternalHalfSiblingsAnswer = false;
  private hasMaternalHalfSiblingsAnswer = false;

  constructor(madhhab: Madhhab) {
    this.madhhab = madhhab;
  }

  // MARK: - Answer Methods

  answerBool(step: QuestionStep, value: boolean): void {
    switch (step) {
      case "subjectType":
        this.isForSelf = value;
        return;
      case "hasSpouse":
        this.hasSpouseAnswer = value;
        if (value) {
          if (this.subjectGender === "male") {
            // wifeCount asked next
          } else {
            this.addHeir("husband", 1);
          }
        }
        return;
      case "hasChildren":
        this.hasChildrenAnswer = value;
        return;
      case "hasGrandchildrenThroughSons":
        this.hasGrandchildrenThroughSonsAnswer = value;
        return;
      case "fatherAlive":
        this.fatherAlive = value;
        if (value) this.addHeir("father", 1);
        return;
      case "motherAlive":
        this.motherAlive = value;
        if (value) this.addHeir("mother", 1);
        return;
      case "paternalGrandfatherAlive":
        this.grandfatherAlive = value;
        if (value) this.addHeir("paternalGrandfather", 1);
        return;
      case "hasGrandmothers":
        this.hasGrandmothersAnswer = value;
        if (value) {
          if (!this.motherAlive) this.addHeir("maternalGrandmother", 1);
          if (!this.fatherAlive) this.addHeir("paternalGrandmother", 1);
        }
        return;
      case "hasFullSiblings":
        this.hasFullSiblingsAnswer = value;
        return;
      case "hasPaternalHalfSiblings":
        this.hasPaternalHalfSiblingsAnswer = value;
        return;
      case "hasMaternalHalfSiblings":
        this.hasMaternalHalfSiblingsAnswer = value;
        return;
      default:
        return;
    }
  }

  answerInt(step: QuestionStep, value: number): void {
    switch (step) {
      case "subjectGender":
        this.subjectGender = value === 0 ? "male" : "female";
        return;
      case "wifeCount":
        if (value > 0) this.addHeir("wife", value);
        return;
      case "sonCount":
        this.sonCount = value;
        if (value > 0) this.addHeir("son", value);
        return;
      case "daughterCount":
        this.daughterCount = value;
        if (value > 0) this.addHeir("daughter", value);
        return;
      case "sonsSonCount":
        if (value > 0) this.addHeir("sonsSon", value);
        return;
      case "sonsDaughterCount":
        if (value > 0) this.addHeir("sonsDaughter", value);
        return;
      case "fullBrotherCount":
        if (value > 0) this.addHeir("fullBrother", value);
        return;
      case "fullSisterCount":
        if (value > 0) this.addHeir("fullSister", value);
        return;
      case "paternalHalfBrotherCount":
        if (value > 0) this.addHeir("paternalHalfBrother", value);
        return;
      case "paternalHalfSisterCount":
        if (value > 0) this.addHeir("paternalHalfSister", value);
        return;
      case "maternalHalfBrotherCount":
        if (value > 0) this.addHeir("maternalHalfBrother", value);
        return;
      case "maternalHalfSisterCount":
        if (value > 0) this.addHeir("maternalHalfSister", value);
        return;
      default:
        return;
    }
  }

  // MARK: - Navigation

  nextStep(): QuestionStep {
    const next = this.computeNextStep(this.currentStep);
    this.currentStep = next;
    return next;
  }

  // MARK: - Build Case

  buildCase(): InheritanceCase {
    return inheritanceCase(this.subjectGender ?? "male", this.collectedHeirs, this.madhhab);
  }

  // MARK: - Reset

  reset(): void {
    this.currentStep = "subjectType";
    this.isForSelf = true;
    this.subjectGender = undefined;
    this.collectedHeirs = [];
    this.hasSpouseAnswer = false;
    this.hasChildrenAnswer = false;
    this.sonCount = 0;
    this.daughterCount = 0;
    this.hasGrandchildrenThroughSonsAnswer = false;
    this.fatherAlive = false;
    this.motherAlive = false;
    this.grandfatherAlive = false;
    this.hasGrandmothersAnswer = false;
    this.hasFullSiblingsAnswer = false;
    this.hasPaternalHalfSiblingsAnswer = false;
    this.hasMaternalHalfSiblingsAnswer = false;
  }

  // MARK: - Private Helpers

  private addHeir(type: HeirType, count: number): void {
    this.collectedHeirs.push(heirEntry(type, count));
  }

  private get shouldAskSiblings(): boolean {
    if (this.fatherAlive) return false;
    if (this.madhhab === "hanafi" && this.grandfatherAlive) return false;
    return true;
  }

  private get shouldAskGrandmothers(): boolean {
    return !this.motherAlive || !this.fatherAlive;
  }

  private computeNextStep(step: QuestionStep): QuestionStep {
    switch (step) {
      case "subjectType":
        return "subjectGender";
      case "subjectGender":
        return "hasSpouse";
      case "hasSpouse":
        if (this.hasSpouseAnswer && this.subjectGender === "male") return "wifeCount";
        return "hasChildren";
      case "wifeCount":
        return "hasChildren";
      case "hasChildren":
        if (this.hasChildrenAnswer) return "sonCount";
        return "fatherAlive";
      case "sonCount":
        return "daughterCount";
      case "daughterCount":
        if (this.sonCount === 0 && this.daughterCount === 0) {
          this.hasChildrenAnswer = false;
          return "fatherAlive";
        }
        return "hasGrandchildrenThroughSons";
      case "hasGrandchildrenThroughSons":
        if (this.hasGrandchildrenThroughSonsAnswer) return "sonsSonCount";
        return "fatherAlive";
      case "sonsSonCount":
        return "sonsDaughterCount";
      case "sonsDaughterCount":
        return "fatherAlive";
      case "fatherAlive":
        return "motherAlive";
      case "motherAlive":
        if (!this.fatherAlive) return "paternalGrandfatherAlive";
        if (this.shouldAskGrandmothers) return "hasGrandmothers";
        return "done";
      case "paternalGrandfatherAlive":
        if (this.shouldAskGrandmothers) return "hasGrandmothers";
        if (this.shouldAskSiblings) return "hasFullSiblings";
        return "done";
      case "hasGrandmothers":
        if (this.shouldAskSiblings) return "hasFullSiblings";
        return "done";
      case "hasFullSiblings":
        if (this.hasFullSiblingsAnswer) return "fullBrotherCount";
        return "hasPaternalHalfSiblings";
      case "fullBrotherCount":
        return "fullSisterCount";
      case "fullSisterCount":
        return "hasPaternalHalfSiblings";
      case "hasPaternalHalfSiblings":
        if (this.hasPaternalHalfSiblingsAnswer) return "paternalHalfBrotherCount";
        return "hasMaternalHalfSiblings";
      case "paternalHalfBrotherCount":
        return "paternalHalfSisterCount";
      case "paternalHalfSisterCount":
        return "hasMaternalHalfSiblings";
      case "hasMaternalHalfSiblings":
        if (this.hasMaternalHalfSiblingsAnswer) return "maternalHalfBrotherCount";
        return "done";
      case "maternalHalfBrotherCount":
        return "maternalHalfSisterCount";
      case "maternalHalfSisterCount":
        return "done";
      case "done":
        return "done";
    }
  }
}
