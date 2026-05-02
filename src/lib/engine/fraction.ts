// Exact rational arithmetic for inheritance calculations.
//
// BigInt-backed so denominators of arbitrary size never overflow. Always
// auto-reduces on construction and stores denominator as a positive value.
// 1:1 port of FairShareEngine/Sources/FairShareEngine/Types/Fraction.swift,
// with BigInt instead of Swift Int. The Swift engine uses Int (64-bit on iOS)
// and we choose BigInt here to be conservative against over-multiplication
// during awl/radd chains.

const ZERO = 0n;
const ONE = 1n;

function abs(n: bigint): bigint {
  return n < 0n ? -n : n;
}

function gcdBig(a: bigint, b: bigint): bigint {
  let x = abs(a);
  let y = abs(b);
  while (y !== ZERO) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x === ZERO ? ONE : x;
}

function lcmBig(a: bigint, b: bigint): bigint {
  if (a === ZERO || b === ZERO) return ZERO;
  return abs((a / gcdBig(a, b)) * b);
}

function asBig(n: number | bigint): bigint {
  return typeof n === "bigint" ? n : BigInt(n);
}

export class Fraction {
  readonly numerator: bigint;
  readonly denominator: bigint;

  constructor(numerator: number | bigint, denominator: number | bigint = 1) {
    const num = asBig(numerator);
    const den = asBig(denominator);
    if (den === ZERO) {
      throw new Error("Fraction denominator cannot be zero");
    }
    const sign = den < ZERO ? -ONE : ONE;
    const rawNum = num * sign;
    const rawDen = den * sign;
    const divisor = gcdBig(abs(rawNum), rawDen);
    this.numerator = rawNum / divisor;
    this.denominator = rawDen / divisor;
  }

  /** Display-only decimal representation (0..100). */
  get percentage(): number {
    if (this.denominator === ZERO) return 0;
    // Convert to Number for display; precision loss here is intentional and
    // acceptable since percentage is purely a UI hint, not used in math.
    return (Number(this.numerator) / Number(this.denominator)) * 100;
  }

  add(other: Fraction): Fraction {
    const common = lcmBig(this.denominator, other.denominator);
    const newNum =
      this.numerator * (common / this.denominator) +
      other.numerator * (common / other.denominator);
    return new Fraction(newNum, common);
  }

  subtract(other: Fraction): Fraction {
    const common = lcmBig(this.denominator, other.denominator);
    const newNum =
      this.numerator * (common / this.denominator) -
      other.numerator * (common / other.denominator);
    return new Fraction(newNum, common);
  }

  multiply(other: Fraction): Fraction {
    return new Fraction(this.numerator * other.numerator, this.denominator * other.denominator);
  }

  divide(other: Fraction): Fraction {
    if (other.numerator === ZERO) {
      throw new Error("Cannot divide by zero fraction");
    }
    return new Fraction(this.numerator * other.denominator, this.denominator * other.numerator);
  }

  equals(other: Fraction): boolean {
    return this.numerator === other.numerator && this.denominator === other.denominator;
  }

  /** Strict less-than. */
  lt(other: Fraction): boolean {
    return this.numerator * other.denominator < other.numerator * this.denominator;
  }

  lte(other: Fraction): boolean {
    return this.numerator * other.denominator <= other.numerator * this.denominator;
  }

  gt(other: Fraction): boolean {
    return this.numerator * other.denominator > other.numerator * this.denominator;
  }

  gte(other: Fraction): boolean {
    return this.numerator * other.denominator >= other.numerator * this.denominator;
  }

  toString(): string {
    return this.denominator === ONE ? `${this.numerator}` : `${this.numerator}/${this.denominator}`;
  }

  toJSON(): { numerator: string; denominator: string } {
    return { numerator: this.numerator.toString(), denominator: this.denominator.toString() };
  }

  static fromJSON(value: { numerator: string | number; denominator: string | number }): Fraction {
    const n = typeof value.numerator === "string" ? BigInt(value.numerator) : BigInt(value.numerator);
    const d =
      typeof value.denominator === "string" ? BigInt(value.denominator) : BigInt(value.denominator);
    return new Fraction(n, d);
  }

  static lcmInt(a: number | bigint, b: number | bigint): bigint {
    return lcmBig(asBig(a), asBig(b));
  }

  static gcdInt(a: number | bigint, b: number | bigint): bigint {
    return gcdBig(asBig(a), asBig(b));
  }

  // MARK: - Common Share Constants
  static readonly ZERO = new Fraction(0, 1);
  static readonly ONE_HALF = new Fraction(1, 2);
  static readonly ONE_THIRD = new Fraction(1, 3);
  static readonly ONE_FOURTH = new Fraction(1, 4);
  static readonly ONE_SIXTH = new Fraction(1, 6);
  static readonly ONE_EIGHTH = new Fraction(1, 8);
  static readonly TWO_THIRDS = new Fraction(2, 3);
  static readonly ONE = new Fraction(1, 1);
}
