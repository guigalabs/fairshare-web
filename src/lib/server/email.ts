export interface MagicLinkEmail {
  subject: string;
  text: string;
  html: string;
}

export function buildMagicLinkEmail(args: { url: string; identifier: string }): MagicLinkEmail {
  const host = new URL(args.url).host;
  const subject = `Sign in to ${host}`;
  const text = `Sign in to ${host}\n\nClick the link below to sign in to your FairShare account.\nThis link expires in 10 minutes.\n\n${args.url}\n\nIf you didn't request this, you can safely ignore this email.\n`;
  const html = `<!doctype html>
<html lang="en">
<body style="font-family:system-ui,-apple-system,sans-serif;color:#0f172a;background:#fff;padding:2rem;line-height:1.55;">
  <div style="max-width:520px;margin:0 auto;">
    <h1 style="font-size:1.25rem;margin:0 0 1rem;">Sign in to ${escapeHtml(host)}</h1>
    <p>Click the button below to sign in to your FairShare account. The link expires in 10 minutes.</p>
    <p style="margin:1.5rem 0;">
      <a href="${escapeHtml(args.url)}" style="display:inline-block;background:#0f172a;color:#fff;padding:0.75rem 1.25rem;border-radius:9999px;text-decoration:none;font-weight:600;">Sign in</a>
    </p>
    <p style="font-size:0.875rem;color:#64748b;">Or copy and paste this URL into your browser:<br><span style="word-break:break-all;">${escapeHtml(args.url)}</span></p>
    <hr style="border:none;border-top:1px solid #e2e8f0;margin:2rem 0;">
    <p style="font-size:0.8125rem;color:#64748b;">If you didn't request this email, you can safely ignore it.</p>
  </div>
</body>
</html>`;
  return { subject, text, html };
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
