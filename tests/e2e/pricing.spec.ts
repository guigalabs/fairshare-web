import { expect, test } from "@playwright/test";

test("/pricing renders heading and Pro plan", async ({ page }) => {
  await page.goto("/pricing");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/pro/i);
});

test("/pricing has monthly and annual cadence toggle with both prices visible", async ({
  page,
}) => {
  await page.goto("/pricing");
  const monthly = page.getByRole("button", { name: /monthly/i });
  const annual = page.getByRole("button", { name: /annual/i });
  await expect(monthly).toBeVisible();
  await expect(annual).toBeVisible();

  await expect(page.getByText("$19")).toBeVisible();

  await annual.click();
  await expect(page.getByText("$179")).toBeVisible();
});

test("/pricing exposes a waitlist email form", async ({ page }) => {
  await page.goto("/pricing");
  const email = page.getByRole("textbox", { name: /email/i });
  const submit = page.getByRole("button", { name: "Notify me" });
  await expect(email).toBeVisible();
  await expect(submit).toBeVisible();
});
