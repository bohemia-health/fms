"use server";

import { api } from "@/lib/api";
import { toStoreProducts } from "@/components/store/lines";
import type { StoreProduct } from "@/components/store/types";

// What the search flyout shows per hit. Plain data (no components), since it
// crosses the server action boundary.
export type SearchHit = {
  href: string;
  title: string;
  line?: string;
  detail: string;
  image: { src: string; alt: string; className?: string };
};

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

// Catalogue search: every word of the query must appear in the product's
// title or its line's label (so "repair" finds the Repair Signaling line and
// "reta" finds Retatrutide). The catalogue is three figures of rows at most,
// so one fetch and a filter is fine; a real index can replace this behind
// the same signature. Used by the /search page (whole products, for the
// tiles) and by the flyout through searchCatalogue (six flat rows).
export async function findProducts(query: string): Promise<StoreProduct[]> {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];

  // An unreachable API is "no results", not a crash in the flyout.
  let rows: Awaited<ReturnType<Awaited<ReturnType<typeof api.items.$get>>["json"]>>;
  try {
    const res = await api.items.$get();
    if (!res.ok) return [];
    rows = await res.json();
  } catch (error) {
    console.error("[search] catalogue unavailable", error);
    return [];
  }
  return toStoreProducts(rows)
    .filter((p) => p.href !== "#")
    .filter((p) => {
      const hay = `${p.title} ${p.line?.label ?? ""}`.toLowerCase();
      return words.every((w) => hay.includes(w));
    });
}

export async function searchCatalogue(query: string): Promise<SearchHit[]> {
  return (await findProducts(query))
    .slice(0, 6)
    .map((p) => ({
      href: p.href,
      title: p.title,
      line: p.line?.label,
      detail:
        p.price != null
          ? `${p.variants.length > 1 ? "From " : ""}${money.format(p.price)} · ${p.descriptor}`
          : (p.descriptor ?? ""),
      image: p.line?.image ?? { src: "/store/mito-vial.png", alt: "" },
    }));
}
