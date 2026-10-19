"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronDownIcon } from "lucide-react";
import type { BagLine } from "./types";

// Same curve and timings as the bag flyout so the two reveals feel related:
// the panel's bottom edge slides down over text that fades in just behind it.
const slide = [0.4, 0, 0.2, 1] as const;
const fade = [0.25, 0.1, 0.25, 1] as const;

// "Show product details" disclosure under a bag line. Lists the batches that
// point at this item (batch.item_id): number, vendor, cap/crimp, COA link.
export default function ProductDetails({ line }: { line: BagLine }) {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const { batches } = line;

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={`details-${line.itemId}`}
        className="mt-2 inline-flex items-center gap-0.5 text-md text-[#0065CC] hover:underline"
      >
        {open ? "Hide" : "Show"} product details
        {/* The chevron turns through 180° while the panel is open. */}
        <motion.span
          className="inline-flex"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3, ease: slide }}
        >
          <ChevronDownIcon className="size-4" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="details"
            id={`details-${line.itemId}`}
            className="overflow-hidden"
            initial={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={
              reduceMotion
                ? { opacity: 1 }
                : {
                    height: "auto",
                    opacity: 1,
                    transition: {
                      height: { duration: 0.4, ease: slide },
                      opacity: { duration: 0.3, ease: fade, delay: 0.1 },
                    },
                  }
            }
            exit={
              reduceMotion
                ? { opacity: 0 }
                : {
                    height: 0,
                    opacity: 0,
                    transition: {
                      height: { duration: 0.32, ease: slide, delay: 0.06 },
                      opacity: { duration: 0.14, ease: fade },
                    },
                  }
            }
          >
            <div className="flex flex-col gap-4 pt-4 text-sm">
              {batches.length === 0 && (
                <p className="text-muted-foreground">
                  No batch has been assigned to this item yet.
                </p>
              )}
              {batches.map((b) => (
                <dl
                  key={b.id}
                  className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1"
                >
                  <dt className="text-muted-foreground">Batch</dt>
                  <dd className="tabular-nums">{b.number}</dd>

                  <dt className="text-muted-foreground">Vendor</dt>
                  <dd>{b.vendor}</dd>

                  {(b.cap || b.crimp) && (
                    <>
                      <dt className="text-muted-foreground">Vial</dt>
                      <dd>
                        {[b.cap && `${b.cap} cap`, b.crimp && `${b.crimp} crimp`]
                          .filter(Boolean)
                          .join(", ")}
                      </dd>
                    </>
                  )}

                  <dt className="text-muted-foreground">
                    Lab {b.coas.length === 1 ? "report" : "reports"}
                  </dt>
                  <dd>
                    {b.coas.length === 0 ? (
                      <span className="text-muted-foreground">Not on file</span>
                    ) : (
                      <ul className="flex flex-wrap gap-x-4 gap-y-1">
                        {b.coas.map((c) => (
                          <li key={c.id}>
                            <a
                              href={c.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#0065CC] hover:underline"
                            >
                              {c.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </dd>
                </dl>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
