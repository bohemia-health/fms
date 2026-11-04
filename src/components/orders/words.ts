// What the store says about an order or a parcel. Internal states are
// grouped into what a customer can act on; the warehouse keeps the detail.
type Tone = "muted" | "blue" | "green" | "amber" | "red";

export const orderWords: Record<string, { label: string; tone: Tone }> = {
  RECEIVED: { label: "Order received", tone: "muted" },
  OPEN: { label: "Being prepared", tone: "blue" },
  SHIPPED: { label: "Shipped", tone: "blue" },
  IN_TRANSIT: { label: "On its way", tone: "blue" },
  DELAYED: { label: "Delayed", tone: "amber" },
  COMPLETED: { label: "Delivered", tone: "green" },
  CANCELLED: { label: "Cancelled", tone: "red" },
  ACTION_REQUIRED: { label: "Needs your attention", tone: "amber" },
};

export const parcelWords: Record<string, { label: string; tone: Tone }> = {
  PRE_FILED: { label: "Label created", tone: "muted" },
  IN_TRANSIT: { label: "In transit", tone: "blue" },
  RELEASED_TO_CARRIER: { label: "In transit", tone: "blue" },
  CLEARED: { label: "Cleared customs", tone: "blue" },
  AWAITING_CLEARANCE: { label: "In customs", tone: "amber" },
  IN_INSPECTION: { label: "In customs", tone: "amber" },
  PGA_HOLD: { label: "In customs", tone: "amber" },
  DUTY_PENDING: { label: "Duties due", tone: "amber" },
  DELAYED: { label: "Delayed", tone: "amber" },
  STATUS_UNKNOWN: { label: "Awaiting carrier update", tone: "muted" },
  DELIVERED: { label: "Delivered", tone: "green" },
  REJECTED: { label: "Could not be delivered", tone: "red" },
  RETURNED: { label: "Returned to us", tone: "red" },
};

export const tones: Record<Tone, string> = {
  muted: "bg-muted text-foreground",
  blue: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  green: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  amber: "bg-amber-500/15 text-amber-800 dark:text-amber-300",
  red: "bg-destructive/10 text-destructive",
};

// The carrier's own tracking page for a number, where a customer can read
// every scan in the carrier's words.
export function carrierUrl(code: string | null, trackingNumber: string | null) {
  if (!code || !trackingNumber) return null;
  const n = encodeURIComponent(trackingNumber);
  switch (code) {
    case "usps":
      return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${n}`;
    case "ups":
      return `https://www.ups.com/track?tracknum=${n}`;
    case "fedex":
      return `https://www.fedex.com/fedextrack/?trknbr=${n}`;
    case "dhl_express":
      return `https://www.dhl.com/en/express/tracking.html?AWB=${n}`;
    default:
      return null;
  }
}

export const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
export const money = (v: string | number | null | undefined) =>
  v === null || v === undefined || v === "" ? "—" : currency.format(Number(v));
export const longDate = (v: string | null | undefined) =>
  v ? new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(new Date(v)) : null;
export const shortDate = (v: string | null | undefined) =>
  v ? new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric" }).format(new Date(v)) : null;
export const dateTime = (v: string | null | undefined) =>
  v ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(v)) : null;
