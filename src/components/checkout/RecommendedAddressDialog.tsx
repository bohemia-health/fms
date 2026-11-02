"use client";

import { Dialog } from "@base-ui/react/dialog";
import { ChevronRight } from "lucide-react";
import BagButton from "@/components/bag/BagButton";
import {
  confirmShippingAddress,
  type AddressReview,
} from "@/app/checkout/actions";
import type { Address } from "@/app/checkout/address";

// The carrier knows a cleaner form of what they typed: show both and let
// them pick. Either choice submits the chosen address and moves on.
export default function RecommendedAddressDialog({
  review,
  onClose,
}: {
  review: AddressReview | null;
  onClose: () => void;
}) {
  return (
    <Dialog.Root
      open={review !== null}
      onOpenChange={(open) => !open && onClose()}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/40 transition-opacity duration-300 data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-background p-8 text-foreground shadow-[0_24px_64px_-16px_rgba(0,0,0,0.4)] outline-none transition-all duration-300 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
          {review && (
            <>
              <Dialog.Title className="text-2xl font-medium tracking-tight">
                Use recommended address instead?
              </Dialog.Title>
              <Dialog.Description className="mt-2 text-muted-foreground">
                We&apos;re unable to verify your address, but found a close
                match.
              </Dialog.Description>

              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <AddressBlock heading="You Entered" address={review.entered} />
                <AddressBlock
                  heading="Recommended"
                  address={review.recommended}
                />
              </div>

              <div className="mt-8 flex flex-col items-start gap-4">
                <form action={confirmShippingAddress} className="w-full">
                  <input
                    type="hidden"
                    name="address"
                    value={JSON.stringify(review.recommended)}
                  />
                  <BagButton label="Use Recommended" />
                </form>
                <form action={confirmShippingAddress}>
                  <input
                    type="hidden"
                    name="address"
                    value={JSON.stringify(review.entered)}
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-0.5 text-[#0065CC] hover:underline"
                  >
                    Use Your Address
                    <ChevronRight className="size-4" strokeWidth={1.75} />
                  </button>
                </form>
              </div>
            </>
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function AddressBlock({
  heading,
  address,
}: {
  heading: string;
  address: Address;
}) {
  const cityLine = [
    address.city,
    [address.state, address.postalCode].filter(Boolean).join(" "),
  ]
    .filter(Boolean)
    .join(", ");
  return (
    <div>
      <p className="font-semibold">{heading}</p>
      <p className="mt-1 leading-snug">
        {address.address1}
        {address.address2 && (
          <>
            <br />
            {address.address2}
          </>
        )}
        {address.address3 && (
          <>
            <br />
            {address.address3}
          </>
        )}
        <br />
        {cityLine}
        <br />
        {address.country}
      </p>
    </div>
  );
}
