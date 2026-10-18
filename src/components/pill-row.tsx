"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useScrollRail } from "./rail/use-scroll-rail";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

type PillRowProps = {
  items: {
    label: string;
    slug?: string;
  }[];
  className?: string;
};

// Apple-style filter row: rounded pills that scroll sideways when they
// overflow. Each edge has a fade plus a chevron that nudges the row along,
// always visible, dimmed when there is nothing left to scroll that way.
// Each pill links to ?category=slug, carrying the current ?q= along.
export default function PillRow({ items, className }: PillRowProps) {
  const params = useSearchParams();
  const active = params.get("category");
  const q = params.get("q");
  const {
    ref: scroller,
    canScrollLeft,
    canScrollRight,
    scrollByStep,
  } = useScrollRail(240);

  return (
    <div className={cn("relative", className)}>
      <div
        ref={scroller}
        className="-my-1 flex gap-4 overflow-x-auto scroll-smooth px-16 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => {
          const isSelected = item.slug ? item.slug === active : active === null;
          return (
            <Link
              scroll={false}
              key={item.label}
              href={{
                pathname: "/repository",
                query: {
                  ...(item.slug && { category: item.slug }),
                  ...(q && { q }),
                },
              }}
              aria-pressed={isSelected}
              className={cn(
                "inline-flex items-center h-14 shrink-0 whitespace-nowrap rounded-full border px-6 text-[17px] transition-colors",
                isSelected
                  ? "border-foreground bg-foreground text-background"
                  : "border-foreground/15 bg-transparent text-foreground hover:border-foreground/40",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* Edge chevrons on a solid block with a vertical divider; pills cut off crisply at the line.
          Always visible; a chevron dims when there is nothing left to scroll that way. */}
      <EdgeControl
        side="left"
        enabled={canScrollLeft}
        onClick={() => scrollByStep(-1)}
      />
      <EdgeControl
        side="right"
        enabled={canScrollRight}
        onClick={() => scrollByStep(1)}
      />
    </div>
  );
}

function EdgeControl({
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
    <div
      className={cn(
        "absolute inset-y-0 flex items-center border-foreground/15 bg-background",
        side === "left" ? "left-0 border-r pr-4" : "right-0 border-l pl-4",
      )}
    >
      <button
        type="button"
        aria-label={side === "left" ? "Scroll left" : "Scroll right"}
        onClick={onClick}
        disabled={!enabled}
        className="flex size-11 items-center justify-center text-foreground/70 transition-colors hover:text-foreground disabled:text-foreground/25"
      >
        <Icon className="size-6" strokeWidth={1.5} />
      </button>
    </div>
  );
}
