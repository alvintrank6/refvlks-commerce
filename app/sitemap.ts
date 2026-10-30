import type { MetadataRoute } from "next";
import {
  paths,
  products,
  helpPath,
  legalPath,
  type Locale,
} from "../src/lib/catalog";
import { absoluteUrl } from "../src/lib/seo";
export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  for (const locale of ["en", "vi"] as Locale[]) {
    const p = paths(locale);
    for (const url of [
      p.home,
      p.shop,
      p.craft,
      p.donation,
      p.about,
      p.studio,
      p.contact,
      helpPath(locale, "size-fit"),
      helpPath(locale, "faq"),
      helpPath(locale, "care-repair"),
      helpPath(locale, "shipping-returns"),
      legalPath(locale, "privacy"),
      legalPath(locale, "terms"),
      legalPath(locale, "payment"),
      ...products.map((product) => `${p.product}/${product.handle}`),
    ])
      entries.push({ url: absoluteUrl(url), changeFrequency: "weekly" });
  }
  return entries;
}
