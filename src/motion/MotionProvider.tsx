"use client";
/* eslint-disable @next/next/no-img-element -- Original brand SVG wordmarks are served directly. */

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { motionTokens } from "./tokens";

declare global {
  interface Window {
    __refvlksMotionReady?: boolean;
  }
}

export function MotionProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    let alive = true;
    let cleanup = () => {};
    const initialize = async () => {
      await document.fonts.ready;
      const [{ default: gsap }, { SplitText }, { ScrollTrigger }] =
        await Promise.all([
          import("gsap"),
          import("gsap/SplitText"),
          import("gsap/ScrollTrigger"),
        ]);
      if (!alive) return;
      gsap.registerPlugin(SplitText, ScrollTrigger);
      const mm = gsap.matchMedia();
      mm.add(
        {
          full: "(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
          lite: "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
          off: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const tier = context.conditions;
          if (!tier || tier.off) return;
          const splits: Array<{ revert: () => void }> = [];
          const tweens: Array<{ kill: () => void }> = [];
          document
            .querySelectorAll<HTMLElement>("main h1, main h2")
            .forEach((heading) => {
              if (
                !heading.getClientRects().length ||
                getComputedStyle(heading).display === "none"
              )
                return;
              const split = SplitText.create(heading, {
                type: tier.full ? "lines,words" : "lines",
                mask: "lines",
                linesClass: "motion-line",
              });
              splits.push(split);
              tweens.push(
                gsap.from(split.lines, {
                  yPercent: tier.full ? 105 : 0,
                  y: tier.full ? 0 : 12,
                  opacity: 0,
                  duration: tier.full ? 0.8 : 0.45,
                  stagger: tier.full ? 0.08 : 0.04,
                  ease: "power3.out",
                  scrollTrigger: {
                    trigger: heading,
                    start: "top 92%",
                    once: true,
                  },
                }),
              );
            });
          return () => {
            tweens.forEach((tween) => killWithTrigger(tween));
            splits.forEach((split) => split.revert());
          };
        },
      );
      cleanup = () => mm.revert();
    };
    void initialize();
    return () => {
      alive = false;
      cleanup();
    };
  }, [pathname]);

  useEffect(() => {
    let alive = true;
    const html = document.documentElement;
    const overlay = document.querySelector<HTMLElement>("[data-preloader]");
    const finish = () => {
      html.classList.remove("first-visit");
      overlay?.setAttribute("aria-hidden", "true");
      window.__refvlksMotionReady = true;
    };
    if (!html.classList.contains("first-visit") || !overlay) {
      finish();
      return;
    }
    const run = async () => {
      try {
        const hero =
          document.querySelector<HTMLImageElement>(".hero-media img");
        if (hero && !hero.complete)
          await Promise.race([
            hero.decode().catch(() => undefined),
            new Promise((resolve) => setTimeout(resolve, 450)),
          ]);
        const [{ default: gsap }, { DrawSVGPlugin }] = await Promise.all([
          import("gsap"),
          import("gsap/DrawSVGPlugin"),
        ]);
        if (!alive) return;
        gsap.registerPlugin(DrawSVGPlugin);
        const full = window.matchMedia(
          "(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
        ).matches;
        const off = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
        if (off) {
          finish();
          return;
        }
        if (!full) {
          gsap.to(overlay, { opacity: 0, duration: 0.3, onComplete: finish });
          return;
        }
        const lines = overlay.querySelectorAll("line");
        gsap.set(lines, { drawSVG: "0%" });
        gsap
          .timeline({ onComplete: finish })
          .to(lines, {
            drawSVG: "100%",
            duration: 0.28,
            stagger: 0.06,
            ease: motionTokens.ease.standard,
          })
          .fromTo(
            overlay.querySelector("img"),
            { y: 8, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.25 },
            0.1,
          )
          .to(
            overlay,
            { yPercent: -100, duration: 0.45, ease: motionTokens.ease.curtain },
            0.55,
          );
      } catch {
        finish();
      }
    };
    void run();
    const timeout = window.setTimeout(finish, 1200);
    return () => {
      alive = false;
      clearTimeout(timeout);
      finish();
    };
  }, []);

  useEffect(() => {
    let alive = true;
    let cleanup = () => {};
    const run = async () => {
      const { default: gsap } = await import("gsap");
      if (!alive) return;
      const html = document.documentElement;
      const curtain = document.querySelector<HTMLElement>("[data-curtain]");
      const progress = document.querySelector<HTMLElement>(
        "[data-scroll-progress]",
      );
      const cursor = document.querySelector<HTMLElement>("[data-cursor-ui]");
      const cursorText = cursor?.querySelector<HTMLElement>("span");
      const mm = gsap.matchMedia();
      const remove: Array<() => void> = [];

      if (html.classList.contains("curtain-incoming") && curtain) {
        gsap.fromTo(
          curtain,
          { yPercent: 0 },
          {
            yPercent: -100,
            duration: 0.6,
            ease: motionTokens.ease.curtain,
            onComplete: () => html.classList.remove("curtain-incoming"),
          },
        );
      }
      const pageShow = () => {
        if (curtain) gsap.set(curtain, { yPercent: -100 });
        html.classList.remove("curtain-incoming");
      };
      window.addEventListener("pageshow", pageShow);
      remove.push(() => window.removeEventListener("pageshow", pageShow));

      mm.add(
        {
          full: "(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
          lite: "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
          off: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const tier = context.conditions;
          if (!tier || tier.off) return;
          const updateProgress = () => {
            if (!progress) return;
            const maximum =
              document.documentElement.scrollHeight - window.innerHeight;
            progress.style.transform = `scaleX(${maximum > 0 ? Math.min(1, window.scrollY / maximum) : 0})`;
          };
          window.addEventListener("scroll", updateProgress, { passive: true });
          window.addEventListener("resize", updateProgress, { passive: true });
          updateProgress();
          if (!tier.full)
            return () => {
              window.removeEventListener("scroll", updateProgress);
              window.removeEventListener("resize", updateProgress);
            };

          let lenis: { destroy: () => void } | null = null;
          let idleId = 0;
          const flow =
            /\/(cart|checkout|order|gio-hang|thanh-toan|don-hang|legal|phap-ly|help|ho-tro)/.test(
              pathname,
            );
          if (!flow) {
            const startLenis = async () => {
              const { default: Lenis } = await import("lenis");
              if (!alive) return;
              lenis = new Lenis({ lerp: 0.1, autoRaf: true });
            };
            idleId = window.setTimeout(() => void startLenis(), 250);
          }
          const moveCursor = gsap.quickTo(cursor, "x", {
            duration: 0.15,
            ease: "power2.out",
          });
          const moveCursorY = gsap.quickTo(cursor, "y", {
            duration: 0.15,
            ease: "power2.out",
          });
          const pointer = (event: PointerEvent) => {
            if (!cursor || !cursorText) return;
            moveCursor(event.clientX);
            moveCursorY(event.clientY);
            const target = event.target as Element;
            const form = target.closest(
              "form, input, textarea, select, button, label",
            );
            const contextElement = target.closest<HTMLElement>(
              "[data-cursor], .product-card",
            );
            cursor.classList.toggle("is-visible", !form);
            cursor.classList.toggle(
              "is-context",
              Boolean(contextElement) && !form,
            );
            cursorText.textContent =
              contextElement?.dataset.cursor ??
              (contextElement?.classList.contains("product-card")
                ? "View"
                : "");
          };
          document.addEventListener("pointermove", pointer, { passive: true });
          const magnetic = [
            ...document.querySelectorAll<HTMLElement>("[data-magnetic]"),
          ].map((element) => {
            const x = gsap.quickTo(element, "x", {
              duration: 0.3,
              ease: "power2.out",
            });
            const y = gsap.quickTo(element, "y", {
              duration: 0.3,
              ease: "power2.out",
            });
            const move = (event: PointerEvent) => {
              const rect = element.getBoundingClientRect();
              x(
                ((event.clientX - rect.left) / rect.width - 0.5) *
                  motionTokens.magnetic.max *
                  2,
              );
              y(
                ((event.clientY - rect.top) / rect.height - 0.5) *
                  motionTokens.magnetic.max *
                  2,
              );
            };
            const leave = () => {
              x(0);
              y(0);
            };
            element.addEventListener("pointermove", move);
            element.addEventListener("pointerleave", leave);
            return () => {
              element.removeEventListener("pointermove", move);
              element.removeEventListener("pointerleave", leave);
            };
          });
          return () => {
            window.removeEventListener("scroll", updateProgress);
            window.removeEventListener("resize", updateProgress);
            document.removeEventListener("pointermove", pointer);
            magnetic.forEach((dispose) => dispose());
            window.clearTimeout(idleId);
            lenis?.destroy();
            cursor?.classList.remove("is-visible", "is-context");
          };
        },
      );

      const click = async (event: MouseEvent) => {
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        )
          return;
        const link = (event.target as Element).closest<HTMLAnchorElement>(
          "a[href]",
        );
        if (
          !link ||
          link.target ||
          link.hasAttribute("download") ||
          link.dataset.viewTransition
        )
          return;
        const url = new URL(link.href);
        if (
          url.origin !== location.origin ||
          url.pathname === location.pathname ||
          url.hash ||
          /\/(cart|checkout|order|gio-hang|thanh-toan|don-hang)/.test(
            url.pathname,
          )
        )
          return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
          return;
        event.preventDefault();
        if (!curtain) {
          location.assign(url.href);
          return;
        }
        const full = window.matchMedia(
          "(min-width: 1024px) and (hover: hover) and (pointer: fine)",
        ).matches;
        if (!full) {
          gsap.to("main", {
            opacity: 0,
            duration: 0.2,
            onComplete: () => location.assign(url.href),
          });
          return;
        }
        try {
          sessionStorage.setItem("refvlks-curtain", "1");
        } catch {
          /* navigation still works */
        }
        gsap.set(curtain, { visibility: "visible" });
        gsap.fromTo(
          curtain,
          { yPercent: 100 },
          {
            yPercent: 0,
            duration: motionTokens.duration.curtain,
            ease: motionTokens.ease.curtain,
            onComplete: () => location.assign(url.href),
          },
        );
      };
      document.addEventListener("click", click);
      remove.push(() => document.removeEventListener("click", click));
      cleanup = () => {
        mm.revert();
        remove.forEach((dispose) => dispose());
      };
    };
    void run();
    return () => {
      alive = false;
      cleanup();
    };
  }, [pathname]);

  return (
    <>
      {children}
      <div data-preloader aria-hidden="true">
        <img
          src="/brand/refvlks_logo_wordmark_reversed_on-cocoa.svg"
          width="190"
          height="44"
          alt=""
        />
        <svg viewBox="0 0 300 70" aria-hidden="true">
          {Array.from({ length: 7 }, (_, index) => (
            <line
              key={index}
              x1="0"
              x2="300"
              y1={5 + index * 10}
              y2={5 + index * 10}
            />
          ))}
        </svg>
      </div>
      <div data-curtain aria-hidden="true">
        <img
          src="/brand/refvlks_logo_wordmark_reversed_on-cocoa.svg"
          width="160"
          height="37"
          alt=""
        />
      </div>
      <div data-scroll-progress aria-hidden="true" />
      <div data-cursor-ui aria-hidden="true">
        <span />
      </div>
    </>
  );
}

function killWithTrigger(tween: {
  kill: () => void;
  scrollTrigger?: { kill: () => void };
}) {
  tween.scrollTrigger?.kill();
  tween.kill();
}
