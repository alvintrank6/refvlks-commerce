"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function HomeMotion({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      const root = scope.current;
      if (!root) return;
      const hero = root.querySelector<HTMLElement>(".hero");
      const media = root.querySelector<HTMLElement>(".hero-media .picture");
      const image = media?.querySelector("img");
      const pattern = root.querySelector<HTMLElement>(".hero-weft");
      const mm = gsap.matchMedia();
      mm.add(
        {
          full: "(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
          lite: "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
          off: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const tier = context.conditions;
          if (!tier || tier.off || !hero || !media || !image) return;
          gsap.to(image, {
            yPercent: tier.full ? 8 : 4,
            ease: "none",
            scrollTrigger: {
              trigger: hero,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });
          if (pattern)
            gsap.to(pattern, {
              yPercent: tier.full ? -4 : -2,
              ease: "none",
              scrollTrigger: {
                trigger: hero,
                start: "top top",
                end: "bottom top",
                scrub: true,
              },
            });
          if (!tier.full) return;
          const rotateX = gsap.quickTo(media, "rotationX", {
            duration: 0.3,
            ease: "power2.out",
          });
          const rotateY = gsap.quickTo(media, "rotationY", {
            duration: 0.3,
            ease: "power2.out",
          });
          gsap.set(media, {
            transformPerspective: 1200,
            transformOrigin: "center",
          });
          const move = (event: PointerEvent) => {
            const bounds = media.getBoundingClientRect();
            rotateY(((event.clientX - bounds.left) / bounds.width - 0.5) * 6);
            rotateX((0.5 - (event.clientY - bounds.top) / bounds.height) * 6);
          };
          const leave = () => {
            rotateX(0);
            rotateY(0);
          };
          media.addEventListener("pointermove", move);
          media.addEventListener("pointerleave", leave);

          const cards = root.querySelectorAll<HTMLElement>(".product-card");
          const cleanups: Array<() => void> = [];
          cards.forEach((card) => {
            const tiltX = gsap.quickTo(card, "rotationX", {
              duration: 0.35,
              ease: "power2.out",
            });
            const tiltY = gsap.quickTo(card, "rotationY", {
              duration: 0.35,
              ease: "power2.out",
            });
            gsap.set(card, {
              transformPerspective: 1000,
              transformOrigin: "center",
            });
            const onMove = (event: PointerEvent) => {
              const bounds = card.getBoundingClientRect();
              tiltY(((event.clientX - bounds.left) / bounds.width - 0.5) * 8);
              tiltX((0.5 - (event.clientY - bounds.top) / bounds.height) * 8);
            };
            const onLeave = () => {
              tiltX(0);
              tiltY(0);
            };
            card.addEventListener("pointermove", onMove);
            card.addEventListener("pointerleave", onLeave);
            cleanups.push(() => {
              card.removeEventListener("pointermove", onMove);
              card.removeEventListener("pointerleave", onLeave);
            });
          });
          return () => {
            media.removeEventListener("pointermove", move);
            media.removeEventListener("pointerleave", leave);
            cleanups.forEach((cleanup) => cleanup());
          };
        },
      );
      return () => mm.revert();
    },
    { scope },
  );
  return (
    <div ref={scope} className="home-motion-root">
      {children}
    </div>
  );
}
