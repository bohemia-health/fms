import {
  bag,
  batch,
  coa,
  item_images,
  bag_items,
  itemTable,
  manufacturer,
} from "@/db";
import { db } from "@/index";
import { eq, and, inArray } from "drizzle-orm";
import { cookies } from "next/headers";
import type { BagBatch, BagLine } from "@/components/bag/types";
import { coaTypeLabel, coaTypeRank } from "@/components/bag/coaTypeLabel";
import { itemImageUrl, labReportUrl } from "@/integrations/b2/client";

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
      itemCodeId: itemTable.item_code_id,
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

  const batchesByItem = await getBatchesForItems(rows.map((r) => r.itemId));

  // numeric comes back as a string ("150.00"); BagLine wants a number.
  return rows.map(({ imageKey, price, ...r }) => ({
    ...r,
    price: Number(price),
    image: imageKey ? itemImageUrl(imageKey) : null,
    batches: batchesByItem.get(r.itemId) ?? [],
  }));
}

// Batches that point at the given items, with their vendor and every lab
// report on file, grouped by item id. The left join to coa yields one row per
// (batch, coa), so a batch with three reports arrives as three rows and is
// folded back into one BagBatch with three coas.
async function getBatchesForItems(
  itemIds: string[],
): Promise<Map<string, BagBatch[]>> {
  const grouped = new Map<string, BagBatch[]>();
  if (itemIds.length === 0) return grouped;

  const rows = await db
    .select({
      itemId: batch.item_id,
      id: batch.id,
      number: batch.batch_number,
      vendor: manufacturer.short_name,
      vendorFullName: manufacturer.name,
      cap: batch.cap_color,
      crimp: batch.crimp_color,
      coaId: coa.id,
      coaKey: coa.file_key,
      coaType: coa.test_type,
      coaTitle: coa.title,
    })
    .from(batch)
    .innerJoin(manufacturer, eq(batch.manufacturer_id, manufacturer.id))
    .leftJoin(coa, eq(coa.batch_id, batch.id))
    .where(inArray(batch.item_id, itemIds))
    .orderBy(batch.id);

  for (const row of rows) {
    if (!row.itemId) continue;
    const list = grouped.get(row.itemId) ?? [];
    let entry = list.find((b) => b.id === row.id);
    if (!entry) {
      entry = {
        id: row.id,
        number: row.number,
        vendor: row.vendor ?? row.vendorFullName,
        cap: row.cap,
        crimp: row.crimp,
        coas: [],
      };
      list.push(entry);
      grouped.set(row.itemId, list);
    }
    if (row.coaId && row.coaKey) {
      entry.coas.push({
        id: row.coaId,
        rank: coaTypeRank(row.coaType),
        label: coaTypeLabel(row.coaType, row.coaTitle ?? ""),
        url: labReportUrl(row.coaKey),
      });
    }
  }
  // Reports in the house order: Mass Purity, LC-MS, Endotoxin, Sterility,
  // Benzyl Alcohol. The enum's alphabetical order would put Benzyl first.
  for (const list of grouped.values()) {
    for (const b of list) b.coas.sort((a, c) => a.rank - c.rank);
  }
  return grouped;
}
