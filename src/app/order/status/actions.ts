"use server";

import { trackOrder, type OrderDetail } from "@/lib/orders";

export type TrackState =
  | { kind: "idle" }
  | { kind: "error"; message: string; orderNumber: string; email: string }
  | { kind: "found"; order: OrderDetail };

export async function track(_prev: TrackState, formData: FormData): Promise<TrackState> {
  if (formData.get("reset") !== null) return { kind: "idle" };
  const orderNumber = String(formData.get("orderNumber") ?? "").trim().toUpperCase();
  const email = String(formData.get("email") ?? "").trim();
  if (!orderNumber || !email) {
    return { kind: "error", message: "Enter both your order number and the email you used.", orderNumber, email };
  }
  const order = await trackOrder(orderNumber, email);
  if (!order) {
    return {
      kind: "error",
      message: "We couldn't find an order with that number and email. Check both and try again.",
      orderNumber,
      email,
    };
  }
  return { kind: "found", order };
}
