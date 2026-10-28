import type { MetadataRoute } from "next";
import { api } from "@/lib/api";
import { storeLines, toStoreProducts } from "@/components/store/lines";

// What search engines should know about: the fixed pages, every line page,
// and every product that has a slug. Served at /sitemap.xml; robots.ts
// points at it. Items carry no updated-at yet, so no lastModified.
//
// Metadata routes sit outside the root layout, so this is prerendered at
// build and re-made every hour; a build must not fail because Asclepius was
// unreachable, so the product list degrades to nothing rather than throwing.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.bhmhlth.com";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const fixed = ["/", "/shop", "/campaign", "/repository", "/contact-us"].map(
    (path) => ({ url: `${SITE_URL}${path}` }),
  );
  const lines = storeLines.map((line) => ({
    url: `${SITE_URL}/shop/${line.slug}`,
  }));
  const products = (await loadProducts()).map((p) => ({
    url: `${SITE_URL}${p.href}`,
  }));
  return [...fixed, ...lines, ...products];
}

async function loadProducts() {
  try {
    const res = await api.items.$get();
    if (!res.ok) return [];
    return toStoreProducts(await res.json()).filter((p) => p.href !== "#");
  } catch (error) {
    console.error("[sitemap] catalogue unavailable", error);
    return [];
  }
}
