import { describe, expect, it } from "vitest";
import { Fraction } from "./fraction";

describe("Fraction", () => {
  describe("construction", () => {
    it("auto-reduces 4/8 to 1/2", () => {
      const f = new Fraction(4, 8);
      expect(f.numerator).toBe(1n);
      expect(f.denominator).toBe(2n);
    });

    it("normalizes -1/-2 to 1/2", () => {
      const f = new Fraction(-1, -2);
      expect(f.numerator).toBe(1n);
      expect(f.denominator).toBe(2n);
    });

    it("places sign on numerator (1/-2 -> -1/2)", () => {
      const f = new Fraction(1, -2);
      expect(f.numerator).toBe(-1n);
      expect(f.denominator).toBe(2n);
    });

    it("throws on zero denominator", () => {
      expect(() => new Fraction(1, 0)).toThrow();
    });

    it("constructs whole numbers via single arg", () => {
      const f = new Fraction(5);
      expect(f.numerator).toBe(5n);
      expect(f.denominator).toBe(1n);
    });
  });

  describe("arithmetic", () => {
    it("1/2 + 1/3 = 5/6", () => {
      const r = new Fraction(1, 2).add(new Fraction(1, 3));
      expect(r.numerator).toBe(5n);
      expect(r.denominator).toBe(6n);
    });

    it("1/2 - 1/3 = 1/6", () => {
      const r = new Fraction(1, 2).subtract(new Fraction(1, 3));
      expect(r.numerator).toBe(1n);
      expect(r.denominator).toBe(6n);
    });

    it("(2/3) * (3/4) = 1/2", () => {
      const r = new Fraction(2, 3).multiply(new Fraction(3, 4));
      expect(r.numerator).toBe(1n);
      expect(r.denominator).toBe(2n);
    });

    it("(1/2) / (1/4) = 2/1", () => {
      const r = new Fraction(1, 2).divide(new Fraction(1, 4));
      expect(r.numerator).toBe(2n);
      expect(r.denominator).toBe(1n);
    });

    it("Awl example: 1/2 + 2/3 + 1/6 = 8/6 (= 4/3)", () => {
      const r = new Fraction(1, 2).add(new Fraction(2, 3)).add(new Fraction(1, 6));
      expect(r.numerator).toBe(4n);
      expect(r.denominator).toBe(3n);
    });
  });

  describe("comparison", () => {
    it("1/3 < 1/2", () => {
      expect(new Fraction(1, 3).lt(new Fraction(1, 2))).toBe(true);
    });
    it("1/2 == 2/4 after reduction", () => {
      expect(new Fraction(1, 2).equals(new Fraction(2, 4))).toBe(true);
    });
    it("ZERO is the additive identity", () => {
      const r = new Fraction(3, 7).add(Fraction.ZERO);
      expect(r.equals(new Fraction(3, 7))).toBe(true);
    });
  });

  describe("percentage", () => {
    it("1/4 -> 25", () => {
      expect(new Fraction(1, 4).percentage).toBe(25);
    });
    it("1/8 -> 12.5", () => {
      expect(new Fraction(1, 8).percentage).toBe(12.5);
    });
  });

  describe("toString", () => {
    it("renders 5/1 as '5'", () => {
      expect(new Fraction(5).toString()).toBe("5");
    });
    it("renders 3/4 as '3/4'", () => {
      expect(new Fraction(3, 4).toString()).toBe("3/4");
    });
  });

  describe("BigInt safety", () => {
    it("does not overflow on large products that would break Number", () => {
      // 2^53 fits in Number, but 2^64 does not. Awl multiplies numerators
      // by (commonDenom / denom) which can grow significantly. Confirm we
      // can construct large fractions without precision loss.
      const big = new Fraction(2n ** 60n, 2n ** 60n);
      expect(big.numerator).toBe(1n);
      expect(big.denominator).toBe(1n);
    });
  });
});
