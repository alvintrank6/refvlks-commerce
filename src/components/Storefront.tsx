import type { ReactNode } from "react";
import Image from "next/image";
import { Link } from "next-view-transitions";
import {
  assets,
  dictionary,
  money,
  paths,
  type Locale,
  type Product,
  type Variant,
} from "../lib/catalog";

export function ResponsivePicture({
  id,
  locale,
  kind = "full",
  className = "",
  priority = false,
  sizes = "(max-width: 700px) 100vw, 50vw",
  mobileId,
  decorative = false,
  viewTransitionName,
}: {
  id: string;
  locale: Locale;
  kind?: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  mobileId?: string;
  decorative?: boolean;
  viewTransitionName?: string;
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
        alt={decorative ? "" : asset.alt[locale]}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        sizes={sizes}
        style={viewTransitionName ? { viewTransitionName } : undefined}
      />
    </picture>
  );
}
export const Picture = ResponsivePicture;

function RollingLink({
  href,
  text,
  className = "",
}: {
  href: string;
  text: string;
  className?: string;
}) {
  return (
    <a className={`rolling-link ${className}`} href={href}>
      <span className="rolling-viewport">
        <span>{text}</span>
        <span aria-hidden="true">{text}</span>
      </span>
    </a>
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
        {d.ui.skip}
      </a>
      <div className="announcement">{d.home.hero.trust}</div>
      <header className="site-header">
        <div className="header-inner">
          <details className="mobile-nav">
            <summary aria-label={d.ui.openMenu}>
              <span></span>
              <span></span>
              <span></span>
            </summary>
            <nav aria-label={d.ui.mobileNav}>
              <a href={p.shop}>{d.nav.shop}</a>
              <a href={p.craft}>{d.nav.craft}</a>
              <a href={p.donation}>{d.nav.donation}</a>
              <a href={p.about}>{d.nav.about}</a>
              <a href={p.studio}>{d.nav.studio}</a>
            </nav>
          </details>
          <a className="logo-link" href={p.home} aria-label={d.ui.logoHome}>
            <Logo />
          </a>
          <nav className="desktop-nav" aria-label={d.ui.mainNav}>
            <RollingLink href={p.shop} text={d.nav.shop} />
            <RollingLink href={p.craft} text={d.nav.craft} />
            <RollingLink href={p.donation} text={d.nav.donation} />
            <RollingLink href={p.about} text={d.nav.about} />
            <RollingLink href={p.studio} text={d.nav.studio} />
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
              {d.nav.bag}{" "}
              <span aria-label={d.ui.itemCount.replace("{n}", String(count))}>
                ({count})
              </span>
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
          <a href={p.home} aria-label={d.ui.logoHome}>
            <Logo reversed />
          </a>
          <p className="footer-tagline">{d.footer.tagline}</p>
        </div>
        <div className="footer-grid">
          <div>
            <h2>{d.nav.shop}</h2>
            <RollingLink href={p.shop} text={d.common.allBags} />
            <RollingLink
              href={`${p.shop}?tier=heritage`}
              text={d.home.collection.heritage}
            />
            <RollingLink
              href={`${p.shop}?tier=signature`}
              text={d.home.collection.signature}
            />
            <RollingLink
              href={`${p.shop}?tier=essential`}
              text={d.home.collection.essential}
            />
          </div>
          <div>
            <h2>Refvlks</h2>
            <RollingLink href={p.craft} text={d.nav.craft} />
            <RollingLink href={p.donation} text={d.nav.donation} />
            <RollingLink href={p.about} text={d.nav.about} />
            <RollingLink href={p.studio} text={d.nav.studio} />
          </div>
          <div>
            <h2>{d.nav.help}</h2>
            <RollingLink href={p.contact} text={d.nav.contact} />
            <RollingLink
              href={`${p.help}/shipping-returns`}
              text={d.footer.shipping}
            />
            <RollingLink href={`${p.help}/care-repair`} text={d.footer.care} />
            <RollingLink href={`${p.help}/faq`} text={d.footer.faq} />
          </div>
          <div>
            <h2>{d.footer.legal}</h2>
            <RollingLink href={`${p.legal}/privacy`} text={d.footer.privacy} />
            <RollingLink href={`${p.legal}/terms`} text={d.footer.terms} />
            <RollingLink
              href={`${p.legal}/payment`}
              text={d.checkout.payment}
            />
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
      data-magnetic={!secondary ? "true" : undefined}
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
    <Link
      className="product-card"
      href={`${p.product}/${product.handle}?colour=${variant.colourKey}`}
      data-view-transition="true"
      prefetch={false}
    >
      <div className="card-media">
        <Picture
          id={variant.cardImage}
          locale={locale}
          kind="card"
          decorative
          viewTransitionName={`product-${product.handle}-${variant.colourKey}`}
        />
        <Picture
          id={variant.hoverImage}
          locale={locale}
          kind="card"
          className="card-hover-image"
          decorative
        />
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
    </Link>
  );
}
