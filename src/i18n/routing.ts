import { defineRouting } from "next-intl/routing";

/** Shared pathname contract for the two storefront locales. */
export const routing = defineRouting({
  locales: ["en", "vi"],
  defaultLocale: "en",
  localePrefix: "always",
  localeDetection: false,
  pathnames: {
    "/": "/",
    "/shop": { en: "/shop", vi: "/cua-hang" },
    "/craft": { en: "/craft", vi: "/thu-cong" },
    "/donation-event": { en: "/donation-event", vi: "/su-kien-quyen-gop" },
    "/about": { en: "/about", vi: "/ve-chung-toi" },
    "/studio": "/studio",
    "/cart": { en: "/cart", vi: "/gio-hang" },
    "/checkout": { en: "/checkout", vi: "/thanh-toan" },
    "/contact": { en: "/contact", vi: "/lien-he" },
    "/products/[handle]": {
      en: "/products/[handle]",
      vi: "/san-pham/[handle]",
    },
  },
});
