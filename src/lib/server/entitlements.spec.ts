import { describe, expect, it } from "vitest";
import { hasProEntitlement } from "./entitlements";

const now = new Date("2026-01-15T12:00:00Z");
const future = new Date("2026-02-15T12:00:00Z");
const past = new Date("2026-01-01T00:00:00Z");

describe("hasProEntitlement", () => {
  it("denies when no subscription exists", () => {
    expect(hasProEntitlement(null, now)).toBe(false);
    expect(hasProEntitlement(undefined, now)).toBe(false);
  });

  it("grants on active regardless of period_end", () => {
    expect(hasProEntitlement({ status: "active", currentPeriodEnd: null }, now)).toBe(true);
    expect(hasProEntitlement({ status: "active", currentPeriodEnd: past }, now)).toBe(true);
  });

  it("grants on past_due during the grace period", () => {
    expect(hasProEntitlement({ status: "past_due", currentPeriodEnd: future }, now)).toBe(true);
  });

  it("denies on past_due after current_period_end", () => {
    expect(hasProEntitlement({ status: "past_due", currentPeriodEnd: past }, now)).toBe(false);
  });

  it("grants on canceled during the wind-down period", () => {
    expect(hasProEntitlement({ status: "canceled", currentPeriodEnd: future }, now)).toBe(true);
  });

  it("denies on canceled after current_period_end", () => {
    expect(hasProEntitlement({ status: "canceled", currentPeriodEnd: past }, now)).toBe(false);
  });

  it("denies on trialing (the free site is the trial — no in-product trial)", () => {
    expect(hasProEntitlement({ status: "trialing", currentPeriodEnd: future }, now)).toBe(false);
  });

  it("denies for any unknown status", () => {
    expect(hasProEntitlement({ status: "expired", currentPeriodEnd: future }, now)).toBe(false);
  });
});
