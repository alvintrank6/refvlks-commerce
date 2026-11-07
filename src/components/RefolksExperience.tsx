"use client";
/* eslint-disable @next/next/no-img-element -- Images are locally optimized WebP assets with CSS aspect ratios. */

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUp,
  Check,
  ChevronDown,
  Mail,
  Menu,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  UserRound,
  X,
  MessageCircle,
  MapPin,
  Camera,
} from "lucide-react";
import {
  accordion,
  colours,
  copy,
  img,
  products,
  type Lang,
  type Product,
} from "../refolks/data";
import "./refolks.css";

type CartItem = { id: string; qty: number; color: string; personal: boolean };
type Account = { name: string; email: string };
type Order = { id: string; date: string; total: number; items: CartItem[] };
type Route = { page: string; id?: string };
const base = (lang: Lang) => `/${lang}`;
const currency = (n: number) => `${new Intl.NumberFormat("vi-VN").format(n)}₫`;
const readStorage = <T,>(key: string, fallback: T): T => {
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
};
const ui = {
  vi: {
    search: "Tìm kiếm",
    account: "Tài khoản",
    bag: "Giỏ hàng",
    close: "Đóng",
    shop: "Cửa hàng",
    all: "Tất cả sản phẩm",
    featured: "Sản phẩm nổi bật",
    explore: "Khám phá",
    readMore: "Đọc thêm",
    readLess: "Thu gọn",
    about: "Câu chuyện Refolks",
    heritage: "Di sản trong từng đường dệt",
    new: "Mới",
    news: "Tin tức & sự kiện mới nhất",
    viewAll: "Xem tất cả",
    community: "Hành trình tuần hoàn & sứ mệnh cộng đồng",
    donate: "Quyên góp áo cũ",
    events: "Tham gia sự kiện",
    discover: "Tìm hiểu thêm",
    filter: "Bộ lọc",
    sort: "Sắp xếp",
    shown: "sản phẩm",
    availability: "Tình trạng",
    inStock: "Còn hàng",
    colour: "Màu sắc",
    material: "Chất liệu",
    personalisation: "Cá nhân hóa",
    clear: "Xóa tất cả",
    apply: "Áp dụng",
    lowHigh: "Giá thấp đến cao",
    highLow: "Giá cao đến thấp",
    newest: "Mới nhất",
    recommended: "Nổi bật",
    priceSoon: "Liên hệ để biết giá",
    details: "Xem chi tiết",
    add: "Thêm vào giỏ",
    quantity: "Số lượng",
    size: "Kích thước & công năng",
    recommendation: "Có thể bạn cũng thích",
    subtotal: "Tạm tính",
    checkout: "Thanh toán ngay",
    viewBag: "Xem giỏ hàng",
    empty: "Giỏ hàng của bạn đang trống",
    keepShopping: "Tiếp tục mua sắm",
    remove: "Xóa",
    freeship: "Phí giao hàng: Hà Nội 30.000₫ · tỉnh khác 40.000₫",
    code: "Mã giảm giá",
    codePlaceholder: "Nhập mã",
    mockPay: "Thanh toán nhanh chỉ là bản demo.",
    signIn: "Đăng nhập",
    signUp: "Tạo tài khoản",
    signOut: "Đăng xuất",
    signPrompt: "Đăng nhập hoặc tạo tài khoản",
    email: "Email",
    password: "Mật khẩu",
    name: "Họ và tên",
    newsletter: "Nhận tin tức và ưu đãi",
    orders: "Đơn hàng",
    profile: "Hồ sơ",
    member: "Hạng thành viên",
    progress: "Còn 1.200.000₫ để lên Platinum",
    manage: "Quản lý tài khoản",
    vouchers: "Kho voucher cho bạn",
    getCode: "Lấy mã",
    copied: "Đã sao chép",
    donationMethod: "Phương thức gửi",
    store: "Gửi tại Store Hoàn Kiếm",
    pickup: "Hẹn lấy tận nơi",
    phone: "Số điện thoại",
    address: "Địa chỉ",
    estimate: "Số lượng/kg ước tính",
    date: "Ngày hẹn",
    note: "Ghi chú",
    submit: "Gửi thông tin",
    successDonate: "Cảm ơn bạn! Mã DONATE15 đã được thêm vào kho voucher.",
    seats: "20 chỗ",
    register: "Đăng ký tham gia",
    people: "Số người",
    successEvent: "Đã ghi nhận đăng ký của bạn.",
    chat: "Chat",
    chatHello: "Xin chào! Refolks có thể giúp gì cho bạn?",
    chatIdeas: ["Chọn túi", "Đổi trả", "Quyên góp", "Workshop", "Phí ship"],
    chatReplies: [
      "Mẫu Everyday Laptop Tote phù hợp cho ngày làm việc và có ngăn laptop 15,6 inch. Bạn có thể xem các góc túi trong trang sản phẩm.",
      "Refolks Care hỗ trợ bảo dưỡng, thay khóa và quai trong năm đầu cho mẫu Everyday Laptop Tote.",
      "Bạn có thể gửi quần áo tại Store Hoàn Kiếm hoặc điền form hẹn lấy trong trang Cộng đồng.",
      "Workshop Tái sinh nếp vải có tối đa 20 chỗ. Bạn có thể đăng ký trong mục Sự kiện.",
      "Phí đề xuất là 30.000₫ tại Hà Nội và 40.000₫ ở tỉnh thành khác.",
    ],
    chatAnswer:
      "Bạn có thể xem sản phẩm, chính sách và sự kiện ngay trên website. Để được tư vấn riêng, hãy gửi email cho Refolks khi thông tin liên hệ chính thức được cập nhật.",
    contact: "Liên hệ",
    policies: "Chính sách",
    information: "Thông tin",
    newsletterTitle: "Bản tin",
    newsletterDesc: "Nhận câu chuyện mới từ Refolks.",
    footerThanks: "Di sản sống cùng nhịp phố.",
    map: "Khu vực Hoàn Kiếm, Hà Nội",
    demoContact: "Thông tin liên hệ sẽ được cập nhật.",
    continue: "Tiếp tục",
    shipping: "Phí giao hàng",
    total: "Tổng cộng",
    placed: "Đơn hàng demo đã được ghi nhận.",
    demoNotice:
      "Đây là bản demo. Không thu tiền và không gửi đơn hàng tới Refolks.",
    demoAccount: "Tài khoản demo được lưu trên trình duyệt này.",
    region: "Khu vực giao hàng",
    hanoi: "Hà Nội · 30.000₫",
    otherRegion: "Tỉnh thành khác · 40.000₫",
    newsletterDone: "Cảm ơn bạn đã đăng ký nhận tin.",
    signInFirst: "Đăng nhập để xem tài khoản và voucher.",
    customize: "Cá nhân hóa",
    zoom: "Phóng to ảnh",
    view360: "Xem các góc túi",
    lookbook: "Lookbook",
    care: "Chăm sóc sản phẩm",
    menu: "Mở menu",
    home: "Trang chủ",
    aboutUs: "Về chúng tôi",
    comingSoon: "Đang cập nhật",
  },
  en: {
    search: "Search",
    account: "Account",
    bag: "Bag",
    close: "Close",
    shop: "Shop",
    all: "All products",
    featured: "Featured pieces",
    explore: "Explore",
    readMore: "Read more",
    readLess: "Read less",
    about: "The Refolks story",
    heritage: "Heritage in every weave",
    new: "New",
    news: "Latest news & events",
    viewAll: "View all",
    community: "A circular journey & community mission",
    donate: "Donate clothing",
    events: "Join an event",
    discover: "Discover more",
    filter: "Filter",
    sort: "Sort by",
    shown: "products",
    availability: "Availability",
    inStock: "In stock",
    colour: "Colour",
    material: "Material",
    personalisation: "Personalisation",
    clear: "Clear all",
    apply: "Apply",
    lowHigh: "Price: low to high",
    highLow: "Price: high to low",
    newest: "Newest",
    recommended: "Featured",
    priceSoon: "Enquire for price",
    details: "View details",
    add: "Add to bag",
    quantity: "Quantity",
    size: "Size & function",
    recommendation: "You may also like",
    subtotal: "Subtotal",
    checkout: "Checkout now",
    viewBag: "View bag",
    empty: "Your bag is empty",
    keepShopping: "Continue shopping",
    remove: "Remove",
    freeship: "Shipping: Hanoi 30,000₫ · other provinces 40,000₫",
    code: "Discount code",
    codePlaceholder: "Enter code",
    mockPay: "Express payment is a demo.",
    signIn: "Sign in",
    signUp: "Create account",
    signOut: "Sign out",
    signPrompt: "Sign in or create an account",
    email: "Email",
    password: "Password",
    name: "Full name",
    newsletter: "Receive news and offers",
    orders: "Orders",
    profile: "Profile",
    member: "Member tier",
    progress: "1,200,000₫ to Platinum",
    manage: "Manage account",
    vouchers: "Your vouchers",
    getCode: "Get code",
    copied: "Copied",
    donationMethod: "Donation method",
    store: "Drop off at Hoan Kiem Store",
    pickup: "Arrange pickup",
    phone: "Phone",
    address: "Address",
    estimate: "Approximate quantity/kg",
    date: "Preferred date",
    note: "Notes",
    submit: "Submit",
    successDonate: "Thank you! DONATE15 is now in your vouchers.",
    seats: "20 seats",
    register: "Register",
    people: "People",
    successEvent: "Your registration has been received.",
    chat: "Chat",
    chatHello: "Hello! How can Refolks help?",
    chatIdeas: ["Choose a bag", "Returns", "Donate", "Workshop", "Shipping"],
    chatReplies: [
      "The Everyday Laptop Tote is designed for workdays with a padded 15.6-inch laptop compartment. Explore its angles on the product page.",
      "Refolks Care covers maintenance, zippers and straps during the first year for the Everyday Laptop Tote.",
      "Drop clothing off at the Hoan Kiem Store or use the pickup form in Community.",
      "The Giving Fabric New Life workshop has a 20-seat limit. Register in Events.",
      "Proposed shipping is 30,000₫ in Hanoi and 40,000₫ elsewhere.",
    ],
    chatAnswer:
      "Explore products, policies and events on this website. For tailored advice, contact Refolks once its official email is confirmed.",
    contact: "Contact",
    policies: "Policies",
    information: "Information",
    newsletterTitle: "Newsletter",
    newsletterDesc: "A new story from Refolks, in your inbox.",
    footerThanks: "Heritage woven into city life.",
    map: "Hoan Kiem district, Hanoi",
    demoContact: "Contact details coming soon.",
    continue: "Continue",
    shipping: "Shipping",
    total: "Total",
    placed: "Your demo order has been recorded.",
    demoNotice:
      "This is a demo. No payment is collected and no order is sent to Refolks.",
    demoAccount: "Demo account details are stored in this browser.",
    region: "Shipping region",
    hanoi: "Hanoi · 30,000₫",
    otherRegion: "Other provinces · 40,000₫",
    newsletterDone: "Thank you for subscribing.",
    signInFirst: "Sign in to see your account and vouchers.",
    customize: "Personalise",
    zoom: "Zoom image",
    view360: "See every angle",
    lookbook: "Lookbook",
    care: "Product care",
    menu: "Open menu",
    home: "Home",
    aboutUs: "About us",
    comingSoon: "Coming soon",
  },
} as const;

function routeFromPath(path: string): Route {
  const parts = path.split("/").filter(Boolean).slice(1);
  const first = parts[0] || "";
  if (!first) return { page: "home" };
  if (
    ["shop", "cua-hang", "women", "men", "collections", "gifts"].includes(first)
  )
    return { page: "shop" };
  if (["products", "san-pham"].includes(first))
    return { page: "product", id: parts[1] };
  if (
    ["community", "cong-dong", "donation-event", "su-kien-quyen-gop"].includes(
      first,
    )
  )
    return { page: "community" };
  if (["about", "ve-chung-toi", "craft", "thu-cong"].includes(first))
    return { page: "about" };
  if (["journal", "news", "tin-tuc"].includes(first))
    return { page: "journal", id: parts[1] };
  if (["account", "tai-khoan", "orders", "don-hang"].includes(first))
    return { page: "account" };
  if (["cart", "gio-hang"].includes(first)) return { page: "cart" };
  if (["checkout", "thanh-toan"].includes(first)) return { page: "checkout" };
  return { page: "home" };
}

export function RefolksExperience({
  initialLocale,
  initialPath,
  initialQuery,
}: {
  initialLocale: Lang;
  initialPath: string;
  initialQuery: string;
}) {
  const [lang, setLang] = useState<Lang>(initialLocale);
  const [route, setRoute] = useState<Route>(() => routeFromPath(initialPath));
  const [queryString, setQueryString] = useState(initialQuery);
  const [menu, setMenu] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const [solid, setSolid] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [bagOpen, setBagOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatChoice, setChatChoice] = useState<number | null>(null);
  const [modal, setModal] = useState<"event" | "zoom" | null>(null);
  const [zoomImage, setZoomImage] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [donated, setDonated] = useState(false);
  const [didHydrate, setDidHydrate] = useState(false);
  const [account, setAccount] = useState<Account | null>(null);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [color, setColor] = useState("brown");
  const [personal, setPersonal] = useState(false);
  const [sort, setSort] = useState("recommended");
  const [availability, setAvailability] = useState(false);
  const [material, setMaterial] = useState<string[]>([]);
  const [filterColors, setFilterColors] = useState<string[]>([]);
  const [filterPersonal, setFilterPersonal] = useState(false);
  const [readMore, setReadMore] = useState(false);
  const [donationMethod, setDonationMethod] = useState<"store" | "pickup">(
    "store",
  );
  const [toast, setToast] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [shippingRegion, setShippingRegion] = useState<"hanoi" | "other">(
    "hanoi",
  );
  const [scrollY, setScrollY] = useState(0);
  const dialogRef = useRef<HTMLDivElement>(null);
  const c = copy[lang],
    u = ui[lang];
  const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce(
    (sum, item) =>
      sum + (products.find((p) => p.id === item.id)?.price || 0) * item.qty,
    0,
  );
  const shippingFee = shippingRegion === "hanoi" ? 30000 : 40000;
  const product = products.find((p) => p.id === route.id) || products[0];
  // DEMO content: journal cards use the supplied official brand and event copy.
  const journalItems = [
    {
      id: "ban-lac",
      tag: "CRAFT",
      image: "artisan-weaving-03",
      title: c.aboutTitle,
      body: c.aboutStory,
    },
    {
      id: "workshop",
      tag: "WORKSHOP",
      image: "workshop-loom",
      title: c.eventName,
      body: [c.eventStory],
    },
    {
      id: "community",
      tag: "COMMUNITY",
      image: "community-gathering",
      title: c.communityTitle,
      body: [c.communitySub, c.donationStory],
    },
  ];

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setCart(readStorage("refolks-cart", []));
      setOrders(readStorage("refolks-orders", []));
      setDonated(readStorage("refolks-donated", false));
      setAccount(readStorage("refolks-account", null));
      requestAnimationFrame(() => {
        setDidHydrate(true);
        document.querySelector(".rf-site")?.setAttribute("data-ready", "true");
      });
    });
    const onPop = () => {
      setRoute(routeFromPath(location.pathname));
      setQueryString(location.search);
      setLang(location.pathname.startsWith("/vi") ? "vi" : "en");
    };
    const onScroll = () => {
      setScrollY(window.scrollY);
      setSolid(window.scrollY > 48);
    };
    window.addEventListener("popstate", onPop);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
  useEffect(() => {
    if (didHydrate) localStorage.setItem("refolks-cart", JSON.stringify(cart));
  }, [cart, didHydrate]);
  useEffect(() => {
    if (didHydrate)
      localStorage.setItem("refolks-orders", JSON.stringify(orders));
  }, [orders, didHydrate]);
  useEffect(() => {
    if (didHydrate)
      localStorage.setItem("refolks-donated", JSON.stringify(donated));
  }, [donated, didHydrate]);
  useEffect(() => {
    if (didHydrate) {
      if (account)
        localStorage.setItem("refolks-account", JSON.stringify(account));
      else localStorage.removeItem("refolks-account");
    }
  }, [account, didHydrate]);
  useEffect(() => {
    const escape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(null);
        setMobile(false);
        setFilterOpen(false);
        setBagOpen(false);
        setAccountOpen(false);
        setChatOpen(false);
        setModal(null);
        setSearchOpen(false);
      }
    };
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, []);
  useEffect(() => {
    if (!modal && !bagOpen && !filterOpen && !mobile) return;
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusable =
      dialogRef.current?.querySelector<HTMLElement>("button, input, a");
    focusable?.focus();
    return () => {
      document.body.style.overflow = old;
    };
  }, [modal, bagOpen, filterOpen, mobile]);
  useEffect(() => {
    if (!modal && !bagOpen && !filterOpen && !mobile && !accountOpen) return;
    const trap = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || !dialogRef.current) return;
      const elements = [
        ...dialogRef.current.querySelectorAll<HTMLElement>(
          "button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), a[href], summary",
        ),
      ].filter((el) => el.getClientRects().length > 0);
      if (!elements.length) return;
      const first = elements[0],
        last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", trap);
    return () => document.removeEventListener("keydown", trap);
  }, [modal, bagOpen, filterOpen, mobile, accountOpen]);
  useEffect(() => {
    const id = toast ? window.setTimeout(() => setToast(""), 4000) : undefined;
    return () => {
      if (id) window.clearTimeout(id);
    };
  }, [toast]);
  const navigate = (path: string) => {
    history.pushState({}, "", path);
    setRoute(routeFromPath(path));
    setQueryString(new URL(path, location.origin).search);
    setMenu(null);
    setMobile(false);
    setFilterOpen(false);
    setBagOpen(false);
    setAccountOpen(false);
    setActiveImage(0);
    setQty(1);
    setReadMore(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const switchLang = (next: Lang) => {
    if (next === lang) return;
    const path = location.pathname.replace(/^\/(en|vi)/, `/${next}`);
    history.replaceState({}, "", path + location.search + location.hash);
    setLang(next);
    document.documentElement.lang = next;
    localStorage.setItem("refolks-lang", next);
  };
  const showProduct = (p: Product) =>
    navigate(`${base(lang)}/products/${p.id}`);
  const showShop = (query = "") => navigate(`${base(lang)}/shop${query}`);
  const addToBag = (p: Product, count = 1) => {
    if (p.price === null) {
      setToast(u.priceSoon);
      return;
    }
    setCart((current) => {
      const key = current.findIndex(
        (item) =>
          item.id === p.id &&
          item.color === color &&
          item.personal === personal,
      );
      if (key < 0)
        return [...current, { id: p.id, qty: count, color, personal }];
      return current.map((item, index) =>
        index === key ? { ...item, qty: item.qty + count } : item,
      );
    });
    setBagOpen(true);
  };
  const updateCart = (index: number, change: number) =>
    setCart((current) =>
      current.flatMap((item, i) =>
        i === index
          ? item.qty + change > 0
            ? [{ ...item, qty: item.qty + change }]
            : []
          : [item],
      ),
    );
  const visible = useMemo(() => {
    const query = new URLSearchParams(queryString);
    let list = products.filter((p) => {
      const gender = query.get("gender");
      const collection = query.get("collection");
      const category = query.get("category");
      const searchTerm = query.get("q");
      return (
        (!gender || (p.gender as readonly string[]).includes(gender)) &&
        (!collection || p.collection === collection) &&
        (!category || p.category === category) &&
        (!searchTerm ||
          p.name[lang].toLowerCase().includes(searchTerm.toLowerCase()))
      );
    });
    if (availability) list = list.filter((p) => p.stock > 0);
    if (filterColors.length)
      list = list.filter((p) =>
        p.colors.some((col) => filterColors.includes(col)),
      );
    if (material.length)
      list = list.filter((p) => p.material.some((m) => material.includes(m)));
    if (filterPersonal) list = list.filter((p) => p.price !== null);
    if (sort === "lowHigh")
      list = [...list].sort(
        (a, b) => (a.price ?? Infinity) - (b.price ?? Infinity),
      );
    if (sort === "highLow")
      list = [...list].sort((a, b) => (b.price ?? -1) - (a.price ?? -1));
    if (sort === "newest") list = [...list].reverse();
    return list;
  }, [
    queryString,
    lang,
    availability,
    filterColors,
    material,
    filterPersonal,
    sort,
  ]);
  const navItems = [
    { key: "about", label: c.nav[0], href: `${base(lang)}/about` },
    { key: "women", label: c.nav[1], href: `${base(lang)}/shop?gender=women` },
    { key: "men", label: c.nav[2], href: `${base(lang)}/shop?gender=men` },
    { key: "collections", label: c.nav[3], href: `${base(lang)}/shop` },
    {
      key: "gifts",
      label: c.nav[4],
      href: `${base(lang)}/shop?category=accessory`,
    },
    { key: "community", label: c.nav[5], href: `${base(lang)}/community` },
  ];
  const mega = (key: string) => {
    if (key === "about")
      return [
        [
          u.about,
          [
            ["Our Story", `${base(lang)}/about`],
            ["Sustainability", `${base(lang)}/about#sustainability`],
            ["Our Artisans", `${base(lang)}/about#artisans`],
            [u.news, `${base(lang)}/journal`],
            [u.contact, `${base(lang)}/about#contact`],
          ],
        ],
      ];
    if (key === "community")
      return [
        [
          u.account,
          [
            [u.vouchers, `${base(lang)}/community#account`],
            [u.donate, `${base(lang)}/community#donation`],
            [u.events, `${base(lang)}/community#events`],
          ],
        ],
      ];
    if (key === "collections")
      return [
        [
          c.nav[3],
          [
            ["Mẫu 1 / Model 1", `${base(lang)}/shop?collection=model-1`],
            ["Mẫu 2 / Model 2", `${base(lang)}/shop?collection=model-2`],
            ["Mẫu 3 / Model 3", `${base(lang)}/shop?collection=model-3`],
          ],
        ],
      ];
    if (key === "gifts")
      return [
        [
          c.nav[4],
          [
            [
              lang === "vi" ? "Tất cả phụ kiện" : "All accessories",
              `${base(lang)}/shop?category=accessory`,
            ],
            [
              lang === "vi" ? "Móc khóa Rồng" : "Dragon Keychain",
              `${base(lang)}/products/dragon-keychain`,
            ],
            [
              lang === "vi" ? "Móc khóa Hoa Cọ" : "Palm Flower Keychain",
              `${base(lang)}/products/palm-keychain`,
            ],
          ],
        ],
      ];
    if (key === "men")
      return [
        [
          lang === "vi" ? "Túi nam" : "Men's bags",
          [
            [u.all, `${base(lang)}/shop?gender=men`],
            [
              lang === "vi" ? "Túi công sở" : "Work bags",
              `${base(lang)}/shop?gender=men&category=tote`,
            ],
          ],
        ],
        [
          lang === "vi" ? "Phụ kiện nam" : "Men's accessories",
          [["Wallets / Cardholders", `${base(lang)}/shop?category=accessory`]],
        ],
      ];
    return [
      [
        lang === "vi" ? "Túi nữ" : "Women's bags",
        [
          [u.all, `${base(lang)}/shop?gender=women`],
          [
            lang === "vi" ? "Túi tote" : "Tote bags",
            `${base(lang)}/shop?gender=women&category=tote`,
          ],
          [
            lang === "vi" ? "Túi đeo chéo" : "Crossbody bags",
            `${base(lang)}/shop?gender=women&category=crossbody`,
          ],
        ],
      ],
      [
        lang === "vi" ? "Trải nghiệm" : "Experiences",
        [[c.eventsTitle, `${base(lang)}/community#events`]],
      ],
    ];
  };
  const setAnchor = (path: string) => {
    const [url, hash] = path.split("#");
    navigate(url);
    if (hash)
      setTimeout(
        () =>
          document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" }),
        50,
      );
  };
  const productCard = (p: Product) => (
    <article className="rf-product-card" key={p.id}>
      <button
        className="rf-card-media"
        onClick={() => showProduct(p)}
        aria-label={p.name[lang]}
      >
        <img
          className="rf-card-main"
          src={p.images[0]}
          alt={p.name[lang]}
          loading="lazy"
        />
        <img
          className="rf-card-hover"
          src={p.lifestyle}
          alt={p.name[lang]}
          loading="lazy"
        />
        <span className="rf-card-badge">{u.new}</span>
      </button>
      <div className="rf-card-meta">
        <button className="rf-card-name" onClick={() => showProduct(p)}>
          {p.name[lang]}
        </button>
        <div className="rf-swatches">
          {p.colors.map((cl) => (
            <span
              key={cl}
              style={{ background: colours[cl].hex }}
              title={colours[cl].name[lang]}
            />
          ))}
        </div>
        <div className="rf-card-bottom">
          <strong>{p.price === null ? u.priceSoon : currency(p.price)}</strong>
          <button aria-label={u.add} onClick={() => addToBag(p)}>
            <Plus size={18} />
          </button>
        </div>
      </div>
    </article>
  );
  const field = (label: string, type = "text", required = true) => (
    <label className="rf-field" key={label}>
      <span>{label}</span>
      <input
        type={type}
        name={label}
        required={required}
        min={type === "number" ? 1 : undefined}
      />
    </label>
  );
  const closeOverlays = () => {
    setMobile(false);
    setFilterOpen(false);
    setBagOpen(false);
    setAccountOpen(false);
    setModal(null);
    setSearchOpen(false);
  };

  return (
    <div className="rf-site">
      <header
        className={`rf-header ${route.page === "home" && !solid && !menu && !mobile ? "rf-header-clear" : "rf-header-solid"}`}
        onMouseLeave={() => setMenu(null)}
      >
        <div className="rf-header-inner">
          <button
            className="rf-icon rf-mobile-menu"
            aria-label={u.menu}
            onClick={() => setMobile(true)}
          >
            <Menu />
          </button>
          <nav className="rf-desktop-nav" aria-label="Main">
            {navItems.map((item) => (
              <button
                key={item.key}
                onMouseEnter={() => setMenu(item.key)}
                onFocus={() => setMenu(item.key)}
                onClick={() => navigate(item.href)}
              >
                {item.label}
                <ChevronDown size={12} />
              </button>
            ))}
          </nav>
          <button
            className="rf-logo"
            onClick={() => navigate(base(lang))}
            aria-label="Refolks home"
          >
            <img
              src={
                route.page === "home" && !solid && !menu && !mobile
                  ? "/images/refolks/logo-light.png"
                  : "/images/refolks/logo-dark.png"
              }
              alt="Refolks"
            />
          </button>
          <div className="rf-header-actions">
            <div className="rf-lang">
              <button
                className={lang === "vi" ? "active" : ""}
                onClick={() => switchLang("vi")}
              >
                VI
              </button>
              <span>/</span>
              <button
                className={lang === "en" ? "active" : ""}
                onClick={() => switchLang("en")}
              >
                EN
              </button>
            </div>
            <button
              className="rf-icon rf-desktop-action"
              aria-label={u.search}
              onClick={() => setSearchOpen(true)}
            >
              <Search size={21} />
            </button>
            <button
              className="rf-icon"
              aria-label={u.account}
              onClick={() => setAccountOpen(!accountOpen)}
            >
              <UserRound size={21} />
            </button>
            <button
              className="rf-icon rf-bag-trigger"
              aria-label={u.bag}
              onClick={() => setBagOpen(true)}
            >
              <ShoppingBag size={21} />
              {totalCount > 0 && <span>{totalCount}</span>}
            </button>
          </div>
        </div>
        {menu && (
          <div className="rf-mega" onMouseEnter={() => setMenu(menu)}>
            <div className="rf-mega-cols">
              {mega(menu).map(([heading, links]) => (
                <div key={heading as string}>
                  <h3>{heading as string}</h3>
                  {(links as string[][]).map(([label, href]) => (
                    <button key={label} onClick={() => setAnchor(href)}>
                      {label}
                    </button>
                  ))}
                </div>
              ))}
            </div>
            <button
              className="rf-mega-feature"
              onClick={() =>
                showShop(
                  menu === "men" || menu === "women" ? `?gender=${menu}` : "",
                )
              }
            >
              <img
                src={img(
                  menu === "women"
                    ? "tote-02-front"
                    : menu === "men"
                      ? "tote-01-front"
                      : "bag-03-front",
                )}
                alt=""
              />
              <span>
                {u.explore} <ArrowRight size={15} />
              </span>
            </button>
          </div>
        )}
      </header>

      {route.page === "home" && (
        <main>
          <section className="rf-hero">
            <img src={img("tote-02-lifestyle")} alt={products[0].name[lang]} />
            <div className="rf-hero-shade" />
            <div className="rf-hero-copy">
              <span className="rf-eyebrow">REFOLKS · HERITAGE IN MOTION</span>
              <h1>{c.heroTitle}</h1>
              <p>{c.heroSub}</p>
              <button
                className="rf-button rf-button-light"
                onClick={() => showShop()}
              >
                {c.heroCta}
                <ArrowRight size={18} />
              </button>
            </div>
            <button
              className="rf-hero-scroll"
              onClick={() =>
                document
                  .getElementById("rf-featured")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              SCROLL TO EXPLORE ↓
            </button>
          </section>
          <div
            className="rf-marquee"
            aria-label="URBAN FUNCTION. HERITAGE CRAFT. VERIFIED IMPACT."
          >
            <div>
              {Array(4)
                .fill("URBAN FUNCTION. HERITAGE CRAFT. VERIFIED IMPACT.")
                .map((s, i) => (
                  <span key={i}>{s} &nbsp; ✦ &nbsp; </span>
                ))}
            </div>
          </div>
          <section id="rf-featured" className="rf-section rf-featured">
            <div className="rf-section-head">
              <div>
                <span className="rf-eyebrow">01 / {u.explore}</span>
                <h2>{u.featured}</h2>
              </div>
              <button className="rf-text-link" onClick={() => showShop()}>
                {u.viewAll}
                <ArrowRight size={17} />
              </button>
            </div>
            <div className="rf-category-grid">
              {[
                [
                  lang === "vi" ? "Túi nữ" : "Women's bags",
                  "tote-02-front",
                  "?gender=women",
                ],
                [
                  lang === "vi" ? "Túi nam" : "Men's bags",
                  "tote-01-front",
                  "?gender=men",
                ],
                [
                  lang === "vi" ? "Phụ kiện & Quà tặng" : "Accessories & gifts",
                  "keychain-dragon",
                  "?category=accessory",
                ],
              ].map(([label, image, query], i) => (
                <button
                  className="rf-category"
                  key={label}
                  onClick={() => showShop(query)}
                >
                  <img src={img(image)} alt="" loading="lazy" />
                  <span>
                    {label}
                    <ArrowRight size={18} />
                  </span>
                  <small>
                    {
                      [
                        lang === "vi" ? "Tote · Đeo chéo" : "Tote · Crossbody",
                        lang === "vi" ? "Tote công sở" : "Work tote",
                        lang === "vi"
                          ? "Móc khóa Rồng · Hoa Cọ"
                          : "Dragon · Palm keychains",
                      ][i]
                    }
                  </small>
                </button>
              ))}
            </div>
          </section>
          <section className="rf-section rf-products-home">
            <div className="rf-section-head">
              <div>
                <span className="rf-eyebrow">02 / SHOP</span>
                <h2>{c.shopTitle}</h2>
                <p>{c.shopIntro}</p>
              </div>
              <button className="rf-text-link" onClick={() => showShop()}>
                {u.viewAll}
                <ArrowRight size={17} />
              </button>
            </div>
            <div className="rf-product-grid">
              {products.slice(0, 3).map(productCard)}
            </div>
          </section>
          <section className="rf-story">
            <div className="rf-story-copy">
              <span className="rf-eyebrow">03 / {u.about}</span>
              <h2>{c.aboutTitle}</h2>
              {c.aboutStory.slice(0, 2).map((p) => (
                <p key={p.slice(0, 20)}>{p}</p>
              ))}
              <button
                className="rf-text-link"
                onClick={() => navigate(`${base(lang)}/about`)}
              >
                {u.discover}
                <ArrowRight size={18} />
              </button>
            </div>
            <img
              src={img("artisan-weaving-01")}
              alt={
                lang === "vi"
                  ? "Nghệ nhân dệt tại Mai Châu"
                  : "Artisan weaving in Mai Chau"
              }
              loading="lazy"
            />
          </section>
          <section className="rf-section rf-usps">
            <div className="rf-section-head">
              <div>
                <span className="rf-eyebrow">04 / REFOLKS</span>
                <h2>{u.heritage}</h2>
              </div>
            </div>
            <div className="rf-usp-grid">
              {c.usps.map((text, i) => (
                <details key={i} className="rf-usp">
                  <summary>
                    <img
                      src={img(
                        [
                          "artisan-weaving-02",
                          "textile-workshop",
                          "tote-02-inside",
                        ][i],
                      )}
                      alt=""
                      loading="lazy"
                    />
                    <span>
                      <small>0{i + 1}</small>
                      <strong>{c.uspTitles[i]}</strong>
                      <Plus size={20} />
                    </span>
                    <p className="rf-usp-overlay">{text}</p>
                  </summary>
                  <p>{text}</p>
                </details>
              ))}
            </div>
          </section>
          <section className="rf-community-teaser">
            <div>
              <span className="rf-eyebrow">05 / COMMUNITY</span>
              <h2>{u.community}</h2>
              <p>{c.communitySub}</p>
              <div className="rf-buttons">
                <button
                  className="rf-button"
                  onClick={() => setAnchor(`${base(lang)}/community#donation`)}
                >
                  {u.donate}
                  <ArrowRight size={17} />
                </button>
                <button
                  className="rf-button rf-button-outline"
                  onClick={() => setAnchor(`${base(lang)}/community#events`)}
                >
                  {u.events}
                  <ArrowRight size={17} />
                </button>
              </div>
            </div>
            <img
              src={img("community-gathering")}
              alt={
                lang === "vi"
                  ? "Cộng đồng cùng tìm hiểu nghề dệt"
                  : "Community textile gathering"
              }
              loading="lazy"
            />
          </section>
          <section className="rf-section rf-news">
            <div className="rf-section-head">
              <div>
                <span className="rf-eyebrow">06 / JOURNAL</span>
                <h2>{u.news}</h2>
              </div>
              <button
                className="rf-text-link"
                onClick={() => navigate(`${base(lang)}/journal`)}
              >
                {u.viewAll}
                <ArrowRight size={17} />
              </button>
            </div>
            <div className="rf-news-grid">
              {journalItems.map((article) => (
                <button
                  key={article.id}
                  onClick={() =>
                    navigate(`${base(lang)}/journal/${article.id}`)
                  }
                >
                  <img src={img(article.image)} alt="" loading="lazy" />
                  <small>{article.tag}</small>
                  <h3>{article.title}</h3>
                  <span>
                    {u.readMore} <ArrowRight size={15} />
                  </span>
                </button>
              ))}
            </div>
          </section>
        </main>
      )}

      {route.page === "journal" && (
        <main className="rf-page rf-journal">
          <div className="rf-breadcrumb">
            <button onClick={() => navigate(base(lang))}>{u.home}</button> /{" "}
            <button onClick={() => navigate(`${base(lang)}/journal`)}>
              {u.news}
            </button>
          </div>
          {route.id && journalItems.some((item) => item.id === route.id) ? (
            (() => {
              const article = journalItems.find(
                (item) => item.id === route.id,
              )!;
              return (
                <article className="rf-article">
                  <span className="rf-eyebrow">
                    {article.tag} / REFOLKS JOURNAL
                  </span>
                  <h1>{article.title}</h1>
                  <img src={img(article.image)} alt="" />
                  <div>
                    {article.body.map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                  </div>
                  <button
                    className="rf-text-link"
                    onClick={() => navigate(`${base(lang)}/journal`)}
                  >
                    {u.viewAll}
                    <ArrowRight size={16} />
                  </button>
                </article>
              );
            })()
          ) : (
            <section className="rf-section">
              <span className="rf-eyebrow">REFOLKS JOURNAL</span>
              <h1>{u.news}</h1>
              <div className="rf-news-grid">
                {journalItems.map((article) => (
                  <button
                    key={article.id}
                    onClick={() =>
                      navigate(`${base(lang)}/journal/${article.id}`)
                    }
                  >
                    <img src={img(article.image)} alt="" loading="lazy" />
                    <small>{article.tag}</small>
                    <h3>{article.title}</h3>
                    <span>
                      {u.readMore}
                      <ArrowRight size={15} />
                    </span>
                  </button>
                ))}
              </div>
            </section>
          )}
        </main>
      )}

      {route.page === "shop" && (
        <main className="rf-page rf-shop">
          <div className="rf-breadcrumb">
            <button onClick={() => navigate(base(lang))}>{u.home}</button> /{" "}
            {u.shop}
          </div>
          <div className="rf-shop-intro">
            <span className="rf-eyebrow">REFOLKS / COLLECTION</span>
            <h1>{c.shopTitle}</h1>
            <p>{c.shopIntro}</p>
            {readMore && <p>{c.aboutStory[4]}</p>}
            <button
              className="rf-text-link"
              onClick={() => setReadMore(!readMore)}
            >
              {readMore ? u.readLess : u.readMore}
              <ChevronDown size={15} />
            </button>
          </div>
          <div className="rf-shop-toolbar">
            <button onClick={() => setFilterOpen(true)}>
              <SlidersHorizontal size={18} />
              {u.filter} +
            </button>
            <span>
              {visible.length} {u.shown}
            </span>
            <label>
              {u.sort}
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="recommended">{u.recommended}</option>
                <option value="newest">{u.newest}</option>
                <option value="lowHigh">{u.lowHigh}</option>
                <option value="highLow">{u.highLow}</option>
              </select>
            </label>
          </div>
          <div className="rf-product-grid rf-shop-grid">
            {visible.map(productCard)}
          </div>
          {visible.length === 0 && (
            <div className="rf-empty">{u.comingSoon}</div>
          )}
          <div className="rf-shop-usps">
            {c.uspTitles.map((title, i) => (
              <div key={title}>
                <span>0{i + 1}</span>
                <h3>{title}</h3>
                <p>{c.usps[i]}</p>
              </div>
            ))}
          </div>
        </main>
      )}

      {route.page === "product" && (
        <main className="rf-page rf-pdp">
          <div className="rf-breadcrumb">
            <button onClick={() => navigate(base(lang))}>{u.home}</button> /{" "}
            <button onClick={() => showShop()}>{u.shop}</button> /{" "}
            {product.name[lang]}
          </div>
          <div className="rf-pdp-grid">
            <div className="rf-gallery">
              <div className="rf-main-image">
                <img
                  src={product.images[activeImage]}
                  alt={product.name[lang]}
                />
                <button
                  aria-label={u.zoom}
                  onClick={() => {
                    setZoomImage(product.images[activeImage]);
                    setModal("zoom");
                  }}
                >
                  <Plus size={22} />
                </button>
              </div>
              <div className="rf-thumbs">
                {product.images.map((src, i) => (
                  <button
                    key={src}
                    className={i === activeImage ? "selected" : ""}
                    onClick={() => setActiveImage(i)}
                    aria-label={`${u.view360} ${i + 1}`}
                  >
                    <img src={src} alt="" loading="lazy" />
                  </button>
                ))}
              </div>
              <button
                className="rf-text-link rf-angle"
                onClick={() =>
                  setActiveImage((activeImage + 1) % product.images.length)
                }
              >
                {u.view360}
                <ArrowRight size={16} />
              </button>
            </div>
            <div className="rf-pdp-info">
              <span className="rf-eyebrow">
                REFOLKS / {product.collection.toUpperCase()}
              </span>
              <h1>{product.name[lang]}</h1>
              <div className="rf-price">
                {product.price === null ? u.priceSoon : currency(product.price)}{" "}
                <small>★★★★★ &nbsp; 4.9</small>
              </div>
              <p>{product.short[lang]}</p>
              <div className="rf-pdp-swatches">
                <strong>{u.colour}</strong>
                <div>
                  {product.colors.map((cl) => (
                    <button
                      key={cl}
                      className={color === cl ? "selected" : ""}
                      aria-label={colours[cl].name[lang]}
                      onClick={() => setColor(cl)}
                      style={{ background: colours[cl].hex }}
                    />
                  ))}
                </div>
                <small>{colours[color]?.name[lang]}</small>
              </div>
              <label className="rf-toggle">
                <input
                  type="checkbox"
                  checked={personal}
                  onChange={(e) => setPersonal(e.target.checked)}
                />
                <span>{u.customize}</span>
              </label>
              <div className="rf-pdp-buy">
                <div className="rf-qty">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    aria-label="Decrease"
                  >
                    <Minus size={16} />
                  </button>
                  <span>{qty}</span>
                  <button onClick={() => setQty(qty + 1)} aria-label="Increase">
                    <Plus size={16} />
                  </button>
                </div>
                <button
                  className="rf-button"
                  onClick={() => addToBag(product, qty)}
                >
                  {product.price === null ? u.priceSoon : u.add}
                  <ArrowRight size={18} />
                </button>
              </div>
              <div className="rf-accordions">
                {(product.id === "everyday-laptop-tote"
                  ? accordion[lang]
                  : accordion[lang].map(
                      ([title]) => [title, u.comingSoon] as const,
                    )
                ).map(([title, body]) => (
                  <details key={title}>
                    <summary>
                      {title}
                      <Plus size={17} />
                    </summary>
                    <p>{body}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
          <section className="rf-pdp-lookbook">
            <img
              src={product.lifestyle}
              alt={product.name[lang]}
              loading="lazy"
            />
            <div>
              <span className="rf-eyebrow">{u.lookbook}</span>
              <h2>{c.aboutTitle}</h2>
              <p>{c.aboutStory[4]}</p>
            </div>
          </section>
          <section className="rf-section">
            <div className="rf-section-head">
              <h2>{u.recommendation}</h2>
            </div>
            <div className="rf-product-grid">
              {products.filter((p) => p.id !== product.id).map(productCard)}
            </div>
          </section>
        </main>
      )}

      {route.page === "about" && (
        <main className="rf-page rf-about">
          <div className="rf-about-hero">
            <div>
              <span className="rf-eyebrow">REFOLKS / {u.aboutUs}</span>
              <h1>{c.aboutTitle}</h1>
              <p>{c.aboutStory[0]}</p>
            </div>
            <img src={img("artisan-weaving-01")} alt="" />
          </div>
          <div className="rf-story-text">
            {c.aboutStory.slice(1).map((p) => (
              <p key={p.slice(0, 20)}>{p}</p>
            ))}
          </div>
          <section id="artisans" className="rf-story">
            <img src={img("artisan-weaving-03")} alt="" loading="lazy" />
            <div className="rf-story-copy">
              <span className="rf-eyebrow">OUR ARTISANS</span>
              <h2>{c.uspTitles[0]}</h2>
              <p>{c.usps[0]}</p>
            </div>
          </section>
          <section id="sustainability" className="rf-section rf-usps">
            <h2>{c.uspTitles[1]}</h2>
            <div className="rf-usp-grid">
              {c.usps.map((p, i) => (
                <div className="rf-usp-static" key={i}>
                  <img
                    src={img(
                      [
                        "artisan-weaving-02",
                        "textile-workshop",
                        "tote-02-inside",
                      ][i],
                    )}
                    alt=""
                    loading="lazy"
                  />
                  <h3>{c.uspTitles[i]}</h3>
                  <p>{p}</p>
                </div>
              ))}
            </div>
          </section>
        </main>
      )}

      {route.page === "community" && (
        <main className="rf-page rf-community">
          <div className="rf-community-hero">
            <span className="rf-eyebrow">REFOLKS / COMMUNITY</span>
            <h1>{c.communityTitle}</h1>
            <p>{c.communitySub}</p>
          </div>
          <section id="account" className="rf-section rf-community-account">
            <div className="rf-section-head">
              <div>
                <span className="rf-eyebrow">01 / COMMUNITY</span>
                <h2>
                  {u.account} & {u.vouchers}
                </h2>
              </div>
            </div>
            {account ? (
              <div className="rf-account-dashboard">
                <div className="rf-member">
                  <div className="rf-avatar">
                    {account.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3>{account.name}</h3>
                    <p>{account.email}</p>
                    <strong>Gold ★</strong>
                    <div className="rf-progress">
                      <span />
                    </div>
                    <small>{u.progress}</small>
                    <button
                      className="rf-text-link"
                      onClick={() => navigate(`${base(lang)}/account`)}
                    >
                      {u.manage}
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
                <div className="rf-vouchers">
                  <h3>{u.vouchers}</h3>
                  {(donated ? ["NEW15", "DONATE15"] : ["NEW15"]).map((code) => (
                    <button
                      key={code}
                      onClick={() => {
                        navigator.clipboard?.writeText(code);
                        setToast(u.copied);
                      }}
                    >
                      <span>15% OFF</span>
                      <strong>{code}</strong>
                      <small>{u.getCode} ↗</small>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rf-account-empty">
                <p>{u.signInFirst}</p>
                <button
                  className="rf-button"
                  onClick={() => setAccountOpen(true)}
                >
                  {u.signIn}
                  <ArrowRight size={16} />
                </button>
              </div>
            )}
          </section>
          <section id="donation" className="rf-section rf-donation">
            <div className="rf-section-head">
              <div>
                <span className="rf-eyebrow">02 / COMMUNITY</span>
                <h2>{c.donationTitle}</h2>
                <p>{c.donationStory}</p>
              </div>
            </div>
            <div className="rf-donation-steps">
              {c.donationSteps.map((step, i) => (
                <div key={i}>
                  <span>0{i + 1}</span>
                  <p>{step}</p>
                </div>
              ))}
            </div>
            <div className="rf-donation-form">
              <div>
                <h3>{u.donationMethod}</h3>
                <div className="rf-tabs">
                  <button
                    className={donationMethod === "store" ? "active" : ""}
                    onClick={() => setDonationMethod("store")}
                  >
                    {u.store}
                  </button>
                  <button
                    className={donationMethod === "pickup" ? "active" : ""}
                    onClick={() => setDonationMethod("pickup")}
                  >
                    {u.pickup}
                  </button>
                </div>
                {donationMethod === "store" && (
                  <div className="rf-map">
                    <MapPin />
                    <span>
                      {u.map}
                      <small>{u.demoContact}</small>
                    </span>
                  </div>
                )}
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  (e.currentTarget as HTMLFormElement).reset();
                  setDonated(true);
                  setToast(u.successDonate);
                }}
              >
                <div className="rf-form-grid">
                  {field(u.name)}
                  {field(u.phone, "tel")}
                  {field(u.email, "email")}
                  {donationMethod === "pickup" && field(u.address)}
                  {field(u.estimate, "number")}
                  {field(u.date, "date")}
                </div>
                <label className="rf-field">
                  <span>{u.note}</span>
                  <textarea name="note" rows={3} />
                </label>
                <button className="rf-button" type="submit">
                  {u.submit}
                  <ArrowRight size={17} />
                </button>
              </form>
            </div>
          </section>
          <section id="events" className="rf-section rf-events">
            <div className="rf-section-head">
              <div>
                <span className="rf-eyebrow">03 / COMMUNITY</span>
                <h2>{c.eventsTitle}</h2>
                <p>{c.eventsIntro}</p>
              </div>
            </div>
            <div className="rf-event-grid">
              <img src={img("community-gathering")} alt="" loading="lazy" />
              <div>
                <span className="rf-eyebrow">WORKSHOP · ★★★★★</span>
                <h3>{c.eventName}</h3>
                <p>{c.eventStory}</p>
                <small>
                  <MapPin size={14} />
                  {u.map} · {u.seats}
                </small>
                <button className="rf-button" onClick={() => setModal("event")}>
                  {c.eventCta}
                  <ArrowRight size={17} />
                </button>
              </div>
            </div>
          </section>
        </main>
      )}

      {route.page === "account" && (
        <main className="rf-page rf-account-page">
          <span className="rf-eyebrow">REFOLKS / ACCOUNT</span>
          <h1>{u.account}</h1>
          {account ? (
            <div className="rf-account-dashboard">
              <div className="rf-member">
                <div className="rf-avatar">
                  {account.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2>{account.name}</h2>
                  <p>{account.email}</p>
                  <strong>Gold ★</strong>
                  <div className="rf-progress">
                    <span />
                  </div>
                  <small>{u.progress}</small>
                  <button
                    className="rf-text-link"
                    onClick={() => setAccount(null)}
                  >
                    {u.signOut}
                  </button>
                </div>
              </div>
              <div className="rf-vouchers">
                <h3>{u.vouchers}</h3>
                {(donated ? ["NEW15", "DONATE15"] : ["NEW15"]).map((code) => (
                  <button
                    key={code}
                    onClick={() => {
                      navigator.clipboard?.writeText(code);
                      setToast(u.copied);
                    }}
                  >
                    <span>15% OFF</span>
                    <strong>{code}</strong>
                    <small>{u.getCode}</small>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <button className="rf-button" onClick={() => setAccountOpen(true)}>
              {u.signIn}
            </button>
          )}
          <section>
            <h2>{u.orders}</h2>
            {orders.length ? (
              orders.map((order) => (
                <div className="rf-order" key={order.id}>
                  <strong>#{order.id.slice(-6)}</strong>
                  <span>{order.date}</span>
                  <span>
                    {order.items.length} {u.shown}
                  </span>
                  <strong>{currency(order.total)}</strong>
                </div>
              ))
            ) : (
              <p>{u.comingSoon}</p>
            )}
          </section>
        </main>
      )}

      {(route.page === "cart" || route.page === "checkout") && (
        <main className="rf-page rf-cart-page">
          <span className="rf-eyebrow">
            REFOLKS / {route.page === "cart" ? u.bag : u.checkout}
          </span>
          <h1>
            {route.page === "cart" ? u.bag : u.checkout} ({totalCount})
          </h1>
          {route.page === "checkout" && (
            <p className="rf-demo-notice">{u.demoNotice}</p>
          )}
          {cart.length === 0 ? (
            <div className="rf-empty">
              <ShoppingBag size={32} />
              <p>{u.empty}</p>
              <button className="rf-button" onClick={() => showShop()}>
                {u.keepShopping}
              </button>
            </div>
          ) : (
            <div className="rf-cart-layout">
              <div>
                {cart.map((item, i) => {
                  const p = products.find((row) => row.id === item.id)!;
                  return (
                    <div className="rf-cart-row" key={i}>
                      <img src={p.images[0]} alt="" />
                      <div>
                        <h3>{p.name[lang]}</h3>
                        <p>
                          {colours[item.color]?.name[lang]}
                          {item.personal ? ` · ${u.customize}` : ""}
                        </p>
                        <strong>
                          {p.price === null
                            ? u.priceSoon
                            : currency(p.price * item.qty)}
                        </strong>
                        <div className="rf-cart-row-actions">
                          <div className="rf-qty">
                            <button onClick={() => updateCart(i, -1)}>
                              <Minus size={14} />
                            </button>
                            <span>{item.qty}</span>
                            <button onClick={() => updateCart(i, 1)}>
                              <Plus size={14} />
                            </button>
                          </div>
                          <button onClick={() => updateCart(i, -item.qty)}>
                            {u.remove}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="rf-cart-summary">
                <h2>{u.subtotal}</h2>
                <p>
                  <span>{u.subtotal}</span>
                  <strong>{currency(subtotal)}</strong>
                </p>
                <label className="rf-field">
                  <span>{u.region}</span>
                  <select
                    value={shippingRegion}
                    onChange={(e) =>
                      setShippingRegion(e.target.value as "hanoi" | "other")
                    }
                  >
                    <option value="hanoi">{u.hanoi}</option>
                    <option value="other">{u.otherRegion}</option>
                  </select>
                </label>
                <p>
                  <span>{u.shipping}</span>
                  <strong>{currency(shippingFee)}</strong>
                </p>
                <p className="rf-total">
                  <span>{u.total}</span>
                  <strong>{currency(subtotal + shippingFee)}</strong>
                </p>
                {route.page === "checkout" ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setOrders((current) => [
                        {
                          id: String(Date.now()),
                          date: new Date().toLocaleDateString(
                            lang === "vi" ? "vi-VN" : "en-US",
                          ),
                          total: subtotal + shippingFee,
                          items: cart,
                        },
                        ...current,
                      ]);
                      setCart([]);
                      setToast(u.placed);
                      navigate(base(lang));
                    }}
                  >
                    {field(u.name)}
                    {field(u.email, "email")}
                    {field(u.phone, "tel")}
                    {field(u.address)}
                    <button className="rf-button" type="submit">
                      {u.checkout}
                    </button>
                  </form>
                ) : (
                  <button
                    className="rf-button"
                    onClick={() => navigate(`${base(lang)}/checkout`)}
                  >
                    {u.checkout}
                    <ArrowRight size={17} />
                  </button>
                )}
              </div>
            </div>
          )}
        </main>
      )}

      <footer id="contact" className="rf-footer">
        <div className="rf-footer-top">
          <div>
            <img src="/images/refolks/logo-light.png" alt="Refolks" />
            <p>{u.footerThanks}</p>
            <div className="rf-social">
              <Camera size={18} />
              <Mail size={18} />
            </div>
          </div>
          <div>
            <h3>{u.contact}</h3>
            <p>{u.map}</p>
            <p>{u.demoContact}</p>
          </div>
          <div>
            <h3>{u.policies}</h3>
            <button onClick={() => setToast(u.comingSoon)}>FAQs</button>
            <button onClick={() => setToast(u.comingSoon)}>{u.shipping}</button>
            <button onClick={() => setToast(u.comingSoon)}>Refolks Care</button>
          </div>
          <div>
            <h3>{u.information}</h3>
            <button onClick={() => navigate(`${base(lang)}/about`)}>
              {u.aboutUs}
            </button>
            <button onClick={() => setAnchor(`${base(lang)}/community#events`)}>
              {u.events}
            </button>
            <button
              onClick={() => setAnchor(`${base(lang)}/community#donation`)}
            >
              {u.donate}
            </button>
          </div>
          <div>
            <h3>{u.newsletterTitle}</h3>
            <p>{u.newsletterDesc}</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setToast(u.newsletterDone);
              }}
            >
              <input
                type="email"
                required
                placeholder={u.email}
                aria-label={u.email}
              />
              <button type="submit" aria-label={u.submit}>
                <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </div>
        <div className="rf-footer-map">
          <MapPin size={22} />
          <div>
            <strong>{u.map}</strong>
            <small>{u.demoContact}</small>
          </div>
        </div>
        <div className="rf-footer-bottom">
          <span>© 2026 REFOLKS</span>
          <span>{u.map}</span>
          <span>VI / EN · VND</span>
        </div>
      </footer>

      <div className="rf-float">
        {scrollY > 800 && (
          <button
            className="rf-back-top"
            aria-label="Back to top"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <ArrowUp size={19} />
          </button>
        )}
        <button
          className="rf-chat-trigger"
          onClick={() => setChatOpen(!chatOpen)}
        >
          <MessageCircle size={18} />
          {u.chat}
        </button>
      </div>
      {chatOpen && (
        <div className="rf-chat-panel">
          <div>
            <strong>REFOLKS · {u.chat}</strong>
            <button onClick={() => setChatOpen(false)} aria-label={u.close}>
              <X size={18} />
            </button>
          </div>
          <p>{u.chatHello}</p>
          <div>
            {u.chatIdeas.map((idea, i) => (
              <button key={idea} onClick={() => setChatChoice(i)}>
                {idea}
              </button>
            ))}
          </div>
          <small>
            {chatChoice === null ? u.chatAnswer : u.chatReplies[chatChoice]}
          </small>
        </div>
      )}
      {searchOpen && (
        <div className="rf-overlay" onMouseDown={closeOverlays}>
          <div
            className="rf-search-panel"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <button onClick={() => setSearchOpen(false)} aria-label={u.close}>
              <X />
            </button>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSearchOpen(false);
                showShop(`?q=${encodeURIComponent(search)}`);
              }}
            >
              <Search />
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={u.search}
              />
            </form>
          </div>
        </div>
      )}
      {mobile && (
        <div className="rf-overlay" onMouseDown={closeOverlays}>
          <div
            className="rf-drawer rf-mobile-drawer"
            ref={dialogRef}
            onMouseDown={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={u.menu}
          >
            <div className="rf-drawer-head">
              <strong>REFOLKS</strong>
              <button onClick={() => setMobile(false)} aria-label={u.close}>
                <X />
              </button>
            </div>
            <div className="rf-mobile-links">
              {navItems.map((item) => (
                <details key={item.key}>
                  <summary>
                    {item.label}
                    <ChevronDown size={17} />
                  </summary>
                  <button onClick={() => navigate(item.href)}>
                    {u.viewAll}
                  </button>
                  {mega(item.key).flatMap(([, links]) =>
                    (links as string[][]).map(([label, href]) => (
                      <button key={label} onClick={() => setAnchor(href)}>
                        {label}
                      </button>
                    )),
                  )}
                </details>
              ))}
            </div>
            <div className="rf-lang">
              <button onClick={() => switchLang("vi")}>VI</button>
              <span>/</span>
              <button onClick={() => switchLang("en")}>EN</button>
            </div>
          </div>
        </div>
      )}
      {filterOpen && (
        <div className="rf-overlay" onMouseDown={closeOverlays}>
          <div
            className="rf-drawer"
            ref={dialogRef}
            onMouseDown={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={u.filter}
          >
            <div className="rf-drawer-head">
              <h2>{u.filter}</h2>
              <button onClick={() => setFilterOpen(false)} aria-label={u.close}>
                <X />
              </button>
            </div>
            <div className="rf-filter-body">
              <fieldset>
                <legend>{u.availability}</legend>
                <label>
                  <input
                    type="checkbox"
                    checked={availability}
                    onChange={(e) => setAvailability(e.target.checked)}
                  />
                  {u.inStock}
                </label>
              </fieldset>
              <fieldset>
                <legend>{u.colour}</legend>
                {Object.entries(colours).map(([key, val]) => (
                  <label key={key}>
                    <input
                      type="checkbox"
                      checked={filterColors.includes(key)}
                      onChange={() =>
                        setFilterColors((current) =>
                          current.includes(key)
                            ? current.filter((v) => v !== key)
                            : [...current, key],
                        )
                      }
                    />
                    <span
                      className="rf-filter-swatch"
                      style={{ background: val.hex }}
                    />
                    {val.name[lang]}{" "}
                    <small>
                      (
                      {
                        products.filter((p) =>
                          (p.colors as readonly string[]).includes(key),
                        ).length
                      }
                      )
                    </small>
                  </label>
                ))}
              </fieldset>
              <fieldset>
                <legend>{u.material}</legend>
                {[
                  ["brocade", lang === "vi" ? "Thổ cẩm Thái" : "Thai brocade"],
                  [
                    "recycled",
                    lang === "vi" ? "Vải tái chế" : "Recycled textile",
                  ],
                  ["canvas", "Canvas"],
                ].map(([key, label]) => (
                  <label key={key}>
                    <input
                      type="checkbox"
                      checked={material.includes(key)}
                      onChange={() =>
                        setMaterial((current) =>
                          current.includes(key)
                            ? current.filter((v) => v !== key)
                            : [...current, key],
                        )
                      }
                    />
                    {label}
                  </label>
                ))}
              </fieldset>
              <fieldset>
                <legend>{u.personalisation}</legend>
                <label>
                  <input
                    type="checkbox"
                    checked={filterPersonal}
                    onChange={(e) => setFilterPersonal(e.target.checked)}
                  />
                  {u.customize}
                </label>
              </fieldset>
            </div>
            <div className="rf-drawer-foot">
              <button
                onClick={() => {
                  setAvailability(false);
                  setMaterial([]);
                  setFilterColors([]);
                  setFilterPersonal(false);
                }}
              >
                {u.clear}
              </button>
              <button
                className="rf-button"
                onClick={() => setFilterOpen(false)}
              >
                {u.apply} ({visible.length})
              </button>
            </div>
          </div>
        </div>
      )}
      {bagOpen && (
        <div className="rf-overlay" onMouseDown={closeOverlays}>
          <div
            className="rf-drawer rf-cart-drawer"
            ref={dialogRef}
            onMouseDown={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={u.bag}
          >
            <div className="rf-drawer-head">
              <h2>
                {u.bag} ({totalCount})
              </h2>
              <button onClick={() => setBagOpen(false)} aria-label={u.close}>
                <X />
              </button>
            </div>
            <div className="rf-cart-drawer-body">
              {cart.length === 0 ? (
                <div className="rf-empty">
                  <ShoppingBag />
                  <p>{u.empty}</p>
                </div>
              ) : (
                <>
                  <div className="rf-freeship">
                    <Check size={18} />
                    {u.freeship}
                  </div>
                  {cart.map((item, i) => {
                    const p = products.find((row) => row.id === item.id)!;
                    return (
                      <div className="rf-cart-row" key={i}>
                        <img src={p.images[0]} alt="" />
                        <div>
                          <h3>{p.name[lang]}</h3>
                          <p>{colours[item.color]?.name[lang]}</p>
                          <strong>
                            {p.price === null
                              ? u.priceSoon
                              : currency(p.price * item.qty)}
                          </strong>
                          <div className="rf-cart-row-actions">
                            <div className="rf-qty">
                              <button onClick={() => updateCart(i, -1)}>
                                <Minus size={14} />
                              </button>
                              <span>{item.qty}</span>
                              <button onClick={() => updateCart(i, 1)}>
                                <Plus size={14} />
                              </button>
                            </div>
                            <button onClick={() => updateCart(i, -item.qty)}>
                              {u.remove}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <h3>{u.recommendation}</h3>
                  <button
                    className="rf-mini-reco"
                    onClick={() => showProduct(products[1])}
                  >
                    <img src={products[1].images[0]} alt="" />
                    {products[1].name[lang]}
                    <ArrowRight size={16} />
                  </button>
                  <details className="rf-discount">
                    <summary>
                      {u.code}
                      <Plus size={16} />
                    </summary>
                    <input placeholder={u.codePlaceholder} />
                  </details>
                </>
              )}
            </div>
            <div className="rf-drawer-foot rf-cart-foot">
              <div>
                <span>{u.subtotal}</span>
                <strong>{currency(subtotal)}</strong>
              </div>
              <button
                className="rf-button"
                onClick={() => navigate(`${base(lang)}/checkout`)}
              >
                {u.checkout}
                <ArrowRight size={16} />
              </button>
              <button onClick={() => navigate(`${base(lang)}/cart`)}>
                {u.viewBag}
              </button>
              <div className="rf-express">
                <button onClick={() => setToast(u.mockPay)}>PayPal</button>
                <button onClick={() => setToast(u.mockPay)}>GPay</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {accountOpen && (
        <div
          className="rf-overlay rf-account-overlay"
          onMouseDown={closeOverlays}
        >
          <div
            className="rf-account-popup"
            ref={dialogRef}
            onMouseDown={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={u.account}
          >
            <button
              className="rf-popup-close"
              onClick={() => setAccountOpen(false)}
              aria-label={u.close}
            >
              <X size={18} />
            </button>
            {account ? (
              <>
                <div className="rf-avatar">
                  {account.name.charAt(0).toUpperCase()}
                </div>
                <h2>{account.name}</h2>
                <p>{account.email}</p>
                <strong>Gold ★</strong>
                <div className="rf-progress">
                  <span />
                </div>
                <small>{u.progress}</small>
                <button
                  className="rf-button"
                  onClick={() => navigate(`${base(lang)}/account`)}
                >
                  {u.manage}
                </button>
                <button
                  className="rf-text-link"
                  onClick={() => setAccount(null)}
                >
                  {u.signOut}
                </button>
              </>
            ) : (
              <>
                <h2>{u.signPrompt}</h2>
                <p className="rf-demo-notice">{u.demoAccount}</p>
                <div className="rf-tabs">
                  <button
                    className={authMode === "signin" ? "active" : ""}
                    onClick={() => setAuthMode("signin")}
                  >
                    {u.signIn}
                  </button>
                  <button
                    className={authMode === "signup" ? "active" : ""}
                    onClick={() => setAuthMode("signup")}
                  >
                    {u.signUp}
                  </button>
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const data = new FormData(e.currentTarget);
                    const email = String(data.get("email") || "");
                    const name =
                      authMode === "signup"
                        ? String(data.get("name") || email.split("@")[0])
                        : email.split("@")[0];
                    setAccount({ name, email });
                    setAccountOpen(false);
                    setToast(
                      lang === "vi"
                        ? `Xin chào, ${name}!`
                        : `Welcome, ${name}!`,
                    );
                  }}
                >
                  {authMode === "signup" && (
                    <label className="rf-field">
                      <span>{u.name}</span>
                      <input name="name" required />
                    </label>
                  )}
                  <label className="rf-field">
                    <span>{u.email}</span>
                    <input name="email" type="email" required />
                  </label>
                  <label className="rf-field">
                    <span>{u.password}</span>
                    <input name="password" type="password" required />
                  </label>
                  <label className="rf-check">
                    <input type="checkbox" />
                    {u.newsletter}
                  </label>
                  <button className="rf-button" type="submit">
                    {authMode === "signin" ? u.signIn : u.signUp}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
      {modal && (
        <div className="rf-overlay" onMouseDown={closeOverlays}>
          <div
            className={`rf-modal ${modal === "zoom" ? "rf-zoom" : ""}`}
            ref={dialogRef}
            onMouseDown={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <button
              className="rf-popup-close"
              onClick={() => setModal(null)}
              aria-label={u.close}
            >
              <X />
            </button>
            {modal === "zoom" ? (
              <img src={zoomImage} alt={product.name[lang]} />
            ) : (
              <>
                <span className="rf-eyebrow">REFOLKS / WORKSHOP</span>
                <h2>{c.eventName}</h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setModal(null);
                    setToast(u.successEvent);
                  }}
                >
                  {field(u.name)}
                  {field(u.phone, "tel")}
                  {field(u.email, "email")}
                  {field(u.people, "number")}
                  <label className="rf-field">
                    <span>{u.note}</span>
                    <textarea rows={3} />
                  </label>
                  <button className="rf-button" type="submit">
                    {u.register}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
      {toast && (
        <div className="rf-toast" role="status">
          {toast}
          <button onClick={() => setToast("")} aria-label={u.close}>
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
