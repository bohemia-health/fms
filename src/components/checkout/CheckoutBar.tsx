"use client";

import { useEffect, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import { SetLocalNav, SetNavbar } from "@asclepius/ui";

// What the order summary prints. Built on the server by checkoutTotals.
export type OrderSummaryData = {
  items: number; // units across every line
  deliversOn: string | null; // "Nov 4 – Nov 6", "Multiple Dates", null = no zip yet
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
};

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

// The Checkout bar with its "Show Order Summary" flyout. A client component
// because the bar's flyout is a render function, which a page (a server
// component) cannot hand to SetLocalNav itself.
export default function CheckoutBar({
  summary,
}: {
  summary: OrderSummaryData;
}) {
  return (
    <>
      {/* The bar sticks in the navbar's place: same as the shop and repository pages. */}
      <SetNavbar sticky={false} />
      <SetLocalNav
        sticky
        title="Checkout"
        titleClassName="font-medium"
        links={[
          {
            href: "#order-summary",
            label: `Show Order Summary: ${currency.format(summary.total)}`,
            toggleFlyout: true,
            className:
              "text-center font-normal text-[0.83rem] tracking-snug text-[#0065CC] hover:text-[#0065CC] hover:underline",
          },
        ]}
        flyout={({ open, onClose }) => (
          <OrderSummaryDrawer open={open} onClose={onClose} summary={summary} />
        )}
      />
    </>
  );
}

// Slides in from the right like an invoice: the order total, then where
// the order stands. The bar supplies the backdrop and the open state.
const ease = [0.4, 0, 0.2, 1] as const;

// The steps after the delivery choice, in order; the current page's step
// reads dark, the rest muted.
const STEPS = [
  { href: "/checkout/shipping", label: "Shipping Details" },
  { href: "/checkout/payment", label: "Payment" },
  { href: "/checkout/review", label: "Review" },
];

function OrderSummaryDrawer({
  open,
  onClose,
  summary,
}: {
  open: boolean;
  onClose: () => void;
  summary: OrderSummaryData;
}) {
  const reduceMotion = useReducedMotion();
  const pathname = usePathname();
  // Rendered onto <body>: inside the bar, its backdrop-filter would make the
  // bar the containing block and pin a "fixed" drawer to the bar's 48px.
  // false during server render and hydration, true once on the client.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!mounted) return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.aside
          id="order-summary"
          role="dialog"
          aria-label="Order summary"
          className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[26rem] flex-col overflow-y-auto bg-background px-12 pb-12 pt-8 text-foreground shadow-[-24px_0_48px_-24px_rgba(0,0,0,0.35)]"
          initial={reduceMotion ? { opacity: 0 } : { x: "100%" }}
          animate={reduceMotion ? { opacity: 1 } : { x: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { x: "100%" }}
          transition={{ duration: 0.4, ease }}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close order summary"
            className="-mr-4 flex size-9 items-center justify-center self-end rounded-full bg-muted text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" strokeWidth={2} />
          </button>

          <h2 className="mt-6 border-b border-foreground/15 pb-3 text-xl font-medium">
            Your Order Total
          </h2>
          <div className="flex items-center justify-between py-6">
            <p className="font-medium">
              {summary.items} {summary.items === 1 ? "item" : "items"}
            </p>
            <Link href="/bag" className="text-[#0065CC] hover:underline">
              Edit bag
            </Link>
          </div>
          <dl className="flex flex-col gap-1.5 border-b border-foreground/15 pb-6">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd className="tabular-nums">
                {currency.format(summary.subtotal)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt>Shipping</dt>
              <dd className="tabular-nums">
                {currency.format(summary.shipping)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt>Estimated Tax</dt>
              <dd className="tabular-nums">{currency.format(summary.tax)}</dd>
            </div>
          </dl>
          <div className="flex justify-between py-6 font-semibold">
            <p>Total</p>
            <p className="tabular-nums">{currency.format(summary.total)}</p>
          </div>

          <h2 className="mt-8 border-b border-foreground/15 pb-3 text-xl font-medium">
            Your Order Details
          </h2>
          <div className="flex items-start justify-between border-b border-foreground/15 py-6">
            <div>
              <p className="font-medium">Delivers on :</p>
              <p>{summary.deliversOn ?? "Enter a zip code"}</p>
            </div>
            <Link
              href="/checkout"
              onClick={onClose}
              className="text-[#0065CC] hover:underline"
            >
              Change
            </Link>
          </div>
          <ol className="divide-y divide-foreground/15">
            {STEPS.map((step) => (
              <li
                key={step.href}
                className={
                  pathname === step.href
                    ? "py-6 font-medium text-foreground"
                    : "py-6 text-muted-foreground"
                }
              >
                {step.label}
              </li>
            ))}
          </ol>
        </motion.aside>
      )}
    </AnimatePresence>,
    document.body,
  );
}
