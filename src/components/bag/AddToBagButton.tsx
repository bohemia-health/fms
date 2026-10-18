"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { addToBag } from "@/app/bag/actions";

// The form around the server action. The item id is bound into the action
// here so the form has nothing to carry; the submit shows pending state.
export default function AddToBagButton({ itemId }: { itemId: string }) {
  const action = addToBag.bind(null, itemId);
  return (
    <form action={action}>
      <Submit />
    </form>
  );
}

function Submit() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" disabled={pending}>
      {pending ? "Adding…" : "Add to Bag"}
    </Button>
  );
}
