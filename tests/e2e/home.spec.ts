import { test, expect } from "@playwright/test";

test("home page loads with featured products section", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1").first()).toBeVisible();
  await expect(page.locator("text=精選產品").first()).toBeVisible();
});

test("navigation links work", async ({ page }) => {
  await page.goto("/");
  await page.click("text=產品");
  await expect(page).toHaveURL(/\/products/);
});

test("hero section has CTA button to products", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("text=探索禮盒").first()).toBeVisible();
});
