import { expect, test } from "@playwright/test";

test("landing page loads with title and a heading", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/FairShare/);
  await expect(page.locator("h1")).toBeVisible();
});

test("landing page surfaces a Pro-for-Practitioners CTA linking to /pricing", async ({ page }) => {
  await page.goto("/");
  const cta = page.getByRole("link", { name: /fairshare for practitioners/i });
  await expect(cta).toBeVisible();
  await expect(cta).toHaveAttribute("href", "/pricing");
});
