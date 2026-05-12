import adapter from "@sveltejs/adapter-cloudflare";
import { relative, sep } from "node:path";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  compilerOptions: {
    runes: ({ filename }) => {
      const relativePath = relative(import.meta.dirname, filename);
      const pathSegments = relativePath.toLowerCase().split(sep);
      const isExternalLibrary = pathSegments.includes("node_modules");
      return isExternalLibrary ? undefined : true;
    },
  },
  kit: {
    adapter: adapter({
      // Prerendered routes are emitted as plain HTML files; the
      // _worker.js handles only routes that opt out of prerender
      // (e.g. /api/**, future /app/**).
      fallback: "404",
    }),
    alias: {
      $engine: "src/lib/engine",
    },
    prerender: {
      // The /ar/ subtree is reached via the reroute hook (src/hooks.ts),
      // not via separate route files, so SvelteKit's crawler can't
      // discover it from internal links alone. List the AR variant of
      // every prerenderable public route so each gets emitted as static
      // HTML (matters both for SEO crawlers and for `vite preview` in
      // CI, which only serves prerendered routes).
      entries: [
        "*",
        "/ar/",
        "/ar/calculate",
        "/ar/methodology",
        "/ar/pricing",
        "/ar/for-attorneys",
        "/ar/for-scholars",
        "/ar/about",
        "/ar/disclaimer",
        "/ar/privacy",
        "/ar/terms",
        "/ar/methodology/madhhab/general",
        "/ar/methodology/madhhab/hanafi",
        "/ar/methodology/madhhab/maliki",
        "/ar/methodology/madhhab/shafii",
        "/ar/methodology/madhhab/hanbali",
        "/ar/methodology/rules/fixed-shares",
        "/ar/methodology/rules/blocking",
        "/ar/methodology/rules/residuary",
        "/ar/methodology/rules/awl",
        "/ar/methodology/rules/radd",
        "/ar/methodology/special-cases/umariatan",
        "/ar/methodology/special-cases/musharakah",
        "/ar/methodology/special-cases/grandfather-with-siblings",
      ],
    },
  },
};

export default config;
