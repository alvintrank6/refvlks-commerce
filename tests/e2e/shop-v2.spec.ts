import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir } from "node:fs/promises";

for (const width of [360, 390, 768, 1024, 1440]) {
  for (const motion of ["no-preference", "reduce"] as const) {
    test(`F7 Shop at ${width}px with ${motion}`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("console", (message) => {
        if (message.type() === "error") errors.push(message.text());
      });
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: motion });
      await page.goto("/en/shop");
      await expect(page.locator("main [data-section]")).toHaveCount(3);
      await expect(page.locator(".shop-grid-cell")).toHaveCount(5);
      await expect(page.locator(".shop-tier")).toHaveCount(3);
      await expect(page.locator(".shop-marquee")).toContainText(
        "INSPECT BEFORE YOU PAY",
      );
      await expect(page.locator(".shop-trust-strip span")).toHaveCount(3);
      await page.locator(".shop-tiers-section").scrollIntoViewIfNeeded();
      expect(
        await page.evaluate(
          () =>
            document.documentElement.scrollWidth <=
            document.documentElement.clientWidth,
        ),
      ).toBe(true);
      expect(errors).toEqual([]);
      const directory = "test-results/screens/F7";
      await mkdir(directory, { recursive: true });
      await page.screenshot({
        path: `${directory}/shop-${width}-${motion}.png`,
      });
    });
  }
}

test("F7 desktop filters and sorts in place with URL history", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/en/shop");
  await page.locator("#desktop-tier").selectOption("heritage");
  await page.locator(".shop-desktop-filters button").click();
  await expect(page.locator(".shop-grid-cell")).toHaveCount(1);
  await expect(page.locator(".shop-page-hero h1")).toHaveText("Heritage");
  await expect(page).toHaveURL(/tier=heritage/);
  await expect(page).toHaveTitle(/Heritage/);
  await page.locator("#desktop-tier").selectOption("");
  await page.locator("#desktop-sort").selectOption("high");
  await page.locator(".shop-desktop-filters button").click();
  await expect(page.locator(".shop-grid-cell")).toHaveCount(5);
  await expect(page.locator(".shop-grid-cell").first()).toContainText(
    "1.890.000",
  );
  await page.locator("#desktop-price").selectOption("under-1500");
  await page.locator(".shop-desktop-filters button").click();
  await expect(page.locator(".shop-grid-cell")).toHaveCount(1);
  await expect(page.locator(".shop-grid-cell").first()).toContainText(
    "Trám Shopper",
  );
  await page.locator("#desktop-colour").selectOption("wine");
  await page.locator(".shop-desktop-filters button").click();
  await expect(page.locator(".empty-state")).toContainText(
    "No bags match these filters.",
  );
  await page.goBack();
  await expect(page.locator(".shop-grid-cell")).toHaveCount(1);
  expect(errors).toEqual([]);
});

test("F7 mobile filter drawer works", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/vi/cua-hang");
  await page.locator(".shop-mobile-filters summary").click();
  await page.locator("#mobile-tier").selectOption("signature");
  await expect(page.locator(".shop-mobile-filters button")).toContainText(
    "3 mẫu",
  );
  await page.locator(".shop-mobile-filters button").click();
  await expect(page.locator(".shop-grid-cell")).toHaveCount(3);
  await expect(page).toHaveURL(/tier=signature/);
});

test("F7 GET filters render without JavaScript and Shop passes axe", async ({
  browser,
  page,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const noJs = await context.newPage();
  await noJs.goto("http://127.0.0.1:4173/en/shop");
  await noJs.locator(".shop-mobile-filters summary").click();
  await noJs.locator("#mobile-tier").selectOption("signature");
  await noJs.locator(".shop-mobile-filters button").click();
  await expect(noJs).toHaveURL(/tier=signature/);
  await expect(noJs.locator(".shop-grid-cell")).toHaveCount(3);
  await context.close();
  await page.goto("/en/shop");
  const result = await new AxeBuilder({ page }).analyze();
  expect(
    result.violations.filter((violation) =>
      ["critical", "serious"].includes(violation.impact ?? ""),
    ),
  ).toEqual([]);
});
