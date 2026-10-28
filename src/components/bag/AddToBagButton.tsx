"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { addToBag } from "@/app/bag/actions";

// The form around the server action. The item id is bound into the action
// here so the form has nothing to carry; the submit shows pending state.
// `pill` is the product page's full-width blue pill; the default is the
// small button the variant list uses.
export default function AddToBagButton({
  itemId,
  pill = false,
  className,
}: {
  itemId: string;
  pill?: boolean;
  className?: string;
}) {
  const action = addToBag.bind(null, itemId);
  return (
    <form action={action} className={className}>
      <Submit pill={pill} />
    </form>
  );
}

function Submit({ pill }: { pill: boolean }) {
  const { pending } = useFormStatus();
  if (pill) {
    return (
      <Button
        type="submit"
        variant="normal"
        disabled={pending}
        className="w-full font-normal transition-[background-color,scale] duration-150 ease-out active:scale-[0.98]"
      >
        {pending ? "Adding…" : "Add to Bag"}
      </Button>
    );
  }
  return (
    <Button type="submit" size="sm" disabled={pending}>
      {pending ? "Adding…" : "Add to Bag"}
    </Button>
  );
}
