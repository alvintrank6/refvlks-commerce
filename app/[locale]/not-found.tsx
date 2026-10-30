"use client";

import { usePathname } from "next/navigation";
import { Logo } from "../../src/components/Storefront";
import { paths } from "../../src/lib/catalog";

export default function NotFound() {
  const locale = usePathname()?.startsWith("/vi") ? "vi" : "en";
  const p = paths(locale);
  return (
    <main className="not-found-page">
      <div className="container">
        <Logo />
        <span className="mono">404 / REFVLKS</span>
        <h1>
          {locale === "vi"
            ? "Trang này đã đi lạc."
            : "This page has wandered off."}
        </h1>
        <p className="lead">
          {locale === "vi"
            ? "Liên kết có thể đã cũ hoặc bị gõ sai."
            : "The link may be old or mistyped."}
        </p>
        <div className="button-row">
          <a className="button button-primary" href={p.shop}>
            {locale === "vi" ? "Xem bộ sưu tập" : "Shop the collection"} ↗
          </a>
          <a className="button button-secondary" href={p.home}>
            {locale === "vi" ? "Về trang chủ" : "Go to homepage"}
          </a>
        </div>
      </div>
    </main>
  );
}
