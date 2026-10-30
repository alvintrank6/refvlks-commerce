import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { env } from "cloudflare:workers";
import {
  allVariants,
  dictionary,
  isLocale,
  money,
  paths,
  productByHandle,
  products,
  type Locale,
} from "../../../src/lib/catalog";
import { cartDetails, getCart } from "../../../src/lib/cart";
import {
  ButtonLink,
  Eyebrow,
  Footer,
  Header,
  Picture,
  ProductCard,
} from "../../../src/components/Storefront";
import CheckoutPage from "../../../src/components/CheckoutPage";
import QRCode from "qrcode";
import { vietqrPayload } from "../../../src/lib/vietqr";

type Props = {
  params: Promise<{ locale: string; slug?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};
const param = (
  obj: Record<string, string | string[] | undefined>,
  key: string,
) => (typeof obj[key] === "string" ? (obj[key] as string) : "");

function kindOf(locale: Locale, slug: string[]) {
  const first = slug[0] ?? "";
  if (!first) return "home";
  const p = paths(locale);
  const pairs: Record<string, string> = {
    shop: p.shop,
    craft: p.craft,
    donation: p.donation,
    about: p.about,
    studio: p.studio,
    cart: p.cart,
    checkout: p.checkout,
    contact: p.contact,
    product: p.product,
    order: p.order,
    help: p.help,
    legal: p.legal,
  };
  return (
    Object.entries(pairs).find(
      ([, path]) => path.split("/").pop() === first,
    )?.[0] ?? "unknown"
  );
}
function altPath(
  locale: Locale,
  kind: string,
  slug: string[],
  query: Record<string, string | string[] | undefined>,
) {
  const other = locale === "en" ? "vi" : "en";
  const path =
    (paths(other) as unknown as Record<string, string>)[kind] ??
    paths(other).home;
  const tail =
    kind === "product" ||
    kind === "order" ||
    kind === "help" ||
    kind === "legal"
      ? `/${slug.slice(1).join("/")}`
      : "";
  const colour = param(query, "colour");
  return `${path}${tail}${colour ? `?colour=${encodeURIComponent(colour)}` : ""}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw, slug = [] } = await params;
  if (!isLocale(raw)) return {};
  const d = dictionary(raw),
    kind = kindOf(raw, slug);
  let title =
    raw === "vi"
      ? "Túi đi làm, ngoài tĩnh, trong dệt tay"
      : "Work Bags, Quiet Outside, Woven Inside";
  let description = d.home.intro;
  if (kind === "shop") title = d.shop.title;
  if (kind === "product") {
    const product = productByHandle(slug[1] ?? "");
    if (product) {
      title = product.name[raw];
      description = product.short[raw];
    }
  }
  if (kind === "studio") title = d.studio.title;
  if (kind === "craft") title = d.craft.title;
  if (kind === "donation") {
    title = d.donation.title;
    description = d.donation.intro;
  }
  if (kind === "about") title = d.about.title;
  return {
    title,
    description,
    robots:
      kind === "cart" || kind === "checkout" || kind === "order"
        ? { index: false, follow: false }
        : undefined,
  };
}

export default async function Page({ params, searchParams }: Props) {
  const { locale: raw, slug = [] } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw;
  const q = await searchParams;
  const kind = kindOf(locale, slug);
  if (kind === "unknown") notFound();
  const cart = await getCart();
  const count = cart.reduce((n, line) => n + line.qty, 0);
  const altHref = altPath(locale, kind, slug, q);
  return (
    <>
      <Header locale={locale} altHref={altHref} count={count} />
      <main id="main">
        {kind === "home" ? (
          <Home locale={locale} />
        ) : kind === "shop" ? (
          <Shop locale={locale} q={q} />
        ) : kind === "product" ? (
          <ProductPage locale={locale} handle={slug[1]} q={q} />
        ) : kind === "craft" ? (
          <Craft locale={locale} />
        ) : kind === "donation" ? (
          <Donation locale={locale} />
        ) : kind === "about" ? (
          <About locale={locale} />
        ) : kind === "studio" ? (
          <Studio locale={locale} q={q} />
        ) : kind === "cart" ? (
          <Cart locale={locale} cart={cart} />
        ) : kind === "checkout" ? (
          slug[1] === "card" ? (
            <CardPreview locale={locale} />
          ) : (
            <CheckoutPage locale={locale} cart={cart} query={q} />
          )
        ) : kind === "contact" ? (
          <Contact locale={locale} q={q} />
        ) : kind === "order" ? (
          <Order locale={locale} token={slug[1]} />
        ) : kind === "help" ? (
          <Help locale={locale} topic={slug[1]} />
        ) : kind === "legal" ? (
          <Legal locale={locale} topic={slug[1]} />
        ) : null}
      </main>
      <Footer locale={locale} />
    </>
  );
}

function Donation({ locale }: { locale: Locale }) {
  const d = dictionary(locale);
  return (
    <section className="container page-hero">
      <Eyebrow>{d.donation.eyebrow}</Eyebrow>
      <h1>{d.donation.title}</h1>
      <p className="lead">{d.donation.intro}</p>
    </section>
  );
}

function Home({ locale }: { locale: Locale }) {
  const d = dictionary(locale),
    p = paths(locale);
  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <Eyebrow>{d.home.eyebrow}</Eyebrow>
          <h1>{d.home.headline}</h1>
          <p className="lead">{d.home.intro}</p>
          <div className="hero-actions">
            <ButtonLink href={p.shop}>{d.common.shopCollection}</ButtonLink>
            <ButtonLink secondary href={p.studio}>
              {d.common.visitStudio}
            </ButtonLink>
          </div>
          <p className="hero-note">{d.home.trust}</p>
        </div>
        <div className="hero-media">
          <Picture id="HOME-01" mobileId="HOME-02" locale={locale} priority />
          <span className="hero-index">01 / REFVLKS</span>
        </div>
      </section>
      <section className="section container">
        <div className="section-heading">
          <div>
            <Eyebrow>{d.shop.eyebrow}</Eyebrow>
            <h2>{d.home.collectionTitle}</h2>
            <p className="lead">{d.home.collectionBody}</p>
          </div>
          <a className="text-link" href={p.shop}>
            {d.common.allBags} ↗
          </a>
        </div>
        <div className="product-grid">
          {allVariants.map(({ product, variant }) => (
            <ProductCard
              key={variant.sku}
              product={product}
              variant={variant}
              locale={locale}
            />
          ))}
        </div>
      </section>
      <section className="section dark-section" id="reveal">
        <div className="container">
          <a className="text-link" href="#after-reveal">
            {d.home.skipReveal}
          </a>
          <div className="reveal-layout">
            <div>
              <Eyebrow>{d.home.revealLabel}</Eyebrow>
              <h2>{d.home.revealTitle}</h2>
              <div className="reveal-steps">
                <div className="reveal-step">{d.home.revealOne}</div>
                <div className="reveal-step">{d.home.revealTwo}</div>
                <div className="reveal-step">{d.home.revealThree}</div>
              </div>
              <a className="text-link" href={p.craft}>
                {d.common.learnMore} ↗
              </a>
            </div>
            <div>
              <div className="reveal-image">
                <Picture id="REVEAL-08" locale={locale} />
              </div>
              <div className="reveal-small">
                <Picture id="REVEAL-01" locale={locale} />
                <Picture id="REVEAL-05" locale={locale} />
                <Picture id="REVEAL-08" locale={locale} />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section materials-section" id="after-reveal">
        <div className="container">
          <Eyebrow>{d.craft.eyebrow}</Eyebrow>
          <div className="section-heading">
            <h2>{d.home.materialsTitle}</h2>
            <a className="text-link" href={p.craft}>
              {d.common.learnMore} ↗
            </a>
          </div>
          <div className="materials-grid">
            <div className="material-panel">
              <div className="material-number">70%</div>
              <h3>{d.craft.new}</h3>
              <p>{d.home.materialOne}</p>
            </div>
            <div className="material-panel">
              <div className="material-number">30%</div>
              <h3>{d.craft.recovered}</h3>
              <p>{d.home.materialTwo}</p>
            </div>
          </div>
          <p className="material-foot">{d.home.materialNote}</p>
        </div>
      </section>
      <section className="section container">
        <Eyebrow>REFVLKS / 03</Eyebrow>
        <h2>{d.home.trustTitle}</h2>
        <div className="trust-grid">
          <div className="trust-item">
            <span className="number">01</span>
            <h3>{d.home.trustOneTitle}</h3>
            <p>{d.home.trustOne}</p>
          </div>
          <div className="trust-item">
            <span className="number">02</span>
            <h3>{d.home.trustTwoTitle}</h3>
            <p>{d.home.trustTwo}</p>
          </div>
          <div className="trust-item">
            <span className="number">03</span>
            <h3>{d.home.trustThreeTitle}</h3>
            <p>{d.home.trustThree}</p>
          </div>
        </div>
      </section>
      <section className="section studio-cta">
        <div className="container">
          <div>
            <Eyebrow>{d.studio.eyebrow}</Eyebrow>
            <h2>{d.home.studioTitle}</h2>
            <p className="lead">{d.home.studioBody}</p>
          </div>
          <ButtonLink href={`${p.studio}#book`}>{d.studio.book}</ButtonLink>
        </div>
      </section>
    </>
  );
}

function Shop({
  locale,
  q,
}: {
  locale: Locale;
  q: Record<string, string | string[] | undefined>;
}) {
  const d = dictionary(locale),
    p = paths(locale);
  const tier = param(q, "tier"),
    sort = param(q, "sort"),
    colour = param(q, "colour");
  let rows = allVariants.filter(
    ({ product, variant }) =>
      (!tier || product.tier === tier) &&
      (!colour || variant.colourKey === colour),
  );
  if (sort === "low")
    rows = [...rows].sort((a, b) => a.variant.priceVnd - b.variant.priceVnd);
  if (sort === "high")
    rows = [...rows].sort((a, b) => b.variant.priceVnd - a.variant.priceVnd);
  return (
    <>
      <section className="container page-hero">
        <Eyebrow>{d.shop.eyebrow}</Eyebrow>
        <h1>{tier ? tier[0].toUpperCase() + tier.slice(1) : d.shop.title}</h1>
        <p className="lead">{d.shop.intro}</p>
      </section>
      <section className="container section" style={{ paddingTop: 0 }}>
        <div className="filters">
          <form className="filter-form" action={p.shop} method="get">
            <div className="field">
              <label htmlFor="tier">{d.shop.tier}</label>
              <select id="tier" name="tier" defaultValue={tier}>
                <option value="">{d.shop.all}</option>
                <option value="essential">Essential</option>
                <option value="signature">Signature</option>
                <option value="heritage">Heritage</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="colour">{d.common.colour}</label>
              <select id="colour" name="colour" defaultValue={colour}>
                <option value="">{d.shop.all}</option>
                {allVariants.map(({ variant }) => (
                  <option key={variant.sku} value={variant.colourKey}>
                    {variant.colour[locale]}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="sort">{d.shop.sort}</label>
              <select id="sort" name="sort" defaultValue={sort}>
                <option value="featured">{d.shop.featured}</option>
                <option value="low">{d.shop.low}</option>
                <option value="high">{d.shop.high}</option>
              </select>
            </div>
            <button className="button button-secondary" type="submit">
              {d.shop.filter} →
            </button>
          </form>
          <span className="filter-count">
            {d.shop.count.replace("{n}", String(rows.length))}
          </span>
        </div>
        {rows.length ? (
          <div className="product-grid">
            {rows.map(({ product, variant }) => (
              <ProductCard
                key={variant.sku}
                product={product}
                variant={variant}
                locale={locale}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h2>{d.shop.empty}</h2>
            <ButtonLink href={p.shop}>{d.shop.clear}</ButtonLink>
          </div>
        )}
      </section>
    </>
  );
}

async function ProductPage({
  locale,
  handle,
  q,
}: {
  locale: Locale;
  handle?: string;
  q: Record<string, string | string[] | undefined>;
}) {
  const product = productByHandle(handle ?? "");
  if (!product) notFound();
  const d = dictionary(locale),
    p = paths(locale),
    colour = param(q, "colour"),
    variant =
      product.variants.find((v) => v.colourKey === colour) ??
      product.variants[0];
  const gallery =
    variant.images ??
    product.images
      .map((i) => i.asset)
      .filter(
        (id) =>
          product.variants.length === 1 ||
          id.startsWith(variant.cardImage.slice(0, 5)) ||
          id.startsWith("LIFE"),
      );
  const inside = product.images.find(
    (i) => i.role === "inside" || i.role === "open",
  );
  const stockRow = env.DB
    ? await env.DB.prepare("SELECT stock FROM inventory WHERE sku=?")
        .bind(variant.sku)
        .first<{ stock: number }>()
    : null;
  const available = (stockRow?.stock ?? variant.stock) > 0;
  return (
    <div className="with-mobile-buy">
      <div className="container product-detail">
        <div className="gallery">
          {gallery.map((id) => (
            <Picture key={id} id={id} locale={locale} />
          ))}
        </div>
        <div className="buy-box">
          <Eyebrow>
            {product.tier.toUpperCase()} · {product.code}
          </Eyebrow>
          <h1>{product.name[locale]}</h1>
          <p className="buy-price">{money(variant.priceVnd)}</p>
          <p className="lead">{product.short[locale]}</p>
          <div className="field-label">
            {d.product.colourLabel}: {variant.colour[locale]}
          </div>
          <div className="swatches">
            {product.variants.map((v) => (
              <a
                key={v.sku}
                className="swatch"
                href={`${p.product}/${product.handle}?colour=${v.colourKey}`}
                aria-label={v.colour[locale]}
                aria-current={v.sku === variant.sku}
              >
                <i style={{ backgroundColor: v.swatch }} />
              </a>
            ))}
          </div>
          <form method="post" action="/api/cart">
            <input type="hidden" name="action" value="add" />
            <input type="hidden" name="sku" value={variant.sku} />
            <input type="hidden" name="locale" value={locale} />
            <button
              className="button button-primary"
              type="submit"
              disabled={!available}
            >
              {available ? d.common.addToBag : d.common.soldOut}
              <span aria-hidden="true">↗</span>
            </button>
          </form>
          <p className="buy-note">{d.product.inspect}</p>
          <a
            className="text-link"
            href={`${p.studio}?bag=${product.handle}#book`}
          >
            {d.product.studio} ↗
          </a>
        </div>
      </div>
      <section className="section container">
        <Eyebrow>{d.product.about}</Eyebrow>
        <h2>{product.name[locale]}</h2>
        <p className="lead">{product.long[locale]}</p>
        <div className="material-list">
          {product.materials.parts.map((part, i) => (
            <div key={i}>
              <dt>{part.part}</dt>
              <dd>{part[locale]}</dd>
            </div>
          ))}
        </div>
        <p className="mono">{product.materials.share[locale]}</p>
      </section>
      {inside && (
        <section className="story-panel">
          <div>
            <Eyebrow>{d.home.revealLabel}</Eyebrow>
            <h2>{locale === "vi" ? "Mở ra." : "Open it."}</h2>
            <p className="lead">{product.short[locale]}</p>
          </div>
          <Picture id={inside.asset} locale={locale} />
        </section>
      )}
      <section className="section container">
        <div className="section-heading">
          <div>
            <Eyebrow>{d.shop.eyebrow}</Eyebrow>
            <h2>{d.product.more}</h2>
          </div>
          <a className="text-link" href={p.shop}>
            {d.common.allBags} ↗
          </a>
        </div>
        <div className="product-grid">
          {allVariants
            .filter((row) => row.product.code !== product.code)
            .slice(0, 3)
            .map(({ product, variant }) => (
              <ProductCard
                key={variant.sku}
                product={product}
                variant={variant}
                locale={locale}
              />
            ))}
        </div>
      </section>
      <div className="mobile-buy">
        <form method="post" action="/api/cart">
          <input type="hidden" name="action" value="add" />
          <input type="hidden" name="sku" value={variant.sku} />
          <input type="hidden" name="locale" value={locale} />
          <span>{money(variant.priceVnd)}</span>
          <button className="button button-primary" disabled={!available}>
            {available ? d.common.addToBag : d.common.soldOut} ↗
          </button>
        </form>
      </div>
    </div>
  );
}

function Craft({ locale }: { locale: Locale }) {
  const d = dictionary(locale),
    p = paths(locale);
  return (
    <>
      <section className="container page-hero">
        <Eyebrow>{d.craft.eyebrow}</Eyebrow>
        <h1>{d.craft.title}</h1>
        <p className="lead">{d.craft.intro}</p>
      </section>
      <section className="section container content-grid">
        <Picture id="SP01-05" locale={locale} />
        <div className="text-stack">
          <Eyebrow>70 / 30</Eyebrow>
          <h2>{d.home.materialsTitle}</h2>
          <p className="lead">{d.craft.body}</p>
          <p>{d.home.materialNote}</p>
          <ButtonLink href={`${p.shop}?tier=heritage`}>
            {d.common.shopCollection}
          </ButtonLink>
        </div>
      </section>
      <section className="section materials-section">
        <div className="container materials-grid">
          <div className="material-panel">
            <div className="material-number">70%</div>
            <h3>{d.craft.new}</h3>
            <p>{d.home.materialOne}</p>
          </div>
          <div className="material-panel">
            <div className="material-number">30%</div>
            <h3>{d.craft.recovered}</h3>
            <p>{d.home.materialTwo}</p>
          </div>
        </div>
      </section>
    </>
  );
}

function About({ locale }: { locale: Locale }) {
  const d = dictionary(locale),
    p = paths(locale);
  return (
    <>
      <section className="container page-hero">
        <Eyebrow>{d.about.eyebrow}</Eyebrow>
        <h1>{d.about.title}</h1>
        <p className="lead">{d.about.intro}</p>
      </section>
      <section className="section container content-grid">
        <div className="text-stack">
          <Eyebrow>HANOI / REFVLKS</Eyebrow>
          <h2>{d.home.headline}</h2>
          <p className="lead">{d.home.collectionBody}</p>
          <div className="button-row">
            <ButtonLink href={p.shop}>{d.about.cta}</ButtonLink>
            <ButtonLink secondary href={p.studio}>
              {d.nav.studio}
            </ButtonLink>
          </div>
        </div>
        <Picture id="LIFE-01" locale={locale} />
      </section>
    </>
  );
}

function Studio({
  locale,
  q,
}: {
  locale: Locale;
  q: Record<string, string | string[] | undefined>;
}) {
  const d = dictionary(locale),
    bag = param(q, "bag"),
    status = param(q, "status");
  const now = new Date();
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
  const last = new Date(now.getTime() + 30 * 86400000)
    .toISOString()
    .slice(0, 10);
  const slots = Array.from({ length: 27 }, (_, i) => {
    const mins = 8 * 60 + i * 30;
    return `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;
  });
  return (
    <>
      <section className="container page-hero">
        <Eyebrow>{d.studio.eyebrow}</Eyebrow>
        <h1>{d.studio.title}</h1>
        <p className="lead">{d.studio.intro}</p>
        <p>
          {d.footer.studio}
          <br />
          {d.studio.hours} · {d.studio.appointment}
        </p>
        <ButtonLink href="#book">{d.studio.book}</ButtonLink>
      </section>
      <section className="section materials-section" id="book">
        <div className="container booking-layout">
          <div>
            <Eyebrow>{d.studio.eyebrow}</Eyebrow>
            <h2>{d.studio.book}</h2>
            <p className="lead">{d.studio.appointment}</p>
            <p>{d.footer.studio}</p>
            <p>{d.studio.hours}</p>
            <a
              className="text-link"
              href="https://maps.google.com/?q=22+Le+Quy+Don+Ha+Noi"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Maps ↗
            </a>
          </div>
          <div className="booking-card">
            {status === "success" && (
              <p className="message-box" role="status">
                {d.studio.success}
              </p>
            )}
            {status === "error" && (
              <p className="message-box error" role="alert">
                {d.studio.error}
              </p>
            )}
            <form method="post" action="/api/visits">
              <input type="hidden" name="locale" value={locale} />
              <div className="field">
                <label htmlFor="visit-name">{d.common.name}</label>
                <input
                  id="visit-name"
                  name="name"
                  required
                  autoComplete="name"
                />
              </div>
              <div className="field">
                <label htmlFor="visit-phone">{d.common.phone}</label>
                <input
                  id="visit-phone"
                  name="phone"
                  type="tel"
                  required
                  pattern="0[0-9]{9}"
                  autoComplete="tel"
                />
              </div>
              <div className="field">
                <label htmlFor="visit-email">{d.common.email}</label>
                <input
                  id="visit-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                />
              </div>
              <div className="form-grid">
                <div className="field">
                  <label htmlFor="visit-date">{d.studio.date}</label>
                  <input
                    id="visit-date"
                    name="date"
                    type="date"
                    min={today}
                    max={last}
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="visit-time">{d.studio.time}</label>
                  <select id="visit-time" name="time" required>
                    <option value="">{d.common.choose}</option>
                    {slots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="field">
                <label htmlFor="visit-bag">{d.studio.bag}</label>
                <select id="visit-bag" name="bag" defaultValue={bag}>
                  <option value="">{d.studio.chooseBag}</option>
                  {products.map((product) => (
                    <option key={product.code} value={product.handle}>
                      {product.name[locale]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="visit-note">{d.studio.note}</label>
                <textarea id="visit-note" name="note" maxLength={300} />
              </div>
              <label className="consent">
                <input type="checkbox" name="consent" required />
                <span>{d.checkout.terms}</span>
              </label>
              <button className="button button-primary" type="submit">
                {d.studio.book} ↗
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

function Cart({
  locale,
  cart,
}: {
  locale: Locale;
  cart: Awaited<ReturnType<typeof getCart>>;
}) {
  const d = dictionary(locale),
    p = paths(locale),
    rows = cartDetails(cart),
    subtotal = rows.reduce((n, row) => n + row.total, 0);
  return (
    <section className="container section">
      <Eyebrow>{d.nav.bag}</Eyebrow>
      <h1>{d.cart.title}</h1>
      {rows.length ? (
        <div className="cart-layout">
          <div>
            {rows.map((row) => (
              <div className="cart-row" key={row.variant.sku}>
                <Picture
                  id={row.variant.cardImage}
                  locale={locale}
                  kind="card"
                />
                <div>
                  <h2>{row.product.name[locale]}</h2>
                  <p>{row.variant.colour[locale]}</p>
                  <form method="post" action="/api/cart">
                    <input type="hidden" name="action" value="update" />
                    <input type="hidden" name="sku" value={row.variant.sku} />
                    <input type="hidden" name="locale" value={locale} />
                    <label className="field" htmlFor={`qty-${row.variant.sku}`}>
                      {d.common.quantity}
                      <input
                        id={`qty-${row.variant.sku}`}
                        type="number"
                        name="qty"
                        min="0"
                        max={row.variant.stock}
                        defaultValue={row.qty}
                      />
                    </label>
                    <button type="submit">{d.cart.update}</button>
                  </form>
                  <form method="post" action="/api/cart">
                    <input type="hidden" name="action" value="remove" />
                    <input type="hidden" name="sku" value={row.variant.sku} />
                    <input type="hidden" name="locale" value={locale} />
                    <button type="submit">{d.common.remove}</button>
                  </form>
                </div>
                <div className="cart-price">{money(row.total)}</div>
              </div>
            ))}
          </div>
          <aside className="summary-card">
            <h2>{d.checkout.summary}</h2>
            <div className="summary-line">
              <span>{d.common.subtotal}</span>
              <span>{money(subtotal)}</span>
            </div>
            <p>{d.cart.estimate}</p>
            <ButtonLink href={p.checkout}>{d.cart.checkout}</ButtonLink>
          </aside>
        </div>
      ) : (
        <div className="empty-state">
          <h2>{d.cart.empty}</h2>
          <ButtonLink href={p.shop}>{d.common.shopCollection}</ButtonLink>
        </div>
      )}
    </section>
  );
}

async function Order({ locale, token }: { locale: Locale; token?: string }) {
  if (!token || !env.DB) notFound();
  const order = await env.DB.prepare("SELECT * FROM orders WHERE token = ?")
    .bind(token)
    .first<Record<string, string | number | null>>();
  if (!order) notFound();
  const d = dictionary(locale),
    p = paths(locale),
    transfer = order.payment_method === "transfer";
  const qrSvg = transfer
    ? await QRCode.toString(
        vietqrPayload(Number(order.total), String(order.number)),
        { type: "svg", errorCorrectionLevel: "M", margin: 1, width: 240 },
      ).catch(() => null)
    : null;
  const items = await env.DB.prepare(
    "SELECT * FROM order_items WHERE order_id = ?",
  )
    .bind(order.id)
    .all<Record<string, string | number>>();
  return (
    <section className="container section">
      <Eyebrow>{d.order.title}</Eyebrow>
      <h1>{d.order.title}</h1>
      <p className="lead">{d.order.thanks}</p>
      <div className="order-box">
        <dl>
          <div>
            <dt>{d.order.number}</dt>
            <dd>{order.number}</dd>
          </div>
          <div>
            <dt>{d.order.payment}</dt>
            <dd>{transfer ? d.checkout.transfer : d.checkout.cod}</dd>
          </div>
          <div>
            <dt>{d.common.total}</dt>
            <dd>{money(Number(order.total))}</dd>
          </div>
        </dl>
        {items.results.map((item, i) => (
          <p key={i}>
            {item.name} · {item.colour} × {item.qty} —{" "}
            {money(Number(item.unit_price) * Number(item.qty))}
          </p>
        ))}
      </div>
      {transfer ? (
        <div className="order-box">
          <h2>{d.order.transferTitle}</h2>
          {qrSvg && (
            <div
              className="qr-code"
              role="img"
              aria-label="VietQR"
              dangerouslySetInnerHTML={{ __html: qrSvg }}
            />
          )}
          <dl>
            <div>
              <dt>{d.order.bank}</dt>
              <dd>Techcombank</dd>
            </div>
            <div>
              <dt>{d.order.recipient}</dt>
              <dd>NGUYEN TUNG ANH (Refvlks)</dd>
            </div>
            <div>
              <dt>{d.order.account}</dt>
              <dd>19070671343017</dd>
            </div>
            <div>
              <dt>{d.order.amount}</dt>
              <dd>{money(Number(order.total))}</dd>
            </div>
            <div>
              <dt>{d.order.reference}</dt>
              <dd>{order.number}</dd>
            </div>
          </dl>
          <p>{d.order.deadline}</p>
          {order.customer_marked_paid_at ? (
            <p className="message-box">{d.order.markedDone}</p>
          ) : (
            <form action="/api/orders/mark-transfer" method="post">
              <input type="hidden" name="token" value={token} />
              <input type="hidden" name="locale" value={locale} />
              <button className="button button-secondary" type="submit">
                {d.order.marked}
              </button>
            </form>
          )}
        </div>
      ) : (
        <p className="message-box">{d.order.codNote}</p>
      )}
      <ButtonLink href={p.shop}>{d.common.continueShopping}</ButtonLink>
    </section>
  );
}

function Contact({
  locale,
  q,
}: {
  locale: Locale;
  q: Record<string, string | string[] | undefined>;
}) {
  const d = dictionary(locale),
    status = param(q, "status");
  return (
    <section className="container section">
      <Eyebrow>{d.nav.contact}</Eyebrow>
      <h1>{d.contact.title}</h1>
      <p className="lead">{d.contact.intro}</p>
      <div className="booking-layout">
        <div>
          <h2>{d.studio.title}</h2>
          <p>{d.footer.studio}</p>
          <p>
            {d.studio.hours} · {d.studio.appointment}
          </p>
        </div>
        <div className="booking-card">
          {status === "success" && (
            <p className="message-box" role="status">
              {d.contact.success}
            </p>
          )}
          {status === "error" && (
            <p className="message-box error" role="alert">
              {d.contact.error}
            </p>
          )}
          <form method="post" action="/api/messages">
            <input type="hidden" name="locale" value={locale} />
            <div className="field">
              <label htmlFor="message-name">{d.common.name}</label>
              <input id="message-name" name="name" required />
            </div>
            <div className="field">
              <label htmlFor="message-contact">
                {d.common.phone} / {d.common.email}
              </label>
              <input id="message-contact" name="contact" required />
            </div>
            <div className="field">
              <label htmlFor="message-topic">{d.contact.topic}</label>
              <select id="message-topic" name="topic">
                <option value="order">{d.contact.order}</option>
                <option value="visit">{d.contact.visit}</option>
                <option value="repair">{d.contact.repair}</option>
                <option value="other">{d.contact.other}</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="message-order">{d.contact.orderNumber}</label>
              <input id="message-order" name="orderNumber" />
            </div>
            <div className="field">
              <label htmlFor="message-body">{d.common.message}</label>
              <textarea
                id="message-body"
                name="body"
                required
                maxLength={2000}
              />
            </div>
            <label className="consent">
              <input type="checkbox" name="consent" required />
              <span>{d.checkout.terms}</span>
            </label>
            <button className="button button-primary" type="submit">
              {d.common.send} ↗
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function Help({ locale, topic }: { locale: Locale; topic?: string }) {
  const d = dictionary(locale);
  const title =
    topic === "shipping-returns"
      ? d.footer.shipping
      : topic === "care-repair"
        ? d.footer.care
        : topic === "faq"
          ? d.footer.faq
          : null;
  if (!title) notFound();
  return (
    <section className="container page-hero policy-content">
      <Eyebrow>{d.nav.help}</Eyebrow>
      <h1>{title}</h1>
      {topic === "shipping-returns" ? (
        <>
          <h2>{d.checkout.delivery}</h2>
          <p>
            {d.checkout.ship}. {d.checkout.pickup}. {d.checkout.codDetail}
          </p>
          <h2>{d.footer.shipping}</h2>
          <p>
            {locale === "vi"
              ? "Bạn có thể kiểm tra túi trước khi thanh toán khi nhận hàng. Liên hệ chúng tôi nếu túi có lỗi sản xuất hoặc cần đổi trả."
              : "You may inspect the bag before paying on delivery. Contact us if the bag has a manufacturing defect or you need an exchange."}
          </p>
        </>
      ) : topic === "care-repair" ? (
        <>
          <h2>{d.footer.care}</h2>
          <p>
            {d.home.trustTwo}{" "}
            {locale === "vi"
              ? "Lau nhẹ bằng khăn ẩm và xà phòng dịu. Không giặt máy, tẩy hoặc sấy."
              : "Spot clean with a damp cloth and mild soap. Do not machine wash, bleach or tumble dry."}
          </p>
        </>
      ) : (
        <>
          <h2>
            {locale === "vi"
              ? "Tôi có thể xem túi trước khi mua?"
              : "Can I see the bag first?"}
          </h2>
          <p>{d.home.trustThree}</p>
          <h2>
            {locale === "vi"
              ? "Tôi có thể kiểm hàng?"
              : "Can I inspect before paying?"}
          </h2>
          <p>{d.home.trustOne}</p>
        </>
      )}
    </section>
  );
}

function Legal({ locale, topic }: { locale: Locale; topic?: string }) {
  const d = dictionary(locale);
  const title =
    topic === "privacy"
      ? d.footer.privacy
      : topic === "terms"
        ? d.footer.terms
        : topic === "payment"
          ? d.checkout.payment
          : null;
  if (!title) notFound();
  return (
    <section className="container page-hero policy-content">
      <Eyebrow>{d.footer.legal}</Eyebrow>
      <h1>{title}</h1>
      {topic === "privacy" ? (
        <>
          <p>
            {locale === "vi"
              ? "Chúng tôi dùng thông tin bạn cung cấp để xử lý đơn hàng, yêu cầu ghé studio và tin nhắn. Thông tin không được hiển thị công khai."
              : "We use the information you provide to process orders, studio visit requests, and messages. It is not displayed publicly."}
          </p>
          <p>
            {locale === "vi"
              ? "Liên hệ Refvlks qua biểu mẫu liên hệ nếu bạn muốn hỏi về dữ liệu của mình."
              : "Contact Refvlks through the contact form if you have a question about your data."}
          </p>
        </>
      ) : topic === "terms" ? (
        <>
          <p>
            {locale === "vi"
              ? "Giá và phí giao hàng được hiển thị trước khi bạn đặt đơn. Refvlks sẽ liên hệ xác nhận đơn hàng."
              : "Prices and shipping charges are shown before you place your order. Refvlks will contact you to confirm it."}
          </p>
          <p>
            {locale === "vi"
              ? "Đơn hàng thanh toán khi nhận hàng cho phép kiểm tra túi trước khi trả tiền."
              : "Cash on delivery lets you inspect the bag before paying."}
          </p>
        </>
      ) : (
        <>
          <p>{d.checkout.codDetail}</p>
          <p>{d.checkout.transferDetail}</p>
          <p>{d.checkout.cardDetail}</p>
        </>
      )}
      {locale === "en" && (
        <p className="message-box">The Vietnamese version applies.</p>
      )}
    </section>
  );
}

function CardPreview({ locale }: { locale: Locale }) {
  const d = dictionary(locale),
    p = paths(locale);
  return (
    <section className="container page-hero policy-content">
      <Eyebrow>{d.checkout.payment}</Eyebrow>
      <h1>{d.checkout.card}</h1>
      <p className="lead">{d.checkout.cardDetail}</p>
      <div className="order-box">
        <div className="form-grid">
          <div className="field wide">
            <label htmlFor="card-number">
              {locale === "vi" ? "Số thẻ" : "Card number"}
            </label>
            <input
              id="card-number"
              type="text"
              disabled
              placeholder="•••• •••• •••• ••••"
            />
          </div>
          <div className="field">
            <label htmlFor="card-expiry">
              {locale === "vi" ? "Ngày hết hạn" : "Expiry"}
            </label>
            <input
              id="card-expiry"
              type="text"
              disabled
              placeholder="MM / YY"
            />
          </div>
          <div className="field">
            <label htmlFor="card-cvc">CVC</label>
            <input id="card-cvc" type="text" disabled placeholder="•••" />
          </div>
        </div>
      </div>
      <ButtonLink href={p.checkout}>{d.common.back}</ButtonLink>
    </section>
  );
}
