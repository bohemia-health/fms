import TaxHelp from "@/components/bag/TaxHelp";
import { ShipToAccordion, ShipToPanel, ShipToTrigger } from "@/components/bag/ShipTo";
import type { TaxEstimate } from "@/app/bag/tax";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

// The tax row of the bag summary. The row always reads "Estimated tax for:"
// with the ship-to as the trigger; a place we do not collect in, including
// anywhere outside the US, simply shows $0.00.
export default function EstimatedTax({ estimate }: { estimate: TaxEstimate }) {
  return (
    <ShipToAccordion country={estimate.country} postalCode={estimate.postalCode}>
      {/* Row: label, trigger, amount. Same shape as Subtotal and Shipping. */}
      <div className="flex items-baseline justify-between">
        <div className="inline-flex items-baseline gap-1.5">
          {/* The "?" hangs in the gutter (icon 16px + gap 6px) so the label
              lines up with Subtotal and Shipping, like Apple's bag. */}
          <TaxHelp className="-ml-[22px] self-center" />
          <span>Estimated tax for:</span>
          <ShipToTrigger className="text-base" />
        </div>
        <p className="tabular-nums">{currency.format(estimate.tax)}</p>
      </div>

      {/* Panel: below the row, full width. */}
      <ShipToPanel />
    </ShipToAccordion>
  );
}
