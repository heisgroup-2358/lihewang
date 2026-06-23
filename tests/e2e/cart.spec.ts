import { test, expect } from "@playwright/test";

test("cart page loads", async ({ page }) => {
  await page.goto("/cart");
  await expect(page.locator("text=購物車").first()).toBeVisible();
});

test("checkout page loads", async ({ page }) => {
  await page.goto("/checkout");
  await expect(page.locator("text=結帳").first()).toBeVisible();
});
