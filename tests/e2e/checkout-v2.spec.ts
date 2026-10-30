import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

async function bag(page: import("@playwright/test").Page) {
  await page.goto("/en/products/weft-structured-tote?colour=brown");
  await page.locator(".buy-box").getByRole("button", { name: "Add to bag" }).click();
  await expect(page).toHaveURL(/\/en\/cart\?added=1/);
  await page.getByRole("link", { name: /checkout/i }).click();
  await expect(page).toHaveURL(/\/en\/checkout/);
}

for (const width of [360, 390, 768, 1024, 1440]) {
  for (const motion of ["no-preference", "reduce"] as const) {
    test(`F8 checkout at ${width}px with ${motion}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: motion });
      await bag(page);
      await expect(page.getByText("30,000 ₫", { exact: false }).first()).toBeVisible();
      await page.locator("#delivery-city").selectOption("other");
      await page.getByRole("button", { name: /Review total/ }).click();
      await expect(page.locator(".summary-total")).toContainText("1.930.000 ₫");
      await page.locator(".checkout-form").getByRole("button", { name: /Place order/ }).click();
      await expect(page.locator("#error-name")).toBeVisible();
      await expect(page.locator("#error-phone")).toBeVisible();
      await expect(page.locator("#error-address")).toBeVisible();
      await expect(page.locator("#error-consent")).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
    });
  }
}

test("F8 COD order clears bag and records confirmation", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await bag(page);
  await page.locator("#buyer-name").fill("Test Customer");
  await page.locator("#buyer-phone").fill("0912345678");
  await page.locator("#buyer-address").fill("12 Test Street, Hanoi");
  await page.locator('input[name="consent"]').check();
  await page.locator(".checkout-form").getByRole("button", { name: /Place order/ }).click();
  await expect(page).toHaveURL(/\/en\/order\/[a-f0-9-]+/);
  await expect(page.getByRole("heading", { name: "Order received" })).toBeVisible();
  await expect(page.locator(".order-box dd").getByText("Cash on delivery")).toBeVisible();
  await page.goto("/en/cart");
  await expect(page.getByRole("heading", { name: "Your bag is empty." })).toBeVisible();
});

test("F8 transfer order shows QR, copy fields and manual receipt", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await bag(page);
  await page.locator('input[name="delivery"][value="pickup"]').check();
  await page.getByRole("button", { name: /Review total/ }).click();
  await page.locator("#buyer-name").fill("Test Customer");
  await page.locator("#buyer-phone").fill("0912345678");
  await page.locator('input[name="payment"][value="transfer"]').check();
  await page.locator('input[name="consent"]').check();
  await page.locator(".checkout-form").getByRole("button", { name: /Place order/ }).click();
  await expect(page).toHaveURL(/\/en\/order\/[a-f0-9-]+/);
  await expect(page.getByRole("heading", { name: "Complete your bank transfer" })).toBeVisible();
  await expect(page.locator(".qr-code svg")).toBeVisible();
  await expect(page.getByRole("button", { name: "Copy" })).toHaveCount(3);
  await page.getByRole("button", { name: "I’ve made the transfer" }).click();
  await expect(page.getByText("Transfer noted.", { exact: false })).toBeVisible();
});

test("F8 checkout has no serious accessibility violations", async ({ page }) => {
  await bag(page);
  const result = await new AxeBuilder({ page }).analyze();
  expect(result.violations.filter((v) => ["critical", "serious"].includes(v.impact ?? ""))).toEqual([]);
});
