import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir } from "node:fs/promises";

for (const width of [360, 390, 768, 1024, 1440]) {
  for (const motion of ["no-preference", "reduce"] as const) {
    test(`F3 Home shell at ${width}px with ${motion}`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: motion });
      await page.goto("/en");
      await expect(page.locator('[data-section="H-01"] h1')).toHaveText(
        "Quiet on the outside. A story on the inside.",
      );
      await expect(
        page.locator('[data-section="H-03"] .product-card'),
      ).toHaveCount(5);
      await expect(page.locator(".desktop-nav a")).toHaveCount(5);
      await expect(page.locator(".hero-media img")).toBeVisible();
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
            (element) => getComputedStyle(element).opacity !== "0",
          ),
        ),
      ).toBe(true);
      expect(errors).toEqual([]);
      const directory = "test-results/screens/F3";
      await mkdir(directory, { recursive: true });
      await page.screenshot({
        path: `${directory}/home-${width}-${motion}.png`,
        fullPage: true,
      });
    });
  }
}

test("F3 Home shell has no serious accessibility violations", async ({
  page,
}) => {
  await page.goto("/en");
  const result = await new AxeBuilder({ page }).analyze();
  expect(
    result.violations.filter((violation) =>
      ["critical", "serious"].includes(violation.impact ?? ""),
    ),
  ).toEqual([]);
});
