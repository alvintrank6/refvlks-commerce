"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function RevealMotion({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = scope.current;
    const section = root?.querySelector<HTMLElement>(".reveal-section");
    if (!root || !section) return;
    let alive = true;
    let dispose = () => {};
    const media = window.matchMedia(
      "(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    const initialize = async () => {
      if (!media.matches || section.classList.contains("is-cinematic")) return;
      const frames = Array.from(
        section.querySelectorAll<HTMLElement>(".reveal-frame"),
      );
      const images = frames
        .map((frame) => frame.querySelector("img"))
        .filter((image): image is HTMLImageElement => Boolean(image));
      if (images.length !== 8) return;
      images.forEach((image) => {
        image.loading = "eager";
        image.fetchPriority = "low";
      });
      await Promise.race([
        Promise.all(
          images.map((image) => image.decode().catch(() => undefined)),
        ),
        new Promise((resolve) => setTimeout(resolve, 5000)),
      ]);
      if (images.some((image) => !image.complete || !image.naturalWidth))
        return;
      if (!alive || !media.matches) return;
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (!alive || !media.matches) return;
      gsap.registerPlugin(ScrollTrigger);
      const steps = Array.from(
        section.querySelectorAll<HTMLElement>(".reveal-story-step"),
      );
      const line = section.querySelector<HTMLElement>(".reveal-progress span");
      section.classList.add("is-cinematic");
      gsap.set(frames, { autoAlpha: 0 });
      gsap.set(frames[0], { autoAlpha: 1 });
      steps[0]?.classList.add("is-active");
      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=200%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: ({ progress }) => {
            if (line) line.style.transform = `scaleY(${progress})`;
            const active = progress < 0.39 ? 0 : progress < 0.75 ? 1 : 2;
            steps.forEach((step, index) =>
              step.classList.toggle("is-active", index === active),
            );
          },
        },
      });
      frames.slice(1).forEach((frame, index) => {
        timeline.to(frames[index], { autoAlpha: 0, duration: 0.25 }, index);
        timeline.to(frame, { autoAlpha: 1, duration: 0.25 }, index);
      });
      timeline.to({}, { duration: 0.75 });
      dispose = () => {
        timeline.scrollTrigger?.kill();
        timeline.kill();
        gsap.set(frames, { clearProps: "all" });
        section.classList.remove("is-cinematic");
        steps.forEach((step) => step.classList.remove("is-active"));
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
      { rootMargin: "600px 0px" },
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
    <div ref={scope} className="reveal-motion-root">
      {children}
    </div>
  );
}
