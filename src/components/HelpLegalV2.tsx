import {
  dictionary,
  money,
  paths,
  products,
  type Locale,
} from "../lib/catalog";
import { policy } from "../content/policy";
import { ButtonLink, Eyebrow, Picture } from "./Storefront";

const content = {
  en: {
    size: {
      title: "Size & fit",
      intro:
        "Exact measurements for each bag are being confirmed. Bring your laptop and daily essentials to the studio to try a shape in person.",
      soon: "Coming soon",
      columns: [
        "Bag",
        "W × H × D",
        "Weight",
        "Laptop fit",
        "Handle drop",
        "Compartments",
      ],
      studio: "Not sure? Bring your laptop to the studio.",
    },
    shipping: {
      title: "Shipping, inspection & returns",
      delivery: "Delivery",
      deliveryBody: `Shipping is ${money(policy.shippingFeeHanoi)} in Hanoi and ${money(policy.shippingFeeOther)} elsewhere in Vietnam. Studio collection is free by appointment. The fee and total appear before you place an order.`,
      inspect: "Inspect before you pay",
      inspectBody:
        "For cash on delivery, open the parcel and check the bag in front of the courier before paying. Check the model, colour, quantity, seams, handles and closure.",
      issue: "A problem with your order?",
      issueBody:
        "If the bag is faulty, damaged or different from your order, contact us with your order number and clear photos. We will review the issue and arrange a correction, exchange or refund as appropriate.",
      change: "Changed your mind?",
      changeBody:
        "Please contact us before using the bag so we can discuss the available options. Woven and recovered panels can vary slightly in placement, colour and texture from one bag to another.",
      repair: "Repairs",
      repairBody:
        "Handles, buckles and seams can come back to us for assessment and repair. Send photos through the contact form and we will advise the next step.",
      ask: "Ask about an order",
    },
    care: {
      title: "Care & repair",
      intro: "A little care helps the materials keep their shape and texture.",
      sections: [
        [
          "Jacquard canvas body",
          "Spot clean with a damp cloth and mild soap; blot rather than rub. Do not machine wash, bleach or tumble dry.",
        ],
        [
          "Technical felt body",
          "Lift lint with a soft brush or lint roller. Spot clean with cold water and dry flat, away from heat.",
        ],
        [
          "Coated recovered handles, flaps and straps",
          "Wipe with a damp cloth. Avoid alcohol, solvents and heat so the matte finish stays smooth.",
        ],
        [
          "Recovered-yarn scarf",
          "Hand wash cold on its own and dry flat. Dyed yarn and recovered denim may transfer colour onto light clothing when new or damp.",
        ],
        [
          "Woven lining and panels",
          "Do not scrub. Keep pens capped and keys in a pocket so they cannot snag the weave.",
        ],
        [
          "Storage",
          "Empty the bag, fill it with paper to hold its shape and keep it in its dust bag away from damp.",
        ],
      ],
      variation:
        "Every woven detail and recovered panel is different. Small differences in pattern placement, colour and texture are expected.",
      repair: "Request a repair",
    },
    faq: {
      title: "Frequently asked questions",
      items: [
        [
          "What is recovered textile used for?",
          "Handles, flaps, straps and the scarf: 30% of each bag by textile weight. The body uses new technical textile, either jacquard canvas or dense felt.",
        ],
        [
          "Is the flap leather?",
          "No. None of our bags use leather. Handles and flaps use recovered cotton-denim canvas with a matte coated finish.",
        ],
        [
          "Why do two bags look slightly different?",
          "Woven details and recovered panels vary from piece to piece. That is expected.",
        ],
        [
          "How do I pay?",
          "Cash on delivery or bank transfer. Card payments are unavailable.",
        ],
        [
          "Can I check the bag before paying?",
          "Yes. With cash on delivery, you can inspect the bag in front of the courier before paying.",
        ],
        [
          "The account name is a person's name. Is that right?",
          "Yes. The Techcombank account is held by Refvlks' representative, Nguyen Tung Anh.",
        ],
        ["Where is the studio?", "22 Le Quy Don, Hai Ba Trung Ward, Hanoi."],
        [
          "Do I need to book?",
          "Yes. The studio is open every day from 8:00 to 21:30, by appointment only.",
        ],
      ],
    },
    legal: {
      privacy: {
        title: "Privacy policy",
        sections: [
          [
            "Who handles your information",
            "Refvlks, represented by Nguyễn Tùng Anh, handles the information submitted through this store. You can send privacy questions through the contact form.",
          ],
          [
            "What we collect",
            "We collect the name, phone, optional email, delivery address, order details, studio visit details and messages you provide. Donation signups may also include your participation choice and note. We do not collect payment card details.",
          ],
          [
            "Why we use it",
            "We use this information to process and deliver orders, confirm visits and donation participation, and respond to service or repair requests. We do not use these forms for advertising without separate consent.",
          ],
          [
            "Sharing and storage",
            "Order delivery details may be given to a delivery partner when needed. Service providers that run the store or send transactional emails may process the relevant details. We do not sell your personal information.",
          ],
          [
            "Your choices",
            "Contact us to ask what information we hold about you, request a correction or deletion, or withdraw consent where applicable. We will review the request and any record-keeping obligations.",
          ],
          [
            "Cookies",
            "The store uses a cart cookie and a short-lived cookie to show a donation signup acknowledgement. This build does not run advertising pixels or analytics.",
          ],
        ],
      },
      terms: {
        title: "Terms of sale",
        sections: [
          [
            "Seller and orders",
            "Refvlks is represented by Nguyễn Tùng Anh. The studio is at 22 Le Quy Don, Hai Ba Trung Ward, Hanoi. An online order is recorded when you submit checkout; we contact you to confirm it.",
          ],
          [
            "Prices and stock",
            "Product prices and shipping fees are shown in VND before you place the order. Stock can change; if an item cannot be supplied, we will contact you and return any amount already paid for that item.",
          ],
          [
            "Product appearance",
            "We aim to show each bag accurately. Woven details and recovered panels can vary slightly in placement, colour and texture; screens can show colours differently.",
          ],
          [
            "Delivery and issues",
            "See Shipping, inspection & returns for delivery fees and how to report a problem. Contact us before using a bag if you want to discuss an exchange.",
          ],
          [
            "Contact",
            "Questions about an order or these terms can be sent through the contact form.",
          ],
        ],
      },
      payment: {
        title: "Payment policy",
        sections: [
          [
            "Ways to pay",
            "Choose cash on delivery or bank transfer at checkout. At the studio, pay with cash or bank transfer. Card payment is unavailable; its preview does not collect card data.",
          ],
          [
            "Bank transfer",
            "Transfer the exact total shown on your order confirmation to Techcombank, account 19070671343017, recipient NGUYEN TUNG ANH (Refvlks). Use your order number as the transfer reference. We review the payment before handling the order.",
          ],
          [
            "Cash on delivery",
            "You may inspect the parcel in front of the courier before paying the displayed order total, including shipping.",
          ],
          [
            "Payment safety",
            "Refvlks will not ask for your password, OTP or card number through a call, message or email.",
          ],
        ],
      },
    },
    translation:
      "This English version is a translation. If there is any difference, the Vietnamese version applies.",
  },
  vi: {
    size: {
      title: "Kích thước",
      intro:
        "Số đo chính xác của từng mẫu đang được xác nhận. Hãy mang laptop và đồ dùng hằng ngày đến studio để đeo thử.",
      soon: "Sắp cập nhật",
      columns: [
        "Mẫu túi",
        "R × C × D",
        "Khối lượng",
        "Laptop",
        "Độ rơi quai",
        "Ngăn túi",
      ],
      studio: "Chưa chắc? Mang laptop đến studio để thử.",
    },
    shipping: {
      title: "Giao hàng, kiểm hàng & đổi trả",
      delivery: "Giao hàng",
      deliveryBody: `Phí giao hàng là ${money(policy.shippingFeeHanoi)} tại Hà Nội và ${money(policy.shippingFeeOther)} tại các tỉnh thành khác ở Việt Nam. Nhận tại studio miễn phí theo lịch hẹn. Phí và tổng tiền được hiển thị trước khi đặt hàng.`,
      inspect: "Kiểm hàng trước khi trả tiền",
      inspectBody:
        "Với đơn thanh toán khi nhận hàng, bạn có thể mở gói và kiểm túi trước mặt người giao hàng trước khi trả tiền. Hãy xem mẫu, màu, số lượng, đường may, quai và khóa.",
      issue: "Đơn hàng có vấn đề?",
      issueBody:
        "Nếu túi bị lỗi, hư hại hoặc khác đơn đã đặt, hãy liên hệ với mã đơn và ảnh rõ nét. Chúng tôi sẽ xem xét và sắp xếp sửa sai, đổi hoặc hoàn tiền tùy trường hợp.",
      change: "Đổi ý?",
      changeBody:
        "Hãy liên hệ trước khi sử dụng túi để cùng trao đổi phương án phù hợp. Chi tiết dệt và vải tái chế có thể khác nhau đôi chút về vị trí họa tiết, sắc độ và bề mặt.",
      repair: "Sửa chữa",
      repairBody:
        "Quai, khóa và đường may có thể gửi lại để chúng tôi đánh giá và sửa chữa. Gửi ảnh qua biểu mẫu liên hệ, chúng tôi sẽ hướng dẫn bước tiếp theo.",
      ask: "Hỏi về đơn hàng",
    },
    care: {
      title: "Bảo quản & sửa chữa",
      intro: "Chăm sóc nhẹ nhàng giúp vật liệu giữ phom và bề mặt.",
      sections: [
        [
          "Thân canvas jacquard",
          "Lau vết bẩn bằng khăn ẩm và xà phòng dịu; thấm nhẹ, không chà xát. Không giặt máy, tẩy hoặc sấy.",
        ],
        [
          "Thân nỉ kỹ thuật",
          "Dùng bàn chải mềm hoặc cây lăn bụi. Lau vết bẩn bằng nước lạnh và phơi phẳng, tránh nhiệt.",
        ],
        [
          "Quai, nắp và dải quai phủ hoàn thiện",
          "Lau bằng khăn ẩm. Tránh cồn, dung môi và nhiệt để lớp hoàn thiện mờ luôn mịn.",
        ],
        [
          "Khăn từ sợi tái chế",
          "Giặt tay riêng bằng nước lạnh, phơi phẳng. Sợi nhuộm và jeans tái chế có thể lem màu lên đồ sáng khi mới hoặc còn ẩm.",
        ],
        [
          "Lớp lót và mảng dệt",
          "Không chà xát. Đậy nắp bút và giữ chìa khóa trong ngăn riêng để tránh mắc sợi.",
        ],
        [
          "Cất giữ",
          "Lấy hết đồ trong túi, nhồi giấy để giữ phom và cất trong túi vải, tránh ẩm.",
        ],
      ],
      variation:
        "Mỗi chi tiết dệt và mảnh vải tái chế đều khác nhau. Chênh lệch nhỏ về vị trí họa tiết, màu và bề mặt là bình thường.",
      repair: "Yêu cầu sửa chữa",
    },
    faq: {
      title: "Câu hỏi thường gặp",
      items: [
        [
          "Vải tái chế được dùng ở đâu?",
          "Quai, nắp, dải quai và khăn: 30% mỗi chiếc túi tính theo khối lượng vải. Thân túi dùng vải chuyên dụng mới, canvas jacquard hoặc nỉ dày.",
        ],
        [
          "Nắp túi có phải da không?",
          "Không. Túi Refvlks không dùng da. Quai và nắp dùng canvas cotton-jeans tái chế với lớp hoàn thiện mờ.",
        ],
        [
          "Vì sao hai chiếc túi hơi khác nhau?",
          "Chi tiết dệt và vải tái chế khác nhau ở từng sản phẩm. Điều đó là bình thường.",
        ],
        [
          "Thanh toán thế nào?",
          "Thanh toán khi nhận hàng hoặc chuyển khoản. Thanh toán thẻ chưa khả dụng.",
        ],
        [
          "Có thể kiểm hàng trước khi trả tiền không?",
          "Có. Với đơn thanh toán khi nhận hàng, bạn có thể kiểm túi trước mặt người giao hàng trước khi trả tiền.",
        ],
        [
          "Tên chủ tài khoản là tên cá nhân, có đúng không?",
          "Đúng. Tài khoản Techcombank do người đại diện Refvlks, Nguyễn Tùng Anh, đứng tên.",
        ],
        ["Studio ở đâu?", "22 Lê Quý Đôn, phường Hai Bà Trưng, Hà Nội."],
        [
          "Có cần đặt lịch trước không?",
          "Có. Studio mở cửa hằng ngày từ 8:00 đến 21:30 và chỉ tiếp khách theo lịch hẹn.",
        ],
      ],
    },
    legal: {
      privacy: {
        title: "Chính sách bảo mật",
        sections: [
          [
            "Bên xử lý thông tin",
            "Refvlks, do Nguyễn Tùng Anh đại diện, xử lý thông tin bạn gửi qua cửa hàng. Bạn có thể hỏi về dữ liệu qua biểu mẫu Liên hệ.",
          ],
          [
            "Dữ liệu thu thập",
            "Chúng tôi thu thập họ tên, số điện thoại, email không bắt buộc, địa chỉ giao hàng, thông tin đơn hàng, lịch hẹn studio và nội dung liên hệ do bạn cung cấp. Đăng ký quyên góp có thể gồm cách tham gia và ghi chú. Chúng tôi không thu thập dữ liệu thẻ thanh toán.",
          ],
          [
            "Mục đích sử dụng",
            "Thông tin được dùng để xử lý và giao đơn hàng, xác nhận lịch hẹn hoặc tham gia quyên góp, hỗ trợ sửa chữa và trả lời yêu cầu. Các biểu mẫu này không dùng cho quảng cáo nếu chưa có đồng ý riêng.",
          ],
          [
            "Chia sẻ và lưu trữ",
            "Thông tin giao hàng có thể được chuyển cho đơn vị vận chuyển khi cần. Nhà cung cấp vận hành cửa hàng hoặc gửi email giao dịch có thể xử lý dữ liệu liên quan. Chúng tôi không bán dữ liệu cá nhân.",
          ],
          [
            "Lựa chọn của bạn",
            "Liên hệ để hỏi về thông tin chúng tôi lưu giữ, yêu cầu chỉnh sửa hoặc xóa, hoặc rút lại đồng ý khi phù hợp. Chúng tôi sẽ xem xét yêu cầu và nghĩa vụ lưu hồ sơ liên quan.",
          ],
          [
            "Cookie",
            "Cửa hàng dùng cookie giỏ hàng và cookie ngắn hạn để hiển thị lời cảm ơn sau khi đăng ký quyên góp. Bản dựng này không chạy pixel quảng cáo hoặc phân tích lượt truy cập.",
          ],
        ],
      },
      terms: {
        title: "Điều khoản bán hàng",
        sections: [
          [
            "Người bán và đơn hàng",
            "Refvlks do Nguyễn Tùng Anh đại diện. Studio tại 22 Lê Quý Đôn, phường Hai Bà Trưng, Hà Nội. Đơn hàng trực tuyến được ghi nhận khi bạn gửi thanh toán; chúng tôi sẽ liên hệ xác nhận.",
          ],
          [
            "Giá và tồn kho",
            "Giá sản phẩm và phí giao hàng hiển thị bằng VND trước khi đặt hàng. Tồn kho có thể thay đổi; nếu không thể cung cấp sản phẩm, chúng tôi sẽ liên hệ và hoàn lại khoản đã thanh toán cho sản phẩm đó.",
          ],
          [
            "Hình ảnh sản phẩm",
            "Chúng tôi cố gắng thể hiện túi chính xác. Chi tiết dệt và vải tái chế có thể khác nhẹ về vị trí họa tiết, sắc độ và bề mặt; màu trên màn hình cũng có thể khác thực tế.",
          ],
          [
            "Giao hàng và khiếu nại",
            "Xem mục Giao hàng, kiểm hàng & đổi trả để biết phí giao hàng và cách báo vấn đề. Hãy liên hệ trước khi dùng túi nếu muốn trao đổi việc đổi sản phẩm.",
          ],
          [
            "Liên hệ",
            "Các câu hỏi về đơn hàng hoặc điều khoản có thể gửi qua biểu mẫu Liên hệ.",
          ],
        ],
      },
      payment: {
        title: "Chính sách thanh toán",
        sections: [
          [
            "Cách thanh toán",
            "Chọn thanh toán khi nhận hàng hoặc chuyển khoản khi đặt trực tuyến. Tại studio, bạn có thể trả tiền mặt hoặc chuyển khoản. Thanh toán thẻ chưa khả dụng; bản xem trước không thu thập dữ liệu thẻ.",
          ],
          [
            "Chuyển khoản",
            "Chuyển đúng tổng tiền trên trang xác nhận đơn vào Techcombank, số tài khoản 19070671343017, người thụ hưởng NGUYEN TUNG ANH (Refvlks). Ghi mã đơn hàng trong nội dung chuyển khoản. Chúng tôi kiểm tra khoản tiền trước khi xử lý đơn.",
          ],
          [
            "Thanh toán khi nhận hàng",
            "Bạn có thể kiểm gói hàng trước mặt người giao hàng trước khi trả tổng tiền đơn đã hiển thị, gồm phí vận chuyển.",
          ],
          [
            "An toàn thanh toán",
            "Refvlks không yêu cầu mật khẩu, mã OTP hoặc số thẻ qua điện thoại, tin nhắn hay email.",
          ],
        ],
      },
    },
    translation: "",
  },
} as const;

export const faqItems = (locale: Locale) => content[locale].faq.items;

export function HelpV2({ locale, topic }: { locale: Locale; topic?: string }) {
  const c = content[locale];
  const p = paths(locale);
  if (topic === "size-fit")
    return (
      <section className="container page-hero policy-content">
        <Eyebrow>{dictionary(locale).nav.help}</Eyebrow>
        <h1>{c.size.title}</h1>
        <p className="lead">{c.size.intro}</p>
        <div className="size-table-scroll">
          <table className="size-table">
            <thead>
              <tr>
                {c.size.columns.map((label) => (
                  <th key={label}>{label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.code}>
                  <th scope="row">
                    <a href={`#${product.handle}`}>{product.name[locale]}</a>
                  </th>
                  {[
                    "sizeCm",
                    "weightG",
                    "laptopIn",
                    "handleDropCm",
                    "compartments",
                  ].map((key) => (
                    <td key={key}>{product.specs?.[key] ?? c.size.soon}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="size-card-grid">
          {products.map((product) => (
            <article
              className="size-card"
              id={product.handle}
              key={product.code}
            >
              <Picture id={product.variants[0].cardImage} locale={locale} />
              <h2>{product.name[locale]}</h2>
              <p>{c.size.soon}</p>
            </article>
          ))}
        </div>
        <p className="lead">{c.size.studio}</p>
        <ButtonLink href={`${p.studio}#book`}>
          {dictionary(locale).studio.book}
        </ButtonLink>
      </section>
    );
  if (topic === "shipping-returns")
    return (
      <section className="container page-hero policy-content">
        <Eyebrow>{dictionary(locale).nav.help}</Eyebrow>
        <h1>{c.shipping.title}</h1>
        {[
          [c.shipping.delivery, c.shipping.deliveryBody],
          [c.shipping.inspect, c.shipping.inspectBody],
          [c.shipping.issue, c.shipping.issueBody],
          [c.shipping.change, c.shipping.changeBody],
          [c.shipping.repair, c.shipping.repairBody],
        ].map(([heading, body]) => (
          <div key={heading} className="policy-block">
            <h2>{heading}</h2>
            <p>{body}</p>
          </div>
        ))}
        <ButtonLink href={`${p.contact}?topic=order`}>
          {c.shipping.ask}
        </ButtonLink>
      </section>
    );
  if (topic === "care-repair")
    return (
      <section className="container page-hero policy-content">
        <Eyebrow>{dictionary(locale).nav.help}</Eyebrow>
        <h1>{c.care.title}</h1>
        <p className="lead">{c.care.intro}</p>
        {c.care.sections.map(([heading, body]) => (
          <div className="policy-block" key={heading}>
            <h2>{heading}</h2>
            <p>{body}</p>
          </div>
        ))}
        <p className="message-box">{c.care.variation}</p>
        <ButtonLink href={`${p.contact}?topic=repair`}>
          {c.care.repair}
        </ButtonLink>
      </section>
    );
  if (topic === "faq")
    return (
      <section className="container page-hero policy-content">
        <Eyebrow>{dictionary(locale).nav.help}</Eyebrow>
        <h1>{c.faq.title}</h1>
        <div className="faq-list">
          {c.faq.items.map(([question, answer]) => (
            <details key={question}>
              <summary>{question}</summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
        <ButtonLink href={p.contact}>
          {dictionary(locale).nav.contact}
        </ButtonLink>
      </section>
    );
  return null;
}

export function LegalV2({ locale, topic }: { locale: Locale; topic?: string }) {
  if (topic !== "privacy" && topic !== "terms" && topic !== "payment")
    return null;
  const c = content[locale];
  const p = paths(locale);
  const section = c.legal[topic];
  return (
    <section className="container page-hero policy-content">
      <Eyebrow>{dictionary(locale).footer.legal}</Eyebrow>
      <h1>{section.title}</h1>
      {locale === "en" && <p className="message-box">{c.translation}</p>}
      {section.sections.map(([heading, body]) => (
        <div className="policy-block" key={heading}>
          <h2>{heading}</h2>
          <p>{body}</p>
        </div>
      ))}
      <ButtonLink href={p.contact}>{dictionary(locale).nav.contact}</ButtonLink>
    </section>
  );
}
