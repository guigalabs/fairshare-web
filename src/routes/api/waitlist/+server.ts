import { json, type RequestHandler } from "@sveltejs/kit";
import { makeDb } from "$lib/server/db/client";
import { waitlist } from "$lib/server/db/schema";
import { sendWaitlistAlert } from "$lib/server/notify";

export const prerender = false;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SOURCES = new Set(["pro", "ios"]);

function badRequest(error: string): Response {
  return json({ ok: false, error }, { status: 400 });
}

export const POST: RequestHandler = async ({ request, platform }) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return badRequest("invalid_json");
  }

  const raw = (body as { email?: unknown } | null)?.email;
  if (typeof raw !== "string" || !EMAIL_RE.test(raw)) return badRequest("invalid_email");

  const rawSource = (body as { source?: unknown } | null)?.source;
  const source = typeof rawSource === "string" && SOURCES.has(rawSource) ? rawSource : "pro";

  const rawReferrer = (body as { referrer?: unknown } | null)?.referrer;
  const referrer = typeof rawReferrer === "string" ? rawReferrer.slice(0, 500) : null;

  const email = raw.toLowerCase();

  const d1 = platform?.env?.DB;
  if (!d1) return json({ ok: false, error: "db_not_configured" }, { status: 503 });

  // ON CONFLICT DO NOTHING — repeat signups are idempotent. We still return
  // ok:true so the UI shows the "Thanks" state regardless of whether this is
  // a first-time signup or a re-submit.
  const db = makeDb(d1);
  const inserted = await db
    .insert(waitlist)
    .values({ email, source, referrer })
    .onConflictDoNothing({ target: [waitlist.email, waitlist.source] })
    .returning({ id: waitlist.id });

  // Alert only on first-time signups, after the response is sent. A failed
  // alert is logged and never fails the signup.
  const token = platform?.env?.CF_EMAIL_SEND_TOKEN;
  if (inserted.length > 0 && token) {
    const alert = sendWaitlistAlert(token, { email, source, referrer }).catch((err) =>
      console.error(err),
    );
    platform?.context?.waitUntil(alert);
  }

  return json({ ok: true });
};
