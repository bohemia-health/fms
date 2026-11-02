"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { setShipTo } from "@/app/bag/actions";

// The "where are you?" disclosure the bag uses in two places: the tax row
// and each line's delivery note. The trigger shows the postal code (or an
// invitation to enter one) on the line itself; the panel opens below with a
// postal code field. The country is never asked for: it comes from where the
// shopper is browsing from, and the real address at checkout settles it.
// Apply posts to a Server Function that sets cookies, the page re-renders
// with new estimates, and the panel shuts.
//
// Three pieces instead of one so a server component can lay out the line
// around the trigger and put the panel wherever it belongs; Base UI links
// trigger and panel through context, not nesting.

type ShipToValue = { country: string; postalCode: string | null; close: () => void };
const Ctx = createContext<ShipToValue | null>(null);

function useShipTo() {
  const v = useContext(Ctx);
  if (!v) throw new Error("ShipTo pieces must sit inside <ShipToAccordion>");
  return v;
}

export function ShipToAccordion({
  country,
  postalCode,
  className,
  children,
}: {
  country: string;
  postalCode: string | null;
  className?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState<string[]>([]);
  const close = () => setOpen([]);
  return (
    <Ctx.Provider value={{ country, postalCode, close }}>
      <Accordion className={cn("w-full", className)} value={open} onValueChange={setOpen}>
        <AccordionItem value="ship-to">{children}</AccordionItem>
      </Accordion>
    </Ctx.Provider>
  );
}

export function ShipToTrigger({ className }: { className?: string }) {
  const { country, postalCode } = useShipTo();
  const text = postalCode
    ? country === "US"
      ? postalCode
      : `${postalCode}, ${country}`
    : country === "US"
      ? "Enter zip code"
      : "Enter postal code";
  return (
    // py-0 and flex-none cancel the wrapper's py-2.5 and flex-1, which would
    // otherwise make the line taller than its neighbours.
    <AccordionTrigger
      className={cn("flex-none py-0 font-normal text-[#0065CC] hover:underline", className)}
    >
      {text}
      <ChevronDownIcon className="size-4 transition-transform group-data-open/accordion-trigger:rotate-180" />
    </AccordionTrigger>
  );
}

export function ShipToPanel({ className }: { className?: string }) {
  const { country, postalCode, close } = useShipTo();
  const us = country === "US";

  async function apply(formData: FormData) {
    await setShipTo(formData);
    close();
  }

  return (
    <AccordionContent className={cn("pt-3", className)}>
      <form action={apply} className="flex items-center gap-5">
        <input type="hidden" name="country" value={country} />

        <div className="relative w-full max-w-[360px]">
          {/* Keyed on the saved value so a new estimate remounts the field
              with its new default; Base UI warns if defaultValue changes. */}
          <Input
            key={`${country}:${postalCode ?? ""}`}
            name="postal"
            inputMode={us ? "numeric" : "text"}
            autoComplete="postal-code"
            placeholder={us ? "Zip Code" : "Postal Code"}
            defaultValue={postalCode ?? ""}
            aria-label={us ? "Zip code" : "Postal code"}
            className="h-14 rounded-xl border-foreground/30 pr-20 pl-4 text-base tabular-nums md:text-base"
          />
          <button
            type="submit"
            className="absolute inset-y-0 right-4 text-base text-[#0065CC] hover:underline"
          >
            Apply
          </button>
        </div>

        <button type="button" onClick={close} className="text-base text-[#0065CC] underline">
          Cancel
        </button>
      </form>
    </AccordionContent>
  );
}
