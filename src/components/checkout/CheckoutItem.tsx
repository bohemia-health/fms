import Image from "next/image";
import Link from "next/link";
import type { BagLine } from "@/components/bag/types";

// One line of the order on the checkout page: thumbnail, name and size,
// then the vial finish from its batch when one is assigned, otherwise a link
// to the product page.
export default function CheckoutItem({ line }: { line: BagLine }) {
  const batch = line.batches[0];
  const vial = batch
    ? [batch.cap && `${batch.cap} Lid`, batch.crimp && `${batch.crimp} Crimp`].filter(
        (s): s is string => Boolean(s),
      )
    : [];

  return (
    <div className="relative inline-flex ml-8 py-8 gap-8">
      <Image
        src={line.image ?? "/store/mito-vial.png"}
        alt=""
        width={32}
        height={32}
      />

      <div className="flex flex-col text-muted-foreground text-xs">
        <p className="text-foreground text-base font-medium mb-1">
          {line.name} {line.size}
        </p>
        {line.quantity > 1 && <p>Quantity: {line.quantity}</p>}
        {vial.map((v) => (
          <p key={v}>{v}</p>
        ))}
        {vial.length === 0 &&
          (line.slug ? (
            <Link href={`/shop/${line.slug}`} className="hover:underline">
              View Details
            </Link>
          ) : (
            <p>View Details</p>
          ))}
      </div>
    </div>
  );
}
