import { Fraction } from "$engine";

/**
 * All money calculations operate on integer cents (or the smallest unit of
 * the chosen currency). This avoids floating-point drift over chains of
 * fixed-share / 'awl / radd math.
 */
export type Cents = bigint;

const TWO_DECIMAL = /^-?\d+(\.\d{1,2})?$/;

/**
 * "$1,234.56" / "1234.5" / "1234" → 123456n (cents). Strict: rejects
 * malformed input rather than silently rounding (the practitioner needs
 * to know the figure was rejected).
 */
export function parseCents(input: string): Cents | null {
  const trimmed = input.replace(/[$\s,]/g, "");
  if (trimmed === "" || !TWO_DECIMAL.test(trimmed)) return null;
  const negative = trimmed.startsWith("-");
  const body = negative ? trimmed.slice(1) : trimmed;
  const [whole, frac = ""] = body.split(".");
  const padded = (frac + "00").slice(0, 2);
  const cents = BigInt(whole) * 100n + BigInt(padded);
  return negative ? -cents : cents;
}

/** 123456n → "1234.56". Display-only; does not include a currency symbol. */
export function formatCents(c: Cents): string {
  const negative = c < 0n;
  const abs = negative ? -c : c;
  const whole = abs / 100n;
  const frac = abs % 100n;
  const fracStr = frac.toString().padStart(2, "0");
  return `${negative ? "-" : ""}${whole}.${fracStr}`;
}

/** gross − funeral − debts − bequests, clamped at zero. */
export function netEstate(args: {
  gross: Cents;
  funeral: Cents;
  debts: Cents;
  bequests: Cents;
}): Cents {
  const net = args.gross - args.funeral - args.debts - args.bequests;
  return net < 0n ? 0n : net;
}

/** "After funeral and debts" — the base for the 1/3 wasiyyah cap. */
export function bequeathableBase(args: { gross: Cents; funeral: Cents; debts: Cents }): Cents {
  const base = args.gross - args.funeral - args.debts;
  return base < 0n ? 0n : base;
}

/**
 * Bequests are valid iff their sum is ≤ 1/3 of (gross − funeral − debts),
 * per classical Sharia practice.
 */
export function bequestsValid(args: {
  gross: Cents;
  funeral: Cents;
  debts: Cents;
  bequests: Cents;
}): boolean {
  const cap = bequeathableBase(args) / 3n;
  return args.bequests <= cap;
}

/**
 * Floor of net × heirFraction. The product is exact in BigInt; we lose
 * at most (denominator − 1) cents per heir. Distributing the rounding
 * remainder by largest-remainder is a Phase 2 refinement.
 */
export function perHeirAmount(net: Cents, fraction: Fraction): Cents {
  return (net * fraction.numerator) / fraction.denominator;
}
