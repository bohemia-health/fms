import "server-only";
import { headers } from "next/headers";

// The customer's view of orders, as Asclepius answers it. Everything here
// goes through the visitor's own cookie, never the service key, so a person
// can only ever see what is theirs.
const base = process.env.NEXT_PUBLIC_API_URL ?? "https://api.bhmhlth.com";

export type OrderSummary = {
  orderNumber: string;
  status: string;
  total: string | null;
  createdAt: string | null;
  items: string | null;
  units: number;
  shipmentStatus: string | null;
  expectedAt: string | null;
};

export type Parcel = {
  id: string;
  courier: string;
  courierShort: string | null;
  carrierCode: string | null;
  trackingNumber: string | null;
  status: string;
  shippedAt: string | null;
  expectedAt: string | null;
  receivedAt: string | null;
  currentLocation: string | null;
  trackedAt: string | null;
  events: { location: string | null; country: string | null; at: string | null }[];
};

export type OrderDetail = {
  orderNumber: string;
  status: string;
  email: string | null;
  subtotal: string | null;
  shipping: string | null;
  tax: string | null;
  total: string | null;
  createdAt: string | null;
  address: {
    name: string | null;
    line1: string;
    line2: string | null;
    line3: string | null;
    city: string | null;
    state: string | null;
    postalCode: string | null;
    country: string;
  } | null;
  lines: { id: string; quantity: number; name: string; price: string }[];
  shipments: Parcel[];
};

async function withCookie(path: string, init: RequestInit = {}) {
  const cookie = (await headers()).get("cookie") ?? "";
  return fetch(`${base}${path}`, {
    ...init,
    headers: { cookie, ...init.headers },
    cache: "no-store",
  });
}

export async function myOrders(): Promise<OrderSummary[] | null> {
  const res = await withCookie("/me/orders");
  if (res.status === 401) return null;
  if (!res.ok) throw new Error(`me/orders answered ${res.status}`);
  return res.json();
}

export async function myOrder(number: string): Promise<OrderDetail | null | "unauthenticated"> {
  const res = await withCookie(`/me/orders/${encodeURIComponent(number)}`);
  if (res.status === 401) return "unauthenticated";
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`me/orders/${number} answered ${res.status}`);
  return res.json();
}

export async function trackOrder(orderNumber: string, email: string): Promise<OrderDetail | null> {
  const res = await fetch(`${base}/orders/track`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ orderNumber, email }),
    cache: "no-store",
  });
  if (res.status === 404 || res.status === 400) return null;
  if (!res.ok) throw new Error(`orders/track answered ${res.status}`);
  return res.json();
}
