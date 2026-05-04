import { Fraction } from "$engine";
import { describe, expect, it } from "vitest";
import {
  bequeathableBase,
  bequestsValid,
  formatCents,
  netEstate,
  parseCents,
  perHeirAmount,
} from "./money";

describe("parseCents", () => {
  it.each([
    ["1234", 123_400n],
    ["1234.5", 123_450n],
    ["1234.56", 123_456n],
    ["$1,234.56", 123_456n],
    ["  1234.50 ", 123_450n],
    ["0", 0n],
    ["0.00", 0n],
    ["-50.25", -5025n],
  ])("parses %s as %s cents", (input, expected) => {
    expect(parseCents(input)).toBe(expected);
  });

  it.each([
    ["", "empty"],
    ["abc", "letters"],
    ["1.234", "three decimals"],
    ["1.5.0", "two dots"],
  ])("rejects %s (%s)", (input) => {
    expect(parseCents(input)).toBeNull();
  });
});

describe("formatCents", () => {
  it.each([
    [0n, "0.00"],
    [50n, "0.50"],
    [5n, "0.05"],
    [123_456n, "1234.56"],
    [-123_456n, "-1234.56"],
  ])("formats %s as %s", (input, expected) => {
    expect(formatCents(input)).toBe(expected);
  });
});

describe("netEstate", () => {
  it("subtracts funeral, debts, and bequests from gross", () => {
    expect(netEstate({ gross: 1_000_00n, funeral: 5_00n, debts: 100_00n, bequests: 200_00n })).toBe(
      695_00n,
    );
  });

  it("clamps negative results at zero", () => {
    expect(netEstate({ gross: 1_00n, funeral: 5_00n, debts: 0n, bequests: 0n })).toBe(0n);
  });
});

describe("bequeathableBase", () => {
  it("returns gross minus funeral minus debts (NOT bequests; bequests are paid out of this)", () => {
    expect(bequeathableBase({ gross: 1_000_00n, funeral: 50_00n, debts: 100_00n })).toBe(850_00n);
  });

  it("clamps at zero when debts exceed estate", () => {
    expect(bequeathableBase({ gross: 100_00n, funeral: 200_00n, debts: 0n })).toBe(0n);
  });
});

describe("bequestsValid (1/3 cap on the bequeathable base)", () => {
  it("accepts exactly 1/3 of the base", () => {
    expect(bequestsValid({ gross: 900_00n, funeral: 0n, debts: 0n, bequests: 300_00n })).toBe(true);
  });

  it("rejects bequests above 1/3", () => {
    expect(bequestsValid({ gross: 900_00n, funeral: 0n, debts: 0n, bequests: 300_01n })).toBe(
      false,
    );
  });

  it("computes the cap from the post-deduction base, not gross", () => {
    // base = 900 - 90 = 810; cap = 270.
    expect(
      bequestsValid({ gross: 900_00n, funeral: 30_00n, debts: 60_00n, bequests: 270_00n }),
    ).toBe(true);
    expect(
      bequestsValid({ gross: 900_00n, funeral: 30_00n, debts: 60_00n, bequests: 270_01n }),
    ).toBe(false);
  });
});

describe("perHeirAmount (floor of net × fraction)", () => {
  it("multiplies by the fraction exactly when divisible", () => {
    // 600.00 × 1/2 = 300.00
    expect(perHeirAmount(600_00n, new Fraction(1, 2))).toBe(300_00n);
  });

  it("floors the remainder", () => {
    // 100.00 × 1/3 = 33.33 (33.333... floored)
    expect(perHeirAmount(100_00n, new Fraction(1, 3))).toBe(33_33n);
  });

  it("matches engine fractions like 5/24 (Hanafi siblings)", () => {
    // 24000 cents × 5/24 = 5000 cents = $50.00
    expect(perHeirAmount(240_00n, new Fraction(5, 24))).toBe(50_00n);
  });

  it("returns zero for zero net", () => {
    expect(perHeirAmount(0n, new Fraction(7, 8))).toBe(0n);
  });
});
