"use server";

import { db } from "@/index";
import { getOrCreateBag } from "./bag";
import { and, eq, sql } from "drizzle-orm";
import { bag_items } from "@/db";
import { revalidatePath } from "next/cache";

export async function addToBag(itemId: string) {
  const bagId = await getOrCreateBag();
  await db
    .insert(bag_items)
    .values({ bag_id: bagId, item_id: itemId, quantity: 1 })
    .onConflictDoUpdate({
      target: [bag_items.bag_id, bag_items.item_id],
      set: { quantity: sql`${bag_items.quantity} + 1` },
    });
  // The navbar badge lives in the root layout, so refresh everything under it.
  revalidatePath("/", "layout");
}

export async function removeFromBag(itemId: string) {
  const bagId = await getOrCreateBag();
  await db
    .delete(bag_items)
    .where(and(eq(bag_items.bag_id, bagId), eq(bag_items.item_id, itemId)));
  revalidatePath("/", "layout");
}

// The dropdown offers 1..10, so a quantity below 1 only arrives if something
// else calls this; treat it as a remove rather than storing a zero line.
export async function setQuantity(itemId: string, quantity: number) {
  if (quantity < 1) return removeFromBag(itemId);
  const bagId = await getOrCreateBag();
  await db
    .update(bag_items)
    .set({ quantity })
    .where(and(eq(bag_items.bag_id, bagId), eq(bag_items.item_id, itemId)));
  revalidatePath("/", "layout");
}
