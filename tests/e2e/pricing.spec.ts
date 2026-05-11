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

test("/pricing exposes a waitlist email form via the Subscribe modal", async ({ page }) => {
  await page.goto("/pricing");
  await page.getByRole("button", { name: /subscribe to pro/i }).click();

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("textbox", { name: /email/i })).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Notify me" })).toBeVisible();
});

test("/pricing waitlist submit posts to /api/waitlist with source=pro and shows thanks", async ({
  page,
}) => {
  const captured: { email?: string; source?: string }[] = [];
  await page.route("**/api/waitlist", async (route) => {
    captured.push((await route.request().postDataJSON()) as { email?: string; source?: string });
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true }),
    });
  });

  await page.goto("/pricing");
  await page.getByRole("button", { name: /subscribe to pro/i }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("textbox", { name: /email/i }).fill("amina@example.com");
  await dialog.getByRole("button", { name: "Notify me" }).click();

  await expect(dialog.getByRole("status")).toHaveText(/you're in/i);
  expect(captured).toEqual([{ email: "amina@example.com", source: "pro" }]);
});

test("/pricing waitlist surfaces an inline error when /api/waitlist fails", async ({ page }) => {
  await page.route("**/api/waitlist", (route) =>
    route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({ ok: false, error: "db_not_configured" }),
    }),
  );

  await page.goto("/pricing");
  await page.getByRole("button", { name: /subscribe to pro/i }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("textbox", { name: /email/i }).fill("amina@example.com");
  await dialog.getByRole("button", { name: "Notify me" }).click();

  await expect(dialog.getByRole("alert")).toHaveText(/something went wrong/i);
});
