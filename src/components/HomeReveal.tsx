import { dictionary, paths, type Locale } from "../lib/catalog";
import { ButtonLink, Eyebrow, Picture } from "./Storefront";
import { Claim } from "./Claim";
import { RevealMotion } from "../motion/RevealMotion";

const images = [
  "REVEAL-01",
  "REVEAL-02",
  "REVEAL-03",
  "REVEAL-04",
  "REVEAL-05",
  "REVEAL-06",
  "REVEAL-07",
  "REVEAL-08",
];

export function HomeReveal({ locale }: { locale: Locale }) {
  const d = dictionary(locale);
  const p = paths(locale);
  const steps = [
    {
      number: "70%",
      text: d.home.reveal.one,
      claim: "CL-01" as const,
      image: "REVEAL-01",
    },
    {
      number: "30%",
      text: d.home.reveal.two,
      claim: "CL-02" as const,
      image: "REVEAL-05",
    },
    {
      number: "03",
      text: d.home.reveal.three,
      claim: null,
      image: "REVEAL-08",
    },
  ];
  return (
    <RevealMotion>
      <section
        className="section dark-section reveal-section"
        id="reveal"
        data-section="H-02"
      >
        <div className="container">
          <a className="text-link reveal-skip" href="#collection">
            {d.home.reveal.skip}
          </a>
          <div className="reveal-cinematic">
            <div className="reveal-narrative">
              <Eyebrow>{d.home.reveal.eyebrow}</Eyebrow>
              <h2>{d.home.reveal.title}</h2>
              <div className="reveal-story-steps">
                {steps.map((step) => {
                  const content = (
                    <div className="reveal-story-step" key={step.number}>
                      <strong>{step.number}</strong>
                      <p>{step.text}</p>
                    </div>
                  );
                  return step.claim ? (
                    <Claim id={step.claim} key={step.number}>
                      {content}
                    </Claim>
                  ) : (
                    content
                  );
                })}
              </div>
              <a className="text-link" href={p.craft}>
                {d.home.reveal.cta} ↗
              </a>
            </div>
            <div className="reveal-frames">
              {images.map((id, index) => (
                <div className="reveal-frame" key={id}>
                  <Picture id={id} locale={locale} />
                  <span>{String(index + 1).padStart(2, "0")} / 08</span>
                </div>
              ))}
            </div>
            <div className="reveal-progress" aria-hidden="true">
              <span />
            </div>
          </div>
          <div className="reveal-cards">
            <Eyebrow>{d.home.reveal.eyebrow}</Eyebrow>
            <h2>{d.home.reveal.title}</h2>
            {steps.map((step) => {
              const content = (
                <article className="reveal-card" key={step.number}>
                  <Picture id={step.image} locale={locale} />
                  <div>
                    <strong>{step.number}</strong>
                    <p>{step.text}</p>
                  </div>
                </article>
              );
              return step.claim ? (
                <Claim id={step.claim} key={step.number}>
                  {content}
                </Claim>
              ) : (
                content
              );
            })}
            <ButtonLink href={p.craft}>{d.home.reveal.cta}</ButtonLink>
          </div>
        </div>
      </section>
    </RevealMotion>
  );
}
