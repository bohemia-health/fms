import { cookies } from "next/headers";
import { api, bagHeaders } from "@/lib/api";
import { guessLocation } from "./tax";

// What Asclepius answers on /shipping/estimate: the cheapest carrier rate for
// the bag's parcel plus the packaging material, to the same zip the tax
// estimate uses. Nothing is bought; the label comes from the real address at
// checkout.
type EstimateResponse = Awaited<ReturnType<typeof api.shipping.estimate.$get>>;
export type ShippingEstimate = Extract<
  Awaited<ReturnType<EstimateResponse["json"]>>,
  { reason: string }
>;

export async function getShippingEstimate(): Promise<ShippingEstimate> {
  const jar = await cookies();
  const token = jar.get("bag_token")?.value;
  const { country, postal } = await guessLocation();

  // A shipping hiccup must not take the bag down: the row shows nothing and
  // the delivery note says checkout will settle it.
  const unavailable: ShippingEstimate = {
    country,
    postalCode: postal ?? null,
    packaging: null,
    weightOz: 0,
    oversize: false,
    rate: null,
    expedited: null,
    shipping: 0,
    materialCost: 0,
    total: 0,
    cached: false,
    reason: "unavailable",
  };

  try {
    const res = await api.shipping.estimate.$get(
      { query: { country, postal } },
      { headers: bagHeaders(token) },
    );
    if (res.status !== 200) {
      console.error(`shipping/estimate answered ${res.status}`);
      return unavailable;
    }
    return await res.json();
  } catch (e) {
    console.error("shipping/estimate unreachable", e);
    return unavailable;
  }
}
