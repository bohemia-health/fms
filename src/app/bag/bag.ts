import { bag, item_images, bag_items, itemTable } from "@/db";
import { db } from "@/index";
import { eq, and } from "drizzle-orm";
import { cookies } from "next/headers";
import type { BagLine } from "@/components/bag/types";
import { itemImageUrl } from "@/integrations/b2/client";

export async function getOrCreateBag(): Promise<string> {
  const jar = await cookies();
  const token = jar.get("bag_token")?.value;
  if (token) {
    const [found] = await db
      .select({ id: bag.id })
      .from(bag)
      .where(eq(bag.session_token, token));

    if (found) return found.id;
  }

  const newToken = crypto.randomUUID();
  const [created] = await db
    .insert(bag)
    .values({ session_token: newToken })
    .returning({ id: bag.id });

  jar.set("bag_token", newToken, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
  return created.id;
}

// Read-only: the layout calls this on every request and layouts may not set
// cookies, so a visitor with no bag gets [] rather than a new bag.
export async function getBagLines(): Promise<BagLine[]> {
  const jar = await cookies();
  const token = jar.get("bag_token")?.value;
  if (!token) return [];

  const rows = await db
    .select({
      itemId: itemTable.id,
      imageKey: item_images.file_key,
      name: itemTable.name,
      size: itemTable.size,
      form: itemTable.form,
      quantity: bag_items.quantity,
      price: itemTable.price,
    })
    .from(bag_items)
    .innerJoin(bag, eq(bag_items.bag_id, bag.id))
    .innerJoin(itemTable, eq(bag_items.item_id, itemTable.id))
    .leftJoin(
      item_images,
      and(eq(item_images.item_id, itemTable.id), eq(item_images.position, 0)),
    )
    .where(eq(bag.session_token, token))
    .orderBy(bag_items.added_at);

  // numeric comes back as a string ("150.00"); BagLine wants a number.
  return rows.map(({ imageKey, price, ...r }) => ({
    ...r,
    price: Number(price),
    image: imageKey ? itemImageUrl(imageKey) : null,
  }));
}
