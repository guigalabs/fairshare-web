import { expect, test } from "@playwright/test";

// Smoke test for the /ar/ Arabic subtree. Locks in the contract:
// - /ar/<path> serves Arabic content and sets <html lang="ar" dir="rtl">.
// - canonical is self-referential (does NOT redirect to the EN URL).
// - hreflang link tags link the locales to each other.
// - Internal nav links preserve the /ar/ prefix so users stay in AR.

test("/ar serves Arabic home with correct lang+dir", async ({ page }) => {
  await page.goto("/ar");
  const html = page.locator("html");
  await expect(html).toHaveAttribute("lang", "ar");
  await expect(html).toHaveAttribute("dir", "rtl");
  await expect(page).toHaveTitle(/فيرشير/);
});

test("/ar canonical and hreflang are correct", async ({ page }) => {
  await page.goto("/ar");
  const canonical = page.locator('link[rel="canonical"]');
  await expect(canonical).toHaveAttribute("href", "https://fairshare.guigalabs.com/ar/");
  await expect(page.locator('link[hreflang="en"]')).toHaveAttribute(
    "href",
    "https://fairshare.guigalabs.com/",
  );
  await expect(page.locator('link[hreflang="ar"]')).toHaveAttribute(
    "href",
    "https://fairshare.guigalabs.com/ar/",
  );
  await expect(page.locator('link[hreflang="x-default"]')).toHaveAttribute(
    "href",
    "https://fairshare.guigalabs.com/",
  );
});

test("EN home keeps unprefixed canonical and points hreflang to /ar/", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://fairshare.guigalabs.com/",
  );
  await expect(page.locator('link[hreflang="ar"]')).toHaveAttribute(
    "href",
    "https://fairshare.guigalabs.com/ar/",
  );
});

test("AR nav links stay inside /ar/", async ({ page }) => {
  await page.goto("/ar/methodology");
  // The Pro nav link in AR should go to /ar/pricing, not /pricing.
  const proLink = page.locator('header a[href*="pricing"]').first();
  await expect(proLink).toHaveAttribute("href", "/ar/pricing");
});

test("AR methodology drill-down has Arabic title and Arabic canonical", async ({ page }) => {
  await page.goto("/ar/methodology/madhhab/hanafi");
  await expect(page).toHaveTitle(/الحنفي/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://fairshare.guigalabs.com/ar/methodology/madhhab/hanafi/",
  );
});
