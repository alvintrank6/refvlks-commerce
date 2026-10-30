import type { Metadata } from "next";
import { LocaleProvider } from "../../src/components/LocaleProvider";
import { ViewTransitions } from "next-view-transitions";
import { MotionProvider } from "../../src/motion/MotionProvider";
import { absoluteUrl, jsonLd, siteOrigin } from "../../src/lib/seo";
import "../globals.css";
export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: { default: "Work Bags | Refvlks", template: "%s | Refvlks" },
  description: "Tailored work bags with woven details from Hanoi.",
  icons: {
    icon: "/brand/favicons/icon.svg",
    apple: "/brand/favicons/apple-touch-icon.png",
  },
  manifest: "/manifest.webmanifest",
  openGraph: { siteName: "Refvlks", images: [{ url: "/images/og/refvlks_og_v2.jpg", width: 1200, height: 630, alt: "Refvlks work bags" }] },
  twitter: { card: "summary_large_image", images: ["/images/og/refvlks_og_v2.jpg"] },
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
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(){var h=document.documentElement;try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches){h.classList.add('js-motion');if(!sessionStorage.getItem('refvlks-visited')){h.classList.add('first-visit');sessionStorage.setItem('refvlks-visited','1')}if(sessionStorage.getItem('refvlks-curtain')){h.classList.add('curtain-incoming');sessionStorage.removeItem('refvlks-curtain')}}}catch(e){}setTimeout(function(){if(!window.__refvlksMotionReady)h.classList.remove('js-motion','first-visit','curtain-incoming')},3000)})()`,
            }}
          />
        </head>
        <body>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({
            "@context": "https://schema.org", "@type": "Organization",
            "@id": `${siteOrigin}/#organization`, name: "Refvlks", url: siteOrigin,
            logo: absoluteUrl("/brand/refvlks_logo_wordmark_primary.svg"),
            description: selected === "vi" ? "Túi đi làm với chi tiết dệt thủ công tại Việt Nam." : "Work bags with textile woven by hand in Vietnam.",
          }) }} />
          <LocaleProvider locale={selected}>
            <MotionProvider>{children}</MotionProvider>
          </LocaleProvider>
        </body>
      </html>
    </ViewTransitions>
  );
}
