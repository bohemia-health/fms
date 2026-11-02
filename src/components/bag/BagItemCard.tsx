import { Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { QuantityDropdown } from "./QuantityDropdown";
import ProductDetails from "./ProductDetails";
import RemoveFromBagButton from "./RemoveFromBagButton";
import { setQuantity } from "@/app/bag/actions";

import type { BagLine } from "./types";
import type { ShippingEstimate } from "@/app/bag/shipping";
import { CheckoutLogoBag } from "../icons/checkout-logo-bag";
import { ShipToAccordion, ShipToPanel, ShipToTrigger } from "./ShipTo";
import { arrives } from "./arrives";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function BagItemCard({
  line,
  shipping,
}: {
  line: BagLine;
  shipping: ShippingEstimate;
}) {
  const standard = shipping.rate;
  const expedited = shipping.expedited;
  return (
    <li className="flex gap-4 mt-8 py-10 sm:gap-8 md:gap-10 md:py-14 border-b">
      <div className="relative size-20 shrink-0 sm:size-28 md:size-40">
        <Image
          src={line.image ?? "/store/mito-vial.png"}
          alt=""
          fill
          className="object-contain"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-col gap-4 border-b border-foreground/15 pb-8 md:flex-row md:gap-8">
          <div className="min-w-0 md:flex-[3]">
            <h1 className="text-xl font-semibold tracking-tight leading-tight md:text-2xl">
              {line.name} {line.size}
            </h1>
            <ProductDetails line={line} />
          </div>
          <div className="md:flex-1">
            {/* A bound server action is serializable, so it can cross into
                the client component as a plain callback. */}
            <QuantityDropdown
              defaultValue={line.quantity}
              onQuantityChange={setQuantity.bind(null, line.itemId)}
            />
          </div>

          <div className="flex flex-col gap-3 md:flex-[2] md:items-end md:text-right">
            <p className="text-2xl font-semibold leading-tight tracking-tight tabular-nums">
              {currency.format(line.price * line.quantity)}
            </p>
            <div className="flex gap-4 text-md md:flex-col md:items-end md:gap-1.5">
              <RemoveFromBagButton itemId={line.itemId} />
              <Link href="/" className="text-[#0065CC] underline">
                Save for Later
              </Link>
            </div>
          </div>
          {/* End of Product Details Section */}
        </div>

        {/* Delivery notes: stacked on phones, side by side from md where the
            first one keeps its desktop right padding. The ship-to trigger
            sits on the first line; its panel opens under both notes. */}
        <ShipToAccordion
          country={shipping.country}
          postalCode={shipping.postalCode}
          className="mt-6 text-sm leading-snug"
        >
          <div className="flex w-full flex-col gap-4 md:flex-row md:gap-0">
            <div className="flex items-start gap-3 md:shrink-0 md:pr-40">
              <Truck size={18} strokeWidth={1.25} className="mt-0.5 shrink-0" />
              <div>
                <div className="flex items-baseline gap-1.5 whitespace-nowrap">
                  <span>Order today. Delivers to</span>
                  <ShipToTrigger className="text-sm" />
                </div>
                <p className="font-semibold">
                  {standard
                    ? `${arrives(standard, 2)} — ${currency.format(shipping.total)}`
                    : shipping.reason === "unavailable"
                      ? "Shipping will be calculated at checkout"
                      : "Enter a zip code to see delivery dates"}
                </p>
              </div>
            </div>
            {expedited && (
              <div className="flex items-start gap-3">
                <CheckoutLogoBag
                  strokeWidth={1.25}
                  className="mt-0.5 size-[18px] shrink-0"
                />
                <div>
                  <p>Need it quick? Expedited shipping is available.</p>
                  <p className="font-semibold">
                    {arrives(expedited, 1)} —{" "}
                    {currency.format(expedited.amount + shipping.materialCost)}
                  </p>
                </div>
              </div>
            )}
          </div>
          <ShipToPanel />
        </ShipToAccordion>
      </div>
    </li>
  );
}
