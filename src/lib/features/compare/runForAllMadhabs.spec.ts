import { describe, expect, it } from "vitest";
import { runForAllMadhabs } from "./runForAllMadhabs";

describe("runForAllMadhabs", () => {
  it("returns one result per madhhab in MADHHABS order", () => {
    const out = runForAllMadhabs({
      subjectGender: "male",
      heirs: [{ type: "wife", count: 1 }],
    });
    expect(out.map((r) => r.madhhab)).toEqual(["general", "hanafi", "maliki", "shafii", "hanbali"]);
  });

  it("yields divergent fractions for the grandfather-with-siblings case", () => {
    // Hanafi: GF blocks siblings entirely. Shafi'i / Maliki: split.
    const heirs = [
      { type: "paternalGrandfather" as const, count: 1 },
      { type: "fullBrother" as const, count: 1 },
    ];
    const results = runForAllMadhabs({ subjectGender: "male", heirs });
    const byMadhhab = Object.fromEntries(results.map((r) => [r.madhhab, r.result]));

    const hanafiBrothers = byMadhhab.hanafi.shares.find((s) => s.heirType === "fullBrother");
    expect(hanafiBrothers).toBeUndefined();

    const shafiiBrothers = byMadhhab.shafii.shares.find((s) => s.heirType === "fullBrother");
    expect(shafiiBrothers).toBeDefined();
    expect(shafiiBrothers?.fraction.numerator).toBeGreaterThan(0n);
  });

  it("yields the same shares for general and hanafi when no madhhab-specific rule applies", () => {
    const heirs = [
      { type: "wife" as const, count: 1 },
      { type: "son" as const, count: 1 },
    ];
    const results = runForAllMadhabs({ subjectGender: "male", heirs });
    const general = results.find((r) => r.madhhab === "general")!.result;
    const hanafi = results.find((r) => r.madhhab === "hanafi")!.result;
    expect(
      general.shares
        .map((s) => `${s.heirType}:${s.fraction.numerator}/${s.fraction.denominator}`)
        .sort(),
    ).toEqual(
      hanafi.shares
        .map((s) => `${s.heirType}:${s.fraction.numerator}/${s.fraction.denominator}`)
        .sort(),
    );
  });
});
