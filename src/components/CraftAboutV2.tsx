import { paths, type Locale } from "../lib/catalog";
import { ButtonLink, Eyebrow, Picture } from "./Storefront";
import { StoryMotion } from "../motion/StoryMotion";

const story = {
  en: {
    craft: {
      eyebrow: "CRAFT & MATERIALS",
      title: "Seventy, thirty.",
      lead: "Every Refvlks bag is built from two kinds of cloth, each where it works best.",
      new: "New technical textile for the body: dense jacquard canvas and 3 mm felt that hold their shape and take daily wear.",
      recovered:
        "Recovered cotton, denim and synthetics for handles, flaps, straps and scarves, finished with a matte water-based coating so they stay smooth and easy to wipe.",
      note: "Measured by textile weight. Every part is listed on each product page.",
      process: "From cloth to bag.",
      steps: [
        [
          "Sort",
          "Clothes too worn to give away, including pieces from our monthly donation drives, are set aside for recovery.",
          "SP01-05",
        ],
        [
          "Clean and cut",
          "They are washed, opened at the seams and cut into panels by type: cotton, denim, synthetics.",
          "SP01-06",
        ],
        [
          "Coat",
          "Panels for handles and flaps get a matte water-based finish, so recovered cloth feels smooth and wipes clean.",
          "SP01-02",
        ],
        [
          "Sew",
          "Recovered parts are sewn to a body of new jacquard canvas or felt, with a woven lining or panel.",
          "SP01-07",
        ],
        [
          "Check",
          "Every bag is checked by hand: shape, seams, handles and closures.",
          "SP01-01",
        ],
      ],
      weave: "The weave.",
      weaveBody:
        "The lining of the Weft Structured Tote and the panel of the Loom Carryall are multicolour woven brocade.",
      uncertain: "What we don't claim yet.",
      uncertainBody:
        "QR codes that trace each bag to its batch are in development. Batch-by-batch measurement of the 70/30 split is being set up. When they are ready, they will be here, with evidence.",
      shop: "Shop Heritage",
      donate: "Join the donation event",
    },
    about: {
      eyebrow: "ABOUT REFVLKS",
      title: "Why we started Refvlks.",
      intro:
        "Two things kept coming up. Donated clothes left in piles by the roadside in Ky Son, Nghe An, because nobody had asked what was needed. And skilled weavers with fewer orders every year. We could not fix either alone, but we could make something people actually want to carry, and build it from both.",
      promises: "What we promise.",
      cards: [
        [
          "Built for work first.",
          "A bag has to carry your day before it can carry a story.",
          "SP01-06",
        ],
        [
          "Recovered textile, where it counts.",
          "30% of every bag, from handles to scarves, measured by textile weight.",
          "SP01-05",
        ],
        [
          "Clothes that reach people.",
          "Every month, wearable clothes go to mountain communities; the rest becomes our fabric.",
          null,
        ],
      ],
      pronounce: 'Say it "re·folks".',
      next: "What comes next.",
      nextBody:
        "QR codes that trace every bag to its batch. Accessories made entirely from recovered textile. More drives, to more communities. These are plans, and we will show them here when they are real.",
      shop: "Shop the collection",
      donate: "Join the donation event",
    },
  },
  vi: {
    craft: {
      eyebrow: "THỦ CÔNG & VẬT LIỆU",
      title: "Bảy mươi, ba mươi.",
      lead: "Mỗi chiếc túi Refvlks làm từ hai loại vải, mỗi loại ở đúng chỗ của nó.",
      new: "Vải chuyên dụng mới cho thân túi: canvas jacquard dày và nỉ 3 mm, giữ phom và chịu được mài mòn hằng ngày.",
      recovered:
        "Cotton, jeans và vải tổng hợp tái chế cho quai, nắp, dải quai và khăn, phủ lớp hoàn thiện mờ gốc nước để mịn và dễ lau.",
      note: "Tính theo khối lượng vải. Từng bộ phận được ghi trên trang sản phẩm.",
      process: "Từ tấm vải đến chiếc túi.",
      steps: [
        [
          "Phân loại",
          "Quần áo đã quá cũ để trao tặng, gồm cả những chiếc từ các chuyến quyên góp hằng tháng, được để riêng để tái chế.",
          "SP01-05",
        ],
        [
          "Giặt và cắt",
          "Chúng được giặt sạch, tháo đường may và cắt thành tấm theo loại: cotton, jeans, vải tổng hợp.",
          "SP01-06",
        ],
        [
          "Phủ hoàn thiện",
          "Tấm vải cho quai và nắp được phủ lớp hoàn thiện mờ gốc nước, để vải tái chế mịn tay và dễ lau.",
          "SP01-02",
        ],
        [
          "May",
          "Phần tái chế được may cùng thân túi bằng canvas jacquard hoặc nỉ mới, kèm lớp lót hoặc mảng dệt.",
          "SP01-07",
        ],
        [
          "Kiểm tra",
          "Từng chiếc túi được kiểm tra thủ công: phom, đường may, quai và khóa.",
          "SP01-01",
        ],
      ],
      weave: "Phần dệt.",
      weaveBody:
        "Lớp lót của Weft Structured Tote và mảng dệt của Loom Carryall là thổ cẩm dệt nhiều màu.",
      uncertain: "Điều chúng tôi chưa khẳng định.",
      uncertainBody:
        "Mã QR truy xuất từng chiếc túi về lô sản xuất đang được phát triển. Việc đo tỷ lệ 70/30 theo từng lô đang được thiết lập. Khi sẵn sàng, chúng sẽ có mặt ở đây, kèm bằng chứng.",
      shop: "Xem dòng Heritage",
      donate: "Tham gia quyên góp",
    },
    about: {
      eyebrow: "VỀ REFVLKS",
      title: "Vì sao chúng tôi làm Refvlks.",
      intro:
        "Có hai điều cứ lặp lại. Quần áo quyên góp bị bỏ thành đống bên đường ở Kỳ Sơn, Nghệ An, vì không ai hỏi người dân thực sự cần gì. Và những người thợ dệt giỏi có ít đơn hàng hơn mỗi năm. Chúng tôi không thể tự giải quyết cả hai, nhưng có thể làm ra thứ người ta thật sự muốn mang theo, và làm nó từ cả hai.",
      promises: "Điều chúng tôi cam kết.",
      cards: [
        [
          "Làm để đi làm trước tiên.",
          "Một chiếc túi phải mang được ngày làm việc của bạn trước khi mang một câu chuyện.",
          "SP01-06",
        ],
        [
          "Vải tái chế, đúng chỗ.",
          "30% mỗi chiếc túi, từ quai đến khăn, tính theo khối lượng vải.",
          "SP01-05",
        ],
        [
          "Áo quần đến đúng người.",
          "Mỗi tháng, quần áo còn mặc tốt được mang lên vùng cao; phần còn lại thành vải của chúng tôi.",
          null,
        ],
      ],
      pronounce: 'Đọc là "re·folks".',
      next: "Tiếp theo là gì.",
      nextBody:
        "Mã QR truy xuất từng chiếc túi về lô sản xuất. Phụ kiện làm hoàn toàn từ vải tái chế. Thêm nhiều chuyến quyên góp, đến thêm nhiều cộng đồng. Đây là kế hoạch, và chúng tôi sẽ cho bạn thấy ở đây khi chúng thành hiện thực.",
      shop: "Xem bộ sưu tập",
      donate: "Tham gia quyên góp",
    },
  },
} as const;

export function CraftV2({ locale }: { locale: Locale }) {
  const s = story[locale].craft;
  const p = paths(locale);
  return (
    <StoryMotion>
      <section className="section container craft-share" data-section="CR-01">
        <div className="craft-share-intro">
          <Eyebrow>{s.eyebrow}</Eyebrow>
          <h1>{s.title}</h1>
          <p className="lead">{s.lead}</p>
        </div>
        <Picture id="SP01-05" locale={locale} />
        <div
          className="craft-ratio"
          aria-label="70% new technical textile, 30% recovered textile"
        >
          <div className="ratio-thread" aria-hidden="true">
            <span />
          </div>
          <div>
            <strong className="ratio-number" data-count="70">
              70%
            </strong>
            <p>{s.new}</p>
          </div>
          <div>
            <strong className="ratio-number" data-count="30">
              30%
            </strong>
            <p>{s.recovered}</p>
          </div>
        </div>
        <p className="mono craft-ratio-note">{s.note}</p>
      </section>
      <section className="section craft-process" data-section="CR-02">
        <div className="container">
          <Eyebrow>{s.eyebrow}</Eyebrow>
          <h2>{s.process}</h2>
          <div className="story-stack">
            <div className="story-thread" aria-hidden="true" />
            {s.steps.map(([title, body, image], i) => (
              <article className="story-stack-card" key={title}>
                <span className="mono">0{i + 1} / 05</span>
                <Picture id={image} locale={locale} />
                <div>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section container craft-weave" data-section="CR-03">
        <div className="craft-weave-images">
          <Picture id="SP01-07" locale={locale} />
          <Picture id="REVEAL-08" locale={locale} />
          <Picture id="SP03-01" locale={locale} />
        </div>
        <div>
          <Eyebrow>{s.eyebrow}</Eyebrow>
          <h2>{s.weave}</h2>
          <p className="lead">{s.weaveBody}</p>
          <h3>{s.uncertain}</h3>
          <p>{s.uncertainBody}</p>
          <div className="button-row">
            <ButtonLink href={`${p.shop}?tier=heritage`}>{s.shop}</ButtonLink>
            <ButtonLink secondary href={p.donation}>
              {s.donate}
            </ButtonLink>
          </div>
        </div>
      </section>
    </StoryMotion>
  );
}

export function AboutV2({ locale }: { locale: Locale }) {
  const s = story[locale].about;
  const p = paths(locale);
  return (
    <StoryMotion>
      <section className="section container about-why" data-section="AB-01">
        <div>
          <Eyebrow>{s.eyebrow}</Eyebrow>
          <h1>{s.title}</h1>
          <p className="lead">{s.intro}</p>
          <a
            className="mono source-link"
            href="https://tuoitre.vn/quan-ao-cu-dua-len-vung-lu-quet-khong-ai-lay-huyen-noi-gi-20221010150851613.htm"
            target="_blank"
            rel="noopener noreferrer"
          >
            Doãn Hòa, Tuổi Trẻ · 2022 ↗
          </a>
        </div>
        <Picture id="LIFE-01" locale={locale} />
      </section>
      <section className="section about-promises" data-section="AB-02">
        <div className="container">
          <Eyebrow>{s.eyebrow}</Eyebrow>
          <h2>{s.promises}</h2>
          <div className="story-stack">
            <div className="story-thread" aria-hidden="true" />
            {s.cards.map(([title, body, image], i) => (
              <article className="story-stack-card" key={title}>
                <span className="mono">0{i + 1} / 03</span>
                {image ? (
                  <Picture id={image} locale={locale} />
                ) : (
                  <div className="weft-card" aria-hidden="true" />
                )}
                <div>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
              </article>
            ))}
          </div>
          <p className="mono">{s.pronounce}</p>
        </div>
      </section>
      <section className="section container about-next" data-section="AB-03">
        <Picture id="LIFE-06" locale={locale} />
        <div>
          <Eyebrow>{s.eyebrow}</Eyebrow>
          <h2>{s.next}</h2>
          <p className="lead">{s.nextBody}</p>
          <div className="button-row">
            <ButtonLink href={p.shop}>{s.shop}</ButtonLink>
            <ButtonLink secondary href={p.donation}>
              {s.donate}
            </ButtonLink>
          </div>
        </div>
      </section>
    </StoryMotion>
  );
}
