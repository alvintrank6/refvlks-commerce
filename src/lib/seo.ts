import {
  assets,
  helpPath,
  legalPath,
  paths,
  productByHandle,
  type HelpTopic,
  type LegalTopic,
  type Locale,
} from "./catalog";
import { faqItems } from "../components/HelpLegalV2";

export const siteOrigin = "https://refvlks-atelier-2026.alvintrank95.chatgpt.site";
export const absoluteUrl = (path: string) => new URL(path, siteOrigin).toString();
export const jsonLd = (value: unknown) =>
  JSON.stringify(value).replace(/</g, "\\u003c");

export function seoPath(locale: Locale, kind: string, slug: string[]) {
  const p = paths(locale);
  if (kind === "help") return helpPath(locale, slug[1] as HelpTopic);
  if (kind === "legal") return legalPath(locale, slug[1] as LegalTopic);
  if (kind === "product") return `${p.product}/${slug[1]}`;
  return (p as Record<string, string>)[kind] ?? p.home;
}

export function seoSchemas(locale: Locale, kind: string, slug: string[], stock?: number) {
  const url = absoluteUrl(seoPath(locale, kind, slug));
  const p = paths(locale);
  const schemas: Record<string, unknown>[] = [];
  const name = (locale === "vi" ? "Refvlks" : "Refvlks");
  if (kind === "studio") {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Store",
      "@id": `${absoluteUrl(p.studio)}#store`,
      name,
      url,
      image: absoluteUrl("/images/og/refvlks_og_v2.jpg"),
      address: {
        "@type": "PostalAddress",
        streetAddress: "22 Lê Quý Đôn",
        addressLocality: "Hà Nội",
        addressCountry: "VN",
      },
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "08:00",
        closes: "21:30",
      },
      publicAccess: true,
      description: locale === "vi" ? "Tham quan theo lịch hẹn." : "Visits by appointment.",
    });
  }
  if (kind === "product") {
    const product = productByHandle(slug[1] ?? "");
    if (product) {
      const variant = product.variants[0];
      const image = assets.get(variant.cardImage)?.variants[0]?.files.webp;
      schemas.push({
        "@context": "https://schema.org",
        "@type": "Product",
        "@id": `${url}#product`,
        name: product.name[locale],
        description: product.short[locale],
        image: image ? absoluteUrl(image) : undefined,
        brand: { "@type": "Brand", name },
        sku: variant.sku,
        offers: {
          "@type": "Offer",
          url,
          priceCurrency: "VND",
          price: variant.priceVnd,
          availability: (stock ?? variant.stock) > 0
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
          itemCondition: "https://schema.org/NewCondition",
        },
      });
    }
  }
  if (kind === "help" && slug[1] === "faq") {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqItems(locale).map(([question, answer]) => ({
        "@type": "Question", name: question,
        acceptedAnswer: { "@type": "Answer", text: answer },
      })),
    });
  }
  if (!["home", "cart", "checkout", "order"].includes(kind)) {
    const label: Record<string, Record<Locale, string>> = {
      shop: { en: "Shop", vi: "Cửa hàng" },
      craft: { en: "Craft", vi: "Thủ công" },
      donation: { en: "Donation Event", vi: "Sự kiện quyên góp" },
      about: { en: "About", vi: "Về chúng tôi" },
      studio: { en: "Studio", vi: "Studio" },
      contact: { en: "Contact", vi: "Liên hệ" },
      help: { en: "Help", vi: "Hỗ trợ" },
      legal: { en: "Legal", vi: "Pháp lý" },
      product: { en: "Shop", vi: "Cửa hàng" },
    };
    const items = [
      { "@type": "ListItem", position: 1, name, item: absoluteUrl(p.home) },
      ...(kind === "product" ? [{ "@type": "ListItem", position: 2, name: label.shop[locale], item: absoluteUrl(p.shop) }] : []),
      { "@type": "ListItem", position: kind === "product" ? 3 : 2,
        name: kind === "product" ? (productByHandle(slug[1] ?? "")?.name[locale] ?? "") : (label[kind]?.[locale] ?? ""), item: url },
    ];
    schemas.push({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items });
  }
  return schemas;
}
