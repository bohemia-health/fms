import BagButton from "@/components/bag/BagButton";
import BagItemCard from "@/components/bag/BagItemCard";
import { getBagLines } from "./bag";

import Link from "next/link";
import TaxHelp from "@/components/bag/TaxHelp";
import { container } from "@/lib/layout";
import { cn } from "@/lib/utils";
import { Bag } from "@/components/icons/bag";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default async function bagPage() {
  const lines = await getBagLines();
  const subtotal = lines.reduce((sum, l) => sum + l.price * l.quantity, 0);
  // Placeholder until tax is computed from the address; shipping is free.
  const estimatedTax = 216.79;

  return (
    <main>
      <section
        className={cn(
          container,
          "flex flex-col items-center border-b border-foreground/15 py-24 text-center",
        )}
      >
        <div className="flex w-fit flex-col items-center gap-1">
          <h1 className="text-[2.45rem] font-semibold">
            Your bag total is {currency.format(subtotal)}.
          </h1>
          <p className="text-md">
            Check the{" "}
            <Link href="/repository" className="underline text-[#007AFF]">
              reports
            </Link>{" "}
            before you checkout.
          </p>
          <div className="mt-8 flex w-[640px] max-w-full flex-col gap-3 sm:flex-row sm:gap-4">
            <BagButton
              label="Continue Shopping"
              className="bg-foreground text-background hover:bg-foreground/90"
            />
            <BagButton label="Check Out" />
          </div>
        </div>
      </section>

      <section className={cn(container, "pb-16")}>
        <ul className="divide-y divide-foreground/15">
          {lines.map((line) => (
            <BagItemCard key={line.itemId} line={line} />
          ))}
        </ul>
      </section>

      {/* Checkout Subtotal and Details Section */}
      <section className={cn(container, "pb-16")}>
        <div className="ml-auto flex w-full flex-col gap-1 text-[16px] md:w-3/4 pb-3">
          <div className="flex justify-between">
            <p>Subtotal</p>
            <p className="tabular-nums">{currency.format(subtotal)}</p>
          </div>

          <div className="flex justify-between">
            <p>Shipping</p>
            <p>FREE</p>
          </div>

          <div className="flex justify-between">
            {/* The "?" hangs in the gutter (icon 16px + gap 6px) so the label
                lines up with Subtotal and Shipping, like Apple's bag. */}
            <p className="inline-flex items-center gap-1.5">
              <TaxHelp className="-ml-[22px]" />
              Estimated tax for 38671
            </p>
            <p className="tabular-nums">{currency.format(estimatedTax)}</p>
          </div>

          <div className="mt-2 flex justify-between border-t border-foreground/15 pt-3 text-2xl font-semibold">
            <p>Total</p>
            <p className="tabular-nums">
              {currency.format(subtotal + estimatedTax)}
            </p>
          </div>

          <div className="flex gap-4 py-8">
            <BagButton
              label="Continue Shopping"
              className="bg-foreground text-background hover:bg-foreground/90"
            />
            <BagButton label="Check Out" className="py-5" />
          </div>
        </div>
      </section>
    </main>
  );
}
