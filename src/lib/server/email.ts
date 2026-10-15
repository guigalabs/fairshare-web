export interface SignInEmail {
  subject: string;
  text: string;
  html: string;
}

export function buildSignInCodeEmail(args: { code: string; host: string }): SignInEmail {
  const subject = `Your FairShare sign-in code: ${args.code}`;
  const text = `Your FairShare sign-in code is ${args.code}\n\nEnter it on the sign-in page. It expires in 10 minutes.\n\nIf you didn't try to sign in to ${args.host}, you can ignore this email.\n`;
  const html = `<!doctype html>
<html lang="en">
<body style="font-family:system-ui,-apple-system,sans-serif;color:#0f172a;background:#fff;padding:2rem;line-height:1.55;">
  <div style="max-width:520px;margin:0 auto;">
    <h1 style="font-size:1.25rem;margin:0 0 1rem;">Your sign-in code</h1>
    <p>Enter this code on the FairShare sign-in page. It expires in 10 minutes.</p>
    <p style="margin:1.5rem 0;font-size:2rem;font-weight:700;letter-spacing:0.3em;font-family:ui-monospace,Menlo,monospace;">${escapeHtml(args.code)}</p>
    <hr style="border:none;border-top:1px solid #e2e8f0;margin:2rem 0;">
    <p style="font-size:0.8125rem;color:#64748b;">If you didn't try to sign in to ${escapeHtml(args.host)}, you can ignore this email.</p>
  </div>
</body>
</html>`;
  return { subject, text, html };
}

/** Six digits from a CSPRNG, zero-padded. */
export function newSignInCode(): string {
  const n = crypto.getRandomValues(new Uint32Array(1))[0] % 1_000_000;
  return String(n).padStart(6, "0");
}

export function isSignInCode(value: string): boolean {
  return /^\d{6}$/.test(value);
}

function escapeHtml(s: string): string {
  return s.replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[c] ?? c,
  );
}
