"use client";
import * as React from "react";

// Shared scroll state for horizontal rails (PillRow, Rail): which way the row
// can still move, plus a nudge helper. `step` is a pixel count, or a function
// of the scroller for steps that depend on its width.
export type ScrollPace = "snap" | "drift";

export function useScrollRail(step: number | ((el: HTMLDivElement) => number)) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);
  // Which item sits at the row's snap edge right now, and how many there are.
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [count, setCount] = React.useState(0);

  // Re-check both directions whenever the row scrolls or resizes.
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function update() {
      if (!el) return;
      setCanScrollLeft(el.scrollLeft > 0);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);

      // The active item is the one whose left edge is nearest the scroll
      // position. Items snap to the padding edge, so measure from there.
      const items = Array.from(el.children) as HTMLElement[];
      setCount(items.length);
      const padding = parseFloat(getComputedStyle(el).paddingLeft) || 0;
      // One item step, for expressing each item's offset in item units.
      const step =
        items.length > 1
          ? items[1].offsetLeft - items[0].offsetLeft
          : items[0]?.offsetWidth || 1;
      // Continuous position in items (0 = first item snapped, 1.5 = halfway
      // between the second and third). Published on the Rail wrapper, which
      // holds both the scroller and the dots, so RailDots can follow it.
      if (items[0] && el.parentElement) {
        const progress =
          (el.scrollLeft - (items[0].offsetLeft - padding)) / step;
        el.parentElement.style.setProperty("--rail-p", progress.toFixed(4));
      }
      let nearest = 0;
      let nearestDistance = Infinity;
      items.forEach((item, i) => {
        const offset = item.offsetLeft - padding - el.scrollLeft;
        const distance = Math.abs(offset);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearest = i;
        }
        // Apple's gallery parallax input: how far this item sits from the
        // snap edge, in items (0 = snapped, 1 = one item to the right, -0.4
        // = 40% scrolled past). Set straight on the element, no re-render;
        // RailCaption reads it.
        item.style.setProperty("--rail-d", (offset / step).toFixed(4));
      });
      setActiveIndex(nearest);
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

  // Our own tween for programmatic scrolls. The browser's `behavior: "smooth"`
  // is about 300ms in Chrome with a fixed curve, which makes the caption
  // parallax read as a blink. This runs 1.2s for one item (a little longer
  // for several) on an ease-in-out quartic. While it runs, scroll-snap and CSS scroll-behavior are switched off
  // on the element: with them on, Chrome snaps each programmatic scrollLeft to
  // the nearest snap point and animates it, so the tween would stutter. They
  // come back at the end, on a snap point, so nothing visibly moves. A wheel,
  // touch or pointer-down from the user cancels the tween and hands over.
  const tween = React.useRef<{ frame: number; finish: () => void } | null>(
    null,
  );

  // "snap" is the dot-click / chevron tween. "drift" is for autoplay: nobody
  // asked for this particular move, so it should not grab the eye. Longer,
  // and on a sine curve whose peak speed is 1.6x the average instead of the
  // quartic's 4x, so the card glides across rather than lunging mid-way.
  function animateTo(
    el: HTMLDivElement,
    target: number,
    pace: ScrollPace = "snap",
  ) {
    tween.current?.finish();
    const max = el.scrollWidth - el.clientWidth;
    target = Math.max(0, Math.min(max, target));
    const start = el.scrollLeft;
    const delta = target - start;
    if (Math.abs(delta) < 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.scrollTo({ left: target, behavior: "auto" });
      return;
    }

    const items = Array.from(el.children) as HTMLElement[];
    const itemStep =
      items.length > 1
        ? items[1].offsetLeft - items[0].offsetLeft
        : el.clientWidth;
    const span = Math.abs(delta) / itemStep;
    // 1.2s for one item, +200ms per extra item, capped at 1.8s. Ease-in-out
    // quartic: a longer dwell at both ends than cubic, so the card settles
    // rather than stops. 800ms cubic was judged too fast.
    const duration =
      pace === "drift"
        ? Math.min(2800, 2000 + 200 * Math.max(0, span - 1))
        : Math.min(1800, 1200 + 200 * Math.max(0, span - 1));
    const ease =
      pace === "drift"
        ? (t: number) => (1 - Math.cos(Math.PI * t)) / 2
        : (t: number) =>
            t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;

    const prevBehavior = el.style.scrollBehavior;
    const prevSnap = el.style.scrollSnapType;
    el.style.scrollBehavior = "auto";
    el.style.scrollSnapType = "none";

    const cancelEvents = ["wheel", "touchstart", "pointerdown"] as const;
    const finish = () => {
      cancelAnimationFrame(current.frame);
      cancelEvents.forEach((e) => el.removeEventListener(e, finish));
      el.style.scrollBehavior = prevBehavior;
      el.style.scrollSnapType = prevSnap;
      tween.current = null;
    };
    const t0 = performance.now();
    const frame = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      el.scrollLeft = start + delta * ease(p);
      if (p < 1) current.frame = requestAnimationFrame(frame);
      else finish();
    };
    const current = { frame: requestAnimationFrame(frame), finish };
    tween.current = current;
    cancelEvents.forEach((e) =>
      el.addEventListener(e, finish, { passive: true }),
    );
  }

  function scrollByStep(direction: -1 | 1) {
    const el = ref.current;
    if (!el) return;
    const px = typeof step === "function" ? step(el) : step;
    animateTo(el, el.scrollLeft + direction * px);
  }

  function scrollToIndex(index: number, pace: ScrollPace = "snap") {
    const el = ref.current;
    const item = el?.children[index] as HTMLElement | undefined;
    if (!el || !item) return;
    const padding = parseFloat(getComputedStyle(el).paddingLeft) || 0;
    animateTo(el, item.offsetLeft - padding, pace);
  }

  return {
    ref,
    canScrollLeft,
    canScrollRight,
    scrollByStep,
    activeIndex,
    count,
    scrollToIndex,
  };
}
