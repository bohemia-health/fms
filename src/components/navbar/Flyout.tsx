"use client";
import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { container } from "@/lib/layout";

// The navbar flyout shell: the panel that drops from under the bar, and the
// page backdrop behind it. Bag and Search each put their own content inside.
//
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

type FlyoutProps = {
  /** DOM id the trigger button points at with aria-controls. */
  id: string;
  /** Accessible name for the dialog, e.g. "Shopping bag". */
  label: string;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export function Flyout({ id, label, open, onClose, children }: FlyoutProps) {
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
          id={id}
          role="dialog"
          aria-label={label}
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
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

type BackdropProps = { open: boolean; onClose: () => void };

export function FlyoutBackdrop({ open, onClose }: BackdropProps) {
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
