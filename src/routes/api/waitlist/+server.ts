import { json, type RequestHandler } from "@sveltejs/kit";

export const prerender = false;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function badRequest(error: string): Response {
  return json({ ok: false, error }, { status: 400 });
}

const SOURCES = new Set(["pro", "ios"]);

export const POST: RequestHandler = async ({ request, platform }) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return badRequest("invalid_json");
  }

  const raw = (body as { email?: unknown } | null)?.email;
  if (typeof raw !== "string" || !EMAIL_RE.test(raw)) return badRequest("invalid_email");

  // `source` distinguishes Pro waitlist from iOS waitlist on the same KV.
  // Defaults to "pro" so the existing pricing form keeps its key shape.
  const rawSource = (body as { source?: unknown } | null)?.source;
  const source = typeof rawSource === "string" && SOURCES.has(rawSource) ? rawSource : "pro";

  const kv = platform?.env?.WAITLIST_KV;
  if (!kv) return json({ ok: false, error: "kv_not_configured" }, { status: 503 });

  const email = raw.toLowerCase();
  const key = source === "pro" ? `waitlist:${email}` : `waitlist:${source}:${email}`;
  await kv.put(key, JSON.stringify({ email, source, createdAt: new Date().toISOString() }));
  return json({ ok: true });
};
