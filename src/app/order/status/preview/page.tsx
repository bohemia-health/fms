import { notFound } from "next/navigation";
import OrderView from "@/components/orders/OrderView";
import type { OrderDetail } from "@/lib/orders";

const sampleOrder: OrderDetail = {
  orderNumber: "SAMPLE0001",
  status: "RECEIVED",
  email: "warehouse-preview@example.com",
  createdAt: "2026-11-14T16:00:00Z",
  subtotal: "54.00",
  shipping: "6.00",
  tax: "0.00",
  total: "60.00",
  address: {
    name: "Sample Customer",
    line1: "123 Example Lane",
    line2: null,
    line3: null,
    city: "Chicago",
    state: "IL",
    postalCode: "60601",
    country: "US",
  },
  lines: [
    { id: "sample-kit", name: "Sample kit", quantity: 2, price: "24.00" },
    { id: "sample-pack", name: "Sample pack", quantity: 1, price: "6.00" },
  ],
  shipments: [],
};

export default function OrderPreviewPage() {
  if (process.env.NODE_ENV !== "development") notFound();

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-12 md:py-16">
      <p className="mb-6 text-sm text-muted-foreground">Local preview · Sample order</p>
      <OrderView order={sampleOrder} />
    </main>
  );
}
