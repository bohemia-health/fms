"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@asclepius/ui";
import OrderView from "@/components/orders/OrderView";
import { track, type TrackState } from "./actions";

export function StatusForm() {
  const [state, action, pending] = useActionState<TrackState, FormData>(track, { kind: "idle" });

  if (state.kind === "found") {
    return (
      <div className="grid gap-8">
        <OrderView order={state.order} />
        <form action={action}>
          <input type="hidden" name="reset" value="1" />
          <Button type="submit" variant="outline">
            Look up another order
          </Button>
        </form>
      </div>
    );
  }

  const last = state.kind === "error" ? state : null;
  return (
    <form action={action} className="grid gap-5 rounded-2xl border p-6 md:p-8">
      <div className="grid gap-2">
        <Label htmlFor="orderNumber">Order number</Label>
        <Input
          id="orderNumber"
          name="orderNumber"
          defaultValue={last?.orderNumber}
          placeholder="Y2DXWWNTEB"
          autoComplete="off"
          autoCapitalize="characters"
          required
          className="font-mono uppercase"
        />
        <p className="text-xs text-muted-foreground">It&rsquo;s in your confirmation email, ten letters and numbers.</p>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Email used at checkout</Label>
        <Input id="email" name="email" type="email" defaultValue={last?.email} autoComplete="email" required />
      </div>
      {last && (
        <p role="alert" className="text-sm text-destructive">
          {last.message}
        </p>
      )}
      <Button type="submit" disabled={pending} className="w-full md:w-auto md:justify-self-start">
        {pending ? "Looking up…" : "Track order"}
      </Button>
    </form>
  );
}
