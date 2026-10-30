import { env } from "cloudflare:workers";
import { NextRequest, NextResponse } from "next/server";
import { cartCookie, cartDetails, parseCart } from "../../../src/lib/cart";
import { isLocale, paths } from "../../../src/lib/catalog";
import { storeRepository } from "../../../src/lib/data";
import { policy } from "../../../src/content/policy";

const clean = (form: FormData, key: string, max = 250) =>
  String(form.get(key) ?? "")
    .trim()
    .slice(0, max);

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const rawLocale = clean(form, "locale", 2);
  const locale = isLocale(rawLocale) ? rawLocale : "en";
  const p = paths(locale);
  const fail = (reason = "details") =>
    NextResponse.redirect(
      new URL(`${p.checkout}?error=${reason}`, request.url),
      303,
    );
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
  if (
    name.length < 2 ||
    !/^0\d{9}$/.test(phone) ||
    (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) ||
    !form.has("consent") ||
    (delivery !== "ship" && delivery !== "pickup") ||
    (payment !== "cod" && payment !== "transfer") ||
    (city !== "hanoi" && city !== "other") ||
    clean(form, "website") ||
    (delivery === "ship" && address.length < 5) ||
    (payment === "cod" &&
      rows.reduce((n, row) => n + row.qty, 0) > policy.codMaxItems)
  )
    return fail();

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
