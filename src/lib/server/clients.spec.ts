import { describe, expect, it } from "vitest";
import { clientCreateSchema, clientPatchSchema } from "./clients";

describe("clientCreateSchema", () => {
  it("accepts a minimal payload (display name only)", () => {
    const r = clientCreateSchema.safeParse({ displayName: "Hassan family" });
    expect(r.success).toBe(true);
    expect(r.data?.displayName).toBe("Hassan family");
  });

  it("rejects an empty display name", () => {
    const r = clientCreateSchema.safeParse({ displayName: "" });
    expect(r.success).toBe(false);
  });

  it("trims whitespace on display name", () => {
    const r = clientCreateSchema.safeParse({ displayName: "  Hassan family  " });
    expect(r.success).toBe(true);
    expect(r.data?.displayName).toBe("Hassan family");
  });

  it("rejects an invalid contact email", () => {
    const r = clientCreateSchema.safeParse({
      displayName: "Hassan",
      primaryContactEmail: "not-an-email",
    });
    expect(r.success).toBe(false);
  });

  it("treats empty-string contact email as null (UI hands us empties)", () => {
    const r = clientCreateSchema.safeParse({
      displayName: "Hassan",
      primaryContactEmail: "",
    });
    expect(r.success).toBe(true);
    expect(r.data?.primaryContactEmail).toBeNull();
  });

  it("caps display name at 200 characters", () => {
    const r = clientCreateSchema.safeParse({ displayName: "x".repeat(201) });
    expect(r.success).toBe(false);
  });
});

describe("clientPatchSchema", () => {
  it("allows an empty patch (no-op update)", () => {
    const r = clientPatchSchema.safeParse({});
    expect(r.success).toBe(true);
  });

  it("allows clearing notes by passing null", () => {
    const r = clientPatchSchema.safeParse({ notes: null });
    expect(r.success).toBe(true);
    expect(r.data?.notes).toBeNull();
  });

  it("preserves clientCreate validation rules on patched fields", () => {
    const r = clientPatchSchema.safeParse({ displayName: "" });
    expect(r.success).toBe(false);
  });
});
