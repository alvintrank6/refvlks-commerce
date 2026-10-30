import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir } from "node:fs/promises";

for (const width of [360, 390, 768, 1024, 1440]) {
  for (const motion of ["no-preference", "reduce"] as const) {
    test(`F4 product at ${width}px with ${motion}`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: motion });
      await page.goto("/en/products/weft-structured-tote?colour=brown");
      await expect(page.locator("main section[data-section]")).toHaveCount(3);
      await expect(
        page.locator('[data-section="P-02"] .material-hotspot'),
      ).toHaveCount(4);
      await page.locator('[data-section="P-02"]').scrollIntoViewIfNeeded();
      await page.locator('.material-hotspot[aria-label^="Body:"]').click();
      await expect(page.locator(".hotspot-popover")).toBeVisible();
      await expect(page.locator(".hotspot-popover")).toContainText(
        "Jacquard canvas",
      );
      await page.keyboard.press("Escape");
      await expect(page.locator(".hotspot-popover")).toBeHidden();
      await page.locator(".site-footer").scrollIntoViewIfNeeded();
      expect(
        await page.evaluate(
          () =>
            document.documentElement.scrollWidth <=
            document.documentElement.clientWidth,
        ),
      ).toBe(true);
      expect(
        await page.evaluate(() =>
          [...document.querySelectorAll("main section")].every(
            (section) => getComputedStyle(section).opacity !== "0",
          ),
        ),
      ).toBe(true);
      expect(errors).toEqual([]);
      const directory = "test-results/screens/F4";
      await mkdir(directory, { recursive: true });
      await page.screenshot({
        path: `${directory}/product-${width}-${motion}.png`,
        fullPage: true,
      });
    });
  }
}

test("F4 add, change quantity and remove", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/en/products/loom-flap-tote?colour=wine");
  await page
    .locator(".buy-box")
    .getByRole("button", { name: "Add to bag" })
    .click();
  await expect(page).toHaveURL(/\/en\/cart\?added=1/);
  await expect(page.getByRole("status")).toContainText("Added to your bag.");
  await expect(page.locator(".cart-quantity span")).toHaveText("1");
  await page.getByRole("button", { name: "Increase quantity" }).click();
  await expect(page.locator(".cart-quantity span")).toHaveText("2");
  await page.getByRole("button", { name: "Decrease quantity" }).click();
  await expect(page.locator(".cart-quantity span")).toHaveText("1");
  await page.getByRole("button", { name: "Remove" }).click();
  await expect(
    page.getByRole("heading", { name: "Your bag is empty." }),
  ).toBeVisible();
});

test("F4 add-to-bag motion finishes on the cart", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/en/products/loom-carryall?colour=black-cinnabar");
  await page
    .locator(".buy-box")
    .getByRole("button", { name: "Add to bag" })
    .click();
  await expect(page).toHaveURL(/\/en\/cart\?added=1/);
  await expect(page.getByRole("status")).toContainText("Added to your bag.");
});

test("F4 product has no serious accessibility violations", async ({ page }) => {
  await page.goto("/en/products/weft-structured-tote?colour=brown");
  const result = await new AxeBuilder({ page }).analyze();
  expect(
    result.violations.filter((violation) =>
      ["critical", "serious"].includes(violation.impact ?? ""),
    ),
  ).toEqual([]);
});
