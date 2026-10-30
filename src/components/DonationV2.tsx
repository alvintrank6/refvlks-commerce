import { env } from "cloudflare:workers";
import { cookies } from "next/headers";
import { PackageOpen, Shirt, Truck, Recycle } from "lucide-react";
import { dictionary, legalPath, paths, type Locale } from "../lib/catalog";
import { donationRepository } from "../lib/data";
import { isApproved } from "../content/claims";
import { ButtonLink, Eyebrow, Picture } from "./Storefront";
import { DonationSubmit } from "./DonationSubmit";
import { StoryMotion } from "../motion/StoryMotion";

const copy = {
  en: {
    join: "Join the next drive",
    how: "How it works",
    marquee:
      "MONTHLY TRIPS · EVERY PIECE CHECKED · WORN-OUT PIECES RECYCLED · NOTHING GOES TO WASTE ·",
    process: "From your wardrobe to the mountains, in four steps.",
    steps: [
      [
        "Bring",
        "Register and we'll message you this month's collection point.",
      ],
      [
        "Sort",
        "Our team checks every piece. Clean, intact clothes are folded and packed by size and type: adults, children, warm layers.",
      ],
      [
        "Deliver",
        "Once a month the team travels north and hands the clothes over in person, to communities in the Northwest and other mountain regions of Vietnam.",
      ],
      [
        "Recycle the rest",
        "Torn, faded or worn-through pieces never go up the mountain. We clean and cut them into the recovered textile used in our handles, flaps and scarves.",
      ],
    ],
    where: "See where it ends up",
    bring: "Please bring",
    dont: "Please don't bring",
    next: "Join the next drive.",
    unknown:
      "The date for next month's drive is announced here and sent to everyone who registers.",
    nextLabel: "NEXT DRIVE",
    collection: "Collection",
    destination: "Destination",
    form: {
      name: "Name",
      phone: "Phone or Zalo",
      email: "Email (optional)",
      role: "I'd like to",
      donate: "Donate clothes",
      volunteer: "Volunteer on a trip",
      both: "Both",
      amount: "Roughly how much?",
      one: "One bag",
      two: "Two to three bags",
      more: "More than three bags",
      note: "Note (optional)",
      privacy: "I agree to the Privacy Policy",
      recycle:
        "I understand that clothes unfit to wear may be recycled into textile for Refvlks products.",
      submit: "Count me in",
    },
    thanks:
      "Thanks, {name}. We'll message you the date and collection details for the next drive.",
    error: "Please check your details and try again.",
    rate: "Too many signups from this connection. Please try again in an hour.",
    faq: [
      [
        "Can I donate torn or faded clothes?",
        "Yes. They won't go up the mountain, but they will become recovered textile in our bags.",
      ],
      [
        "Do you sell the clothes we donate?",
        "No. Wearable clothes are given away for free. Only pieces too worn to wear are recycled into fabric, and that fabric is used in Refvlks bags.",
      ],
    ],
  },
  vi: {
    join: "Đăng ký tham gia",
    how: "Cách hoạt động",
    marquee:
      "MỖI THÁNG MỘT CHUYẾN · KIỂM TỪNG CHIẾC · ÁO QUÁ CŨ ĐƯỢC TÁI CHẾ · KHÔNG CHIẾC NÀO BỊ BỎ PHÍ ·",
    process: "Từ tủ đồ của bạn lên vùng cao, qua bốn bước.",
    steps: [
      ["Mang đến", "Đăng ký để chúng tôi nhắn điểm nhận đồ của tháng."],
      [
        "Phân loại",
        "Đội ngũ kiểm tra từng chiếc. Quần áo sạch, còn nguyên vẹn được gấp và đóng gói theo cỡ và loại: người lớn, trẻ em, đồ ấm.",
      ],
      [
        "Trao tặng",
        "Mỗi tháng một lần, đội ngũ lên đường và trao tận tay quần áo cho bà con Tây Bắc và các vùng núi khác của Việt Nam.",
      ],
      [
        "Tái chế phần còn lại",
        "Những chiếc rách, bạc màu hay thủng nhiều không được mang lên vùng cao. Chúng tôi làm sạch, cắt và biến chúng thành vải tái chế cho quai, nắp và khăn của túi.",
      ],
    ],
    where: "Xem chúng trở thành gì",
    bring: "Nên mang",
    dont: "Không nên mang",
    next: "Tham gia chuyến tới.",
    unknown:
      "Ngày của chuyến tháng tới sẽ được công bố tại đây và gửi tới mọi người đã đăng ký.",
    nextLabel: "CHUYẾN TỚI",
    collection: "Nhận đồ",
    destination: "Điểm đến",
    form: {
      name: "Họ tên",
      phone: "Số điện thoại hoặc Zalo",
      email: "Email (không bắt buộc)",
      role: "Tôi muốn",
      donate: "Quyên góp quần áo",
      volunteer: "Đi tình nguyện",
      both: "Cả hai",
      amount: "Khoảng bao nhiêu?",
      one: "Một túi",
      two: "Hai đến ba túi",
      more: "Hơn ba túi",
      note: "Ghi chú",
      privacy: "Tôi đồng ý với Chính sách bảo mật",
      recycle:
        "Tôi hiểu rằng quần áo không còn mặc được có thể được tái chế thành vải cho sản phẩm của Refvlks.",
      submit: "Đăng ký tham gia",
    },
    thanks:
      "Cảm ơn {name}. Chúng tôi sẽ nhắn bạn ngày và thông tin nhận đồ của chuyến tới.",
    error: "Vui lòng kiểm tra thông tin và thử lại.",
    rate: "Đã có quá nhiều đăng ký từ kết nối này. Vui lòng thử lại sau một giờ.",
    faq: [
      [
        "Tôi có thể gửi quần áo rách hoặc bạc màu không?",
        "Có. Chúng sẽ không được mang lên vùng cao, nhưng sẽ trở thành vải tái chế trong túi của chúng tôi.",
      ],
      [
        "Refvlks có bán quần áo quyên góp không?",
        "Không. Quần áo còn mặc được đều được tặng miễn phí. Chỉ những chiếc quá cũ mới được tái chế thành vải, và vải đó được dùng trong túi Refvlks.",
      ],
    ],
  },
} as const;

export async function DonationV2({
  locale,
  status,
}: {
  locale: Locale;
  status: string;
}) {
  const d = dictionary(locale).donation;
  const c = copy[locale];
  const p = paths(locale);
  const event = await (await donationRepository(env.DB)).getEvent();
  const thankName =
    status === "success"
      ? ((await cookies()).get("donation-thanks")?.value ?? "")
      : "";
  const steps = c.steps;
  const icons = [PackageOpen, Shirt, Truck, Recycle];
  const impact = event.impact;
  const showImpact =
    isApproved("CL-20") &&
    impact.kgCollected != null &&
    impact.piecesDelivered != null &&
    impact.kgRecycled != null;
  return (
    <StoryMotion>
      <section className="section donation-hero" data-section="DE-01">
        <div className="container donation-hero-grid">
          <div>
            <Eyebrow>{d.eyebrow}</Eyebrow>
            <h1>{d.title}</h1>
            <p className="lead">{d.intro}</p>
            <div className="button-row">
              <ButtonLink href="#join">{c.join}</ButtonLink>
              <ButtonLink secondary href="#how">
                {c.how}
              </ButtonLink>
            </div>
          </div>
          <svg
            className="donation-route"
            viewBox="0 0 560 560"
            role="img"
            aria-label={
              locale === "vi"
                ? "Hành trình cách điệu từ Hà Nội đến vùng cao"
                : "Illustrated route from Hanoi to the Northwest"
            }
          >
            <rect width="560" height="560" fill="#E8DFD0" />
            <path
              d="M32 88H510M12 142H534M48 202H520M10 292H532M30 378H512M5 463H540"
              stroke="#4A2E1F"
              strokeWidth="2"
            />
            <path
              className="route-thread"
              d="M160 444C85 332 230 300 264 240S390 204 408 114"
              fill="none"
              stroke="#B3341F"
              strokeWidth="4"
            />
            <circle cx="160" cy="444" r="9" fill="#B3341F" />
            <circle cx="408" cy="114" r="9" fill="#B3341F" />
            <text x="45" y="483" fill="#4A2E1F" fontSize="22">
              HANOI
            </text>
            <text x="336" y="82" fill="#4A2E1F" fontSize="22">
              NORTHWEST
            </text>
          </svg>
        </div>
        <div className="shop-marquee donation-marquee" aria-hidden="true">
          <div className="shop-marquee-track">
            <span>{c.marquee} </span>
            <span>{c.marquee} </span>
          </div>
        </div>
        {showImpact && (
          <div className="container donation-impact">
            <strong>{impact.kgCollected} kg</strong>
            <strong>{impact.piecesDelivered}</strong>
            <strong>{impact.kgRecycled} kg</strong>
          </div>
        )}
      </section>
      <section
        className="section donation-process"
        data-section="DE-02"
        id="how"
      >
        <div className="container">
          <Eyebrow>{d.eyebrow}</Eyebrow>
          <h2>{c.process}</h2>
          <div className="story-stack">
            <div className="story-thread" aria-hidden="true" />
            {steps.map(([title, body], index) => {
              const Icon = icons[index];
              return (
                <article className="story-stack-card donation-step" key={title}>
                  <span className="mono">0{index + 1} / 04</span>
                  <div className="donation-step-icon">
                    <Icon size={68} strokeWidth={1.25} aria-hidden="true" />
                    {index === 3 && (
                      <div className="donation-step-images">
                        <Picture id="SP01-05" locale={locale} />
                        <Picture id="SP03-01" locale={locale} />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3>{title}</h3>
                    <p>{body}</p>
                    {index === 3 && (
                      <a className="text-link" href={p.shop}>
                        {c.where} ↗
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
          <div className="donation-accept">
            <div>
              <h3>{c.bring}</h3>
              <ul>
                {event.accepts.bring[locale].map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3>{c.dont}</h3>
              <ul>
                {event.accepts.dontBring[locale].map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section className="section donation-join" data-section="DE-03" id="join">
        <div className="container donation-join-grid">
          <div>
            <Eyebrow>{d.eyebrow}</Eyebrow>
            <h2>{c.next}</h2>
            <div className="donation-event-card">
              <span className="mono">{c.nextLabel}</span>
              {event.nextEvent.date ? (
                <p>{event.nextEvent.date}</p>
              ) : (
                <p>{c.unknown}</p>
              )}
              {event.nextEvent.collectionWindow[locale] && (
                <p>
                  {c.collection}: {event.nextEvent.collectionWindow[locale]}
                </p>
              )}
              {event.nextEvent.destination[locale] && (
                <p>
                  {c.destination}: {event.nextEvent.destination[locale]}
                </p>
              )}
            </div>
            <div className="faq-list">
              {c.faq.map(([question, answer]) => (
                <details key={question}>
                  <summary>{question}</summary>
                  <p>{answer}</p>
                </details>
              ))}
            </div>
          </div>
          <div className="donation-form-card">
            {status === "success" && (
              <p className="message-box" role="status">
                {c.thanks.replace(
                  "{name}",
                  thankName || (locale === "vi" ? "bạn" : "friend"),
                )}
              </p>
            )}
            {status === "error" && (
              <p className="message-box error" role="alert">
                {c.error}
              </p>
            )}
            {status === "rate-limit" && (
              <p className="message-box error" role="alert">
                {c.rate}
              </p>
            )}
            <form
              className="validated-form donation-form"
              method="post"
              action="/api/donation"
            >
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
                <label htmlFor="donation-name">{c.form.name}</label>
                <input
                  id="donation-name"
                  name="name"
                  required
                  minLength={2}
                  autoComplete="name"
                  aria-describedby="donation-name-error"
                />
                <p className="field-error" id="donation-name-error">
                  {c.form.name} · {locale === "vi" ? "bắt buộc" : "required"}
                </p>
              </div>
              <div className="field">
                <label htmlFor="donation-phone">{c.form.phone}</label>
                <input
                  id="donation-phone"
                  name="phone"
                  type="tel"
                  required
                  pattern="0[0-9]{9}"
                  autoComplete="tel"
                  aria-describedby="donation-phone-error"
                />
                <p className="field-error" id="donation-phone-error">
                  {locale === "vi"
                    ? "Nhập 10 chữ số, bắt đầu bằng 0."
                    : "Enter 10 digits beginning with 0."}
                </p>
              </div>
              <div className="field">
                <label htmlFor="donation-email">{c.form.email}</label>
                <input
                  id="donation-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                />
              </div>
              <fieldset className="donation-role">
                <legend>{c.form.role}</legend>
                <label>
                  <input
                    type="radio"
                    name="role"
                    value="donate"
                    defaultChecked
                  />
                  {c.form.donate}
                </label>
                <label>
                  <input type="radio" name="role" value="volunteer" />
                  {c.form.volunteer}
                </label>
                <label>
                  <input type="radio" name="role" value="both" />
                  {c.form.both}
                </label>
              </fieldset>
              <div className="field donation-amount">
                <label htmlFor="donation-amount">{c.form.amount}</label>
                <select id="donation-amount" name="amount" defaultValue="">
                  <option value="">—</option>
                  <option value="one">{c.form.one}</option>
                  <option value="two-three">{c.form.two}</option>
                  <option value="more">{c.form.more}</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="donation-note">{c.form.note}</label>
                <textarea id="donation-note" name="note" maxLength={300} />
              </div>
              <label className="consent">
                <input
                  type="checkbox"
                  name="consentPrivacy"
                  required
                  aria-describedby="donation-privacy-error"
                />
                <span>
                  {locale === "vi" ? "Tôi đồng ý với " : "I agree to the "}
                  <a href={legalPath(locale, "privacy")}>
                    {locale === "vi" ? "Chính sách bảo mật" : "Privacy Policy"}
                  </a>
                </span>
              </label>
              <p className="field-error" id="donation-privacy-error">
                {c.form.privacy}
              </p>
              <label className="consent donation-recycle">
                <input
                  type="checkbox"
                  name="consentRecycle"
                  aria-describedby="donation-recycle-error"
                />
                <span>{c.form.recycle}</span>
              </label>
              <p className="field-error" id="donation-recycle-error">
                {c.form.recycle}
              </p>
              <DonationSubmit>{c.form.submit} ↗</DonationSubmit>
            </form>
          </div>
        </div>
      </section>
    </StoryMotion>
  );
}
