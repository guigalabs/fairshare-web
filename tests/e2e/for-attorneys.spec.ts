import { expect, test } from "@playwright/test";

test("/for-attorneys renders heading and a pricing CTA", async ({ page }) => {
  await page.goto("/for-attorneys");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/attorneys/i);
  await expect(page.getByRole("link", { name: "See pricing" })).toHaveAttribute("href", "/pricing");
});
