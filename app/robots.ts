import type { MetadataRoute } from "next";
import { siteOrigin } from "../src/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/en/cart", "/vi/gio-hang", "/en/checkout", "/vi/thanh-toan", "/en/order", "/vi/don-hang"],
    },
    sitemap: `${siteOrigin}/sitemap.xml`,
  };
}
