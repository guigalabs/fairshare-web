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

test("/pricing waitlist submit posts to /api/waitlist and shows thanks", async ({ page }) => {
  const captured: { email?: string }[] = [];
  await page.route("**/api/waitlist", async (route) => {
    captured.push((await route.request().postDataJSON()) as { email?: string });
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true }),
    });
  });

  await page.goto("/pricing");
  await page.getByRole("textbox", { name: /email/i }).fill("amina@firm.com");
  await page.getByRole("button", { name: "Notify me" }).click();

  await expect(page.getByRole("status")).toHaveText(/thanks/i);
  expect(captured).toEqual([{ email: "amina@firm.com" }]);
});

test("/pricing waitlist surfaces an inline error when /api/waitlist fails", async ({ page }) => {
  await page.route("**/api/waitlist", (route) =>
    route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({ ok: false, error: "kv_not_configured" }),
    }),
  );

  await page.goto("/pricing");
  await page.getByRole("textbox", { name: /email/i }).fill("amina@firm.com");
  await page.getByRole("button", { name: "Notify me" }).click();

  await expect(page.getByRole("alert")).toHaveText(/something went wrong/i);
});
