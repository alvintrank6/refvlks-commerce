import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { RefolksExperience } from "../../../src/components/RefolksExperience";
import { copy, products } from "../../../src/refolks/data";
import { absoluteUrl } from "../../../src/lib/seo";

type Locale = "vi" | "en";
type Props = {
  params: Promise<{ locale: string; slug?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};
const isLocale = (value: string): value is Locale =>
  value === "vi" || value === "en";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug = [] } = await params;
  if (!isLocale(locale)) return {};
  const section = slug[0] ?? "";
  const product = products.find((p) => p.id === slug[1]);
  const title =
    product?.name[locale] ??
    (["shop", "cua-hang", "women", "men", "collections", "gifts"].includes(
      section,
    )
      ? copy[locale].shopTitle
      : [
            "community",
            "cong-dong",
            "donation-event",
            "su-kien-quyen-gop",
          ].includes(section)
        ? copy[locale].communityTitle
        : ["about", "ve-chung-toi", "craft", "thu-cong"].includes(section)
          ? copy[locale].aboutTitle
          : ["journal", "news", "tin-tuc"].includes(section)
            ? locale === "vi"
              ? "Tin tức & sự kiện mới nhất"
              : "Latest news & events"
            : copy[locale].heroTitle);
  const description =
    product?.short[locale] ??
    (section === "shop" || section === "cua-hang"
      ? copy[locale].shopIntro
      : copy[locale].heroSub);
  const suffix = slug.length ? `/${slug.join("/")}` : "";
  const path = `/${locale}${suffix}`;
  const alternate = `/${locale === "vi" ? "en" : "vi"}${suffix}`;
  const privatePage = [
    "account",
    "checkout",
    "cart",
    "orders",
    "tai-khoan",
    "thanh-toan",
    "gio-hang",
    "don-hang",
  ].includes(section);
  return {
    title: `${title} | Refolks`,
    description,
    robots: privatePage
      ? { index: false, follow: false }
      : { index: true, follow: true },
    alternates: {
      canonical: absoluteUrl(path),
      languages: {
        [locale]: absoluteUrl(path),
        [locale === "vi" ? "en" : "vi"]: absoluteUrl(alternate),
      },
    },
    openGraph: {
      siteName: "Refolks",
      title,
      description,
      images: [
        {
          url: product?.images[0] ?? "/images/refolks/tote-02-lifestyle.webp",
          width: 1200,
          height: 900,
          alt: title,
        },
      ],
    },
  };
}

export default async function Page({ params, searchParams }: Props) {
  const { locale, slug = [] } = await params;
  if (!isLocale(locale)) notFound();
  if (
    ["products", "san-pham"].includes(slug[0]) &&
    !products.some((p) => p.id === slug[1])
  ) {
    redirect(`/${locale}/shop`);
  }
  if (["studio", "contact", "lien-he"].includes(slug[0]))
    redirect(`/${locale}/about`);
  const query = new URLSearchParams(
    Object.entries(await searchParams).flatMap(([key, value]) =>
      typeof value === "string" ? [[key, value]] : [],
    ),
  ).toString();
  return (
    <RefolksExperience
      initialLocale={locale}
      initialPath={`/${locale}${slug.length ? `/${slug.join("/")}` : ""}`}
      initialQuery={query}
    />
  );
}
