import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      $engine: path.resolve(import.meta.dirname, "src/lib/engine"),
      $lib: path.resolve(import.meta.dirname, "src/lib"),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.{test,spec}.{js,ts}"],
    exclude: ["tests/e2e/**", "tests/a11y/**", "node_modules/**"],
  },
});
