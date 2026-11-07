import type { MetadataRoute } from "next";
import { siteOrigin } from "../src/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/en/cart",
        "/vi/cart",
        "/en/checkout",
        "/vi/checkout",
        "/en/account",
        "/vi/account",
      ],
    },
    sitemap: `${siteOrigin}/sitemap.xml`,
  };
}
