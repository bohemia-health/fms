"use client";
import { useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { container } from "@/lib/layout";
import { Bookmark, Settings, Package } from "lucide-react";

const easeOut = [0.23, 1, 0.32, 1] as const;
const bagLinks = [
  { id: 1, label: "Orders", icon: Package, href: "/orders/list" },
  { id: 2, label: "Your Saves", icon: Bookmark, href: "/saves" },
  { id: 3, label: "Account", icon: Settings, href: "/account" },
];

type Props = { open: boolean; onClose: () => void };

export function BagFlyout({ open, onClose }: Props) {
  const reduceMotion = useReducedMotion();
  const hidden = reduceMotion ? "translateY(0px)" : "translateY(-12px)";

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="bag-flyout"
          role="dialog"
          aria-label="Shopping bag"
          className="absolute inset-x-0 top-full bg-background border-b border-foreground/10 shadow-[0_24px_48px_-24px_rgba(0,0,0,0.35)]"
          initial={{ opacity: 0, transform: hidden }}
          animate={{ opacity: 1, transform: "translateY(0px)" }}
          exit={{
            opacity: 0,
            transform: hidden,
            transition: { duration: 0.18, ease: easeOut },
          }}
          transition={{ duration: 0.28, ease: easeOut }}
        >
          <div className={cn(container, "py-10 md:py-12")}>
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
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function BagBackdrop({ open, onClose }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          aria-hidden
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.18, ease: easeOut } }}
          transition={{ duration: 0.28, ease: easeOut }}
        />
      )}
    </AnimatePresence>
  );
}
