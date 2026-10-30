import rawProducts from "../content/products.seed.json";
import rawAssets from "../content/assets.json";
import en from "../messages/en.json";
import vi from "../messages/vi.json";

export type Locale = "en" | "vi";
export type Dict = typeof en;
export const dictionary = (locale: Locale): Dict =>
  (locale === "vi" ? vi : en) as Dict;
export const isLocale = (value: string): value is Locale =>
  value === "en" || value === "vi";

export type Variant = {
  sku: string;
  colourKey: string;
  colour: Record<Locale, string>;
  swatch: string;
  priceVnd: number;
  stock: number;
  cardImage: string;
  hoverImage: string;
  images?: string[];
};
export type Product = {
  code: string;
  handle: string;
  tier: "essential" | "signature" | "heritage";
  name: Record<Locale, string>;
  variants: Variant[];
  images: { asset: string; role: string }[];
  short: Record<Locale, string>;
  long: Record<Locale, string>;
  materials: {
    share: Record<Locale, string>;
    parts: { part: string; en: string; vi: string; group: string }[];
  };
  status: string;
};
export type Asset = {
  id: string;
  alt: Record<Locale, string>;
  variants: {
    kind: string;
    w: number;
    h: number;
    files: { avif?: string; webp?: string; jpg?: string };
  }[];
};
export const products = (rawProducts.products as Product[]).filter(
  (p) => p.status === "active",
);
export const allVariants = products.flatMap((product) =>
  product.variants.map((variant) => ({ product, variant })),
);
export const assets = new Map(
  (rawAssets.assets as Asset[]).map((asset) => [asset.id, asset]),
);
export const productByHandle = (handle: string) =>
  products.find((p) => p.handle === handle);
export const variantBySku = (sku: string) =>
  allVariants.find((row) => row.variant.sku === sku);
export const money = (amount: number) =>
  `${new Intl.NumberFormat("vi-VN").format(amount)} ₫`;
export const paths = (locale: Locale) =>
  locale === "vi"
    ? {
        home: "/vi",
        shop: "/vi/cua-hang",
        craft: "/vi/thu-cong",
        donation: "/vi/su-kien-quyen-gop",
        about: "/vi/ve-chung-toi",
        studio: "/vi/studio",
        cart: "/vi/gio-hang",
        checkout: "/vi/thanh-toan",
        contact: "/vi/lien-he",
        order: "/vi/don-hang",
        product: "/vi/san-pham",
        help: "/vi/ho-tro",
        legal: "/vi/phap-ly",
      }
    : {
        home: "/en",
        shop: "/en/shop",
        craft: "/en/craft",
        donation: "/en/donation-event",
        about: "/en/about",
        studio: "/en/studio",
        cart: "/en/cart",
        checkout: "/en/checkout",
        contact: "/en/contact",
        order: "/en/order",
        product: "/en/products",
        help: "/en/help",
        legal: "/en/legal",
      };
