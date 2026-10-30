import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const en = [
  ["/en/help/size-fit", "Size & fit"],
  ["/en/help/shipping-returns", "Shipping, inspection & returns"],
  ["/en/help/care-repair", "Care & repair"],
  ["/en/help/faq", "Frequently asked questions"],
  ["/en/legal/privacy", "Privacy policy"],
  ["/en/legal/terms", "Terms of sale"],
  ["/en/legal/payment", "Payment policy"],
] as const;

for (const width of [360, 390, 768, 1024, 1440]) {
  for (const motion of ["no-preference", "reduce"] as const) {
    test(`F12 content at ${width}px with ${motion}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: motion });
      for (const [path, title] of en) {
        await page.goto(path);
        await expect(
          page.getByRole("heading", { name: title, level: 1 }),
        ).toBeVisible();
        expect(
          await page.evaluate(
            () =>
              document.documentElement.scrollWidth <=
              document.documentElement.clientWidth,
          ),
        ).toBe(true);
      }
    });
  }
}

test("F12 size guide marks unknown specs and guides studio visit", async ({
  page,
}) => {
  await page.goto("/en/help/size-fit");
  await expect(page.locator(".size-table tbody tr")).toHaveCount(4);
  await expect(page.locator(".size-card")).toHaveCount(4);
  await expect(page.getByText("Coming soon").first()).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Book a visit/ }),
  ).toHaveAttribute("href", "/en/studio#book");
});

test("F12 policy pages omit unapproved timelines", async ({ page }) => {
  for (const [path] of en) {
    await page.goto(path);
    const text = await page.locator("main").innerText();
    expect(text).not.toMatch(
      /24 hours|7 days|6 months|1 to 2 working days|13 to 14-inch laptop/i,
    );
  }
  await page.goto("/en/help/shipping-returns");
  await expect(page.locator("main")).toContainText("30.000 ₫");
  await expect(page.locator("main")).toContainText("40.000 ₫");
});

test("F12 404 is localized and returns 404", async ({ page, request }) => {
  expect((await request.get("/en/does-not-exist")).status()).toBe(404);
  expect((await request.get("/vi/ho-tro/khong-co")).status()).toBe(404);
  await page.goto("/en/does-not-exist");
  await expect(
    page.getByRole("heading", { name: "This page has wandered off." }),
  ).toBeVisible();
  await page.goto("/vi/ho-tro/khong-co");
  await expect(
    page.getByRole("heading", { name: "Trang này đã đi lạc." }),
  ).toBeVisible();
});

test("F12 Vietnamese help and legal URLs preserve topic on language switch", async ({ page, request }) => {
  const routes = [
    ["/vi/ho-tro/kich-thuoc", "/en/help/size-fit"],
    ["/vi/ho-tro/giao-hang-doi-tra", "/en/help/shipping-returns"],
    ["/vi/ho-tro/bao-quan-sua-chua", "/en/help/care-repair"],
    ["/vi/ho-tro/cau-hoi", "/en/help/faq"],
    ["/vi/phap-ly/bao-mat", "/en/legal/privacy"],
    ["/vi/phap-ly/dieu-khoan", "/en/legal/terms"],
    ["/vi/phap-ly/thanh-toan", "/en/legal/payment"],
  ] as const;
  for (const [vi, en] of routes) {
    expect((await request.get(vi)).status()).toBe(200);
    await page.goto(vi);
    await expect(page.getByRole("link", { name: "EN", exact: true })).toHaveAttribute("href", en);
  }
});

test("F12 FAQ and privacy have no serious accessibility violations", async ({
  page,
}) => {
  for (const path of ["/en/help/faq", "/vi/phap-ly/bao-mat"]) {
    await page.goto(path);
    const result = await new AxeBuilder({ page }).analyze();
    expect(
      result.violations.filter((v) =>
        ["critical", "serious"].includes(v.impact ?? ""),
      ),
    ).toEqual([]);
  }
});
