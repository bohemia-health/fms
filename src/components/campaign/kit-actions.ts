"use server";

import { addToBag, setQuantity } from "@/app/bag/actions";
import { getBagLines } from "@/app/bag/bag";

export async function changeKitQuantity(itemId: string, change: 1 | -1) {
  if (!itemId || (change !== 1 && change !== -1)) {
    return { ok: false as const, error: "Invalid bag update." };
  }

  try {
    const lines = await getBagLines();
    const current = lines.find((line) => line.itemId === itemId)?.quantity ?? 0;
    if (change === 1) {
      if (current >= 99) {
        return { ok: false as const, error: "You can add up to 99 kits." };
      }
      await addToBag(itemId);
    } else {
      await setQuantity(itemId, current - 1);
    }
    const updated = await getBagLines();
    return {
      ok: true as const,
      quantity: updated.find((line) => line.itemId === itemId)?.quantity ?? 0,
    };
  } catch {
    return {
      ok: false as const,
      error: "Couldn't update your bag. Please try again.",
    };
  }
}
