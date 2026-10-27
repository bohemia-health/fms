"use server";

import { revalidatePath } from "next/cache";
import { api, bagHeaders } from "@/lib/api";
import { getOrCreateBag } from "./bag";

export async function addToBag(itemId: string) {
  const token = await getOrCreateBag();
  await api.bag.items.$post(
    { json: { itemId } },
    { headers: bagHeaders(token) },
  );
  // The navbar badge lives in the root layout, so refresh everything under it.
  revalidatePath("/", "layout");
}

export async function removeFromBag(itemId: string) {
  const token = await getOrCreateBag();
  await api.bag.items[":itemId"].$delete(
    { param: { itemId } },
    { headers: bagHeaders(token) },
  );
  revalidatePath("/", "layout");
}

// The dropdown offers 1..10, so a quantity below 1 only arrives if something
// else calls this; treat it as a remove rather than storing a zero line.
export async function setQuantity(itemId: string, quantity: number) {
  if (quantity < 1) return removeFromBag(itemId);
  const token = await getOrCreateBag();
  await api.bag.items[":itemId"].$put(
    { param: { itemId }, json: { quantity } },
    { headers: bagHeaders(token) },
  );
  revalidatePath("/", "layout");
}
