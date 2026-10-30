"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function StoryMotion({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      const root = scope.current;
      if (!root) return;
      const mm = gsap.matchMedia();
      mm.add(
        {
          full: "(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
          lite: "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
          off: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          if (context.conditions?.off) return;
          root
            .querySelectorAll<HTMLElement>(".ratio-number")
            .forEach((number) => {
              const target = Number(number.dataset.count);
              const state = { value: 0 };
              gsap.to(state, {
                value: target,
                duration: 1.2,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: number,
                  start: "top 85%",
                  once: true,
                },
                onUpdate: () => {
                  number.textContent = `${Math.round(state.value)}%`;
                },
              });
            });
          root
            .querySelectorAll<HTMLElement>(".ratio-thread span")
            .forEach((bar) => {
              gsap.fromTo(
                bar,
                { scaleX: 0 },
                {
                  scaleX: 1,
                  transformOrigin: "left center",
                  ease: "none",
                  scrollTrigger: {
                    trigger: bar,
                    start: "top 85%",
                    end: "top 30%",
                    scrub: true,
                  },
                },
              );
            });
          root
            .querySelectorAll<HTMLElement>(".story-thread")
            .forEach((thread) => {
              gsap.fromTo(
                thread,
                { scaleY: 0 },
                {
                  scaleY: 1,
                  transformOrigin: "top center",
                  ease: "none",
                  scrollTrigger: {
                    trigger: thread.parentElement,
                    start: "top 70%",
                    end: "bottom 75%",
                    scrub: true,
                  },
                },
              );
            });
          root
            .querySelectorAll<SVGPathElement>(".route-thread")
            .forEach((path) => {
              const length = path.getTotalLength();
              gsap.fromTo(
                path,
                { strokeDasharray: length, strokeDashoffset: length },
                {
                  strokeDashoffset: 0,
                  ease: "none",
                  scrollTrigger: {
                    trigger: path,
                    start: "top 90%",
                    end: "bottom 25%",
                    scrub: true,
                  },
                },
              );
            });
          const donationJoin =
            root.querySelector<HTMLElement>(".donation-join");
          if (donationJoin)
            gsap.fromTo(
              donationJoin,
              { backgroundColor: "#f4efe6" },
              {
                backgroundColor: "#d8c4b2",
                ease: "none",
                scrollTrigger: {
                  trigger: donationJoin,
                  start: "top 80%",
                  end: "top 20%",
                  scrub: true,
                },
              },
            );
          if (!context.conditions?.full) return;
          root
            .querySelectorAll<HTMLElement>(".story-stack-card")
            .forEach((card, index) => {
              if (index === 0) return;
              const previous =
                card.previousElementSibling as HTMLElement | null;
              if (!previous?.classList.contains("story-stack-card")) return;
              gsap.to(previous, {
                scale: 0.96,
                y: -18,
                ease: "none",
                scrollTrigger: {
                  trigger: card,
                  start: "top 80%",
                  end: "top 16%",
                  scrub: true,
                },
              });
            });
        },
      );
      return () => mm.revert();
    },
    { scope },
  );
  return <div ref={scope}>{children}</div>;
}
