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
  },
};

export default config;
