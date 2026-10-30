import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir } from "node:fs/promises";

const cases = [
  { locale: "en", path: "/en/donation-event", heading: /Once a month/ },
  { locale: "vi", path: "/vi/su-kien-quyen-gop", heading: /Mỗi tháng một lần/ },
];

for (const width of [360, 390, 768, 1024, 1440]) {
  for (const motion of ["no-preference", "reduce"] as const) {
    test(`F1 routes and navigation at ${width}px with ${motion}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: motion });
      for (const entry of cases) {
        await page.goto(entry.path);
        await expect(page.getByRole("heading", { level: 1 })).toHaveText(
          entry.heading,
        );
        await expect(page.locator(".desktop-nav a")).toHaveCount(5);
        expect(
          await page.evaluate(
            () =>
              document.documentElement.scrollWidth <=
              document.documentElement.clientWidth,
          ),
        ).toBe(true);
        const directory = "test-results/screens/F1";
        await mkdir(directory, { recursive: true });
        await page.screenshot({
          path: `${directory}/${entry.locale}-${width}-${motion}.png`,
        });
      }
    });
  }
}

test("F1 donation page has no serious accessibility violations", async ({
  page,
}) => {
  await page.goto("/en/donation-event");
  const result = await new AxeBuilder({ page }).analyze();
  expect(
    result.violations.filter((violation) =>
      ["critical", "serious"].includes(violation.impact ?? ""),
    ),
  ).toEqual([]);
});
