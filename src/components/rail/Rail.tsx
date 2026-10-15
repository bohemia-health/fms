"use client";
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useScrollRail } from "./use-scroll-rail";

type RailProps = {
  children: React.ReactNode;
  /** Goes on the scroller: use it for the gap between items. */
  className?: string;
  /** Accessible name for the row, e.g. "MITO products". */
  label?: string;
  /** false = no chevron pair below the row (short rows like the category chips). */
  controls?: boolean;
  /**
   * true = the row scrolls inside the store column and clips at its edge.
   * Default is the Apple bleed: items run to the viewport edge while the
   * first one still starts on the column's text edge.
   */
  contained?: boolean;
};

// Horizontal rail aligned to the store column (1520px max, 16px padding, same
// as the store header). By default the scroller is full-viewport wide with a
// gutter that puts the first item on the column's text edge (1488 = 1520
// minus padding), so items bleed off the window edge. `contained` makes the
// scroller the column itself. The LocalNav keeps its own 980px column.
// A pair of round chevrons under the row, right-aligned to the column,
// nudges it along most of a viewport at a time; both dim when the row fits.
export default function Rail({
  children,
  className,
  label,
  controls = true,
  contained = false,
}: RailProps) {
  const { ref, canScrollLeft, canScrollRight, scrollByStep } = useScrollRail(
    (el) => el.clientWidth * 0.8,
  );

  return (
    <div>
      <div
        ref={ref}
        aria-label={label}
        className={cn(
          "flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth",
          contained
            ? "mx-auto w-full max-w-[1520px] px-4 scroll-px-4"
            : "px-[max(1rem,calc((100%-1488px)/2))] scroll-px-[max(1rem,calc((100%-1488px)/2))]",
          // Vertical room so card shadows and hover lift are not clipped.
          "-my-5 py-5",
          "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          className,
        )}
      >
        {children}
      </div>

      {controls && (
        <div className="mx-auto mt-6 flex w-full max-w-[1520px] justify-end gap-3 px-4">
          <RailButton
            side="left"
            enabled={canScrollLeft}
            onClick={() => scrollByStep(-1)}
          />
          <RailButton
            side="right"
            enabled={canScrollRight}
            onClick={() => scrollByStep(1)}
          />
        </div>
      )}
    </div>
  );
}

// One item in a Rail: snaps to the column edge and never shrinks. Size it
// with className.
function RailItem({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="rail-item"
      className={cn("shrink-0 snap-start", className)}
      {...props}
    />
  );
}

function RailButton({
  side,
  enabled,
  onClick,
}: {
  side: "left" | "right";
  enabled: boolean;
  onClick: () => void;
}) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      aria-label={side === "left" ? "Scroll left" : "Scroll right"}
      onClick={onClick}
      disabled={!enabled}
      className={cn(
        "flex size-9 items-center justify-center rounded-full bg-foreground/[0.08] text-foreground",
        "transition-[background-color,transform] duration-150 ease-out",
        "hover:bg-foreground/[0.14] active:scale-95",
        "disabled:pointer-events-none disabled:opacity-30",
      )}
    >
      <Icon className="size-5" strokeWidth={1.75} />
    </button>
  );
}

export { Rail, RailItem };
