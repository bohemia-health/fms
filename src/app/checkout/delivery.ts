import type { BagCampaign, BagLine } from "../../components/bag/types";

// Which rate the customer picked for each shipment, kept in a cookie as JSON
// keyed by section: {"ready":"expedited","campaign:123456":"standard"}.
export const DELIVERY_COOKIE = "checkout_delivery";
export type DeliveryMethod = "standard" | "expedited";
export type DeliveryChoices = Record<string, DeliveryMethod>;

export const isDeliveryMethod = (x: unknown): x is DeliveryMethod =>
  x === "standard" || x === "expedited";
// "ready" for stock, or the campaign a pre-order ships with.
export const isSectionKey = (x: unknown): x is string =>
  typeof x === "string" && /^(ready|campaign:[0-9A-Za-z_-]{1,64})$/.test(x);

export function parseDeliveryChoices(raw: string | undefined): DeliveryChoices {
  if (!raw) return {};
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return {};
  }
  if (typeof parsed !== "object" || parsed === null) return {};
  const out: DeliveryChoices = {};
  for (const [k, v] of Object.entries(parsed)) {
    if (isSectionKey(k) && isDeliveryMethod(v)) out[k] = v;
  }
  return out;
}

// "Ships in 4-8 weeks." from the campaign's window, as the checkout page
// prints it above a pre-order.
export function shipsIn(
  c: Pick<BagCampaign, "shipsInWeeksMin" | "shipsInWeeksMax">,
): string {
  const lo = c.shipsInWeeksMin;
  const hi = c.shipsInWeeksMax;
  if (lo !== null && hi !== null && lo !== hi) return `Ships in ${lo}-${hi} weeks.`;
  const only = lo ?? hi;
  if (only !== null) return `Ships in ${only} weeks.`;
  return "Ships after the group buy closes.";
}

// The checkout page shows one section per shipment: everything in stock
// first, then one per group buy, each with its own delivery choice. Lines
// keep their bag order within a section.
export type CheckoutSection = {
  key: string; // "ready" | "campaign:<id>"
  heading: string;
  shipsLater: boolean; // a pre-order: dates count from when it ships
  lines: BagLine[];
};

export function checkoutSections(lines: BagLine[]): CheckoutSection[] {
  const ready: CheckoutSection = {
    key: "ready",
    heading: "In stock and ready to ship.",
    shipsLater: false,
    lines: [],
  };
  const byCampaign = new Map<string, CheckoutSection>();
  for (const line of lines) {
    if (!line.campaign) {
      ready.lines.push(line);
      continue;
    }
    const key = `campaign:${line.campaign.id}`;
    let section = byCampaign.get(key);
    if (!section) {
      section = {
        key,
        heading: shipsIn(line.campaign),
        shipsLater: true,
        lines: [],
      };
      byCampaign.set(key, section);
    }
    section.lines.push(line);
  }
  return [ready, ...byCampaign.values()].filter((s) => s.lines.length > 0);
}
