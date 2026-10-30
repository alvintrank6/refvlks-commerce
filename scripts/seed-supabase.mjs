import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = JSON.parse(
  await readFile(join(root, "src/content/products.seed.json"), "utf8"),
);
const quote = (value) => `'${String(value).replaceAll("'", "''")}'`;
const statements = [
  "-- Generated from src/content/products.seed.json. Regenerate with npm run db:seed:supabase.",
];

for (const product of source.products) {
  statements.push(`insert into public.products (handle, status, payload)
values (${quote(product.handle)}, ${quote(product.status)}, ${quote(JSON.stringify(product))}::jsonb)
on conflict (handle) do update set status = excluded.status, payload = excluded.payload, updated_at = now();`);
  for (const variant of product.variants) {
    statements.push(`insert into public.inventory
  (sku, product_handle, price_vnd, stock, name_en, name_vi, colour_en, colour_vi)
values (${quote(variant.sku)}, ${quote(product.handle)}, ${variant.priceVnd}, ${variant.stock},
  ${quote(product.name.en)}, ${quote(product.name.vi)}, ${quote(variant.colour.en)}, ${quote(variant.colour.vi)})
on conflict (sku) do update set product_handle = excluded.product_handle,
  price_vnd = excluded.price_vnd, name_en = excluded.name_en, name_vi = excluded.name_vi,
  colour_en = excluded.colour_en, colour_vi = excluded.colour_vi;`);
  }
}

const target = join(root, "supabase/seed.sql");
await writeFile(target, statements.join("\n\n") + "\n", "utf8");
console.log(`Wrote ${target} (${source.products.length} designs)`);
