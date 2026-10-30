"use client";

import { useId, useState, type ReactNode } from "react";

type Hotspot = { part: string; x: number; y: number };
type Part = { part: string; en: string; vi: string };

export function MaterialHotspots({
  children,
  hotspots,
  parts,
  labels,
  locale,
}: {
  children: ReactNode;
  hotspots: Hotspot[];
  parts: Part[];
  labels: Record<string, string>;
  locale: "en" | "vi";
}) {
  const [active, setActive] = useState<string | null>(null);
  const id = useId();
  const selected = parts.find((part) => part.part === active);
  return (
    <div
      className="hotspot-stage"
      onKeyDown={(event) => {
        if (event.key === "Escape") setActive(null);
      }}
    >
      {children}
      {hotspots.map((hotspot) => {
        const part = parts.find((item) => item.part === hotspot.part);
        if (!part) return null;
        return (
          <button
            key={hotspot.part}
            type="button"
            className="material-hotspot"
            style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
            aria-label={`${labels[hotspot.part] ?? hotspot.part}: ${part[locale]}`}
            aria-expanded={active === hotspot.part}
            aria-controls={id}
            onClick={() =>
              setActive(active === hotspot.part ? null : hotspot.part)
            }
          >
            <span aria-hidden="true" />
          </button>
        );
      })}
      <div id={id} className="hotspot-popover" hidden={!selected} role="status">
        {selected && (
          <>
            <strong>{labels[selected.part] ?? selected.part}</strong>
            <p>{selected[locale]}</p>
          </>
        )}
      </div>
    </div>
  );
}
