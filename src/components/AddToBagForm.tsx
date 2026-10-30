"use client";

import { useState, type FormEvent } from "react";

export function AddToBagForm({
  sku,
  locale,
  label,
  available,
  mobile = false,
}: {
  sku: string;
  locale: "en" | "vi";
  label: string;
  available: boolean;
  mobile?: boolean;
}) {
  const [submitting, setSubmitting] = useState(false);
  const add = async (event: FormEvent<HTMLFormElement>) => {
    if (!available || submitting) return;
    const form = event.currentTarget;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const source = document.querySelector<HTMLImageElement>(
      ".gallery .picture img",
    );
    const target = document.querySelector<HTMLElement>(".bag-link");
    if (prefersReduced || !source || !target) return;
    const sourceBounds = source.getBoundingClientRect();
    if (sourceBounds.bottom < 0 || sourceBounds.top > window.innerHeight)
      return;
    event.preventDefault();
    setSubmitting(true);
    try {
      const [{ default: gsap }, { Flip }] = await Promise.all([
        import("gsap"),
        import("gsap/Flip"),
      ]);
      gsap.registerPlugin(Flip);
      const from = sourceBounds;
      const to = target.getBoundingClientRect();
      const image = source.cloneNode(true) as HTMLImageElement;
      image.alt = "";
      image.setAttribute("aria-hidden", "true");
      Object.assign(image.style, {
        position: "fixed",
        zIndex: "70",
        left: `${from.left}px`,
        top: `${from.top}px`,
        width: `${from.width}px`,
        height: `${from.height}px`,
        objectFit: "cover",
        pointerEvents: "none",
      });
      document.body.appendChild(image);
      const state = Flip.getState(image);
      Object.assign(image.style, {
        left: `${to.left}px`,
        top: `${to.top}px`,
        width: `${to.width}px`,
        height: `${to.height}px`,
      });
      Flip.from(state, {
        duration: 0.7,
        ease: "power2.inOut",
        absolute: true,
        onComplete: () => {
          image.remove();
          form.submit();
        },
      });
    } catch {
      form.submit();
    }
  };
  return (
    <form
      method="post"
      action="/api/cart"
      onSubmit={add}
      className={mobile ? "mobile-add-form" : undefined}
    >
      <input type="hidden" name="action" value="add" />
      <input type="hidden" name="sku" value={sku} />
      <input type="hidden" name="locale" value={locale} />
      <button
        className="button button-primary"
        type="submit"
        disabled={!available || submitting}
      >
        {label}
        <span aria-hidden="true">↗</span>
      </button>
    </form>
  );
}
