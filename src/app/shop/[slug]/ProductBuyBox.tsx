"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import AddToBagButton from "@/components/bag/AddToBagButton";
import DoseSwatches from "@/components/store/DoseSwatches";
import { dosesFrom } from "@/components/store/doses";
import type { StoreVariant } from "@/components/store/types";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

// The part of the product page that changes with the chosen size: the dose
// dots (or text pills when a size is not a number of mg), the chosen size's
// price, and Add to Bag bound to that exact item. State lives here so the
// page around it stays a server component.
export default function ProductBuyBox({
  variants,
}: {
  variants: StoreVariant[];
}) {
  const [selected, setSelected] = useState(0);
  const variant = variants[selected];
  const doses = dosesFrom(variants);
  const allMg = doses.length === variants.length;

  if (!variant) {
    return (
      <p className="mt-10 text-sm font-light text-muted-foreground">
        No sizes listed yet.
      </p>
    );
  }

  return (
    <div className="mt-10">
      <div className="flex items-baseline justify-between">
        <h2 className="text-[14px] font-medium">Dose</h2>
        <p className="text-[14px] font-light text-muted-foreground tabular-nums">
          {variant.mg != null ? `${variant.mg} mg` : variant.size}
          <span className="capitalize"> · {variant.form}</span>
        </p>
      </div>

      {allMg ? (
        <DoseSwatches
          className="mt-4"
          size="md"
          selectable
          doses={doses}
          selected={selected}
          onChange={setSelected}
        />
      ) : (
        <div role="radiogroup" aria-label="Size" className="mt-4 flex flex-wrap gap-2">
          {variants.map((v, i) => {
            const active = i === selected;
            return (
              <button
                key={v.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setSelected(i)}
                className={cn(
                  "rounded-full px-4 py-2 text-[14px] ring-1 transition-[background-color,box-shadow,scale] duration-150 ease-out active:scale-[0.97]",
                  active
                    ? "bg-foreground text-background ring-foreground"
                    : "ring-foreground/20 hover:ring-foreground/50",
                )}
              >
                {v.size}
              </button>
            );
          })}
        </div>
      )}

      <p className="mt-8 text-[28px] font-medium tracking-tight tabular-nums">
        {variant.price != null ? (
          money.format(variant.price)
        ) : (
          <span className="text-[20px] text-[#0065CC]">View pricing</span>
        )}
      </p>

      <AddToBagButton itemId={variant.id} pill className="mt-5 max-w-xs" />
    </div>
  );
}
