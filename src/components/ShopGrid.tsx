"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { flushSync } from "react-dom";
import type { Dict } from "../lib/catalog";

export type ShopItem = {
  sku: string;
  tier: string;
  colour: string;
  colourName: string;
  price: number;
  card: ReactNode;
};
type Filters = { tier: string; colour: string; price: string; sort: string };

const filterItems = (items: ShopItem[], filters: Filters) => {
  const filtered = items.filter(
    (item) =>
      (!filters.tier || item.tier === filters.tier) &&
      (!filters.colour || item.colour === filters.colour) &&
      (!filters.price ||
        (filters.price === "under-1500"
          ? item.price < 1500000
          : filters.price === "1500-1800"
            ? item.price >= 1500000 && item.price <= 1800000
            : item.price > 1800000)),
  );
  if (filters.sort === "low") filtered.sort((a, b) => a.price - b.price);
  if (filters.sort === "high") filtered.sort((a, b) => b.price - a.price);
  return filtered;
};

export function ShopGrid({
  shopPath,
  initial,
  items,
  copy,
  colourLabel,
  priceLabel,
}: {
  shopPath: string;
  initial: Filters;
  items: ShopItem[];
  copy: Dict["shop"];
  colourLabel: string;
  priceLabel: string;
}) {
  const [draft, setDraft] = useState(initial);
  const [applied, setApplied] = useState(initial);
  const drawer = useRef<HTMLDetailsElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const rows = useMemo(() => filterItems(items, applied), [items, applied]);
  const preview = useMemo(() => filterItems(items, draft), [items, draft]);
  const active = [draft.tier, draft.colour, draft.price].filter(Boolean).length;
  const colours = Array.from(
    new Map(items.map((item) => [item.colour, item.colourName])).entries(),
  );

  useEffect(() => {
    document.title = `${applied.tier ? applied.tier[0].toUpperCase() + applied.tier.slice(1) : copy.title} | Refvlks`;
  }, [applied.tier, copy.title]);

  useEffect(() => {
    const pop = () => {
      const url = new URL(location.href);
      const next = {
        tier: url.searchParams.get("tier") ?? "",
        colour: url.searchParams.get("colour") ?? "",
        price: url.searchParams.get("price") ?? "",
        sort: url.searchParams.get("sort") ?? "featured",
      };
      setApplied(next);
      setDraft(next);
    };
    window.addEventListener("popstate", pop);
    return () => window.removeEventListener("popstate", pop);
  }, []);

  useEffect(() => {
    const marquee = document.querySelector<HTMLElement>(".shop-marquee-track");
    if (!marquee || matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    let last = scrollY;
    let timeout = 0;
    const scroll = () => {
      if (matchMedia("(max-width: 1023px)").matches) return;
      const velocity = scrollY - last;
      last = scrollY;
      if (Math.abs(velocity) < 2) return;
      marquee.style.animationDirection = velocity < 0 ? "reverse" : "normal";
      marquee.style.animationDuration = "20s";
      clearTimeout(timeout);
      timeout = window.setTimeout(() => {
        marquee.style.animationDuration = "40s";
      }, 220);
    };
    addEventListener("scroll", scroll, { passive: true });
    return () => {
      removeEventListener("scroll", scroll);
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const element = grid.current;
    if (!element) return;
    let alive = true;
    let cleanup = () => {};
    const start = async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (!alive) return;
      gsap.registerPlugin(ScrollTrigger);
      const cells = element.querySelectorAll<HTMLElement>(".shop-grid-cell");
      const tween = gsap.fromTo(
        cells,
        { clipPath: "inset(100% 0 0 0)" },
        {
          clipPath: "inset(0% 0 0 0)",
          duration: 0.9,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: element, start: "top 85%", once: true },
        },
      );
      cleanup = () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        gsap.set(cells, { clearProps: "clipPath" });
      };
    };
    void start();
    return () => {
      alive = false;
      cleanup();
    };
  }, []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const next: Filters = {
      tier: String(form.get("tier") ?? ""),
      colour: String(form.get("colour") ?? ""),
      price: String(form.get("price") ?? ""),
      sort: String(form.get("sort") ?? "featured"),
    };
    const url = new URL(shopPath, location.origin);
    for (const [key, value] of Object.entries(next))
      if (value && !(key === "sort" && value === "featured"))
        url.searchParams.set(key, value);
    history.pushState(null, "", url);
    drawer.current?.removeAttribute("open");
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setApplied(next);
      return;
    }
    const [{ default: gsap }, { Flip }] = await Promise.all([
      import("gsap"),
      import("gsap/Flip"),
    ]);
    gsap.registerPlugin(Flip);
    const state = Flip.getState(".shop-grid-cell");
    flushSync(() => setApplied(next));
    Flip.from(state, {
      duration: 0.5,
      ease: "power2.inOut",
      absolute: true,
      stagger: 0.03,
      onEnter: (elements) =>
        gsap.fromTo(
          elements,
          { opacity: 0, scale: 0.96 },
          { opacity: 1, scale: 1, duration: 0.35 },
        ),
      onLeave: (elements) =>
        gsap.to(elements, { opacity: 0, scale: 0.96, duration: 0.25 }),
    });
  };

  const fields = (prefix: string) => (
    <>
      <div className="field">
        <label htmlFor={`${prefix}-tier`}>{copy.tier}</label>
        <select
          id={`${prefix}-tier`}
          name="tier"
          value={draft.tier}
          onChange={(event) => setDraft({ ...draft, tier: event.target.value })}
        >
          <option value="">{copy.all}</option>
          <option value="essential">Essential</option>
          <option value="signature">Signature</option>
          <option value="heritage">Heritage</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor={`${prefix}-colour`}>{colourLabel}</label>
        <select
          id={`${prefix}-colour`}
          name="colour"
          value={draft.colour}
          onChange={(event) =>
            setDraft({ ...draft, colour: event.target.value })
          }
        >
          <option value="">{copy.all}</option>
          {colours.map(([value, name]) => (
            <option value={value} key={value}>
              {name}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor={`${prefix}-price`}>{priceLabel}</label>
        <select
          id={`${prefix}-price`}
          name="price"
          value={draft.price}
          onChange={(event) =>
            setDraft({ ...draft, price: event.target.value })
          }
        >
          <option value="">{copy.priceAll}</option>
          <option value="under-1500">{copy.priceUnder}</option>
          <option value="1500-1800">{copy.priceMiddle}</option>
          <option value="over-1800">{copy.priceAbove}</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor={`${prefix}-sort`}>{copy.sort}</label>
        <select
          id={`${prefix}-sort`}
          name="sort"
          value={draft.sort}
          onChange={(event) => setDraft({ ...draft, sort: event.target.value })}
        >
          <option value="featured">{copy.featured}</option>
          <option value="low">{copy.low}</option>
          <option value="high">{copy.high}</option>
        </select>
      </div>
    </>
  );

  return (
    <>
      <section
        className="container page-hero shop-page-hero"
        data-section="S-01"
      >
        <p className="eyebrow">
          <span className="eyebrow-line" />
          {copy.eyebrow}
        </p>
        <h1>
          {applied.tier
            ? applied.tier[0].toUpperCase() + applied.tier.slice(1)
            : copy.title}
        </h1>
        <p className="lead">{copy.intro}</p>
      </section>
      <div className="shop-marquee" aria-hidden="true">
        <div className="shop-marquee-track">
          <span>{copy.marquee} </span>
          <span>{copy.marquee} </span>
        </div>
      </div>
      <section className="section shop-grid-section" data-section="S-02">
        <div className="shop-filter-wrap">
          <div className="container shop-filter-inner">
            <form
              className="filter-form shop-desktop-filters"
              action={shopPath}
              method="get"
              onSubmit={submit}
            >
              {fields("desktop")}
              <button className="button button-secondary" type="submit">
                {copy.filter} →
              </button>
            </form>
            <details className="shop-mobile-filters" ref={drawer}>
              <summary>
                {copy.filter} ({active})
              </summary>
              <form
                className="filter-form"
                action={shopPath}
                method="get"
                onSubmit={submit}
              >
                {fields("mobile")}
                <button className="button button-primary" type="submit">
                  {copy.showCount.replace("{n}", String(preview.length))} →
                </button>
              </form>
            </details>
            <span className="filter-count" aria-live="polite">
              {copy.count.replace("{n}", String(rows.length))}
            </span>
          </div>
        </div>
        <div className="container shop-grid-content">
          {rows.length ? (
            <div className="product-grid shop-product-grid" ref={grid}>
              {rows.map((item) => (
                <div
                  className="shop-grid-cell"
                  data-flip-id={item.sku}
                  key={item.sku}
                >
                  {item.card}
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h2>{copy.empty}</h2>
              <a className="button button-primary" href={shopPath}>
                {copy.clear} ↗
              </a>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
