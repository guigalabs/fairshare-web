import { describe, expect, it } from "vitest";
import type { SavedCalculation } from "$lib/persistence";
import { dexieToCasePayload } from "./dexieImport";

describe("dexieToCasePayload", () => {
  it("maps the Dexie name to the server's deceasedName", () => {
    const local: SavedCalculation = {
      name: "Father Yousef (Hanafi)",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-02T00:00:00Z",
      subjectGender: "male",
      madhhab: "hanafi",
      heirs: [{ type: "wife", count: 1 }],
    };
    const out = dexieToCasePayload(local);
    expect(out.deceasedName).toBe("Father Yousef (Hanafi)");
    expect(out.subjectGender).toBe("male");
    expect(out.madhhab).toBe("hanafi");
    expect(out.heirs).toEqual([{ type: "wife", count: 1 }]);
  });

  it("falls back to a placeholder when the local row had no name", () => {
    const local: SavedCalculation = {
      name: "",
      createdAt: "",
      updatedAt: "",
      subjectGender: "female",
      madhhab: "shafii",
      heirs: [{ type: "husband", count: 1 }],
    };
    expect(dexieToCasePayload(local).deceasedName).toBe("Imported scenario");
  });
});
