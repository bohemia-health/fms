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
   * "chevrons" (default) = the round pair under the row, right-aligned.
   * "dots" = Apple's centered pill: one dot per item, the active one
   * stretched into a bar that slides as the row scrolls.
   */
  nav?: "chevrons" | "dots";
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
  nav = "chevrons",
}: RailProps) {
  const {
    ref,
    canScrollLeft,
    canScrollRight,
    scrollByStep,
    activeIndex,
    count,
    scrollToIndex,
  } = useScrollRail((el) => el.clientWidth * 0.8);

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

      {controls && nav === "dots" && count > 1 && (
        <RailDots
          count={count}
          activeIndex={activeIndex}
          onSelect={scrollToIndex}
        />
      )}

      {controls && nav === "chevrons" && (
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

// Text that moves with Apple's media-card-gallery parallax. apple.com/iphone
// sets two variables on each card's caption from the card's distance `d` to
// the snap edge, in cards: `--parallax-x: (d + d * 1.6) * 120px` (312px per
// card) and `--parallax-opacity: 1 - |d| * 3.2` (gone by 31% of a swipe), the
// same constants at 400px and 1245px cards. The slide is kept as is. The fade
// slope is 2 here, not 3.2: Apple's leaves the middle 38% of a swipe with no
// text at all, which is fine under a finger but reads as a blink on a dot
// click or a trackpad flick; at 2 the outgoing caption reaches zero exactly
// as the incoming one starts, a continuous crossfade. `--rail-d` comes from
// useScrollRail on the item; `--rail-parallax` is a 0/1 switch so reduced
// motion can turn it off without fighting the inline math.
function RailCaption({ className, style, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="rail-caption"
      className={cn(
        "[--rail-parallax:1] motion-reduce:[--rail-parallax:0] will-change-[transform,opacity]",
        className,
      )}
      style={{
        transform:
          "translateX(calc(var(--rail-d, 0) * 312px * var(--rail-parallax)))",
        opacity:
          "calc(1 - max(var(--rail-d, 0), -1 * var(--rail-d, 0)) * 2 * var(--rail-parallax))",
        ...style,
      }}
      {...props}
    />
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

// Apple's gallery paddle, as on apple.com/iphone's media card gallery,
// watched mid-transition: a pill of 8px dots where the current one is a bar
// (48px at desktop, 32px on phones), and when the gallery moves the outgoing
// bar shrinks while the incoming dot grows, both at once, so the filled mass
// looks pushed along the pill in time with the card. Theirs tweens on the
// index change; this rail's version follows the row's continuous position
// `--rail-p` (from useScrollRail, on the wrapper) directly: with
// k = max(0, 1 - |i - p|) a dot is 8px + (bar - 8px) * k wide at
// 30% + 70% * k opacity, so the handoff tracks the cards through the scroll
// tween and under a finger, and is complete exactly when the card lands.
// Pill geometry, same page: 120x56 for two dots, radius 28, 24px from the
// pill edge to the first dot (16px padding + 8px item margin), 16px between
// dots. 56px tall from md up, 40px on phones.
function RailDots({
  count,
  activeIndex,
  onSelect,
}: {
  count: number;
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Choose a slide"
      className="mx-auto mt-8 flex w-fit items-center gap-4 rounded-full bg-foreground/[0.08] px-6 py-4 [--rail-bar:32px] md:py-6 md:[--rail-bar:48px]"
    >
      {Array.from({ length: count }, (_, i) => {
        const active = i === activeIndex;
        const k = `max(0, 1 - max(${i} - var(--rail-p, 0), var(--rail-p, 0) - ${i}))`;
        return (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={active}
            aria-label={`Slide ${i + 1}`}
            onClick={() => onSelect(i)}
            className="h-2 shrink-0 rounded-full bg-foreground"
            style={{
              width: `calc(8px + (var(--rail-bar) - 8px) * ${k})`,
              opacity: `calc(0.3 + 0.7 * ${k})`,
            }}
          />
        );
      })}
    </div>
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

export { Rail, RailItem, RailCaption };
