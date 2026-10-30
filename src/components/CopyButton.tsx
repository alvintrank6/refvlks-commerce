"use client";

import { useState } from "react";

export function CopyButton({
  value,
  copy,
  copied,
}: {
  value: string;
  copy: string;
  copied: string;
}) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className="copy-button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setDone(true);
          window.setTimeout(() => setDone(false), 2000);
        } catch {
          setDone(false);
        }
      }}
    >
      <span aria-live="polite">{done ? copied : copy}</span>
    </button>
  );
}
