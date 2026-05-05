import { expect, test } from "@playwright/test";

test("/for-scholars renders heading and a pricing CTA", async ({ page }) => {
  await page.goto("/for-scholars");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/scholars/i);
  await expect(page.getByRole("link", { name: "See pricing" })).toHaveAttribute("href", "/pricing");
});
