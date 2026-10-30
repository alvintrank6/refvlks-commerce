"use client";

import type { ReactNode } from "react";

export function DonationSubmit({ children }: { children: ReactNode }) {
  return (
    <button
      className="button button-primary"
      type="submit"
      onClick={(event) => {
        const form = event.currentTarget.form;
        if (!form) return;
        form.dataset.attempted = "true";
        const role = form.querySelector<HTMLInputElement>(
          'input[name="role"]:checked',
        )?.value;
        const recycle = form.querySelector<HTMLInputElement>(
          'input[name="consentRecycle"]',
        );
        if (recycle) recycle.required = role !== "volunteer";
      }}
    >
      {children}
    </button>
  );
}
