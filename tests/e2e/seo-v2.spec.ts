import { expect, test } from "@playwright/test";

const origin = "https://refvlks-atelier-2026.alvintrank95.chatgpt.site";

test("EN and VI pages expose canonical and language alternates", async ({
  page,
}) => {
  await page.goto("/vi/ho-tro/cau-hoi");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    `${origin}/vi/ho-tro/cau-hoi`,
  );
  await expect(page.locator('link[hreflang="en"]')).toHaveAttribute(
    "href",
    `${origin}/en/help/faq`,
  );
  await expect(page.locator('link[hreflang="vi"]')).toHaveAttribute(
    "href",
    `${origin}/vi/ho-tro/cau-hoi`,
  );
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    `${origin}/images/og/refvlks_og_v2.jpg`,
  );
  const data = await page
    .locator('script[type="application/ld+json"]')
    .allTextContents();
  expect(
    data.map((text) => JSON.parse(text)).map((item) => item["@type"]),
  ).toContain("FAQPage");
});

test("product exposes live offer and branded image", async ({ page }) => {
  await page.goto("/en/products/weft-structured-tote?colour=brown");
  const data = (
    await page.locator('script[type="application/ld+json"]').allTextContents()
  ).map((text) => JSON.parse(text));
  const product = data.find((item) => item["@type"] === "Product");
  expect(product.name).toBe("Weft Structured Tote");
  expect(product.offers.priceCurrency).toBe("VND");
  expect(product.offers.availability).toMatch(
    /schema.org\/(InStock|OutOfStock)/,
  );
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    `${origin}/images/og/refvlks_og_weft-structured-tote.jpg`,
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    `${origin}/en/products/weft-structured-tote`,
  );
});

test("filtered shop and private flows stay out of search", async ({ page }) => {
  await page.goto("/en/shop?tier=signature");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/,
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    `${origin}/en/shop`,
  );
  await page.goto("/en/cart");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/,
  );
});

test("sitemap, robots, and undated event remain claim safe", async ({
  page,
  request,
}) => {
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).toContain(`${origin}/vi/su-kien-quyen-gop`);
  expect(sitemap).not.toContain("/en/cart");
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("Disallow: /en/checkout");
  await page.goto("/en/donation-event");
  const data = (
    await page.locator('script[type="application/ld+json"]').allTextContents()
  ).map((text) => JSON.parse(text));
  expect(data.some((item) => item["@type"] === "Event")).toBe(false);
});
