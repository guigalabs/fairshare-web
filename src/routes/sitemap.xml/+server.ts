import type { RequestHandler } from "./$types";
import { METHODOLOGY } from "$lib/content/methodology";

export const prerender = true;

const SITE = "https://fairshare.guigalabs.com";

interface PathSpec {
  /** Path with leading slash and no locale prefix, e.g. "/", "/calculate/". */
  path: string;
  changefreq: "daily" | "weekly" | "monthly" | "yearly";
  priority: number;
}

function pathSpecs(): PathSpec[] {
  const staticSpecs: PathSpec[] = [
    { path: "/", changefreq: "weekly", priority: 1.0 },
    { path: "/calculate/", changefreq: "monthly", priority: 0.95 },
    { path: "/methodology/", changefreq: "monthly", priority: 0.9 },
    { path: "/pricing/", changefreq: "monthly", priority: 0.9 },
    { path: "/for-attorneys/", changefreq: "monthly", priority: 0.8 },
    { path: "/for-scholars/", changefreq: "monthly", priority: 0.8 },
    { path: "/about/", changefreq: "yearly", priority: 0.4 },
    { path: "/disclaimer/", changefreq: "yearly", priority: 0.5 },
    { path: "/privacy/", changefreq: "yearly", priority: 0.3 },
    { path: "/terms/", changefreq: "yearly", priority: 0.3 },
  ];
  const methodologySpecs: PathSpec[] = METHODOLOGY.map((e) => ({
    path: `/methodology/${e.group}/${e.slug}/`,
    changefreq: "monthly",
    priority: 0.7,
  }));
  return [...staticSpecs, ...methodologySpecs];
}

const enUrl = (path: string) => `${SITE}${path}`;
const arUrl = (path: string) => `${SITE}/ar${path === "/" ? "/" : path}`;

function urlEntry(loc: string, alt: { en: string; ar: string }, spec: PathSpec, today: string) {
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${spec.changefreq}</changefreq>
    <priority>${spec.priority.toFixed(1)}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${alt.en}"/>
    <xhtml:link rel="alternate" hreflang="ar" href="${alt.ar}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${alt.en}"/>
  </url>`;
}

export const GET: RequestHandler = () => {
  const today = new Date().toISOString().slice(0, 10);
  const items: string[] = [];
  for (const spec of pathSpecs()) {
    const en = enUrl(spec.path);
    const ar = arUrl(spec.path);
    items.push(urlEntry(en, { en, ar }, spec, today));
    items.push(urlEntry(ar, { en, ar }, spec, today));
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${items.join("\n")}
</urlset>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
