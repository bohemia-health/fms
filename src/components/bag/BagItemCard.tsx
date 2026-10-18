import { Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { QuantityDropdown } from "./QuantityDropdown";
import ProductDetails from "./ProductDetails";

import type { BagLine } from "./types";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function BagItemCard({ line }: { line: BagLine }) {
  return (
    <li className="flex gap-8 mt-8 py-14 md:gap-10 border-b">
      <div className="relative size-28 shrink-0 md:size-40">
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
            <h1 className="text-2xl font-semibold tracking-tight leading-tight">
              {line.name} {line.size}
            </h1>
            <ProductDetails line={line} />
          </div>
          <div className="md:flex-1">
            <QuantityDropdown defaultValue={line.quantity} />
          </div>

          <div className="flex flex-col gap-3 md:flex-[2] md:items-end md:text-right">
            <p className="text-2xl font-semibold leading-tight tracking-tight tabular-nums">
              {currency.format(line.price * line.quantity)}
            </p>
            <div className="flex gap-4 text-md md:flex-col md:items-end md:gap-1.5">
              <Link href="/" className="text-[#0065CC] underline">
                Remove
              </Link>
              <Link href="/" className="text-[#0065CC] underline">
                Save for Later
              </Link>
            </div>
          </div>
          {/* End of Product Details Section */}
        </div>

        <div className="mt-6 flex text-sm leading-snug w-full">
          <div className="flex items-start gap-3 pr-40">
            <Truck size={18} strokeWidth={1.25} className="mt-0.5 shrink-0" />
            <div>
              <p>Order today. Delivers to 38671</p>
              <p className="font-semibold">Nov 3 – Nov 10 — Free</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Truck size={18} strokeWidth={1.25} className="mt-0.5 shrink-0" />
            <div>
              <p>Order today. Delivers to 38671</p>
              <p className="font-semibold">Nov 3 – Nov 10 — Free</p>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}
