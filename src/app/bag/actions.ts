"use server";

import { db } from "@/index";
import { getOrCreateBag } from "./bag";
import { sql } from "drizzle-orm";
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
