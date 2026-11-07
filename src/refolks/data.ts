export type Lang = "vi" | "en";
export type Bilingual = Record<Lang, string>;
export const t = (vi: string, en: string): Bilingual => ({ vi, en });
export const img = (name: string) => `/images/refolks/${name}.webp`;

// DEMO content: names for Models 1 and 3, stock, reviews and unspecified prices need confirmation.
// TODO: replace model-1/model-2/model-3 collection labels with the confirmed collection names.
export const products = [
  {
    id: "everyday-laptop-tote",
    name: t(
      "Everyday Laptop Tote – Ký Ức Bản Lác",
      "Everyday Laptop Tote - Memories of Ban Lac",
    ),
    short: t(
      "Sự giao thoa giữa nét thanh lịch công sở và tinh thần tự do. Chiếc Work Tote dáng hộp cứng cáp, điểm xuyết chiếc khăn lụa mang họa tiết Con Hươu quấn trên quai xách – biểu tượng của lòng trung thành và sức sống mãnh liệt.",
      "A seamless fusion of workplace elegance and a free-spirited soul. This structured boxy Work Tote features a silk scarf tied to the handle adorned with the Deer motif, a symbol of loyalty and vibrant vitality.",
    ),
    price: 1890000,
    category: "tote",
    gender: ["women", "men"],
    material: ["brocade", "recycled", "canvas"],
    collection: "model-2",
    stock: 12,
    colors: ["burgundy", "brown", "cream"],
    images: [
      img("tote-02-front"),
      img("tote-02-lifestyle"),
      img("tote-02-side"),
      img("tote-02-bottom"),
      img("tote-02-inside"),
    ],
    lifestyle: img("tote-02-lifestyle"),
  },
  {
    id: "model-1-work-tote",
    name: t("Túi công sở Mẫu 1", "Model 1 Work Tote"),
    short: t(
      "Dáng tote công sở phom đứng với điểm nhấn thổ cẩm.",
      "A structured work tote with a brocade accent.",
    ),
    price: null as number | null,
    category: "tote",
    gender: ["women", "men"],
    material: ["brocade", "recycled", "canvas"],
    collection: "model-1",
    stock: 8,
    colors: ["brown", "cream"],
    images: [
      img("tote-01-front"),
      img("tote-01-angle"),
      img("tote-01-side"),
      img("tote-01-bottom"),
      img("tote-01-inside"),
    ],
    lifestyle: img("tote-01-lifestyle"),
  },
  {
    id: "model-3-crossbody",
    name: t("Túi đeo chéo Mẫu 3", "Model 3 Crossbody Bag"),
    short: t(
      "Dáng túi đeo chéo gọn gàng, điểm họa tiết dệt thủ công.",
      "A compact crossbody silhouette with hand-woven detail.",
    ),
    price: null as number | null,
    category: "crossbody",
    gender: ["women"],
    material: ["brocade"],
    collection: "model-3",
    stock: 6,
    colors: ["brown"],
    images: [
      img("bag-03-front"),
      img("bag-03-side"),
      img("bag-03-side-left"),
      img("bag-03-bottom"),
      img("bag-03-inside"),
    ],
    lifestyle: img("bag-03-side"),
  },
  {
    id: "dragon-keychain",
    name: t("Móc khóa Rồng", "Dragon Keychain"),
    short: t(
      "Phụ kiện nhỏ với điểm nhấn họa tiết Rồng.",
      "A small accessory with a dragon motif.",
    ),
    price: null as number | null,
    category: "accessory",
    gender: ["women", "men"],
    material: ["brocade"],
    collection: "accessories",
    stock: 6,
    colors: ["brown"],
    images: [img("keychain-dragon"), img("keychain-dragon-silver")],
    lifestyle: img("keychain-dragon"),
  },
  {
    id: "palm-keychain",
    name: t("Móc khóa Hoa Cọ", "Palm Flower Keychain"),
    short: t(
      "Phụ kiện nhỏ với điểm nhấn họa tiết Hoa Cọ.",
      "A small accessory with a palm flower motif.",
    ),
    price: null as number | null,
    category: "accessory",
    gender: ["women", "men"],
    material: ["brocade"],
    collection: "accessories",
    stock: 6,
    colors: ["brown"],
    images: [img("keychain-palm-silver"), img("keychain-palm-soft")],
    lifestyle: img("keychain-palm-soft"),
  },
] as const;
export type Product = (typeof products)[number];

export const colours: Record<string, { name: Bilingual; hex: string }> = {
  burgundy: { name: t("Đỏ đô", "Burgundy"), hex: "#7A1F1E" },
  brown: { name: t("Nâu", "Brown"), hex: "#75523C" },
  cream: { name: t("Kem", "Cream"), hex: "#D1B79C" },
};

export const copy = {
  vi: {
    nav: [
      "Về chúng tôi",
      "Túi nữ",
      "Túi nam",
      "Bộ sưu tập",
      "Quà tặng",
      "Cộng đồng",
    ],
    heroTitle: "MANG DI SẢN VÀO NHỊP SỐNG ĐƯƠNG ĐẠI",
    heroSub:
      "Chiếc túi bền đẹp và thanh lịch dành cho bạn, kết tinh trọn vẹn từ chất liệu tái chế tuần hoàn cùng nghệ thuật dệt thêu thổ cẩm Thái thủ công.",
    heroCta: "Khám Phá Bộ Sưu Tập",
    aboutTitle: "TỪ BẢN LÁC ĐẾN CHỐN THÀNH THỊ",
    aboutStory: [
      "Mọi chuyện bắt đầu từ một chuyến đi thực tế của nhóm sinh viên chúng tôi đến Bản Lác, Mai Châu. Giữa những nếp nhà sàn bình yên, chúng tôi say mê ngắm nhìn các bà, các mẹ người Thái tỉ mẩn dệt nên những tấm thổ cẩm rực rỡ. Mỗi hoa văn không chỉ là những đường chỉ đan chéo, mà là cả một lời cầu bình an, một câu chuyện của núi rừng.",
      "Thế nhưng, đằng sau vẻ đẹp ấy lại là nỗi trăn trở khôn nguôi. Các nghệ nhân ngày một thưa vắng, ngọn lửa nghề thiếu người tiếp nối, còn các sản phẩm thổ cẩm đầy tâm huyết dần nằm im bám bụi vì vắng khách. Cùng lúc đó, làn sóng rác thải khổng lồ từ ngành thời trang nhanh vẫn đang đè nặng lên môi trường.",
      "Refolks ra đời từ chính trăn trở ấy.",
      'Chúng tôi tin rằng văn hóa không nên nằm yên trong tủ kính bảo tàng, mà phải "sống" cùng nhịp thở hiện đại.',
      "Bằng việc hòa quyện những dải thổ cẩm bản địa cùng chất liệu tái chế tuần hoàn, Refolks thổi hồn di sản vào từng chiếc túi công sở thanh lịch có tính ứng dụng cao. Để mỗi ngày bước ra đường, bạn không chỉ mang theo một thiết kế tinh tế, mà đang khoác lên vai niềm tự hào văn hóa cùng lời cam kết tử tế với Trái Đất.",
    ],
    uspTitles: ["BẢN SẮC DI SẢN", "TUẦN HOÀN TRÁCH NHIỆM", "ỨNG DỤNG TỐI ƯU"],
    usps: [
      "Mỗi chiếc túi là một bảo tàng thu nhỏ. Đó có thể là họa tiết Bọc Khoáy mang lời chúc bình an, hoa văn Con Hươu của lòng trung thành, hay sự vững chãi của Cây Cọ vươn lên trong gió.",
      "Giảm thiểu rác thải bằng việc ứng dụng 30% vật liệu vải thu hồi được xử lý nghiêm ngặt trở thành một phần của chiếc túi. Vòng đời của những thước vải cũ được tái sinh đầy kiêu hãnh.",
      'Đẹp nhưng không quên nhiệm vụ. Với phom đứng thanh lịch, chất liệu bền bỉ vượt thời gian, trang bị ngăn chống sốc an toàn cho laptop 13–16" cùng hệ thống ngăn chứa đa dạng, chiếc túi luôn sẵn sàng bên bạn mọi lịch trình.',
    ],
    shopTitle: "THE WORKPLACE ESSENTIALS",
    shopIntro:
      "Gọn gàng, vững chãi và mang đậm hơi thở di sản. Tìm chiếc túi Work Tote hoàn hảo cho hành trình công sở của bạn.",
    communityTitle: "HƠN CẢ MỘT THƯƠNG HIỆU, CHÚNG TA LÀ MỘT CỘNG ĐỒNG",
    communitySub:
      "Nơi cái đẹp đi liền với lòng trắc ẩn, và thời trang là chiếc cầu nối hệ sinh thái xanh.",
    donationTitle: "GÓP VẢI CŨ – DỆT ĐỜI MỚI",
    donationStory:
      "Những chiếc quần áo cũ nằm im trong góc tủ của bạn có thể là khởi đầu cho một hành trình mới. Tại Refolks, chúng tôi thu gom phế liệu dệt may để tái sinh thành lớp vải lót túi bền bỉ, hoặc trao gửi những bộ quần áo còn tốt đến các tổ chức từ thiện vùng cao.",
    donationSteps: [
      "Phân loại: Gom những trang phục không còn dùng tới.",
      "Gửi gắm: Gửi trực tiếp tại Store Hoàn Kiếm hoặc điền Form để chúng tôi đến nhận.",
      "Nhận quả ngọt: Nhận ngay Voucher giảm giá 15% cho đơn hàng Refolks tiếp theo thay cho lời cảm ơn từ Trái Đất.",
    ],
    eventsTitle: "NHỊP ĐẬP REFOLKS",
    eventsIntro:
      "Nơi chúng ta không chỉ nói về thời trang bền vững, mà cùng nhau chạm tay vào nó.",
    eventName: 'Workshop: "Tái sinh nếp vải – Tự tay làm túi Mini"',
    eventStory:
      "Cuối tuần này, hãy mang một món đồ vải cũ của bạn đến không gian Refolks. Chúng tôi sẽ hướng dẫn bạn cách cắt, may và biến chúng thành một chiếc túi mini hoặc card holder nhỏ xinh mang đậm dấu ấn cá nhân, điểm xuyết thêm một chút họa tiết thổ cẩm Thái.",
    eventCta: "Đăng Ký Chỗ Ngồi (Giới hạn 20 slots)",
  },
  en: {
    nav: ["About", "Women", "Men", "Collections", "Gifts", "Community"],
    heroTitle: "WEAVING HERITAGE INTO CONTEMPORARY LIFE",
    heroSub:
      "An elegant, durable tote designed for you—seamlessly combining circular recycled materials with the exquisite hand-weaving art of Thai ethnic artisans.",
    heroCta: "Explore the Collection",
    aboutTitle: "FROM BAN LAC TO THE CITY",
    aboutStory: [
      "It all began with a student field trip to Ban Lac, Mai Chau. Amidst the peaceful wooden stilt houses, we were captivated watching Thai mothers and grandmothers meticulously weave vibrant brocade textiles. Each intricate motif was far more than crisscrossed threads—it carried a prayer for peace and a story of the mountain forests.",
      "Yet behind that beauty lay a lingering worry. Master artisans are aging with few young successors to inherit the craft, while their heart-spun textiles sit quietly gathering dust due to a lack of buyers. At the same time, a massive wave of fast-fashion waste continues to burden our environment.",
      "Refolks was born from that very anxiety.",
      "We believe culture shouldn't remain static inside museum display cases—it must live and breathe within modern daily life.",
      "By blending indigenous hand-woven brocades with circular recycled fabrics, Refolks breathes heritage into highly functional, elegant work totes. Every day you step out, you don't just carry a refined design—you wear cultural pride on your shoulder and a mindful commitment to the Earth.",
    ],
    uspTitles: [
      "HERITAGE IDENTITY",
      "RESPONSIBLE CIRCULARITY",
      "OPTIMAL FUNCTIONALITY",
    ],
    usps: [
      'Every tote is a miniature museum. It might feature the "Boc Khoay" motif carrying blessings of peace, the Deer pattern symbolizing loyalty, or the resilience of the Palm Tree standing tall in the wind.',
      "Minimizing environmental waste by integrating 30% rigorously processed upcycled textile waste into every bag. Discarded fabrics begin a proud new life cycle.",
      'Stylish without compromising utility. Featuring a structured silhouette, timeless durability, a protective padded sleeve for 13–16" laptops, and smart multi-pocket organization—built to accompany you through every schedule.',
    ],
    shopTitle: "THE WORKPLACE ESSENTIALS",
    shopIntro:
      "Sleek, structured, and steeped in heritage. Find the perfect Work Tote for your daily career journey.",
    communityTitle: "MORE THAN A BRAND, WE ARE A COMMUNITY",
    communitySub:
      "Where beauty meets compassion, and fashion serves as a bridge to a greener ecosystem.",
    donationTitle: "DONATE OLD FABRICS – WEAVE NEW LIVES",
    donationStory:
      "Forgotten clothes sitting at the back of your closet can mark the start of a new journey. At Refolks, we collect textile leftovers to upcycle them into durable bag linings, while gently used clothing is donated to highland charitable partners.",
    donationSteps: [
      "Sort: Gather unworn or discarded clothing items.",
      "Donate: Drop them off directly at our Hoan Kiem Store or fill out our pickup form.",
      "Get Rewarded: Receive a 15% discount voucher for your next Refolks purchase as a thank-you from the Earth.",
    ],
    eventsTitle: "THE REFOLKS PULSE",
    eventsIntro:
      "Where we don't just talk about sustainable fashion—we experience it hands-on.",
    eventName: 'Workshop: "Giving Fabric New Life – Handcraft Your Mini Tote"',
    eventStory:
      "This weekend, bring an old piece of fabric to the Refolks space. We will guide you through cutting, sewing, and transforming it into a personalized mini tote or cardholder, accented with traditional Thai brocade motifs.",
    eventCta: "Reserve Your Spot (Limited to 20 seats)",
  },
} as const;

export const accordion = {
  vi: [
    [
      "Vật liệu minh bạch",
      "Lớp vỏ ngoài kết hợp 70% vải canvas cao cấp giữ phom và 30% vải thu hồi upcycled. Lớp lót bên trong 100% từ vải dệt tái chế mềm mịn, chống xước thiết bị.",
    ],
    [
      "Công năng tối đa",
      'Ngăn đệm vách chống sốc an toàn cho laptop 15.6", khe trụ giữ bình nước thẳng đứng, ngăn zip ẩn bảo mật đồ cá nhân. Đáy túi gia cố 4 đinh tán chống trầy xước khi đặt để.',
    ],
    [
      "Ký duyên nghệ nhân",
      "Quét mã QR đính kèm để xem câu chuyện về nhóm nghệ nhân người Thái tại Mai Châu đã dệt nên họa tiết trên chiếc túi này.",
    ],
    [
      "Chăm sóc & Bảo quản",
      "Sản phẩm đi kèm đặc quyền Refolks Care – Miễn phí bảo dưỡng, thay khóa/quai trong 1 năm đầu. (Khuyến nghị: Chỉ giặt khô hoặc dùng khăn ẩm lau nhẹ bề mặt vải canvas, không chà xát mạnh lên phần khăn lụa dệt họa tiết).",
    ],
  ],
  en: [
    [
      "Transparent Materials",
      "Exterior shell combines 70% premium shape-retaining canvas and 30% upcycled fabric. Interior lining is made from 100% soft, anti-scratch recycled woven fabric.",
    ],
    [
      "Maximum Functionality",
      'Padded protective compartment fits up to 15.6" laptops; upright internal water bottle holder; hidden zipped pocket for personal valuables. Base reinforced with 4 metal studs to prevent wear and scratches.',
    ],
    [
      "Artisan Signature",
      "Scan the included QR code to discover the story of the Thai artisan community in Mai Chau who hand-wove the patterns on your tote.",
    ],
    [
      "Care & Maintenance",
      "Includes exclusive Refolks Care membership—enjoy 1-year complimentary maintenance, zipper, and strap replacements. (Recommendation: Dry clean or gently wipe canvas surfaces with a damp cloth; avoid harsh scrubbing on the pattern-woven silk scarf).",
    ],
  ],
} as const;
