import { cookies } from "next/headers";
import { api } from "@/lib/api";
import { toStoreProduct } from "@/components/store/lines";
import type { StoreProduct } from "@/components/store/types";
import type { BagLine } from "@/components/bag/types";

// "You may also like" under the bag. For now: items from products that are
// not already in the bag, in a random order. The order is a hash of the item
// id and the visitor's bag token, so it is random per visitor but stable for
// that visitor across renders; plain random() would reshuffle the cards every
// time a quantity changed. The API's /items/recommended is the seam for
// smarter picks later (same line first, a pairings table, co-purchase)
// without touching the page.
export async function getRecommendations(
  lines: BagLine[],
  count = 4,
): Promise<StoreProduct[]> {
  const jar = await cookies();
  const seed = jar.get("bag_token")?.value ?? "guest";

  // Exclude by product, not by item, so the other size of something already
  // in the bag is not offered as a recommendation.
  const inBag = lines
    .map((l) => l.itemCodeId)
    .filter((id): id is string => id !== null);

  const res = await api.items.recommended.$get({
    query: { seed, count: String(count), exclude: inBag.join(",") },
  });
  return (await res.json()).map(toStoreProduct);
}
