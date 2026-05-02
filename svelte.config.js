import adapter from "@sveltejs/adapter-static";
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
      pages: "out",
      assets: "out",
      fallback: "404.html",
      precompress: false,
      strict: true,
    }),
    alias: {
      $engine: "src/lib/engine",
    },
    prerender: {
      // Routes that don't exist yet (built in later phases). Don't fail the
      // build on links to them — landing already renders, calculate/result/
      // saved/methodology arrive in B4-B9.
      handleHttpError: ({ path, message }) => {
        const pending = new Set([
          "/about",
          "/disclaimer",
          "/privacy",
          "/terms",
          "/settings",
        ]);
        if (pending.has(path)) return;
        throw new Error(message);
      },
    },
  },
};

export default config;
