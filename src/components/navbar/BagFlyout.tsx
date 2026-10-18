"use client";
import { useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { container } from "@/lib/layout";
import { Bookmark, Settings, Package } from "lucide-react";

import type { BagLine } from "../bag/types";
import BagItem from "../bag/BagItem";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

// Motion: the panel is a height reveal, so its bottom edge slides down over
// text that stays put, and the text fades in once the edge is mostly down.
// On close the order flips: text blinks out first (100ms), then the edge
// slides back up. Under reduced motion the height snaps and only opacity moves.
// Gentle in-out for the edge so it eases away and settles, not snaps.
const slide = [0.4, 0, 0.2, 1] as const;
const fade = [0.25, 0.1, 0.25, 1] as const;

const panelVariants = {
  closed: {
    height: 0,
    transition: { duration: 0.42, ease: slide, delay: 0.12 },
  },
  open: { height: "auto", transition: { duration: 0.5, ease: slide } },
};
const contentVariants = {
  closed: { opacity: 0, transition: { duration: 0.14, ease: fade } },
  open: { opacity: 1, transition: { duration: 0.32, ease: fade, delay: 0.2 } },
};
const backdropVariants = {
  closed: {
    opacity: 0,
    transition: { duration: 0.42, ease: fade, delay: 0.08 },
  },
  open: { opacity: 1, transition: { duration: 0.5, ease: fade } },
};
const bagLinks = [
  { id: 1, label: "Orders", icon: Package, href: "/orders/list" },
  { id: 2, label: "Your Saves", icon: Bookmark, href: "/saves" },
  { id: 3, label: "Account", icon: Settings, href: "/account" },
];

type BackdropProps = { open: boolean; onClose: () => void };
type Props = { open: boolean; onClose: () => void; lines: BagLine[] };

export function BagFlyout({ open, onClose, lines }: Props) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="bag-flyout"
          role="dialog"
          aria-label="Shopping bag"
          className="absolute inset-x-0 top-full overflow-hidden bg-background border-b border-foreground/10 shadow-[0_24px_48px_-24px_rgba(0,0,0,0.35)]"
          variants={reduceMotion ? undefined : panelVariants}
          initial="closed"
          animate="open"
          exit="closed"
        >
          <motion.div
            variants={contentVariants}
            className={cn(container, "py-10 md:py-12")}
          >
            {lines.length === 0 ? (
              <>
                <h2 className="text-2xl font-medium">Your Bag is empty.</h2>
                <p className="mt-2 text-[11.5px] font-light text-muted-foreground">
                  <Link
                    href="/shop"
                    onClick={onClose}
                    className="text-[#007AFF] underline"
                  >
                    Shop Now
                  </Link>{" "}
                </p>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-medium">Bag</h2>
                <ul className="mt-6 divide-y divide-foreground/10">
                  {lines.map((line) => (
                    <BagItem key={line.itemId} line={line} />
                  ))}
                </ul>
                <div className="mt-6 flex items-center justify-between gap-6">
                  <p className="text-[13px] font-light text-muted-foreground">
                    Subtotal{" "}
                    <span className="font-medium text-foreground">
                      {money.format(
                        lines.reduce((sum, l) => sum + l.price * l.quantity, 0),
                      )}
                    </span>
                  </p>
                  <Link
                    href="/bag"
                    onClick={onClose}
                    className="rounded-full bg-[#0071E3] px-5 py-2 text-[13px] font-medium text-white transition-colors hover:bg-[#0077ED]"
                  >
                    View Bag
                  </Link>
                </div>
              </>
            )}

            <h3 className="mt-10 text-xs font-light tracking-wider text-muted-foreground">
              My Profile
            </h3>
            <ul className="mt-3 space-y-2 text-xs font-medium">
              {bagLinks.map(({ id, href, label, icon: IconComponent }) => (
                <li key={id}>
                  <Link
                    href={href}
                    onClick={onClose}
                    className="flex items-center justify-start gap-3 text-foreground/80 hover:text-foreground transition-colors"
                  >
                    <IconComponent size={11} />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function BagBackdrop({ open, onClose }: BackdropProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          aria-hidden
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-md"
          variants={backdropVariants}
          initial="closed"
          animate="open"
          exit="closed"
        />
      )}
    </AnimatePresence>
  );
}
