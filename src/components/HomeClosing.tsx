import { dictionary, helpPath, paths, type Locale } from "../lib/catalog";
import { ButtonLink, Eyebrow, Picture } from "./Storefront";
import { Claim } from "./Claim";
import { CarriedMotion, InvitationMotion } from "../motion/HomeClosingMotion";

const gallery = [
  {
    image: "LIFE-01",
    handle: "weft-structured-tote",
    colour: "brown",
    title: "WEFT STRUCTURED TOTE",
  },
  {
    image: "SP02F-02",
    handle: "loom-flap-tote",
    colour: "forest",
    title: "LOOM FLAP TOTE · FOREST",
  },
  {
    image: "LIFE-05",
    handle: "loom-carryall",
    colour: "black-cinnabar",
    title: "LOOM CARRYALL",
  },
  {
    image: "LIFE-04",
    handle: "loom-flap-tote",
    colour: "wine",
    title: "LOOM FLAP TOTE · WINE",
  },
  {
    image: "LIFE-08",
    handle: "tram-shopper",
    colour: "cream-brown",
    title: "TRÁM SHOPPER",
  },
  {
    image: "SP03-03",
    handle: "loom-carryall",
    colour: "black-cinnabar",
    title: "LOOM CARRYALL",
  },
  {
    image: "LIFE-02",
    handle: "loom-flap-tote",
    colour: "forest",
    title: "LOOM FLAP TOTE · FOREST",
  },
  {
    image: "LIFE-07",
    handle: "loom-carryall",
    colour: "black-cinnabar",
    title: "LOOM CARRYALL",
  },
];

export function HomeCarried({ locale }: { locale: Locale }) {
  const d = dictionary(locale);
  const p = paths(locale);
  return (
    <CarriedMotion>
      <section className="carried-section" data-section="H-04" id="carried">
        <div
          className="carried-viewport"
          tabIndex={0}
          data-cursor="Drag"
          aria-label={d.home.carried.title}
        >
          <div className="carried-track">
            <div className="carried-panel carried-intro">
              <Eyebrow>REFVLKS / 04</Eyebrow>
              <h2>{d.home.carried.title}</h2>
              <p className="lead">{d.home.carried.body}</p>
              <span className="carried-line" aria-hidden="true" />
            </div>
            {gallery.map((item, index) => (
              <figure
                className="carried-panel carried-photo"
                key={`${item.image}-${index}`}
              >
                <Picture
                  id={item.image}
                  locale={locale}
                  sizes="(max-width: 800px) 80vw, 65vw"
                />
                <figcaption>
                  <span>{String(index + 1).padStart(2, "0")} / 08</span>
                  <a href={`${p.product}/${item.handle}?colour=${item.colour}`}>
                    {item.title} ↗
                  </a>
                </figcaption>
              </figure>
            ))}
            <div className="carried-panel carried-outro">
              <Eyebrow>REFVLKS / 04</Eyebrow>
              <Claim id="CL-10">
                <div>
                  <h3>{d.home.carried.inspectTitle}</h3>
                  <p>{d.home.carried.inspectBody}</p>
                </div>
              </Claim>
              <Claim id="CL-11">
                <div>
                  <h3>{d.home.carried.repairTitle}</h3>
                  <p>{d.home.carried.repairBody}</p>
                </div>
              </Claim>
              <Claim id="CL-13">
                <div>
                  <h3>{d.home.carried.studioTitle}</h3>
                  <p>{d.home.carried.studioBody}</p>
                </div>
              </Claim>
              <ButtonLink href={helpPath(locale, "shipping-returns")}>
                {d.home.carried.cta}
              </ButtonLink>
            </div>
          </div>
        </div>
        <div className="carried-progress" aria-hidden="true">
          <span />
        </div>
      </section>
    </CarriedMotion>
  );
}

export function HomeInvitations({ locale }: { locale: Locale }) {
  const d = dictionary(locale);
  const p = paths(locale);
  return (
    <InvitationMotion>
      <section
        className="invitation-section"
        data-section="H-05"
        id="invitations"
      >
        <div className="invitation-grid">
          <div className="invitation-panel invitation-donation">
            <Eyebrow>{d.home.invite.donationEyebrow}</Eyebrow>
            <h3>{d.home.invite.donationTitle}</h3>
            <Claim id="CL-17">
              <Claim id="CL-21">
                <p>{d.home.invite.donationBody}</p>
              </Claim>
            </Claim>
            <ButtonLink href={p.donation}>
              {d.home.invite.donationCta}
            </ButtonLink>
            <Picture id="SP03-01" locale={locale} decorative />
          </div>
          <div className="invitation-panel invitation-studio">
            <Picture id="LIFE-03" locale={locale} decorative />
            <div className="invitation-studio-content">
              <Eyebrow>{d.home.invite.studioEyebrow}</Eyebrow>
              <h3>{d.home.invite.studioTitle}</h3>
              <Claim id="CL-13">
                <p>{d.home.invite.studioBody}</p>
              </Claim>
              <ButtonLink href={`${p.studio}#book`}>
                {d.home.invite.studioCta}
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </InvitationMotion>
  );
}
