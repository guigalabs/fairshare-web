import { describe, expect, it } from "vitest";
import { brandingPutSchema } from "./branding";

describe("brandingPutSchema", () => {
  it("accepts an empty payload", () => {
    expect(brandingPutSchema.safeParse({}).success).toBe(true);
  });

  it("accepts a 6-digit hex color with or without #", () => {
    expect(brandingPutSchema.safeParse({ primaryColor: "#1f3a5f" }).success).toBe(true);
    expect(brandingPutSchema.safeParse({ primaryColor: "1f3a5f" }).success).toBe(true);
  });

  it("rejects an invalid color", () => {
    expect(brandingPutSchema.safeParse({ primaryColor: "rebeccapurple" }).success).toBe(false);
    expect(brandingPutSchema.safeParse({ primaryColor: "#fff" }).success).toBe(false);
  });

  it("caps long strings", () => {
    expect(brandingPutSchema.safeParse({ customDisclaimerEn: "x".repeat(2001) }).success).toBe(
      false,
    );
  });

  it("trims letterhead whitespace", () => {
    const r = brandingPutSchema.safeParse({ letterheadText: "  Hassan & Partners  " });
    expect(r.success).toBe(true);
    expect(r.data?.letterheadText).toBe("Hassan & Partners");
  });
});
