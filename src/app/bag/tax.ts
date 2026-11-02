import { cookies, headers } from "next/headers";
import { api } from "@/lib/api";

// Where the customer said they are, typed into the bag's ship-to field.
// Beats the IP guess below. Outside the US the "zip" is a postal code.
export const ZIP_COOKIE = "ship_zip";
export const COUNTRY_COOKIE = "ship_country";

// What Asclepius answers on /tax/estimate. Mirrors TaxEstimate in the API;
// the typed client enforces the match, this just names it for components.
type EstimateResponse = Awaited<ReturnType<typeof api.tax.estimate.$get>>;
export type TaxEstimate = Extract<
  Awaited<ReturnType<EstimateResponse["json"]>>,
  { reason: string }
>;

// Where to estimate for, best source first: a zip the customer typed, then
// Vercel's IP geolocation headers (present on every production request,
// absent locally), then nothing, which the API reports as "unknown".
export async function guessLocation() {
  const jar = await cookies();
  const typed = jar.get(ZIP_COOKIE)?.value;
  if (typed) {
    return { country: jar.get(COUNTRY_COOKIE)?.value ?? "US", postal: typed };
  }

  const h = await headers();
  return {
    country: h.get("x-vercel-ip-country") ?? "US",
    postal: h.get("x-vercel-ip-postal-code") ?? undefined,
  };
}

export async function getTaxEstimate(subtotal: number): Promise<TaxEstimate> {
  const { country, postal } = await guessLocation();
  const res = await api.tax.estimate.$get({
    query: { country, postal, subtotal: String(subtotal) },
  });
  // 400 only happens on a malformed subtotal, which we build ourselves.
  if (res.status !== 200) throw new Error(`tax/estimate answered ${res.status}`);
  return res.json();
}
