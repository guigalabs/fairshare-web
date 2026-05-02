import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.{test,spec}.{js,ts}"],
    exclude: ["tests/e2e/**", "tests/a11y/**", "node_modules/**"],
  },
});
