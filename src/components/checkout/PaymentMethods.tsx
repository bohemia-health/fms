"use client";

import { useState } from "react";
import { Label } from "@asclepius/ui";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import BagButton from "@/components/bag/BagButton";
import { placeOrder } from "@/app/checkout/actions";
import type { PaymentGroup, PaymentMethodId } from "@/app/checkout/payment-methods";

// Step 3 of checkout: choose how to pay, then place the order. Two levels of
// choice, group then method, so adding a card processor or a second coin is
// data, not a redesign. With one group and one method both come pre-picked.
export default function PaymentMethods({
  groups,
  error,
}: {
  groups: PaymentGroup[];
  error: string | null; // from the last placeOrder attempt, if it failed
}) {
  const [groupId, setGroupId] = useState(groups[0]?.id ?? "");
  const group = groups.find((g) => g.id === groupId) ?? groups[0];
  const [method, setMethod] = useState<PaymentMethodId | "">(
    group?.methods[0]?.id ?? "",
  );

  return (
    <form action={placeOrder} className="flex flex-col gap-10">
      <div role="radiogroup" aria-label="Payment type" className="flex flex-col gap-4">
        {groups.map((g) => {
          const checked = g.id === groupId;
          return (
            <Button
              key={g.id}
              type="button"
              variant="outline"
              role="radio"
              aria-checked={checked}
              onClick={() => {
                setGroupId(g.id);
                setMethod(g.methods[0]?.id ?? "");
              }}
              className={cn(
                "h-auto w-full justify-start px-6 py-6 text-left rounded-lg ring-1 ring-foreground/20",
                checked && "ring-2 ring-foreground",
              )}
            >
              <div className="flex flex-col">
                <p className="text-[1.05rem]">{g.label}</p>
                <Label className="text-[0.76rem] text-foreground/70 mt-1 tracking-snug">
                  {g.detail}
                </Label>
              </div>
            </Button>
          );
        })}
      </div>

      {group && (
        <div>
          <h4 className="text-lg font-medium mb-4">Choose a currency:</h4>
          <div role="radiogroup" aria-label="Currency" className="flex flex-col gap-4">
            {group.methods.map((m) => {
              const checked = m.id === method;
              return (
                <Button
                  key={m.id}
                  type="button"
                  variant="outline"
                  role="radio"
                  aria-checked={checked}
                  onClick={() => setMethod(m.id)}
                  className={cn(
                    "h-auto w-full justify-start px-6 py-5 text-left rounded-lg ring-1 ring-foreground/20",
                    checked && "ring-2 ring-foreground",
                  )}
                >
                  <div className="flex flex-col">
                    <p className="text-[1.05rem]">{m.label}</p>
                    <Label className="text-[0.76rem] text-foreground/70 mt-1 tracking-snug">
                      {m.detail}
                    </Label>
                  </div>
                </Button>
              );
            })}
          </div>
        </div>
      )}

      <input type="hidden" name="paymentMethod" value={method} />

      {error && (
        <p role="alert" className="text-[0.95rem] text-red-700">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-3 border-t border-foreground/15 pt-8">
        <p className="text-[0.9rem] text-muted-foreground">
          Placing the order gives you a payment address and the exact amount to send.
          You have 24 hours to pay before the order expires.
        </p>
        <div className="w-full md:w-auto md:min-w-80">
          <BagButton label="Place order" disabled={!method} />
        </div>
      </div>
    </form>
  );
}
