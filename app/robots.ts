import type {MetadataRoute} from "next";
export default function robots():MetadataRoute.Robots{return{rules:{userAgent:"*",allow:"/",disallow:["/en/cart","/vi/gio-hang","/en/checkout","/vi/thanh-toan","/en/order","/vi/don-hang"]},sitemap:"https://refvlks-atelier-2026.alvintrank95.chatgpt.site/sitemap.xml"}}
