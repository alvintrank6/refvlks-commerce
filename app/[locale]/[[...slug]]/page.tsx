import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { env } from "cloudflare:workers";
import {
  allVariants,
  dictionary,
  isLocale,
  helpPath,
  legalPath,
  parseHelpTopic,
  parseLegalTopic,
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
import { HomeMotion } from "../../../src/motion/HomeMotion";
import { HomeReveal } from "../../../src/components/HomeReveal";
import {
  HomeCarried,
  HomeInvitations,
} from "../../../src/components/HomeClosing";
import { ShopGrid } from "../../../src/components/ShopGrid";
import { ShopTiers } from "../../../src/components/ShopTiers";
import { MaterialHotspots } from "../../../src/components/MaterialHotspots";
import { AddToBagForm } from "../../../src/components/AddToBagForm";
import { Claim } from "../../../src/components/Claim";
import { CopyButton } from "../../../src/components/CopyButton";
import { VisitDateTime } from "../../../src/components/VisitDateTime";
import { CheckoutSubmit } from "../../../src/components/CheckoutSubmit";
import { CraftV2, AboutV2 } from "../../../src/components/CraftAboutV2";
import { DonationV2 } from "../../../src/components/DonationV2";
import { HelpV2, LegalV2 } from "../../../src/components/HelpLegalV2";

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
  if (kind === "help") {
    const topic = parseHelpTopic(locale, slug[1] ?? "");
    return topic ? helpPath(other, topic) : paths(other).home;
  }
  if (kind === "legal") {
    const topic = parseLegalTopic(locale, slug[1] ?? "");
    return topic ? legalPath(other, topic) : paths(other).home;
  }
  const path =
    (paths(other) as unknown as Record<string, string>)[kind] ??
    paths(other).home;
  const tail =
    kind === "product" || kind === "order" ? `/${slug.slice(1).join("/")}` : "";
  const colour = param(query, "colour");
  return `${path}${tail}${colour ? `?colour=${encodeURIComponent(colour)}` : ""}`;
}

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { locale: raw, slug = [] } = await params;
  if (!isLocale(raw)) return {};
  const query = await searchParams;
  const d = dictionary(raw),
    kind = kindOf(raw, slug);
  let title =
    raw === "vi"
      ? "Túi đi làm, ngoài tĩnh, trong có câu chuyện dệt"
      : "Work Bags, Quiet Outside, Woven Inside";
  let description = d.home.hero.body;
  if (kind === "shop") {
    const tier = param(query, "tier");
    title = ["essential", "signature", "heritage"].includes(tier)
      ? tier[0].toUpperCase() + tier.slice(1)
      : d.shop.title;
  }
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
      kind === "cart" ||
      kind === "checkout" ||
      kind === "order" ||
      (kind === "shop" &&
        Boolean(
          param(query, "tier") ||
          param(query, "colour") ||
          param(query, "price") ||
          param(query, "sort"),
        ))
        ? { index: false, follow: false }
        : undefined,
    alternates: kind === "shop" ? { canonical: paths(raw).shop } : undefined,
  };
}

export default async function Page({ params, searchParams }: Props) {
  const { locale: raw, slug = [] } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw;
  const q = await searchParams;
  const kind = kindOf(locale, slug);
  if (kind === "unknown") notFound();
  const helpTopic =
    kind === "help" ? parseHelpTopic(locale, slug[1] ?? "") : undefined;
  const legalTopic =
    kind === "legal" ? parseLegalTopic(locale, slug[1] ?? "") : undefined;
  if (kind === "help" && !helpTopic) notFound();
  if (kind === "legal" && !legalTopic) notFound();
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
          <CraftV2 locale={locale} />
        ) : kind === "donation" ? (
          <DonationV2 locale={locale} status={param(q, "status")} />
        ) : kind === "about" ? (
          <AboutV2 locale={locale} />
        ) : kind === "studio" ? (
          <Studio locale={locale} q={q} />
        ) : kind === "cart" ? (
          <Cart locale={locale} cart={cart} q={q} />
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
          <HelpV2 locale={locale} topic={helpTopic} />
        ) : kind === "legal" ? (
          <LegalV2 locale={locale} topic={legalTopic} />
        ) : null}
      </main>
      <Footer locale={locale} />
    </>
  );
}

function Home({ locale }: { locale: Locale }) {
  const d = dictionary(locale),
    p = paths(locale);
  return (
    <HomeMotion>
      <section className="hero" data-section="H-01">
        <div className="hero-content">
          <Eyebrow>{d.home.hero.eyebrow}</Eyebrow>
          <h1>{d.home.hero.title}</h1>
          <p className="lead">{d.home.hero.body}</p>
          <div className="hero-actions">
            <ButtonLink href={p.shop}>{d.common.shopCollection}</ButtonLink>
            <ButtonLink secondary href={p.studio}>
              {d.common.visitStudio}
            </ButtonLink>
          </div>
          <p className="hero-note">{d.home.hero.trust}</p>
        </div>
        <div className="hero-media">
          <Picture id="HOME-01" mobileId="HOME-02" locale={locale} priority />
          <span className="hero-weft" aria-hidden="true" />
          <span className="hero-index">01 / REFVLKS</span>
        </div>
      </section>
      <HomeReveal locale={locale} />
      <section
        className="section container home-collection"
        data-section="H-03"
        id="collection"
        tabIndex={-1}
      >
        <div className="section-heading">
          <div>
            <Eyebrow>{d.home.collection.eyebrow}</Eyebrow>
            <h2>{d.home.collection.title}</h2>
            <p className="lead">{d.home.collection.body}</p>
          </div>
          <a className="text-link" href={p.shop}>
            {d.home.collection.cta} ↗
          </a>
        </div>
        <nav className="collection-chips" aria-label={d.shop.tier}>
          <a href={p.shop}>{d.home.collection.all}</a>
          <a href={`${p.shop}?tier=essential`}>{d.home.collection.essential}</a>
          <a href={`${p.shop}?tier=signature`}>{d.home.collection.signature}</a>
          <a href={`${p.shop}?tier=heritage`}>{d.home.collection.heritage}</a>
        </nav>
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
      <HomeCarried locale={locale} />
      <HomeInvitations locale={locale} />
    </HomeMotion>
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
  const initial = {
    tier: param(q, "tier"),
    colour: param(q, "colour"),
    price: param(q, "price"),
    sort: param(q, "sort") || "featured",
  };
  const items = allVariants.map(({ product, variant }) => ({
    sku: variant.sku,
    tier: product.tier,
    colour: variant.colourKey,
    colourName: variant.colour[locale],
    price: variant.priceVnd,
    card: <ProductCard product={product} variant={variant} locale={locale} />,
  }));
  return (
    <>
      <ShopGrid
        shopPath={p.shop}
        initial={initial}
        items={items}
        copy={d.shop}
        colourLabel={d.common.colour}
        priceLabel={d.common.price}
      />
      <ShopTiers locale={locale} />
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
      <section data-section="P-01" className="product-buy-section">
        <div className="container product-detail">
          <div className="gallery">
            {gallery.map((id, index) => (
              <figure key={id} className="gallery-frame">
                <Picture
                  id={id}
                  locale={locale}
                  viewTransitionName={
                    index === 0
                      ? `product-${product.handle}-${variant.colourKey}`
                      : undefined
                  }
                />
                <figcaption className="gallery-index">
                  {String(index + 1).padStart(2, "0")} /{" "}
                  {String(gallery.length).padStart(2, "0")}
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="buy-box">
            <Eyebrow>
              {product.tier.toUpperCase()} · {product.code}
            </Eyebrow>
            <h1>{product.name[locale]}</h1>
            <p className="buy-price">{money(variant.priceVnd)}</p>
            <p className="lead">{product.short[locale]}</p>
            {available && <p className="stock-status">{d.product.inStock}</p>}
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
            <AddToBagForm
              sku={variant.sku}
              locale={locale}
              available={available}
              label={available ? d.common.addToBag : d.common.soldOut}
            />
            {!available && (
              <a className="text-link" href={p.contact}>
                {d.product.stockQuestion} ↗
              </a>
            )}
            <p className="buy-note">{d.product.inspect}</p>
            <a
              className="text-link"
              href={`${p.studio}?bag=${product.handle}#book`}
            >
              {d.product.studio} ↗
            </a>
          </div>
        </div>
      </section>
      <section data-section="P-02" className="section product-inside">
        <div className="container">
          <Eyebrow>{d.product.materials}</Eyebrow>
          <h2>{d.product.inside}</h2>
          <p className="lead">{product.long[locale]}</p>
          <div className="inside-layout">
            <MaterialHotspots
              hotspots={product.hotspots ?? []}
              parts={product.materials.parts}
              labels={d.product.partLabels}
              locale={locale}
            >
              <Picture id={gallery[0]} locale={locale} />
            </MaterialHotspots>
            <div>
              <dl className="material-list">
                {product.materials.parts.map((part) => (
                  <div key={part.part}>
                    <dt>
                      {d.product.partLabels[
                        part.part as keyof typeof d.product.partLabels
                      ] ?? part.part}
                    </dt>
                    <dd>{part[locale]}</dd>
                  </div>
                ))}
              </dl>
              <Claim id="CL-01">
                <p className="material-share">
                  <strong>{d.product.shareNew}</strong>
                  <Claim id="CL-02">
                    <span>{d.product.shareRecovered}</span>
                  </Claim>
                </p>
              </Claim>
              {Object.values(product.specs ?? {}).some(
                (value) => value !== null,
              ) && (
                <dl className="product-specs">
                  {Object.entries(product.specs ?? {})
                    .filter(([, value]) => value !== null)
                    .map(([key, value]) => (
                      <div key={key}>
                        <dt>
                          {d.product.specLabels[
                            key as keyof typeof d.product.specLabels
                          ] ?? key}
                        </dt>
                        <dd>
                          {String(value)}
                          {key === "sizeCm" || key === "handleDropCm"
                            ? " cm"
                            : key === "weightG"
                              ? " g"
                              : key === "laptopIn"
                                ? " in"
                                : key === "loadKg"
                                  ? " kg"
                                  : ""}
                        </dd>
                      </div>
                    ))}
                </dl>
              )}
            </div>
          </div>
          {inside && (
            <div className="inside-open">
              <div>
                <h3>{d.product.open}</h3>
                <p>{product.short[locale]}</p>
              </div>
              <Picture id={inside.asset} locale={locale} />
            </div>
          )}
        </div>
      </section>
      <section data-section="P-03" className="section container product-before">
        <Eyebrow>{d.product.about}</Eyebrow>
        <h2>{d.product.before}</h2>
        <div className="product-accordions">
          {[
            [d.product.deliveryTitle, d.product.deliveryBody],
            [d.product.paymentTitle, d.product.paymentBody],
            [d.product.returnsTitle, d.product.returnsBody],
            [d.product.careTitle, d.product.careBody],
            [d.product.questionsTitle, d.product.questionsBody],
          ].map(([title, body]) => (
            <details key={title}>
              <summary>{title}</summary>
              <p>{body}</p>
            </details>
          ))}
        </div>
        <div className="section-heading">
          <div>
            <Eyebrow>{d.shop.eyebrow}</Eyebrow>
            <h3>{d.product.moreTitle}</h3>
          </div>
          <a className="text-link" href={p.shop}>
            {d.common.allBags} ↗
          </a>
        </div>
        <div className="product-grid product-rail">
          {allVariants
            .filter((row) => row.variant.sku !== variant.sku)
            .slice(0, 4)
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
        <span>{money(variant.priceVnd)}</span>
        <AddToBagForm
          sku={variant.sku}
          locale={locale}
          available={available}
          label={available ? d.common.addToBag : d.common.soldOut}
          mobile
        />
      </div>
    </div>
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
  const last = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(now.getTime() + 30 * 86400000));
  return (
    <>
      <section className="container page-hero studio-hero" data-section="ST-01">
        <div>
          <Eyebrow>{d.studio.eyebrow}</Eyebrow>
          <h1>{d.studio.title}</h1>
          <p className="lead">{d.studio.intro}</p>
          <ul className="studio-points">
            <li>{d.studio.bring}</li>
            <li>{d.studio.slow}</li>
            <li>{d.studio.pay}</li>
          </ul>
          <ButtonLink href="#book">{d.studio.book}</ButtonLink>
        </div>
        <Picture id="LIFE-04" locale={locale} />
      </section>
      <section
        className="section materials-section"
        id="book"
        data-section="ST-02"
      >
        <div className="container booking-layout">
          <div>
            <Eyebrow>{d.studio.eyebrow}</Eyebrow>
            <h2>{d.studio.book}</h2>
            <p className="lead">{d.studio.appointment}</p>
            <p>{d.studio.intro}</p>
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
            {status === "taken" && (
              <p className="message-box error" role="alert">
                {d.studio.taken}
              </p>
            )}
            {status === "rate-limit" && (
              <p className="message-box error" role="alert">
                {d.studio.rateLimit}
              </p>
            )}
            <form className="validated-form" method="post" action="/api/visits">
              <input type="hidden" name="locale" value={locale} />
              <input
                type="text"
                name="website"
                className="honeypot"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />
              <div className="field">
                <label htmlFor="visit-name">{d.common.name}</label>
                <input
                  id="visit-name"
                  name="name"
                  required
                  minLength={2}
                  autoComplete="name"
                  aria-describedby="visit-name-error"
                />
                <p className="field-error" id="visit-name-error">
                  {d.studio.nameError}
                </p>
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
                  aria-describedby="visit-phone-error"
                />
                <p className="field-error" id="visit-phone-error">
                  {d.studio.phoneError}
                </p>
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
              <VisitDateTime
                today={today}
                last={last}
                dateLabel={d.studio.date}
                timeLabel={d.studio.time}
                choose={d.common.choose}
                dateError={d.studio.dateError}
                timeError={d.studio.timeError}
              />
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
              <p className="field-error" id="visit-consent-error">
                {d.studio.consentError}
              </p>
              <CheckoutSubmit>{d.studio.book} ↗</CheckoutSubmit>
            </form>
          </div>
        </div>
      </section>
      <section
        className="section container studio-location"
        data-section="ST-03"
      >
        <div>
          <Eyebrow>{d.studio.eyebrow}</Eyebrow>
          <h2>{d.studio.find}</h2>
          <p className="lead">{d.studio.intro}</p>
          <a
            className="button button-secondary"
            href="https://maps.google.com/?q=22+Le+Quy+Don+Ha+Noi"
            target="_blank"
            rel="noopener noreferrer"
          >
            {d.studio.maps} ↗
          </a>
        </div>
        <svg
          className="studio-map"
          viewBox="0 0 640 420"
          role="img"
          aria-label={d.footer.studio}
        >
          <rect width="640" height="420" fill="#E8DFD0" />
          <path
            d="M30 50H610M-20 115H580M80 190H640M-20 270H610M30 365H640"
            stroke="#4A2E1F"
            strokeWidth="2"
          />
          <path
            d="M120 0V420M260 0V420M390 0V420M530 0V420"
            stroke="#4A2E1F"
            strokeWidth="2"
          />
          <path d="M5 190H640M390 0V420" stroke="#B3341F" strokeWidth="4" />
          <circle
            cx="390"
            cy="190"
            r="17"
            fill="#B3341F"
            stroke="#F4EFE6"
            strokeWidth="6"
          />
          <text x="414" y="177" fill="#4A2E1F" fontSize="19">
            REFVLKS STUDIO
          </text>
        </svg>
      </section>
    </>
  );
}

function Cart({
  locale,
  cart,
  q,
}: {
  locale: Locale;
  cart: Awaited<ReturnType<typeof getCart>>;
  q: Record<string, string | string[] | undefined>;
}) {
  const d = dictionary(locale),
    p = paths(locale),
    rows = cartDetails(cart),
    subtotal = rows.reduce((n, row) => n + row.total, 0);
  return (
    <section className="container section">
      <Eyebrow>{d.nav.bag}</Eyebrow>
      <h1>{d.cart.title}</h1>
      {param(q, "added") === "1" && (
        <p className="cart-added" role="status" aria-live="polite">
          {d.product.added}
        </p>
      )}
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
                  <div
                    className="cart-quantity"
                    role="group"
                    aria-label={d.common.quantity}
                  >
                    <form method="post" action="/api/cart">
                      <input type="hidden" name="action" value="decrement" />
                      <input type="hidden" name="sku" value={row.variant.sku} />
                      <input type="hidden" name="locale" value={locale} />
                      <button type="submit" aria-label={d.cart.decrease}>
                        −
                      </button>
                    </form>
                    <span>{row.qty}</span>
                    <form method="post" action="/api/cart">
                      <input type="hidden" name="action" value="increment" />
                      <input type="hidden" name="sku" value={row.variant.sku} />
                      <input type="hidden" name="locale" value={locale} />
                      <button type="submit" aria-label={d.cart.increase}>
                        +
                      </button>
                    </form>
                  </div>
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
              <dd className="copy-field">
                19070671343017{" "}
                <CopyButton
                  value="19070671343017"
                  copy={d.order.copy}
                  copied={d.order.copied}
                />
              </dd>
            </div>
            <div>
              <dt>{d.order.amount}</dt>
              <dd className="copy-field">
                {money(Number(order.total))}{" "}
                <CopyButton
                  value={String(order.total)}
                  copy={d.order.copy}
                  copied={d.order.copied}
                />
              </dd>
            </div>
            <div>
              <dt>{d.order.reference}</dt>
              <dd className="copy-field">
                {order.number}{" "}
                <CopyButton
                  value={String(order.number)}
                  copy={d.order.copy}
                  copied={d.order.copied}
                />
              </dd>
            </div>
          </dl>
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
    status = param(q, "status"),
    topic = param(q, "topic");
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
          {status === "rate-limit" && (
            <p className="message-box error" role="alert">
              {d.contact.rateLimit}
            </p>
          )}
          <form className="validated-form" method="post" action="/api/messages">
            <input type="hidden" name="locale" value={locale} />
            <input
              type="text"
              name="website"
              className="honeypot"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />
            <div className="field">
              <label htmlFor="message-name">{d.common.name}</label>
              <input
                id="message-name"
                name="name"
                required
                minLength={2}
                aria-describedby="message-name-error"
              />
              <p className="field-error" id="message-name-error">
                {d.contact.nameError}
              </p>
            </div>
            <div className="field">
              <label htmlFor="message-contact">
                {d.common.phone} / {d.common.email}
              </label>
              <input
                id="message-contact"
                name="contact"
                required
                minLength={5}
                aria-describedby="message-contact-error"
              />
              <p className="field-error" id="message-contact-error">
                {d.contact.contactError}
              </p>
            </div>
            <div className="field">
              <label htmlFor="message-topic">{d.contact.topic}</label>
              <select
                id="message-topic"
                name="topic"
                defaultValue={
                  [
                    "order",
                    "visit",
                    "repair",
                    "corporate",
                    "press",
                    "other",
                  ].includes(topic)
                    ? topic
                    : "order"
                }
              >
                <option value="order">{d.contact.order}</option>
                <option value="visit">{d.contact.visit}</option>
                <option value="repair">{d.contact.repair}</option>
                <option value="corporate">{d.contact.corporate}</option>
                <option value="press">{d.contact.press}</option>
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
                minLength={5}
                maxLength={2000}
                aria-describedby="message-body-error"
              />
              <p className="field-error" id="message-body-error">
                {d.contact.bodyError}
              </p>
            </div>
            <label className="consent">
              <input type="checkbox" name="consent" required />
              <span>{d.checkout.terms}</span>
            </label>
            <p className="field-error" id="message-consent-error">
              {d.contact.consentError}
            </p>
            <CheckoutSubmit>{d.common.send} ↗</CheckoutSubmit>
          </form>
        </div>
      </div>
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
