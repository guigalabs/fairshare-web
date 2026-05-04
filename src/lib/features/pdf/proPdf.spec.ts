import { calculate, type HeirEntry } from "$engine";
import { describe, expect, it } from "vitest";
import { buildPractitionerPdf, type PractitionerCaseInput } from "./proPdf";

function baseCase(): PractitionerCaseInput {
  return {
    deceasedName: "Yousef Hassan",
    dateOfDeath: "2024-08-15",
    placeOfDeath: "Lahore, Pakistan",
    jurisdiction: "Punjab",
    deceasedIdentifier: "PK-12345",
    madhhab: "hanafi",
    subjectGender: "male",
    currency: "USD",
    grossEstate: 487_000_00n,
    funeralExpenses: 5_000_00n,
    debts: [{ creditor: "Habib Bank", amount: "20000.00" }],
    bequests: [{ beneficiary: "Yetama charity", amount: "30000.00" }],
    specialFlags: {},
    advisoryNotes: "After consultation with the family, distribution accepted.",
    heirs: [
      { type: "wife", count: 1 } as HeirEntry,
      { type: "son", count: 2 } as HeirEntry,
      { type: "daughter", count: 1 } as HeirEntry,
    ],
  };
}

async function bytesOf(blob: Blob): Promise<Uint8Array> {
  return new Uint8Array(await blob.arrayBuffer());
}

describe("buildPractitionerPdf", () => {
  it("produces a PDF blob with the proper magic bytes", async () => {
    const c = baseCase();
    const blob = await buildPractitionerPdf({
      case: c,
      result: calculate({ subjectGender: "male", heirs: c.heirs, madhhab: "hanafi" }),
      net: 432_000_00n,
      debtsTotal: 20_000_00n,
      bequestsTotal: 30_000_00n,
    });
    expect(blob.type).toBe("application/pdf");
    const bytes = await bytesOf(blob);
    expect(bytes.length).toBeGreaterThan(2000);
    // %PDF-
    expect([bytes[0], bytes[1], bytes[2], bytes[3], bytes[4]]).toEqual([
      0x25, 0x50, 0x44, 0x46, 0x2d,
    ]);
  });

  it("renders without an estate block when grossEstate is 0", async () => {
    const c = { ...baseCase(), grossEstate: 0n, debts: [], bequests: [] };
    const blob = await buildPractitionerPdf({
      case: c,
      result: calculate({ subjectGender: "male", heirs: c.heirs, madhhab: "hanafi" }),
      net: 0n,
      debtsTotal: 0n,
      bequestsTotal: 0n,
    });
    expect((await bytesOf(blob)).length).toBeGreaterThan(1500);
  });

  it("does not throw with all special-case flags set", async () => {
    const c = {
      ...baseCase(),
      specialFlags: {
        mafqud: "Brother Ali; last seen 2018",
        haml: "Widow 6mo pregnant",
        hadm: "Father and son perished in same accident",
        apostate: "n/a",
        qatil: "n/a",
        nonMuslimHeir: "Christian sister; not inheriting per Hanafi rule",
      },
    };
    const blob = await buildPractitionerPdf({
      case: c,
      result: calculate({ subjectGender: "male", heirs: c.heirs, madhhab: "hanafi" }),
      net: 432_000_00n,
      debtsTotal: 20_000_00n,
      bequestsTotal: 30_000_00n,
    });
    expect(blob.size).toBeGreaterThan(2000);
  });

  it("respects the firm letterhead override", async () => {
    const c = baseCase();
    const blob = await buildPractitionerPdf({
      case: c,
      result: calculate({ subjectGender: "male", heirs: c.heirs, madhhab: "hanafi" }),
      net: 432_000_00n,
      debtsTotal: 20_000_00n,
      bequestsTotal: 30_000_00n,
      branding: { letterhead: "Hassan & Partners, LLP", primaryColor: "#1f3a5f" },
    });
    expect(blob.size).toBeGreaterThan(2000);
  });
});
