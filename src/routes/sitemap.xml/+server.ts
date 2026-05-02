import type { RequestHandler } from "./$types";
import { METHODOLOGY } from "$lib/content/methodology";

export const prerender = true;

const SITE = "https://fairshare.guigalabs.com";

interface Entry {
  loc: string;
  lastmod: string;
  changefreq: "daily" | "weekly" | "monthly" | "yearly";
  priority: number;
}

function entries(): Entry[] {
  const today = new Date().toISOString().slice(0, 10);
  const staticPages: Entry[] = [
    { loc: `${SITE}/`, lastmod: today, changefreq: "weekly", priority: 1.0 },
    { loc: `${SITE}/calculate/`, lastmod: today, changefreq: "monthly", priority: 0.95 },
    { loc: `${SITE}/methodology/`, lastmod: today, changefreq: "monthly", priority: 0.9 },
    { loc: `${SITE}/about/`, lastmod: today, changefreq: "yearly", priority: 0.4 },
    { loc: `${SITE}/disclaimer/`, lastmod: today, changefreq: "yearly", priority: 0.5 },
    { loc: `${SITE}/privacy/`, lastmod: today, changefreq: "yearly", priority: 0.3 },
    { loc: `${SITE}/terms/`, lastmod: today, changefreq: "yearly", priority: 0.3 },
  ];
  const methodologyPages: Entry[] = METHODOLOGY.map((e) => ({
    loc: `${SITE}/methodology/${e.group}/${e.slug}/`,
    lastmod: today,
    changefreq: "monthly",
    priority: 0.7,
  }));
  return [...staticPages, ...methodologyPages];
}

export const GET: RequestHandler = () => {
  const items = entries()
    .map(
      (e) => `  <url>
    <loc>${e.loc}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority.toFixed(1)}</priority>
  </url>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</urlset>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
