import "server-only";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import type { BagLine } from "@/components/bag/types";
import { getTaxEstimate } from "@/app/bag/tax";
import { getShippingEstimate, type ShippingEstimate } from "@/app/bag/shipping";
import { arrives } from "@/components/bag/arrives";
import type { DeliveryOption } from "@/components/checkout/DeliveryOptions";
import type { OrderSummaryData } from "@/components/checkout/CheckoutBar";
import {
  DELIVERY_COOKIE,
  checkoutSections,
  parseDeliveryChoices,
  type CheckoutSection,
  type DeliveryMethod,
} from "./delivery";

// The two rates the bag already quotes, as cards. A stock shipment shows the
// carrier's arrival window; a pre-order cannot, so it shows transit days
// counted from the day it ships.
function optionsFor(
  shipping: ShippingEstimate,
  shipsLater: boolean,
): DeliveryOption[] {
  const out: DeliveryOption[] = [];
  const card = (
    method: DeliveryOption["method"],
    rate: NonNullable<ShippingEstimate["rate"]>,
    slack: number,
    label: string,
    price: number,
  ) => {
    const when = shipsLater
      ? rate.deliveryDays !== null
        ? `Delivers ${rate.deliveryDays}–${rate.deliveryDays + slack} days after it ships`
        : null
      : (() => {
          const w = arrives(rate, slack);
          return w ? `Delivers ${w}` : null;
        })();
    out.push({
      method,
      title: when ?? rate.serviceName,
      subtitle: when ? rate.serviceName : rate.carrierName,
      label,
      price: Math.round(price * 100) / 100,
    });
  };
  if (shipping.rate) {
    card("standard", shipping.rate, 2, "Standard Shipping", shipping.total);
  }
  if (shipping.expedited) {
    card(
      "expedited",
      shipping.expedited,
      1,
      "Expedited Shipping",
      shipping.expedited.amount + shipping.materialCost,
    );
  }
  return out;
}

export type PricedSection = CheckoutSection & {
  options: DeliveryOption[];
  selected: DeliveryMethod;
  price: number; // the chosen option's postage + packaging
};

// Everything the checkout bar and step 1 need to price the order: the tax
// and shipping estimates for the bag, each shipment's options with the
// customer's pick, and the running total. Both steps call this so the
// "Show Order Summary" figure is the same on each.
export async function checkoutTotals(
  lines: BagLine[],
  jar: ReadonlyRequestCookies,
) {
  const subtotal = lines.reduce((sum, l) => sum + l.price * l.quantity, 0);
  const [tax, shipping] = await Promise.all([
    getTaxEstimate(subtotal),
    getShippingEstimate(),
  ]);
  const choices = parseDeliveryChoices(jar.get(DELIVERY_COOKIE)?.value);
  const sections: PricedSection[] = checkoutSections(lines).map((s) => {
    const options = optionsFor(shipping, s.shipsLater);
    const selected = choices[s.key] ?? "standard";
    return {
      ...s,
      options,
      selected,
      price: options.find((o) => o.method === selected)?.price ?? 0,
    };
  });
  const shippingTotal = sections.reduce((sum, s) => sum + s.price, 0);
  const total = subtotal + tax.tax + shippingTotal;
  // Plain data for the "Show Order Summary" flyout: it lives in a client
  // component, so only what it prints crosses over.
  const summary: OrderSummaryData = {
    items: lines.reduce((sum, l) => sum + l.quantity, 0),
    deliversOn: deliversOn(sections, shipping),
    subtotal,
    shipping: shippingTotal,
    tax: tax.tax,
    total,
  };
  return { subtotal, tax, shipping, sections, total, summary };
}

// "Delivers on" for the order summary: one shipment shows its window, more
// than one is "Multiple Dates", a pre-order shows its ship window, and no
// zip yet means no date yet.
function deliversOn(
  sections: PricedSection[],
  shipping: ShippingEstimate,
): string | null {
  if (sections.length === 0) return null;
  if (sections.length > 1) return "Multiple Dates";
  const [s] = sections;
  if (s.shipsLater) return s.heading.replace(/\.$/, "");
  const rate = s.selected === "expedited" ? shipping.expedited : shipping.rate;
  if (!rate) return null;
  return arrives(rate, s.selected === "expedited" ? 1 : 2);
}
