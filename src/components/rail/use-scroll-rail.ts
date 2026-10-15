"use client";
import * as React from "react";

// Shared scroll state for horizontal rails (PillRow, Rail): which way the row
// can still move, plus a nudge helper. `step` is a pixel count, or a function
// of the scroller for steps that depend on its width.
export function useScrollRail(
  step: number | ((el: HTMLDivElement) => number),
) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);

  // Re-check both directions whenever the row scrolls or resizes.
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function update() {
      if (!el) return;
      setCanScrollLeft(el.scrollLeft > 0);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    }

    update();
    el.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, []);

  function scrollByStep(direction: -1 | 1) {
    const el = ref.current;
    if (!el) return;
    const px = typeof step === "function" ? step(el) : step;
    el.scrollBy({ left: direction * px, behavior: "smooth" });
  }

  return { ref, canScrollLeft, canScrollRight, scrollByStep };
}
