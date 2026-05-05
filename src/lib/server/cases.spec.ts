import { describe, expect, it } from "vitest";
import { caseCreateSchema, casePatchSchema, heirEntrySchema } from "./cases";

const baseCase = {
  deceasedName: "Yousef Hassan",
  subjectGender: "male" as const,
  madhhab: "hanafi" as const,
  heirs: [{ type: "wife" as const, count: 1 }],
};

describe("caseCreateSchema", () => {
  it("accepts a minimal payload", () => {
    const r = caseCreateSchema.safeParse(baseCase);
    expect(r.success).toBe(true);
  });

  it("requires at least one heir", () => {
    const r = caseCreateSchema.safeParse({ ...baseCase, heirs: [] });
    expect(r.success).toBe(false);
  });

  it("rejects unknown heir types", () => {
    const r = caseCreateSchema.safeParse({
      ...baseCase,
      heirs: [{ type: "neighbor", count: 1 }],
    });
    expect(r.success).toBe(false);
  });

  it("rejects unknown madhhabs", () => {
    const r = caseCreateSchema.safeParse({ ...baseCase, madhhab: "wahhabi" });
    expect(r.success).toBe(false);
  });

  it("validates money strings (no scientific notation, max 2 decimals)", () => {
    expect(caseCreateSchema.safeParse({ ...baseCase, grossEstate: "1.234" }).success).toBe(false);
    expect(caseCreateSchema.safeParse({ ...baseCase, grossEstate: "1e6" }).success).toBe(false);
    expect(caseCreateSchema.safeParse({ ...baseCase, grossEstate: "1234.50" }).success).toBe(true);
  });

  it("defaults funeral expenses to 0 and tags to []", () => {
    const r = caseCreateSchema.safeParse(baseCase);
    expect(r.success).toBe(true);
    expect(r.data?.funeralExpenses).toBe("0");
    expect(r.data?.tags).toEqual([]);
  });

  it("currency must be exactly 3 letters (ISO-4217)", () => {
    expect(caseCreateSchema.safeParse({ ...baseCase, currency: "US" }).success).toBe(false);
    expect(caseCreateSchema.safeParse({ ...baseCase, currency: "USDT" }).success).toBe(false);
    expect(caseCreateSchema.safeParse({ ...baseCase, currency: "USD" }).success).toBe(true);
  });
});

describe("heirEntrySchema (named heirs)", () => {
  it("accepts the count-only shape (engine-compatible)", () => {
    const r = heirEntrySchema.safeParse({ type: "son", count: 3 });
    expect(r.success).toBe(true);
  });

  it("accepts named persons up to count", () => {
    const r = heirEntrySchema.safeParse({
      type: "son",
      count: 3,
      persons: [{ name: "Ahmad" }, { name: "Mohammad" }],
    });
    expect(r.success).toBe(true);
  });

  it("rejects more persons than count", () => {
    const r = heirEntrySchema.safeParse({
      type: "son",
      count: 1,
      persons: [{ name: "A" }, { name: "B" }],
    });
    expect(r.success).toBe(false);
  });

  it("preserves engine-input shape (engine reads only type+count)", () => {
    const parsed = heirEntrySchema.parse({
      type: "wife",
      count: 1,
      persons: [{ name: "Khadija" }],
    });
    expect(parsed.type).toBe("wife");
    expect(parsed.count).toBe(1);
  });
});

describe("specialFlags (mafqud / haml / hadm / apostate / qatil / non-Muslim)", () => {
  it("accepts a free-text note per flag", () => {
    const r = caseCreateSchema.safeParse({
      ...baseCase,
      specialFlags: { mafqud: "Brother Ali; last seen 2018", haml: "Widow 6mo pregnant" },
    });
    expect(r.success).toBe(true);
    expect(r.data?.specialFlags.mafqud).toContain("Ali");
  });

  it("defaults to {} when omitted", () => {
    const r = caseCreateSchema.safeParse(baseCase);
    expect(r.success).toBe(true);
    expect(r.data?.specialFlags).toEqual({});
  });
});

describe("debts and bequests", () => {
  it("requires creditor name and money-formatted amount", () => {
    expect(
      caseCreateSchema.safeParse({
        ...baseCase,
        debts: [{ creditor: "Bank", amount: "1500.00" }],
      }).success,
    ).toBe(true);
  });

  it("rejects unformatted debt amounts", () => {
    expect(
      caseCreateSchema.safeParse({
        ...baseCase,
        debts: [{ creditor: "Bank", amount: "1500.999" }],
      }).success,
    ).toBe(false);
  });

  it("accepts bequests with the same shape (1/3 cap is enforced separately)", () => {
    expect(
      caseCreateSchema.safeParse({
        ...baseCase,
        bequests: [{ beneficiary: "Yetama Charity", amount: "100.00", note: "Annual zakat" }],
      }).success,
    ).toBe(true);
  });
});

describe("casePatchSchema", () => {
  it("allows updating only the advisory_notes field", () => {
    const r = casePatchSchema.safeParse({ advisoryNotes: "After review with the family..." });
    expect(r.success).toBe(true);
  });

  it("does NOT inject create-schema defaults into an empty PATCH", () => {
    const r = casePatchSchema.safeParse({});
    expect(r.success).toBe(true);
    expect(r.data).toEqual({});
    expect(r.data?.tags).toBeUndefined();
    expect(r.data?.debts).toBeUndefined();
    expect(r.data?.bequests).toBeUndefined();
    expect(r.data?.specialFlags).toBeUndefined();
    expect(r.data?.currency).toBeUndefined();
    expect(r.data?.funeralExpenses).toBeUndefined();
  });

  it("does NOT inject defaults when patching an unrelated field", () => {
    const r = casePatchSchema.safeParse({ jurisdiction: "Lahore, Pakistan" });
    expect(r.success).toBe(true);
    // The rest of the case must not be silently rewritten back to defaults.
    expect(Object.keys(r.data ?? {}).sort()).toEqual(["jurisdiction"]);
  });

  it("rejects unknown keys (.strict prevents silent typos)", () => {
    const r = casePatchSchema.safeParse({ deceasedNamez: "typo" });
    expect(r.success).toBe(false);
  });
});
