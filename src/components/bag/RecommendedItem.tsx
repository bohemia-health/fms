"use client";

import Image from "next/image";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { addToBag } from "@/app/bag/actions";
import type { StoreProduct } from "@/components/store/types";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

// One pick in the "You may also like" row under the bag. Flat, no card
// chrome: the image sits on the page background, then name, descriptor,
// price, and a small blue Add to Bag pill. Image and name both link to the
// product page; the pill adds this exact item (the size variant) to the bag.
// Once added it is in the bag, so the next render drops it from the row.
export default function RecommendedItem({
  product,
}: {
  product: StoreProduct;
}) {
  const { id, title, descriptor, price, href, line } = product;
  const image = line?.image ?? { src: "/store/mito-vial.png", alt: "" };
  const action = addToBag.bind(null, id);

  return (
    <div className="flex flex-col">
      <Link
        href={href}
        className="relative aspect-square w-full transition-transform duration-200 ease-out hover:scale-[1.02]"
      >
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(min-width: 768px) 220px, 45vw"
          className="object-contain"
        />
      </Link>

      <div className="mt-5">
        <Link
          href={href}
          className="text-[17px] font-semibold leading-snug tracking-tight hover:underline"
        >
          {title}
        </Link>
        {descriptor && (
          <p className="mt-0.5 text-[13px] text-muted-foreground">
            {descriptor}
          </p>
        )}
        <p className="mt-2 text-[15px] tabular-nums">
          {price != null ? (
            money.format(price)
          ) : (
            <span className="text-[#0065CC]">View pricing</span>
          )}
        </p>
      </div>

      <form action={action} className="mt-4">
        <AddPill />
      </form>
    </div>
  );
}

function AddPill() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-8 items-center rounded-full bg-[#0071E3] px-4 text-[14px] text-white transition-colors hover:bg-[#0077ED] disabled:opacity-60"
    >
      {pending ? "Adding…" : "Add to Bag"}
    </button>
  );
}
