import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("/for-scholars has no axe violations", async ({ page }) => {
  await page.goto("/for-scholars");
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});
