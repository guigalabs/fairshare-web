import { afterEach, describe, expect, it, vi } from "vitest";

// Mock the drizzle client before importing the handler. The handler only
// chains insert().values().onConflictDoNothing(), so the mock captures the
// values passed in and asserts on them. Returns this from each link.
interface Captured {
  email: string;
  source: string;
  referrer: string | null;
}
const captured: Captured[] = [];

vi.mock("$lib/server/db/client", () => ({
  makeDb: () => ({
    insert: () => ({
      values: (row: Captured) => {
        captured.push(row);
        return { onConflictDoNothing: () => Promise.resolve() };
      },
    }),
  }),
}));

import type { RequestEvent } from "./$types";
import { POST } from "./+server";

function makeEvent(body: unknown): RequestEvent {
  return {
    request: new Request("https://x/api/waitlist", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
    platform: { env: { DB: {} as D1Database } },
  } as RequestEvent;
}

function makeUnboundEvent(body: unknown): RequestEvent {
  return {
    request: new Request("https://x/api/waitlist", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
    platform: undefined,
  } as RequestEvent;
}

afterEach(() => {
  captured.length = 0;
});

describe("POST /api/waitlist", () => {
  it("stores a valid email and returns ok", async () => {
    const res = await POST(makeEvent({ email: "amina@example.com" }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(captured).toHaveLength(1);
    expect(captured[0].email).toBe("amina@example.com");
    expect(captured[0].source).toBe("pro");
  });

  it("accepts an ios source", async () => {
    await POST(makeEvent({ email: "x@y.com", source: "ios" }));
    expect(captured[0].source).toBe("ios");
  });

  it("falls back to pro for unknown sources", async () => {
    await POST(makeEvent({ email: "x@y.com", source: "made-up" }));
    expect(captured[0].source).toBe("pro");
  });

  it("captures referrer when provided and truncates long values", async () => {
    await POST(makeEvent({ email: "x@y.com", referrer: "https://example.com/blog" }));
    expect(captured[0].referrer).toBe("https://example.com/blog");

    const long = "https://x/" + "a".repeat(2000);
    await POST(makeEvent({ email: "x2@y.com", referrer: long }));
    expect(captured[1].referrer?.length).toBe(500);
  });

  it("normalizes email to lowercase", async () => {
    await POST(makeEvent({ email: "Mixed@Case.COM" }));
    expect(captured[0].email).toBe("mixed@case.com");
  });

  it("rejects malformed email with 400", async () => {
    const res = await POST(makeEvent({ email: "not-an-email" }));
    expect(res.status).toBe(400);
    expect(captured).toHaveLength(0);
  });

  it("rejects missing email with 400", async () => {
    const res = await POST(makeEvent({}));
    expect(res.status).toBe(400);
  });

  it("rejects malformed JSON with 400", async () => {
    const res = await POST(makeEvent("{not json"));
    expect(res.status).toBe(400);
  });

  it("returns 503 when the database isn't configured", async () => {
    const res = await POST(makeUnboundEvent({ email: "x@y.com" }));
    expect(res.status).toBe(503);
  });
});
