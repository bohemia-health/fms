"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { Dose } from "./doses";

export type { Dose };

// Apple's colour swatches, with mg instead of colour: one round dot per dose,
// the same hue stepping from pale to deep across the row so the eye reads
// "more" left to right without a legend. Display-only by default (the store
// card just shows what sizes exist); `selectable` makes it a radio group for
// the product page. `size="sm"` is the card's 24px dot, "md" the page's 32px.
export default function DoseSwatches({
  doses,
  selectable = false,
  selected: controlled,
  onChange,
  size = "sm",
  className,
}: {
  doses: Dose[];
  selectable?: boolean;
  selected?: number;
  onChange?: (index: number, dose: Dose) => void;
  size?: "sm" | "md";
  className?: string;
}) {
  const [internal, setInternal] = useState(0);
  const selected = controlled ?? internal;
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  const pick = (i: number) => {
    setInternal(i);
    onChange?.(i, doses[i]);
  };

  // Radio-group keyboard contract: only the chosen dot is in the tab order,
  // arrows move the choice (and focus) and wrap, Home/End jump to the ends.
  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    const last = doses.length - 1;
    const next =
      e.key === "ArrowRight" || e.key === "ArrowDown"
        ? (i + 1) % doses.length
        : e.key === "ArrowLeft" || e.key === "ArrowUp"
          ? (i + last) % doses.length
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? last
              : null;
    if (next === null) return;
    e.preventDefault();
    pick(next);
    buttons.current[next]?.focus();
  };

  const dot = cn(
    "flex shrink-0 items-center justify-center rounded-full font-medium leading-none tabular-nums tracking-tight",
    size === "sm" ? "size-6 text-[9px]" : "size-8 text-[11px]",
  );

  if (!selectable) {
    return (
      <ul
        aria-label="Doses"
        className={cn("flex items-center gap-1.5", className)}
      >
        {doses.map((dose, i) => (
          <li
            key={dose.id}
            aria-label={`${dose.mg} mg`}
            style={doseStyle(i, doses.length)}
            className={dot}
          >
            {dose.mg}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div
      role="radiogroup"
      aria-label="Dose"
      className={cn("flex flex-wrap items-center gap-2", className)}
    >
      {doses.map((dose, i) => {
        const active = i === selected;
        return (
          <button
            key={dose.id}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={`${dose.mg} mg`}
            tabIndex={active ? 0 : -1}
            ref={(el) => {
              buttons.current[i] = el;
            }}
            onClick={() => pick(i)}
            onKeyDown={(e) => onKeyDown(e, i)}
            style={doseStyle(i, doses.length)}
            className={cn(
              dot,
              // Press feedback at 120ms, lift on hover only for a real pointer.
              "transition-[scale,box-shadow] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)]",
              "[@media(hover:hover)]:hover:scale-110 active:scale-95",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0065CC] focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              active &&
                "ring-2 ring-foreground/70 ring-offset-2 ring-offset-background",
            )}
          >
            {dose.mg}
          </button>
        );
      })}
    </div>
  );
}

// Lightness steps evenly from 0.86 (first dose) to 0.44 (last) at one hue, so
// the ramp looks even however many doses there are. Text flips from deep to
// pale once the dot is dark enough to need it.
function doseStyle(index: number, count: number) {
  const t = count > 1 ? index / (count - 1) : 0;
  const lightness = 0.86 - t * 0.42;
  return {
    backgroundColor: `oklch(${lightness.toFixed(3)} 0.14 285)`,
    color: lightness > 0.66 ? "oklch(0.30 0.10 285)" : "oklch(0.97 0.02 285)",
  };
}
