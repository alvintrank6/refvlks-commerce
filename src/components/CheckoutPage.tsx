import { cartDetails, type CartLine } from "../lib/cart";
import {
  dictionary,
  legalPath,
  money,
  paths,
  type Locale,
} from "../lib/catalog";
import { policy } from "../content/policy";
import { Eyebrow } from "./Storefront";
import { CheckoutSubmit } from "./CheckoutSubmit";

export default function CheckoutPage({
  locale,
  cart,
  query,
}: {
  locale: Locale;
  cart: CartLine[];
  query: Record<string, string | string[] | undefined>;
}) {
  const d = dictionary(locale),
    p = paths(locale),
    rows = cartDetails(cart);
  if (!rows.length)
    return (
      <section className="container section">
        <h1>{d.cart.empty}</h1>
        <a className="button button-primary" href={p.shop}>
          {d.common.shopCollection}
        </a>
      </section>
    );
  const choice = (key: string) =>
    typeof query[key] === "string" ? (query[key] as string) : "";
  const delivery = choice("delivery") === "pickup" ? "pickup" : "ship";
  const city = choice("city") === "other" ? "other" : "hanoi";
  const subtotal = rows.reduce((n, row) => n + row.total, 0);
  const shipping =
    delivery === "pickup"
      ? 0
      : city === "hanoi"
        ? policy.shippingFeeHanoi
        : policy.shippingFeeOther;
  const total = subtotal + shipping;
  const error = choice("error");
  const errors = d.checkout.errors as Record<string, string>;
  const fieldError = (key: string) => (
    <p
      className={`field-error${error === key ? " is-visible" : ""}`}
      id={`error-${key}`}
    >
      {errors[key]}
    </p>
  );
  return (
    <section className="container section">
      <Eyebrow>{d.checkout.title}</Eyebrow>
      <h1>{d.checkout.title}</h1>
      {error && (
        <p className="message-box error" role="alert">
          {error === "stock"
            ? d.checkout.stockError
            : errors[error] || d.checkout.error}
        </p>
      )}
      <div className="checkout-layout">
        <div>
          <form
            className="form-section delivery-choice"
            action={p.checkout}
            method="get"
          >
            <h2>{d.checkout.delivery}</h2>
            <div className="radio-grid">
              <label className="radio-card">
                <input
                  name="delivery"
                  type="radio"
                  value="ship"
                  defaultChecked={delivery === "ship"}
                />
                <span>
                  <strong>{d.checkout.ship}</strong>
                  {d.common.shipping}
                </span>
              </label>
              <label className="radio-card">
                <input
                  name="delivery"
                  type="radio"
                  value="pickup"
                  defaultChecked={delivery === "pickup"}
                />
                <span>
                  <strong>{d.checkout.pickup}</strong>
                  {d.footer.studio}
                </span>
              </label>
            </div>
            <div className="field" style={{ marginTop: 20, maxWidth: 280 }}>
              <label htmlFor="delivery-city">{d.checkout.city}</label>
              <select id="delivery-city" name="city" defaultValue={city}>
                <option value="hanoi">{d.checkout.hanoi}</option>
                <option value="other">{d.checkout.other}</option>
              </select>
            </div>
            <p className="message-box">{d.checkout.shippingRates}</p>
            <button className="button button-secondary" type="submit">
              {locale === "vi" ? "Xem tổng tiền" : "Review total"} →
            </button>
          </form>
          <form className="checkout-form" method="post" action="/api/orders">
            <input type="hidden" name="locale" value={locale} />
            <input type="hidden" name="delivery" value={delivery} />
            <input type="hidden" name="city" value={city} />
            <input
              type="text"
              name="website"
              className="honeypot"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />
            <div className="form-section">
              <h2>{d.checkout.contact}</h2>
              <div className="form-grid">
                <div className="field">
                  <label htmlFor="buyer-name">{d.common.name}</label>
                  <input
                    id="buyer-name"
                    name="name"
                    required
                    minLength={2}
                    autoComplete="name"
                    aria-describedby="error-name"
                    aria-invalid={error === "name"}
                  />
                  {fieldError("name")}
                </div>
                <div className="field">
                  <label htmlFor="buyer-phone">{d.common.phone}</label>
                  <input
                    id="buyer-phone"
                    name="phone"
                    type="tel"
                    required
                    pattern="0[0-9]{9}"
                    autoComplete="tel"
                    aria-describedby="error-phone"
                    aria-invalid={error === "phone"}
                  />
                  {fieldError("phone")}
                </div>
                <div className="field wide">
                  <label htmlFor="buyer-email">{d.common.email}</label>
                  <input
                    id="buyer-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    aria-describedby="error-email"
                    aria-invalid={error === "email"}
                  />
                  {fieldError("email")}
                </div>
              </div>
            </div>
            {delivery === "ship" && (
              <div className="form-section">
                <h2>{d.checkout.ship}</h2>
                <div className="field">
                  <label htmlFor="buyer-address">{d.checkout.address}</label>
                  <input
                    id="buyer-address"
                    name="address"
                    required
                    minLength={5}
                    autoComplete="street-address"
                    aria-describedby="error-address"
                    aria-invalid={error === "address"}
                  />
                  {fieldError("address")}
                </div>
              </div>
            )}
            <div className="form-section">
              <h2>{d.checkout.payment}</h2>
              <div
                className="radio-grid"
                role="group"
                aria-label={d.checkout.payment}
                aria-describedby="error-payment"
              >
                <label className="radio-card">
                  <input
                    name="payment"
                    type="radio"
                    value="cod"
                    defaultChecked
                  />
                  <span>
                    <strong>{d.checkout.cod}</strong>
                    {d.checkout.codDetail}
                  </span>
                </label>
                <label className="radio-card">
                  <input
                    name="payment"
                    type="radio"
                    value="transfer"
                    defaultChecked={false}
                  />
                  <span>
                    <strong>{d.checkout.transfer}</strong>
                    {d.checkout.transferDetail}
                  </span>
                </label>
                <a
                  className="radio-card disabled-card"
                  href={`${p.checkout}/card`}
                >
                  <span>
                    <strong>{d.checkout.card}</strong>
                    {d.checkout.cardDetail}
                  </span>
                </a>
              </div>
              {fieldError("payment")}
            </div>
            <label className="consent">
              <input type="checkbox" name="consent" required />
              <span>
                {d.checkout.terms}{" "}
                <a href={legalPath(locale, "terms")}>{d.footer.terms}</a> ·{" "}
                <a href={legalPath(locale, "privacy")}>{d.footer.privacy}</a>
              </span>
            </label>
            {fieldError("consent")}
            <CheckoutSubmit>
              {d.checkout.place} — {money(total)} ↗
            </CheckoutSubmit>
          </form>
        </div>
        <aside className="summary-card">
          <h2>{d.checkout.summary}</h2>
          {rows.map((row) => (
            <div className="summary-line" key={row.variant.sku}>
              <span>
                {row.product.name[locale]} · {row.variant.colour[locale]} ×{" "}
                {row.qty}
              </span>
              <span>{money(row.total)}</span>
            </div>
          ))}
          <div className="summary-line">
            <span>{d.common.subtotal}</span>
            <span>{money(subtotal)}</span>
          </div>
          <div className="summary-line">
            <span>{d.common.shipping}</span>
            <span>{money(shipping)}</span>
          </div>
          <div className="summary-line summary-total">
            <span>{d.common.total}</span>
            <span>{money(total)}</span>
          </div>
        </aside>
      </div>
    </section>
  );
}
