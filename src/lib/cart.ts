import { cookies } from "next/headers";
import { variantBySku } from "./catalog";

export type CartLine = {sku: string; qty: number};
export const cartCookie = "refvlks_cart";

export function parseCart(value: string | undefined): CartLine[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(decodeURIComponent(value));
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((line): line is CartLine =>
      typeof line?.sku === "string" && !!variantBySku(line.sku) && Number.isInteger(line.qty) && line.qty > 0
    ).slice(0, 10).map(line => ({sku: line.sku, qty: Math.min(line.qty, 10)}));
  } catch { return []; }
}

export async function getCart(): Promise<CartLine[]> {
  const jar = await cookies();
  return parseCart(jar.get(cartCookie)?.value);
}

export function cartDetails(lines: CartLine[]) {
  return lines.flatMap(line => {
    const found = variantBySku(line.sku);
    return found ? [{...found, qty: line.qty, total: found.variant.priceVnd * line.qty}] : [];
  });
}
