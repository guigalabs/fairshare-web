import { expect, test } from "@playwright/test";

test("landing page loads with title and a heading", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/FairShare/);
  await expect(page.locator("h1")).toBeVisible();
});

test("landing page surfaces a Pro CTA linking to /pricing", async ({ page }) => {
  await page.goto("/");
  const cta = page.getByRole("link", { name: /see pro plans/i });
  await expect(cta).toBeVisible();
  await expect(cta).toHaveAttribute("href", "/pricing");
});

test("hero ledger switches families and links into the calculator", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("tab", { name: /three daughters/i }).click();
  await expect(page.getByRole("tabpanel")).toContainText("'awl");
  const open = page.getByRole("link", { name: /open this family/i });
  await expect(open).toHaveAttribute("href", /^\/result\?case=/);
});
