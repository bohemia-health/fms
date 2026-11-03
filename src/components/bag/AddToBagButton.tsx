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

// While the action runs the label gives way to a spinning ring, Apple's
// bag-button behaviour, instead of swapping to "Adding…" and reflowing.
// The label stays in the DOM, invisible, so the button keeps its width.
function Submit({ pill }: { pill: boolean }) {
  const { pending } = useFormStatus();
  const body = (
    <span className="relative inline-flex items-center justify-center">
      <span className={pending ? "invisible" : undefined}>Add to Bag</span>
      {pending && (
        <span
          role="status"
          aria-label="Adding to bag"
          className="absolute inset-0 flex items-center justify-center"
        >
          <span className="size-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
        </span>
      )}
    </span>
  );
  if (pill) {
    return (
      <Button
        type="submit"
        variant="normal"
        disabled={pending}
        className="w-full font-normal transition-[background-color,scale] duration-150 ease-out active:scale-[0.98]"
      >
        {body}
      </Button>
    );
  }
  return (
    <Button type="submit" size="sm" disabled={pending}>
      {body}
    </Button>
  );
}
