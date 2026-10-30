import type { Metadata } from "next";
import { LocaleProvider } from "../../src/components/LocaleProvider";
import { ViewTransitions } from "next-view-transitions";
import { MotionProvider } from "../../src/motion/MotionProvider";
import "../globals.css";
export const metadata: Metadata = {
  metadataBase: new URL(
    "https://refvlks-atelier-2026.alvintrank95.chatgpt.site",
  ),
  title: { default: "Work Bags | Refvlks", template: "%s | Refvlks" },
  description: "Tailored work bags with woven details from Hanoi.",
  icons: {
    icon: "/brand/favicons/icon.svg",
    apple: "/brand/favicons/apple-touch-icon.png",
  },
  manifest: "/manifest.webmanifest",
  openGraph: { images: ["/images/og/refvlks_og_01_default.jpg"] },
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
          <LocaleProvider locale={selected}>
            <MotionProvider>{children}</MotionProvider>
          </LocaleProvider>
        </body>
      </html>
    </ViewTransitions>
  );
}
