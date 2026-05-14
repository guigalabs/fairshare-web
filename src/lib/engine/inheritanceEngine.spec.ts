import { describe, expect, it } from "vitest";
import { calculate } from "./inheritanceEngine";
import { Fraction } from "./fraction";
import { heirEntry, inheritanceCase } from "./types";
import type { HeirShare } from "./result";

// Curated regression set covering the classical Fara'id cases. Each
// expectation comes from the canonical worked examples in the FairShareEngine
// Swift test suite (FairShareEngineTests/) and must produce bit-identical
// fractions on both sides — that's the parity contract.

function shareOf(shares: readonly HeirShare[], type: string): Fraction {
  const s = shares.find((x) => x.heirType === type);
  if (!s) throw new Error(`no share for ${type}`);
  return s.fraction;
}

describe("InheritanceEngine — classical scenarios", () => {
  it("daughter alone -> 1/2 (no Radd until Adjustments path detects no residuary)", () => {
    // Single daughter, no other heirs: daughter takes 1/2 by fixed share.
    // With no residuary heir, Radd applies and she takes the full estate (1/1).
    const c = inheritanceCase("male", [heirEntry("daughter", 1)], "general");
    const r = calculate(c);
    expect(r.appliedRadd).toBe(true);
    expect(shareOf(r.shares, "daughter").equals(Fraction.ONE)).toBe(true);
  });

  it("two daughters alone -> together get 2/3, then Radd fills to 1", () => {
    const c = inheritanceCase("male", [heirEntry("daughter", 2)], "general");
    const r = calculate(c);
    expect(r.appliedRadd).toBe(true);
    expect(shareOf(r.shares, "daughter").equals(Fraction.ONE)).toBe(true);
  });

  it("husband + son -> husband 1/4, son takes the residue (3/4)", () => {
    const c = inheritanceCase("female", [heirEntry("husband", 1), heirEntry("son", 1)], "general");
    const r = calculate(c);
    expect(shareOf(r.shares, "husband").equals(Fraction.ONE_FOURTH)).toBe(true);
    expect(shareOf(r.shares, "son").equals(new Fraction(3, 4))).toBe(true);
  });

  it("classic Awl (husband + 2 full sisters + mother) -> 1/2 + 2/3 + 1/6 -> 8/6, scaled", () => {
    const c = inheritanceCase(
      "female",
      [heirEntry("husband", 1), heirEntry("fullSister", 2), heirEntry("mother", 1)],
      "general",
    );
    const r = calculate(c);
    expect(r.appliedAwl).toBe(true);
    expect(shareOf(r.shares, "husband").equals(new Fraction(3, 8))).toBe(true);
    expect(shareOf(r.shares, "fullSister").equals(new Fraction(4, 8))).toBe(true);
    expect(shareOf(r.shares, "mother").equals(new Fraction(1, 8))).toBe(true);
  });

  it("Umariatan (husband + mother + father) -> 1/2 + 1/6 + 1/3", () => {
    const c = inheritanceCase(
      "female",
      [heirEntry("husband", 1), heirEntry("mother", 1), heirEntry("father", 1)],
      "general",
    );
    const r = calculate(c);
    expect(r.appliedSpecialCase).toBe("umariatan");
    expect(shareOf(r.shares, "husband").equals(Fraction.ONE_HALF)).toBe(true);
    expect(shareOf(r.shares, "mother").equals(Fraction.ONE_SIXTH)).toBe(true);
    expect(shareOf(r.shares, "father").equals(Fraction.ONE_THIRD)).toBe(true);
  });

  it("Umariatan (wife + mother + father) -> 1/4 + 1/4 + 1/2", () => {
    const c = inheritanceCase(
      "male",
      [heirEntry("wife", 1), heirEntry("mother", 1), heirEntry("father", 1)],
      "general",
    );
    const r = calculate(c);
    expect(r.appliedSpecialCase).toBe("umariatan");
    expect(shareOf(r.shares, "wife").equals(Fraction.ONE_FOURTH)).toBe(true);
    expect(shareOf(r.shares, "mother").equals(Fraction.ONE_FOURTH)).toBe(true);
    expect(shareOf(r.shares, "father").equals(Fraction.ONE_HALF)).toBe(true);
  });

  it("Radd (mother + daughter, no others) -> mother 1/4, daughter 3/4", () => {
    const c = inheritanceCase(
      "male",
      [heirEntry("mother", 1), heirEntry("daughter", 1)],
      "general",
    );
    const r = calculate(c);
    expect(r.appliedRadd).toBe(true);
    expect(shareOf(r.shares, "mother").equals(new Fraction(1, 4))).toBe(true);
    expect(shareOf(r.shares, "daughter").equals(new Fraction(3, 4))).toBe(true);
  });

  it("Hanafi: grandfather blocks full siblings", () => {
    const c = inheritanceCase(
      "male",
      [heirEntry("paternalGrandfather", 1), heirEntry("fullBrother", 2)],
      "hanafi",
    );
    const r = calculate(c);
    expect(r.blockedHeirs.some((b) => b.heirType === "fullBrother")).toBe(true);
    // Grandfather takes everything as residuary.
    expect(shareOf(r.shares, "paternalGrandfather").equals(Fraction.ONE)).toBe(true);
  });

  it("Wife + 1 son -> wife 1/8, son 7/8 (residue)", () => {
    const c = inheritanceCase("male", [heirEntry("wife", 1), heirEntry("son", 1)], "general");
    const r = calculate(c);
    expect(shareOf(r.shares, "wife").equals(Fraction.ONE_EIGHTH)).toBe(true);
    expect(shareOf(r.shares, "son").equals(new Fraction(7, 8))).toBe(true);
  });

  it("Father blocks paternal grandfather", () => {
    const c = inheritanceCase(
      "male",
      [heirEntry("father", 1), heirEntry("paternalGrandfather", 1), heirEntry("son", 1)],
      "general",
    );
    const r = calculate(c);
    expect(r.blockedHeirs.some((b) => b.heirType === "paternalGrandfather")).toBe(true);
  });

  // Q4:11 — "if the deceased left brothers or sisters, the mother has a sixth."
  // The mother's reduction from 1/3 to 1/6 triggers on the *presence* of 2+
  // siblings, even when those siblings are themselves blocked from inheriting
  // by the father (or, in Hanafi, the paternal grandfather). This is the
  // distinction between hajb hirman (total blocking) and hajb nuqsan (reduction
  // blocking).
  it("Wife + mother + father + 2 full brothers -> wife 1/4, mother 1/6, father 7/12 (siblings blocked, but reduce mother)", () => {
    const c = inheritanceCase(
      "male",
      [
        heirEntry("wife", 1),
        heirEntry("mother", 1),
        heirEntry("father", 1),
        heirEntry("fullBrother", 2),
      ],
      "general",
    );
    const r = calculate(c);
    expect(r.blockedHeirs.some((b) => b.heirType === "fullBrother")).toBe(true);
    expect(r.appliedSpecialCase).toBeUndefined();
    expect(shareOf(r.shares, "wife").equals(Fraction.ONE_FOURTH)).toBe(true);
    expect(shareOf(r.shares, "mother").equals(Fraction.ONE_SIXTH)).toBe(true);
    expect(shareOf(r.shares, "father").equals(new Fraction(7, 12))).toBe(true);
  });

  it("Husband + mother + father + 2 maternal half-siblings -> husband 1/2, mother 1/6, father 1/3 (not Umariatan)", () => {
    const c = inheritanceCase(
      "female",
      [
        heirEntry("husband", 1),
        heirEntry("mother", 1),
        heirEntry("father", 1),
        heirEntry("maternalHalfBrother", 1),
        heirEntry("maternalHalfSister", 1),
      ],
      "general",
    );
    const r = calculate(c);
    expect(r.blockedHeirs.some((b) => b.heirType === "maternalHalfBrother")).toBe(true);
    expect(r.blockedHeirs.some((b) => b.heirType === "maternalHalfSister")).toBe(true);
    expect(r.appliedSpecialCase).toBeUndefined();
    expect(shareOf(r.shares, "husband").equals(Fraction.ONE_HALF)).toBe(true);
    expect(shareOf(r.shares, "mother").equals(Fraction.ONE_SIXTH)).toBe(true);
    expect(shareOf(r.shares, "father").equals(Fraction.ONE_THIRD)).toBe(true);
  });

  it("Wife + mother + father + 1 full brother -> Umariatan still applies (only 1 sibling, no reduction)", () => {
    const c = inheritanceCase(
      "male",
      [
        heirEntry("wife", 1),
        heirEntry("mother", 1),
        heirEntry("father", 1),
        heirEntry("fullBrother", 1),
      ],
      "general",
    );
    const r = calculate(c);
    expect(r.blockedHeirs.some((b) => b.heirType === "fullBrother")).toBe(true);
    expect(r.appliedSpecialCase).toBe("umariatan");
    expect(shareOf(r.shares, "wife").equals(Fraction.ONE_FOURTH)).toBe(true);
    expect(shareOf(r.shares, "mother").equals(Fraction.ONE_FOURTH)).toBe(true);
    expect(shareOf(r.shares, "father").equals(Fraction.ONE_HALF)).toBe(true);
  });

  it("Hanafi: grandfather blocks siblings, but 2+ siblings still reduce mother to 1/6", () => {
    const c = inheritanceCase(
      "male",
      [
        heirEntry("wife", 1),
        heirEntry("mother", 1),
        heirEntry("paternalGrandfather", 1),
        heirEntry("fullBrother", 2),
      ],
      "hanafi",
    );
    const r = calculate(c);
    expect(r.blockedHeirs.some((b) => b.heirType === "fullBrother")).toBe(true);
    expect(shareOf(r.shares, "mother").equals(Fraction.ONE_SIXTH)).toBe(true);
  });
});
