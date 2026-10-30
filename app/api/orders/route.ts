import { env } from "cloudflare:workers";
import { NextRequest, NextResponse } from "next/server";
import { cartCookie, cartDetails, parseCart } from "../../../src/lib/cart";
import { isLocale, paths } from "../../../src/lib/catalog";
import { storeRepository } from "../../../src/lib/data";
import { sendTransactionalEmail } from "../../../src/lib/email";

const clean = (form: FormData, key: string, max = 250) =>
  String(form.get(key) ?? "")
    .trim()
    .slice(0, max);

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const rawLocale = clean(form, "locale", 2);
  const locale = isLocale(rawLocale) ? rawLocale : "en";
  const p = paths(locale);
  const cart = parseCart(request.cookies.get(cartCookie)?.value);
  const rows = cartDetails(cart);
  if (!rows.length)
    return NextResponse.redirect(new URL(p.cart, request.url), 303);

  const name = clean(form, "name", 80);
  const phone = clean(form, "phone", 20);
  const email = clean(form, "email", 150);
  const address = clean(form, "address", 200);
  const city = clean(form, "city", 20);
  const delivery = clean(form, "delivery", 20);
  const payment = clean(form, "payment", 20);
  const fail = (reason = "details") => {
    const url = new URL(p.checkout, request.url);
    url.searchParams.set("error", reason);
    if (delivery === "pickup") url.searchParams.set("delivery", "pickup");
    if (city === "other") url.searchParams.set("city", "other");
    return NextResponse.redirect(url, 303);
  };
  if (name.length < 2) return fail("name");
  if (!/^0\d{9}$/.test(phone)) return fail("phone");
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail("email");
  if (delivery !== "ship" && delivery !== "pickup") return fail("delivery");
  if (city !== "hanoi" && city !== "other") return fail("city");
  if (delivery === "ship" && address.length < 5) return fail("address");
  if (payment !== "cod" && payment !== "transfer") return fail("payment");
  if (!form.has("consent")) return fail("consent");
  if (clean(form, "website")) return fail("details");

  try {
    const repository = await storeRepository(env.DB);
    const created = await repository.placeOrder({
      cart,
      locale,
      name,
      phone,
      email: email || null,
      address: delivery === "ship" ? address : null,
      city,
      delivery,
      payment,
    });
    const notify = process.env.ORDER_NOTIFY_EMAIL;
    const emailTasks: Promise<boolean>[] = [];
    if (email)
      emailTasks.push(
        sendTransactionalEmail({
          to: email,
          subject:
            locale === "vi"
              ? `Refvlks đã nhận đơn ${created.number}`
              : `Refvlks order ${created.number} received`,
          text:
            locale === "vi"
              ? `Đơn ${created.number} đã được ghi nhận. Tổng cộng: ${created.total.toLocaleString("vi-VN")} ₫. Xem chi tiết và hướng dẫn thanh toán: ${new URL(`${p.order}/${created.token}`, request.url)}`
              : `Order ${created.number} has been recorded. Total: ${created.total.toLocaleString("vi-VN")} ₫. Details and payment instructions: ${new URL(`${p.order}/${created.token}`, request.url)}`,
          idempotencyKey: `order-${created.number}-customer`,
        }),
      );
    if (notify)
      emailTasks.push(
        sendTransactionalEmail({
          to: notify,
          subject: `New Refvlks order ${created.number}`,
          text: `Order ${created.number}\nName: ${name}\nPhone: ${phone}\nPayment: ${payment}\nTotal: ${created.total.toLocaleString("vi-VN")} ₫\nDetails: ${new URL(`${p.order}/${created.token}`, request.url)}`,
          idempotencyKey: `order-${created.number}-admin`,
        }),
      );
    if (emailTasks.length) {
      const results = await Promise.allSettled(emailTasks);
      for (const result of results)
        if (result.status === "rejected")
          console.error("Order notification failed", result.reason);
    }
    const response = NextResponse.redirect(
      new URL(`${p.order}/${created.token}`, request.url),
      303,
    );
    response.cookies.set(cartCookie, "", { path: "/", maxAge: 0 });
    return response;
  } catch (error) {
    return fail(String(error).includes("OUT_OF_STOCK") ? "stock" : "details");
  }
}
