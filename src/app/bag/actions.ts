"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { api, bagHeaders } from "@/lib/api";
import { getOrCreateBag } from "./bag";
import { COUNTRY_COOKIE, ZIP_COOKIE } from "./tax";
import { parsePostal } from "./postal";

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

// Form action for the ship-to field in the bag. The country is whatever the
// page detected (a hidden field) unless the code itself says otherwise (a
// UK or Canadian format), saved beside the postal code so tax and shipping
// estimate for the same place. Junk is ignored rather than rejected: the
// rows keep their previous guess.
export async function setShipTo(formData: FormData) {
  const parsed = parsePostal(
    String(formData.get("postal") ?? ""),
    String(formData.get("country") ?? "US"),
  );
  if (!parsed) return;

  const jar = await cookies();
  const options = { sameSite: "lax" as const, path: "/", maxAge: 60 * 60 * 24 * 90 };
  jar.set(ZIP_COOKIE, parsed.postal, options);
  jar.set(COUNTRY_COOKIE, parsed.country, options);
}
