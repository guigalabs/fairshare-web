import path from "node:path";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [svelte({ hot: false })],
  resolve: {
    alias: {
      $engine: path.resolve(import.meta.dirname, "src/lib/engine"),
      $lib: path.resolve(import.meta.dirname, "src/lib"),
      "$app/environment": path.resolve(
        import.meta.dirname,
        "src/lib/test/app-environment-stub.ts",
      ),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.{test,spec}.{js,ts}"],
    exclude: ["tests/e2e/**", "tests/a11y/**", "node_modules/**"],
  },
});
