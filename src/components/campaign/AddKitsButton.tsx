"use client";

import { useEffect, useOptimistic, useRef, useState, useTransition } from "react";
import { Check, Minus, Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { changeKitQuantity } from "./kit-actions";
import styles from "./kit-confirmation.module.css";

export default function AddKitsButton({
  itemId,
  quantity: savedQuantity,
  campaignStatus,
}: {
  itemId: string;
  quantity: number;
  campaignStatus: string | null;
}) {
  const [quantity, setQuantity] = useOptimistic(savedQuantity);
  const [pending, startTransition] = useTransition();
  const inFlight = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<{ animate: boolean } | null>(null);

  useEffect(() => {
    if (!confirmation) return;
    const timer = setTimeout(() => setConfirmation(null), 1000);
    return () => clearTimeout(timer);
  }, [confirmation]);

  function update(change: 1 | -1, animate = false) {
    if (inFlight.current) return;
    inFlight.current = true;
    setError(null);
    setConfirmation(null);
    const firstAdd = quantity === 0 && change === 1;
    startTransition(async () => {
      try {
        const result = await changeKitQuantity(itemId, change);
        if (!result.ok) {
          setError(result.error);
          return;
        }
        // Only display the new count once the API has confirmed the change.
        setQuantity(result.quantity);
        if (firstAdd && result.quantity > 0) setConfirmation({ animate });
      } catch {
        setError("Couldn't update your bag. Please try again.");
      } finally {
        inFlight.current = false;
      }
    });
  }

  return (
    <div className="mt-auto w-full px-5 pt-10 pb-7">
      {campaignStatus !== "active" ? (
        <Button disabled className="h-11 w-full rounded-full bg-white/15 text-white opacity-100 disabled:opacity-100">
          {campaignStatus === "upcoming" || campaignStatus === "draft" ? "Not open yet" : "Group buy closed"}
        </Button>
      ) : quantity === 0 ? (
        <Button
          type="button"
          variant="default"
          disabled={pending}
          aria-busy={pending}
          onClick={(event) => update(1, event.detail > 0)}
          className="h-11 w-full rounded-full bg-[#0071E3] text-md text-white hover:bg-[#0071E3]"
        >
          {pending ? "Adding…" : "Add Kits"}
        </Button>
      ) : (
        <div
          role="group"
          aria-label="Kit quantity"
          aria-busy={pending}
          className="grid h-11 w-full grid-cols-[44px_1fr_44px] items-center rounded-full bg-white text-black"
        >
          <button
            type="button"
            onClick={() => update(-1)}
            disabled={pending}
            className="inline-flex size-11 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-[#0071E3] disabled:opacity-40"
            aria-label={quantity === 1 ? "Remove kit from bag" : "Decrease quantity"}
          >
            {quantity === 1 ? <Trash className="size-4" /> : <Minus className="size-4" />}
          </button>
          <span aria-live="polite" className="text-center font-semibold select-none">
            <span className="relative inline-block">
              {confirmation && (
                <Check
                  aria-hidden="true"
                  className={`absolute top-1/2 right-[calc(100%+8px)] size-4 -translate-y-1/2 text-[#0071E3] ${confirmation.animate ? styles.confirmation : ""}`}
                />
              )}
              {quantity} {quantity === 1 ? "Kit" : "Kits"}
            </span>
          </span>
          <button
            type="button"
            onClick={() => update(1)}
            disabled={pending || quantity >= 99}
            className="inline-flex size-11 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-[#0071E3] disabled:opacity-40"
            aria-label="Increase quantity"
          >
            <Plus className="size-4" />
          </button>
        </div>
      )}
      <span role="status" className="sr-only">
        {pending ? "Updating bag" : confirmation ? "Added to bag" : ""}
      </span>
      {error && <p role="alert" className="mt-3 text-sm text-red-300">{error}</p>}
    </div>
  );
}
