import { describe, expect, it, vi } from "vitest";
import { buildWaitlistAlert, sendWaitlistAlert } from "./notify";

const signup = { email: "amina@example.com", source: "pro", referrer: "https://x.com/post" };

describe("buildWaitlistAlert", () => {
  it("names the list and includes where they came from", () => {
    const { subject, text } = buildWaitlistAlert(signup, new Date("2026-10-06T00:00:00Z"));
    expect(subject).toBe("New waitlist signup: amina@example.com (FairShare Pro)");
    expect(text).toContain("Came from: https://x.com/post");
    expect(text).toContain("2026-10-06T00:00:00.000Z");
  });
});

describe("sendWaitlistAlert", () => {
  it("posts to Cloudflare Email Sending with reply-to set to the signup", async () => {
    const fetcher = vi.fn(async () => new Response("{}", { status: 200 }));
    await sendWaitlistAlert("tok", signup, fetcher as unknown as typeof fetch);
    const [url, init] = fetcher.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toContain("/email/sending/send");
    expect((init.headers as Record<string, string>).authorization).toBe("Bearer tok");
    const body = JSON.parse(init.body as string);
    expect(body.to).toBe("fairshare@guigalabs.com");
    expect(body.reply_to).toBe("amina@example.com");
    expect(body.from.address).toBe("fairshare@notify.guigalabs.com");
  });

  it("throws when Cloudflare rejects the send", async () => {
    const fetcher = vi.fn(async () => new Response("nope", { status: 403 }));
    await expect(
      sendWaitlistAlert("tok", signup, fetcher as unknown as typeof fetch),
    ).rejects.toThrow(/403/);
  });
});
