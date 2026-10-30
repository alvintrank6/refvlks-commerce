import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir } from "node:fs/promises";

for (const width of [360, 390, 768, 1024, 1440]) {
  for (const motion of ["no-preference", "reduce"] as const) {
    test(`F5 reveal at ${width}px with ${motion}`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("console", (message) => {
        if (message.type() === "error") errors.push(message.text());
      });
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: motion });
      await page.goto("/en");
      await expect(page.locator('[data-section="H-02"]')).toHaveCount(1);
      await expect(page.locator(".reveal-card")).toHaveCount(3);
      await expect(page.locator(".reveal-frame")).toHaveCount(8);
      await page.locator("#reveal").scrollIntoViewIfNeeded();
      if (width < 1024 || motion === "reduce") {
        await expect(page.locator(".reveal-cards")).toBeVisible();
        await expect(page.locator("#reveal")).not.toHaveClass(/is-cinematic/);
      } else {
        await expect(page.locator("#reveal")).toHaveClass(/is-cinematic/, {
          timeout: 15_000,
        });
        await expect(page.locator(".reveal-cinematic")).toBeVisible();
      }
      await page.getByRole("link", { name: "Skip the reveal" }).click();
      await expect(page).toHaveURL(/#collection$/);
      await expect(page.locator("#collection")).toBeInViewport();
      await expect(page.locator(".product-card")).toHaveCount(5);
      expect(errors).toEqual([]);
      const directory = "test-results/screens/F5";
      await mkdir(directory, { recursive: true });
      await page.screenshot({
        path: `${directory}/home-${width}-${motion}.png`,
        fullPage: true,
      });
    });
  }
}

test("F5 product view transition navigates without browser errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/en");
  await page.locator("#collection .product-card").first().click();
  await expect(page).toHaveURL(/\/en\/products\//);
  await expect(page.locator(".gallery-frame img").first()).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(/\/en$/);
  expect(errors).toEqual([]);
});

test("F5 reduced motion keeps content and controls accessible", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/vi");
  await expect(page.locator(".reveal-cards")).toBeVisible();
  await expect(page.locator("[data-scroll-progress]")).toBeHidden();
  const result = await new AxeBuilder({ page }).analyze();
  expect(
    result.violations.filter((violation) =>
      ["critical", "serious"].includes(violation.impact ?? ""),
    ),
  ).toEqual([]);
});

test("F5 Home remains readable and navigable without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4173/en");
  await expect(page.locator(".hero h1")).toBeVisible();
  await expect(page.locator(".reveal-cards")).toBeVisible();
  await expect(page.locator(".reveal-card")).toHaveCount(3);
  await page.getByRole("link", { name: "Skip the reveal" }).click();
  await expect(page).toHaveURL(/#collection$/);
  await context.close();
});

test("F5 desktop reveal allows keyboard scrolling through the pin", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/en");
  await expect(page.locator("#reveal")).toHaveClass(/is-cinematic/);
  await page.locator("#reveal").scrollIntoViewIfNeeded();
  await page.locator("body").click({ position: { x: 8, y: 400 } });
  for (let index = 0; index < 8; index++) await page.keyboard.press("PageDown");
  await expect
    .poll(() =>
      page
        .locator("#collection")
        .evaluate((element) => element.getBoundingClientRect().top),
    )
    .toBeLessThan(900);
});
