import { Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { QuantityDropdown } from "./QuantityDropdown";
import ProductDetails from "./ProductDetails";
import RemoveFromBagButton from "./RemoveFromBagButton";
import { setQuantity } from "@/app/bag/actions";

import type { BagLine } from "./types";
import { CheckoutLogoBag } from "../icons/checkout-logo-bag";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function BagItemCard({ line }: { line: BagLine }) {
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
            first one keeps its desktop right padding. */}
        <div className="mt-6 flex flex-col gap-4 text-sm leading-snug w-full md:flex-row md:gap-0">
          <div className="flex items-start gap-3 md:pr-40">
            <Truck size={18} strokeWidth={1.25} className="mt-0.5 shrink-0" />
            <div>
              <p>Order today. Delivers to 38671</p>
              <p className="font-semibold">Nov 3 – Nov 10 — Free</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckoutLogoBag
              strokeWidth={1.25}
              className="mt-0.5 size-[18px] shrink-0"
            />
            <div>
              <p>Need it quick? Expedited shipping is available.</p>
              <p className="font-semibold">Nov 3 – Nov 10 — Free</p>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}
