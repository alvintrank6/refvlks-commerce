import type { Metadata } from "next";
import { LocaleProvider } from "../../src/components/LocaleProvider";
import { ViewTransitions } from "next-view-transitions";
import { absoluteUrl, jsonLd, siteOrigin } from "../../src/lib/seo";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: { default: "Refolks · Heritage in Motion", template: "%s" },
  description:
    "Refolks work bags pair Thai brocade heritage with circular materials for contemporary life.",
  icons: {
    icon: "/images/refolks/icon-192.png",
    apple: "/images/refolks/icon-180.png",
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    siteName: "Refolks",
    images: [
      {
        url: "/images/refolks/tote-02-lifestyle.webp",
        width: 1200,
        height: 900,
        alt: "Refolks work tote",
      },
    ],
  },
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const selected = locale === "vi" ? "vi" : "en";
  return (
    <ViewTransitions>
      <html lang={selected}>
        <body>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: jsonLd({
                "@context": "https://schema.org",
                "@type": "Organization",
                "@id": `${siteOrigin}/#organization`,
                name: "Refolks",
                url: siteOrigin,
                logo: absoluteUrl("/images/refolks/logo-dark.png"),
                description:
                  selected === "vi"
                    ? "Túi công sở kết hợp thổ cẩm Thái và vật liệu tuần hoàn."
                    : "Work bags blending Thai brocade with circular materials.",
              }),
            }}
          />
          <LocaleProvider locale={selected}>{children}</LocaleProvider>
        </body>
      </html>
    </ViewTransitions>
  );
}
