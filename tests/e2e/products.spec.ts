import { test, expect } from "@playwright/test";

test("products page shows product list", async ({ page }) => {
  await page.goto("/products");
  await expect(page.locator("text=所有產品").first()).toBeVisible();
});

test("product detail page loads for a known product", async ({ page }) => {
  await page.goto("/products/ishiya-white-chocolate");
  await expect(page.locator("text=白之戀人").first()).toBeVisible();
});

test("product not found shows 404", async ({ page }) => {
  await page.goto("/products/nonexistent-product-xyz");
  await expect(page.locator("text=搵唔到").first()).toBeVisible();
});
