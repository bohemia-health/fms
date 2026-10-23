"use client";

import { useFormStatus } from "react-dom";
import { removeFromBag } from "@/app/bag/actions";

// The "Remove" link under a bag line. Same shape as AddToBagButton: the item
// id is bound into the action so the form carries nothing.
export default function RemoveFromBagButton({ itemId }: { itemId: string }) {
  const action = removeFromBag.bind(null, itemId);
  return (
    <form action={action}>
      <Submit />
    </form>
  );
}

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="text-[#0065CC] underline disabled:opacity-50"
    >
      {pending ? "Removing…" : "Remove"}
    </button>
  );
}
