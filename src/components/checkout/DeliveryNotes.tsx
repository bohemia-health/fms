import Link from "next/link";
import { ArrowUpRight } from "@/components/icons/arrow-up-right";

// "Keep this in mind" copy. Beside the options when the order is one item
// (aside), under every section when it is more (footer), where it also
// says the items may arrive apart.
export default function DeliveryNotes({
  variant,
}: {
  variant: "aside" | "footer";
}) {
  const footer = variant === "footer";
  return (
    <div
      className={
        footer
          ? "py-8 max-w-md text-[0.85rem]"
          : "text-sm text-muted-foreground md:pt-2"
      }
    >
      <h5
        className={
          footer
            ? "text-[0.95rem] font-medium text-foreground mb-2"
            : "text-base font-medium text-foreground mb-3"
        }
      >
        Keep this in mind about your selection:
      </h5>
      <ul
        className={
          footer
            ? "flex flex-col gap-2 leading-[1.3rem] text-foreground list-disc pl-5"
            : "flex flex-col gap-3 text-foreground list-disc pl-5"
        }
      >
        <li>
          The delivery date here is only an estimate. Once your order has been
          shipped, you can use your tracking link to get a specific date.
        </li>
        <li>
          You may also use your tracking link to redirect your shipment to a
          pickup point, hold it at a secure location, or fill out a signature
          waiver or shipment release.
        </li>
        {footer && (
          <li>
            If it turns out we&apos;re unable to deliver your items together,
            we&apos;ll send you an email about the delivery status of each
            item. We&apos;ll send you the items as quickly as possible.
          </li>
        )}
        <li>
          Your shipment may be subject to import tax or duties if outside the
          U.S.
        </li>
      </ul>
      <Link
        href="/legal/shipping-policy"
        className="mt-4 inline-flex items-center gap-0.5 text-[#0065CC] hover:underline"
      >
        View Our Shipping Policy
        <ArrowUpRight className="size-4" />
      </Link>
    </div>
  );
}
