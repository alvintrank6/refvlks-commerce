"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { motionTokens } from "./tokens";

export function CarriedMotion({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section =
      scope.current?.querySelector<HTMLElement>(".carried-section");
    const viewport = section?.querySelector<HTMLElement>(".carried-viewport");
    const track = section?.querySelector<HTMLElement>(".carried-track");
    const progress = section?.querySelector<HTMLElement>(
      ".carried-progress span",
    );
    if (!section || !viewport || !track) return;
    let alive = true;
    let dispose = () => {};
    const media = window.matchMedia(
      "(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    const initialize = async () => {
      if (!media.matches || section.classList.contains("is-pinned")) return;
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (!alive || !media.matches) return;
      gsap.registerPlugin(ScrollTrigger);
      section.classList.add("is-pinned");
      const images =
        section.querySelectorAll<HTMLElement>(".carried-photo img");
      gsap.set(images, { xPercent: -6 });
      const distance = () =>
        Math.max(0, track.scrollWidth - viewport.clientWidth);
      const movement = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${distance()}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progress) progress.style.transform = `scaleX(${self.progress})`;
            const skew = Math.max(
              -motionTokens.skew.max,
              Math.min(motionTokens.skew.max, self.getVelocity() / 350),
            );
            gsap.to(track, { skewX: skew, duration: 0.15, overwrite: "auto" });
            gsap.to(track, {
              skewX: 0,
              duration: 0.4,
              delay: 0.15,
              overwrite: "auto",
            });
          },
        },
      });
      const parallax = gsap.to(images, {
        xPercent: 6,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${distance()}`,
          scrub: 1,
        },
      });
      dispose = () => {
        movement.scrollTrigger?.kill();
        parallax.scrollTrigger?.kill();
        movement.kill();
        parallax.kill();
        gsap.set(track, { clearProps: "transform" });
        gsap.set(images, { clearProps: "transform" });
        section.classList.remove("is-pinned");
      };
      ScrollTrigger.refresh();
    };
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          void initialize();
        }
      },
      { rootMargin: "700px 0px" },
    );
    observer.observe(section);
    const changed = () => {
      if (!media.matches) dispose();
      else void initialize();
    };
    media.addEventListener("change", changed);
    return () => {
      alive = false;
      observer.disconnect();
      media.removeEventListener("change", changed);
      dispose();
    };
  }, []);

  return (
    <div ref={scope} className="carried-motion-root">
      {children}
    </div>
  );
}

export function InvitationMotion({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let alive = true;
    let cleanup = () => {};
    const initialize = async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (!alive) return;
      const section = scope.current?.querySelector<HTMLElement>(
        ".invitation-section",
      );
      if (!section) return;
      gsap.registerPlugin(ScrollTrigger);
      const mm = gsap.matchMedia();
      mm.add(
        {
          full: "(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
          lite: "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
          off: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const tier = context.conditions;
          const enter = () =>
            gsap.to(section, {
              backgroundColor: "#4A2E1F",
              duration: tier?.off ? 0 : 0.6,
            });
          const leave = () =>
            gsap.to(section, {
              backgroundColor: "#F4EFE6",
              duration: tier?.off ? 0 : 0.6,
            });
          const trigger = ScrollTrigger.create({
            trigger: section,
            start: "top center",
            end: "bottom center",
            onEnter: enter,
            onEnterBack: enter,
            onLeaveBack: leave,
          });
          if (tier?.off) return () => trigger.kill();
          const pictures = section.querySelectorAll<HTMLElement>(
            ".invitation-panel .picture",
          );
          const reveal = gsap.fromTo(
            pictures,
            {
              clipPath: tier?.full ? "inset(100% 0 0 0)" : "inset(12% 0 0 0)",
              y: tier?.full ? 0 : 16,
            },
            {
              clipPath: "inset(0% 0 0 0)",
              y: 0,
              duration: tier?.full ? 1 : 0.5,
              stagger: 0.1,
              ease: "power3.out",
              scrollTrigger: { trigger: section, start: "top 80%", once: true },
            },
          );
          return () => {
            trigger.kill();
            reveal.scrollTrigger?.kill();
            reveal.kill();
            gsap.set(pictures, { clearProps: "clipPath,transform" });
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
  }, []);
  return (
    <div ref={scope} className="invitation-motion-root">
      {children}
    </div>
  );
}
