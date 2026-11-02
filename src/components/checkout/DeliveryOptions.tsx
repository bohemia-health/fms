"use client";

import { useOptimistic, useTransition } from "react";
import { Label } from "@asclepius/ui";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { setDeliveryMethod } from "@/app/checkout/actions";
import type { DeliveryMethod } from "@/app/checkout/delivery";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

// Built on the server from the shipping estimate; this component only
// handles choosing one.
export type DeliveryOption = {
  method: DeliveryMethod;
  title: string; // "Delivers Nov 5 – Nov 7"
  subtitle: string; // carrier service
  label: string; // "Standard Shipping"
  price: number; // postage + packaging, what the customer pays
};

export default function DeliveryOptions({
  section,
  selected,
  options,
  reason,
  className,
}: {
  section: string; // "ready" | "campaign:<id>", the cookie key
  selected: DeliveryMethod;
  options: DeliveryOption[];
  reason: string; // the estimate's reason: "unknown" means no zip yet
  className?: string; // per-button padding differs between layouts
}) {
  const [, start] = useTransition();
  const [current, setCurrent] = useOptimistic(selected);

  // No cards to show: either we have no zip to quote against yet, or the
  // carrier gave nothing back. Same copy as the bag page for each.
  if (options.length === 0) {
    return (
      <p className="text-muted-foreground">
        {reason === "unknown"
          ? "Enter a zip code to see delivery dates"
          : "Shipping will be calculated at checkout"}
      </p>
    );
  }

  return (
    <div role="radiogroup" className="flex flex-col gap-4">
      {options.map((o) => {
        const checked = current === o.method;
        return (
          <Button
            key={o.method}
            variant="outline"
            role="radio"
            aria-checked={checked}
            onClick={() =>
              start(async () => {
                setCurrent(o.method);
                await setDeliveryMethod(section, o.method);
              })
            }
            className={cn(
              "h-auto w-full justify-between px-6 text-left rounded-lg ring-1 ring-foreground/20",
              checked && "ring-2 ring-foreground",
              className,
            )}
          >
            <div className="flex flex-col">
              <p className="text-[1.05rem]">{o.title}</p>
              <p className="text-[1.05rem]">{o.subtitle}</p>
              <Label className="text-[0.76rem] text-foreground/70 mt-1 tracking-snug">
                {o.label}
              </Label>
            </div>
            <p className="text-[1.05rem] tabular-nums">{currency.format(o.price)}</p>
          </Button>
        );
      })}
    </div>
  );
}
