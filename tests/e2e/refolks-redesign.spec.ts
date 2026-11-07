import { expect, test } from "@playwright/test";

test.use({ baseURL: "http://127.0.0.1:3000" });

test("shop, product, cart, locale and community flows", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/en");
  await expect(page.locator(".rf-site")).toHaveAttribute("data-ready", "true");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "WEAVING HERITAGE",
  );
  await page.getByRole("button", { name: /Explore the Collection/i }).click();
  await expect(page).toHaveURL(/\/en\/shop/);
  await expect(page.locator(".rf-shop-grid .rf-product-card")).toHaveCount(5);
  await page.getByRole("button", { name: /Filter \+/ }).click();
  await expect(page.getByRole("dialog", { name: "Filter" })).toBeVisible();
  await page
    .getByRole("dialog", { name: "Filter" })
    .getByLabel("Burgundy")
    .check();
  await page
    .getByRole("dialog", { name: "Filter" })
    .getByRole("button", { name: /Apply/ })
    .click();
  await expect(page.locator(".rf-shop-grid .rf-product-card")).toHaveCount(1);
  await page.locator(".rf-shop-grid .rf-card-media").first().click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Everyday Laptop Tote",
  );
  await page.locator(".rf-pdp-buy .rf-button").click();
  await expect(page.getByRole("dialog", { name: "Bag" })).toBeVisible();
  await expect(page.getByRole("dialog", { name: "Bag" })).toContainText(
    "1.890.000₫",
  );
  await page
    .getByRole("dialog", { name: "Bag" })
    .getByRole("button", { name: "Close" })
    .click();
  await page.getByRole("button", { name: "VI" }).first().click();
  await expect(page.locator("html")).toHaveAttribute("lang", "vi");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Ký Ức Bản Lác",
  );
  await page.reload();
  await expect(page.locator(".rf-bag-trigger")).toContainText("1");
  await page.goto("/vi/community");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "CỘNG ĐỒNG",
  );
  await page.getByRole("button", { name: "Đăng nhập", exact: true }).click();
  await page.getByRole("button", { name: "Tạo tài khoản" }).click();
  await page
    .getByRole("dialog", { name: "Tài khoản" })
    .getByLabel("Họ và tên")
    .fill("Mai Anh");
  await page
    .getByRole("dialog", { name: "Tài khoản" })
    .getByLabel("Email")
    .fill("mai@example.com");
  await page
    .getByRole("dialog", { name: "Tài khoản" })
    .getByLabel("Mật khẩu")
    .fill("demo-password");
  await page
    .getByRole("dialog", { name: "Tài khoản" })
    .getByRole("button", { name: "Tạo tài khoản" })
    .last()
    .click();
  await expect(page.locator(".rf-account-dashboard")).toContainText("Mai Anh");
  expect(errors).toEqual([]);
});

test("mobile menu and layout", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/vi");
  await expect(page.locator(".rf-site")).toHaveAttribute("data-ready", "true");
  await page.getByRole("button", { name: "Mở menu" }).click();
  await expect(page.getByRole("dialog", { name: "Mở menu" })).toBeVisible();
  await page
    .getByRole("dialog", { name: "Mở menu" })
    .getByText("Túi nữ")
    .click();
  await page
    .getByRole("dialog", { name: "Mở menu" })
    .getByRole("button", { name: "Tất cả sản phẩm" })
    .first()
    .click();
  await expect(page).toHaveURL(/\/vi\/shop/);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});

test("collection isolation and demo checkout with proposed shipping", async ({
  page,
}) => {
  await page.goto("/en/shop?collection=model-3");
  await expect(page.locator(".rf-site")).toHaveAttribute("data-ready", "true");
  await expect(page.locator(".rf-shop-grid .rf-product-card")).toHaveCount(1);
  await expect(page.locator(".rf-shop-grid")).toContainText(
    "Model 3 Crossbody",
  );
  await page.goto("/en/shop?category=accessory");
  await expect(page.locator(".rf-shop-grid .rf-product-card")).toHaveCount(2);

  await page.goto("/en/products/everyday-laptop-tote");
  await expect(page.locator(".rf-site")).toHaveAttribute("data-ready", "true");
  await page.locator(".rf-pdp-buy .rf-button").click();
  await page
    .getByRole("dialog", { name: "Bag" })
    .getByRole("button", { name: "Checkout now" })
    .click();
  await expect(page).toHaveURL(/\/en\/checkout/);
  await expect(page.locator(".rf-demo-notice")).toContainText(
    "No payment is collected",
  );
  await page.getByLabel("Shipping region").selectOption("other");
  await expect(page.locator(".rf-total")).toContainText("1.930.000₫");
  const form = page.locator(".rf-cart-summary form");
  await form.getByLabel("Full name").fill("Mai Anh");
  await form.getByLabel("Email").fill("mai@example.com");
  await form.getByLabel("Phone").fill("0900000000");
  await form.getByLabel("Address").fill("Hanoi");
  await form.getByRole("button", { name: "Checkout now" }).click();
  await expect(page).toHaveURL(/\/en$/);
  await page.goto("/en/account");
  await expect(page.locator(".rf-order")).toHaveCount(1);
  await expect(page.locator(".rf-order")).toContainText("1.930.000₫");
});

test("donation voucher and workshop registration", async ({ page }) => {
  await page.goto("/vi/community");
  await expect(page.locator(".rf-site")).toHaveAttribute("data-ready", "true");
  await page.getByRole("button", { name: "Đăng nhập", exact: true }).click();
  await page.getByRole("button", { name: "Tạo tài khoản" }).click();
  const accountDialog = page.getByRole("dialog", { name: "Tài khoản" });
  await accountDialog.getByLabel("Họ và tên").fill("Minh");
  await accountDialog.getByLabel("Email").fill("minh@example.com");
  await accountDialog.getByLabel("Mật khẩu").fill("demo-password");
  await accountDialog
    .getByRole("button", { name: "Tạo tài khoản" })
    .last()
    .click();
  await expect(page.locator(".rf-vouchers")).not.toContainText("DONATE15");

  const donation = page.locator(".rf-donation-form form");
  await donation.getByLabel("Họ và tên").fill("Minh");
  await donation.getByLabel("Số điện thoại").fill("0900000000");
  await donation.getByLabel("Email").fill("minh@example.com");
  await donation.getByLabel("Số lượng/kg ước tính").fill("2");
  await donation.getByLabel("Ngày hẹn").fill("2026-11-15");
  await donation.getByRole("button", { name: "Gửi thông tin" }).click();
  await expect(page.locator(".rf-vouchers")).toContainText("DONATE15");

  await page.getByRole("button", { name: /Đăng Ký Chỗ Ngồi/ }).click();
  const eventDialog = page.getByRole("dialog").last();
  await eventDialog.getByLabel("Họ và tên").fill("Minh");
  await eventDialog.getByLabel("Số điện thoại").fill("0900000000");
  await eventDialog.getByLabel("Email").fill("minh@example.com");
  await eventDialog.getByLabel("Số người").fill("1");
  await eventDialog.getByRole("button", { name: "Đăng ký tham gia" }).click();
  await expect(page.getByRole("status")).toContainText("Đã ghi nhận đăng ký");
});
