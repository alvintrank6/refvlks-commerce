import type { MetadataRoute } from "next";
import { products } from "../src/refolks/data";
import { absoluteUrl } from "../src/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return (["en", "vi"] as const).flatMap((locale) =>
    [
      "",
      "shop",
      "about",
      "community",
      "journal",
      "journal/ban-lac",
      "journal/workshop",
      "journal/community",
      ...products.map((product) => `products/${product.id}`),
    ].map((route) => ({
      url: absoluteUrl(`/${locale}${route ? `/${route}` : ""}`),
      changeFrequency: "weekly" as const,
    })),
  );
}
