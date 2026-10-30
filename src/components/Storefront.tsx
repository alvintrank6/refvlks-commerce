import type { ReactNode } from "react";
import Image from "next/image";
import {
  assets,
  dictionary,
  money,
  paths,
  type Locale,
  type Product,
  type Variant,
} from "../lib/catalog";

export function Picture({
  id,
  locale,
  kind = "full",
  className = "",
  priority = false,
  sizes = "(max-width: 700px) 100vw, 50vw",
  mobileId,
}: {
  id: string;
  locale: Locale;
  kind?: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  mobileId?: string;
}) {
  const asset = assets.get(id);
  if (!asset) return null;
  const variant =
    asset.variants.find((item) => item.kind === kind) ?? asset.variants[0];
  if (!variant) return null;
  const src = variant.files.avif ?? variant.files.webp ?? variant.files.jpg;
  if (!src) return null;
  const mobile = mobileId
    ? assets.get(mobileId)?.variants.find((item) => item.kind === "full")
    : undefined;
  return (
    <picture className={`picture ${className}`}>
      {mobile?.files.avif && (
        <source
          media="(max-width: 800px)"
          srcSet={mobile.files.avif}
          type="image/avif"
        />
      )}
      {mobile?.files.webp && (
        <source
          media="(max-width: 800px)"
          srcSet={mobile.files.webp}
          type="image/webp"
        />
      )}
      {variant.files.avif && (
        <source srcSet={variant.files.avif} type="image/avif" />
      )}
      {variant.files.webp && (
        <source srcSet={variant.files.webp} type="image/webp" />
      )}
      <img
        src={src}
        width={variant.w}
        height={variant.h}
        alt={asset.alt[locale]}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        sizes={sizes}
      />
    </picture>
  );
}

export function Logo({ reversed = false }: { reversed?: boolean }) {
  return (
    <Image
      src={
        reversed
          ? "/brand/refvlks_logo_wordmark_reversed_on-cocoa.svg"
          : "/brand/refvlks_logo_wordmark_primary.svg"
      }
      alt="Refvlks"
      width={142}
      height={32}
      unoptimized
    />
  );
}

export function Header({
  locale,
  altHref,
  count,
}: {
  locale: Locale;
  altHref: string;
  count: number;
}) {
  const d = dictionary(locale);
  const p = paths(locale);
  return (
    <>
      <a className="skip-link" href="#main">
        {locale === "vi" ? "Đến nội dung chính" : "Skip to main content"}
      </a>
      <div className="announcement">{d.home.trust}</div>
      <header className="site-header">
        <div className="header-inner">
          <details className="mobile-nav">
            <summary aria-label={locale === "vi" ? "Mở menu" : "Open menu"}>
              <span></span>
              <span></span>
              <span></span>
            </summary>
            <nav aria-label="Mobile">
              <a href={p.shop}>{d.nav.shop}</a>
              <a href={p.craft}>{d.nav.craft}</a>
              <a href={p.donation}>{d.nav.donation}</a>
              <a href={p.about}>{d.nav.about}</a>
              <a href={p.studio}>{d.nav.studio}</a>
            </nav>
          </details>
          <a className="logo-link" href={p.home} aria-label="Refvlks home">
            <Logo />
          </a>
          <nav className="desktop-nav" aria-label="Main">
            <a href={p.shop}>{d.nav.shop}</a>
            <a href={p.craft}>{d.nav.craft}</a>
            <a href={p.donation}>{d.nav.donation}</a>
            <a href={p.about}>{d.nav.about}</a>
            <a href={p.studio}>{d.nav.studio}</a>
          </nav>
          <div className="header-actions">
            <a
              className="locale-link"
              href={altHref}
              lang={locale === "vi" ? "en" : "vi"}
            >
              {locale === "vi" ? "EN" : "VI"}
            </a>
            <a className="bag-link" href={p.cart}>
              {d.nav.bag} <span aria-label={`${count} items`}>({count})</span>
            </a>
          </div>
        </div>
      </header>
    </>
  );
}

export function Footer({ locale }: { locale: Locale }) {
  const d = dictionary(locale),
    p = paths(locale);
  return (
    <footer className="site-footer">
      <div className="container footer-top">
        <div>
          <a href={p.home} aria-label="Refvlks home">
            <Logo reversed />
          </a>
          <p className="footer-tagline">{d.footer.tagline}</p>
        </div>
        <div className="footer-grid">
          <div>
            <h2>{d.nav.shop}</h2>
            <a href={p.shop}>{d.common.allBags}</a>
            <a href={`${p.shop}?tier=heritage`}>Heritage</a>
            <a href={`${p.shop}?tier=signature`}>Signature</a>
            <a href={`${p.shop}?tier=essential`}>Essential</a>
          </div>
          <div>
            <h2>Refvlks</h2>
            <a href={p.craft}>{d.nav.craft}</a>
            <a href={p.donation}>{d.nav.donation}</a>
            <a href={p.about}>{d.nav.about}</a>
            <a href={p.studio}>{d.nav.studio}</a>
          </div>
          <div>
            <h2>{d.nav.help}</h2>
            <a href={p.contact}>{d.nav.contact}</a>
            <a href={`${p.help}/shipping-returns`}>{d.footer.shipping}</a>
            <a href={`${p.help}/care-repair`}>{d.footer.care}</a>
            <a href={`${p.help}/faq`}>{d.footer.faq}</a>
          </div>
          <div>
            <h2>{d.footer.legal}</h2>
            <a href={`${p.legal}/privacy`}>{d.footer.privacy}</a>
            <a href={`${p.legal}/terms`}>{d.footer.terms}</a>
            <a href={`${p.legal}/payment`}>{d.checkout.payment}</a>
          </div>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>{d.footer.representative}</span>
        <span>{d.footer.studio}</span>
        <span>{d.footer.payment}</span>
        <span>© {new Date().getFullYear()} Refvlks</span>
      </div>
    </footer>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="eyebrow">
      <span className="eyebrow-line" />
      {children}
    </p>
  );
}
export function ButtonLink({
  href,
  children,
  secondary = false,
}: {
  href: string;
  children: ReactNode;
  secondary?: boolean;
}) {
  return (
    <a
      className={
        secondary ? "button button-secondary" : "button button-primary"
      }
      href={href}
    >
      {children}
      <span aria-hidden="true">↗</span>
    </a>
  );
}

export function ProductCard({
  product,
  variant,
  locale,
}: {
  product: Product;
  variant: Variant;
  locale: Locale;
}) {
  const p = paths(locale),
    d = dictionary(locale);
  return (
    <a
      className="product-card"
      href={`${p.product}/${product.handle}?colour=${variant.colourKey}`}
      aria-label={`${product.name[locale]}, ${variant.colour[locale]}, ${money(variant.priceVnd)}`}
    >
      <div className="card-media">
        <Picture id={variant.cardImage} locale={locale} kind="card" />
        <span className="card-view">{d.common.viewDetails} ↗</span>
      </div>
      <div className="card-meta">
        <span className="eyebrow card-tier">{product.tier}</span>
        <span className="card-colour">
          <i style={{ backgroundColor: variant.swatch }} />
          {variant.colour[locale]}
        </span>
      </div>
      <div className="card-title-price">
        <h3>{product.name[locale]}</h3>
        <span>{money(variant.priceVnd)}</span>
      </div>
    </a>
  );
}
