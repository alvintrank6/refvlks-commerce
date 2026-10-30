import {
  dictionary,
  money,
  paths,
  products,
  type Locale,
} from "../lib/catalog";
import { Claim } from "./Claim";
import { Eyebrow, Picture } from "./Storefront";

const tiers = [
  { key: "essential", image: "LIFE-08" },
  { key: "signature", image: "LIFE-02" },
  { key: "heritage", image: "LIFE-01" },
] as const;

export function ShopTiers({ locale }: { locale: Locale }) {
  const d = dictionary(locale);
  const p = paths(locale);
  return (
    <section className="section shop-tiers-section" data-section="S-03">
      <div className="container">
        <Eyebrow>REFVLKS / 03</Eyebrow>
        <h2>{d.shop.tiers.title}</h2>
        <div className="shop-tiers-grid">
          {tiers.map((tier) => {
            const prices = products
              .filter((product) => product.tier === tier.key)
              .flatMap((product) =>
                product.variants.map((variant) => variant.priceVnd),
              );
            const min = Math.min(...prices);
            return (
              <article className="shop-tier" key={tier.key}>
                <Picture
                  id={tier.image}
                  locale={locale}
                  sizes="(max-width: 700px) 100vw, 33vw"
                />
                <div className="shop-tier-copy">
                  <span className="eyebrow">{tier.key.toUpperCase()}</span>
                  <h3>{tier.key[0].toUpperCase() + tier.key.slice(1)}</h3>
                  <p>{d.shop.tiers[tier.key]}</p>
                  <strong>
                    {tier.key === "heritage"
                      ? money(min)
                      : `${d.shop.tiers.from} ${money(min)}`}
                  </strong>
                  <a className="text-link" href={`${p.shop}?tier=${tier.key}`}>
                    {d.shop.tiers.link.replace(
                      "{tier}",
                      tier.key[0].toUpperCase() + tier.key.slice(1),
                    )}{" "}
                    ↗
                  </a>
                </div>
              </article>
            );
          })}
        </div>
        <div className="shop-trust-strip">
          <Claim id="CL-10">
            <span>{d.shop.tiers.inspect}</span>
          </Claim>
          <Claim id="CL-11">
            <span>{d.shop.tiers.repairs}</span>
          </Claim>
          <Claim id="CL-13">
            <span>{d.shop.tiers.studio}</span>
          </Claim>
        </div>
      </div>
    </section>
  );
}
