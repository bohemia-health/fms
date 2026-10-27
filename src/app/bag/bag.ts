import { cookies } from "next/headers";
import { api, bagHeaders } from "@/lib/api";
import type { BagLine } from "@/components/bag/types";
import { coaTypeLabel, coaTypeRank } from "@/components/bag/coaTypeLabel";
import { itemImageUrl, labReportUrl } from "@/integrations/b2/client";

const COOKIE = "bag_token";

// The visitor's bag token, making a bag on the API first if they have none.
// Only server actions may call this: layouts cannot set cookies.
export async function getOrCreateBag(): Promise<string> {
  const jar = await cookies();
  const current = jar.get(COOKIE)?.value;
  const res = await api.bag.$post({}, { headers: bagHeaders(current) });
  const { token } = await res.json();
  if (token !== current) {
    jar.set(COOKIE, token, { httpOnly: true, sameSite: "lax", path: "/" });
  }
  return token;
}

// Read-only: the layout calls this on every request, so a visitor with no
// bag gets [] rather than a new bag.
export async function getBagLines(): Promise<BagLine[]> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return [];

  const res = await api.bag.$get({}, { headers: bagHeaders(token) });
  const rows = await res.json();

  // The API hands back keys and raw report types; turning those into URLs
  // and house labels is this site's business. numeric comes back as a
  // string ("150.00"); BagLine wants a number.
  return rows.map(({ imageKey, price, batches, ...r }) => ({
    ...r,
    price: Number(price),
    image: imageKey ? itemImageUrl(imageKey) : null,
    batches: batches.map((b) => ({
      ...b,
      coas: b.coas
        .map((c) => ({
          id: c.id,
          rank: coaTypeRank(c.type),
          label: coaTypeLabel(c.type, c.title ?? ""),
          url: labReportUrl(c.fileKey),
        }))
        // Reports in the house order: Mass Purity, LC-MS, Endotoxin,
        // Sterility, Benzyl Alcohol. The enum's alphabetical order would put
        // Benzyl first.
        .sort((a, c) => a.rank - c.rank),
    })),
  }));
}
