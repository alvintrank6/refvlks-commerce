import type {Metadata} from "next";
import "../globals.css";
export const metadata: Metadata = {metadataBase:new URL("https://refvlks-atelier-2026.alvintrank95.chatgpt.site"),title:{default:"Work Bags | Refvlks",template:"%s | Refvlks"},description:"Tailored work bags with woven details from Hanoi.",icons:{icon:"/brand/favicons/icon.svg",apple:"/brand/favicons/apple-touch-icon.png"},manifest:"/manifest.webmanifest",openGraph:{images:["/images/og/refvlks_og_01_default.jpg"]}};
export default async function RootLayout({children,params}: Readonly<{children:React.ReactNode;params:Promise<{locale:string}>}>) {const {locale}=await params;return <html lang={locale==="vi"?"vi":"en"}><body>{children}</body></html>}
