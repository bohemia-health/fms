"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useScrollRail } from "@/components/rail/use-scroll-rail";

export type GallerySlide = {
  key: string;
  image: { src: string; alt: string };
  /** "contain" (default) keeps the render whole; "cover" fills the frame. */
  fit?: "contain" | "cover";
  /** Extra classes for the image: object position, padding for a cut-out. */
  imageClassName?: string;
  /** HTML copy over the frame's top band, sized in cqw by the caller. */
  caption?: React.ReactNode;
};

/**
 * The product page's gallery, in Apple's buy-page shape: one frame, one
 * slide visible at a time, snap-scrolled, with the chevrons-and-dots pill
 * overlaid at the bottom. Other slides are off-frame, never peeking in.
 * Built on the Rail's scroll hook, not the Rail itself: the Rail is laid
 * out on the store column's gutters, and this lives inside a frame.
 */
export default function Gallery({
  slides,
  className,
}: {
  slides: GallerySlide[];
  className?: string;
}) {
  const {
    ref,
    canScrollLeft,
    canScrollRight,
    scrollByStep,
    activeIndex,
    count,
    scrollToIndex,
  } = useScrollRail((el) => el.clientWidth);

  return (
    <section
      className={cn(
        "@container relative aspect-[4096/2624] w-full overflow-clip rounded-[clamp(16px,2.22vw,28px)] bg-[#f5f5f7] dark:bg-[#1d1d1f]",
        className,
      )}
    >
      <div
        ref={ref}
        aria-label="Product images"
        className="flex h-full snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((s, i) => (
          <div
            key={s.key}
            className="relative h-full w-full shrink-0 snap-start"
          >
            {s.caption && (
              <p className="absolute top-[clamp(16px,3.4cqw,44px)] right-[clamp(16px,3.4cqw,44px)] left-[clamp(16px,3.4cqw,44px)] z-10 text-[clamp(14px,2.1cqw,34px)] leading-tight tracking-tight text-muted-foreground">
                {s.caption}
              </p>
            )}
            <Image
              src={s.image.src}
              alt={s.image.alt}
              fill
              priority={i === 0}
              sizes="(min-width: 1024px) 70vw, 100vw"
              className={cn(
                s.fit === "cover" ? "object-cover" : "object-contain",
                s.imageClassName,
              )}
            />
          </div>
        ))}
      </div>

      {count > 1 && (
        <div className="absolute bottom-[clamp(12px,3cqw,40px)] left-1/2 z-10 flex -translate-x-1/2 items-center gap-3">
          <Arrow
            side="left"
            enabled={canScrollLeft}
            onClick={() => scrollByStep(-1, "quick")}
          />
          <div
            role="tablist"
            aria-label="Choose an image"
            className="flex h-10 items-center gap-2.5 rounded-full bg-foreground/[0.08] px-4"
          >
            {Array.from({ length: count }, (_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === activeIndex}
                aria-label={`Image ${i + 1} of ${count}`}
                onClick={() => scrollToIndex(i, "quick")}
                className={cn(
                  "size-2 rounded-full transition-colors",
                  i === activeIndex
                    ? "bg-foreground"
                    : "bg-foreground/45 hover:bg-foreground/60",
                )}
              />
            ))}
          </div>
          <Arrow
            side="right"
            enabled={canScrollRight}
            onClick={() => scrollByStep(1, "quick")}
          />
        </div>
      )}
    </section>
  );
}

function Arrow({
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
      aria-label={side === "left" ? "Previous image" : "Next image"}
      disabled={!enabled}
      onClick={onClick}
      className="flex size-10 items-center justify-center rounded-full bg-foreground/[0.08] text-foreground transition-colors hover:bg-foreground/15 disabled:opacity-30 disabled:hover:bg-foreground/[0.08]"
    >
      <Icon className="size-5" strokeWidth={2.25} />
    </button>
  );
}
