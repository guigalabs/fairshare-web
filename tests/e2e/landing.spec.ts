import { expect, test } from "@playwright/test";

test("landing page loads with title and a heading", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/FairShare/);
  await expect(page.locator("h1")).toBeVisible();
});
