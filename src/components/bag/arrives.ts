import type { ShippingEstimate } from "@/app/bag/shipping";

// Carrier dates arrive as ISO instants naming a calendar day; show that
// day, not the day it happens to be in the shopper's zone (midnight UTC on
// the 4th is still the 4th). The carrier gives one date and assumes the
// parcel ships today, so it is shown as a window: that day through a couple
// of days later for the standard option, one day for expedited.
const day = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});
const DAY_MS = 24 * 60 * 60 * 1000;
export type Rate = NonNullable<ShippingEstimate["rate"]>;

export function arrives(r: Rate, slackDays: number) {
  if (r.estimatedDelivery) {
    const from = new Date(r.estimatedDelivery);
    const to = new Date(from.getTime() + slackDays * DAY_MS);
    return `${day.format(from)} – ${day.format(to)}`;
  }
  if (r.deliveryDays !== null) {
    return `${r.deliveryDays}–${r.deliveryDays + slackDays} days`;
  }
  return null;
}
