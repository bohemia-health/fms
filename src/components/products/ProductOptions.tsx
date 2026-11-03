"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { cn } from "cn";
import { type Choice, toChoice } from "./options";

export { configOptions, PRODUCT_OPTIONS_CONFIG } from "./options";
export type { Choice, ProductOption } from "./options";

// Uncontrolled by default (own state). Pass `value` and `onChange` to own
// the selection from outside, as the product page's Configurator does so
// size, vendor and quantity can see each other.
export default function ProductOptions({
  choices: rawChoices,
  className,
  value,
  onChange,
}: {
  choices: Choice[];
  className?: string;
  value?: string;
  onChange?: (label: string) => void;
}) {
  const choices = rawChoices.map(toChoice);
  const [own, setOwn] = useState(choices[0]?.label);
  const current = value ?? own;
  const setCurrent = (label: string) => {
    setOwn(label);
    onChange?.(label);
  };
  return (
    // max-w-md: below lg the column is the full page width and the cards
    // would stretch across a tablet; Apple caps them like its checkout button.
    <div className={cn("flex w-full max-w-md flex-col gap-4", className)}>
      {/* flex-col: one card per row. flex alone is a row and the choices run inline. */}
      <div className="flex flex-col gap-2 lg:gap-3" role="radiogroup">
        {choices.map((c) => {
          const isChecked = current === c.label;

          return (
            <div className="flex flex-col" key={c.label}>
              <Button
                variant="outline"
                role="radio"
                aria-checked={isChecked}
                aria-disabled={c.disabled || undefined}
                onClick={() => !c.disabled && setCurrent(c.label)}
                // The checkout button's metrics (56px, 17px regular, 12px
                // corners) with a static fill: selecting only turns the ring
                // the site blue. corner-shape: squircle is Apple's continuous
                // curve; browsers without it keep the plain radius.
                className={cn(
                  "min-h-16 w-full justify-between rounded-2xl py-3 lg:min-h-32 [corner-shape:squircle] border-transparent px-5 text-left text-[17px] font-normal tracking-normal ring-1 ring-foreground/40 hover:bg-transparent",
                  isChecked && "ring-2 ring-[#0065CC]",
                  c.disabled && "cursor-not-allowed opacity-40",
                )}
              >
                <span className="flex flex-col items-start">
                  <span className="font-medium">{c.label}</span>
                  {c.note && (
                    <span className="text-xs font-normal text-muted-foreground">
                      {c.note}
                    </span>
                  )}
                </span>
                {c.price && (
                  // whitespace-normal: Button sets whitespace-nowrap and
                  // white-space inherits, so without this the price never
                  // wraps however narrow its box.
                  <div className="h-auto max-w-24 text-right text-sm leading-snug whitespace-normal text-foreground">
                    {c.price}
                  </div>
                )}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
