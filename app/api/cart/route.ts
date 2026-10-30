import { env } from "cloudflare:workers";
import { NextRequest, NextResponse } from "next/server";
import { cartCookie, parseCart } from "../../../src/lib/cart";
import { isLocale, paths, variantBySku } from "../../../src/lib/catalog";

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const rawLocale = String(form.get("locale") ?? "en");
  const locale = isLocale(rawLocale) ? rawLocale : "en";
  const action = String(form.get("action") ?? "");
  const sku = String(form.get("sku") ?? "");
  const found = variantBySku(sku);
  let cart = parseCart(request.cookies.get(cartCookie)?.value);
  if (found) {
    const row = env.DB
      ? await env.DB.prepare("SELECT stock FROM inventory WHERE sku = ?")
          .bind(sku)
          .first<{ stock: number }>()
      : null;
    const available = Math.max(0, row?.stock ?? found.variant.stock);
    const old = cart.find((line) => line.sku === sku);
    if (action === "add" || action === "increment") {
      const qty = Math.min(available, (old?.qty ?? 0) + 1);
      cart = cart.filter((line) => line.sku !== sku);
      if (qty > 0) cart.push({ sku, qty });
    } else if (action === "decrement") {
      const qty = Math.max(0, (old?.qty ?? 0) - 1);
      cart = cart.filter((line) => line.sku !== sku);
      if (qty > 0) cart.push({ sku, qty });
    } else if (action === "update") {
      const requested = Number(form.get("qty") ?? 0);
      const qty = Number.isInteger(requested)
        ? Math.max(0, Math.min(available, requested))
        : 0;
      cart = cart.filter((line) => line.sku !== sku);
      if (qty > 0) cart.push({ sku, qty });
    } else if (action === "remove") {
      cart = cart.filter((line) => line.sku !== sku);
    }
  }
  const destination = `${paths(locale).cart}${action === "add" ? "?added=1" : ""}`;
  const response = NextResponse.redirect(
    new URL(destination, request.url),
    303,
  );
  response.cookies.set(cartCookie, encodeURIComponent(JSON.stringify(cart)), {
    httpOnly: true,
    sameSite: "lax",
    secure: new URL(request.url).protocol === "https:",
    path: "/",
    maxAge: 30 * 86400,
  });
  return response;
}
