import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { SetBreadcrumb } from "@asclepius/ui";
import { loginUrl } from "@/lib/auth-site";
import { myOrders } from "@/lib/orders";
import { StatusPill } from "@/components/orders/StatusPill";
import { longDate, money, shortDate } from "@/components/orders/words";

export const metadata = { title: "Your orders" };

// Everything this person has bought, under the account or the email they
// used as a guest. Signed out goes to the auth site and comes back here.
export default async function Page() {
  const orders = await myOrders();
  if (orders === null) redirect(loginUrl("/order/list"));

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-12 md:py-16">
      <header className="mb-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Your orders</h1>
          <p className="mt-1 text-muted-foreground">
            {orders.length === 0 ? "Nothing yet." : `${orders.length} ${orders.length === 1 ? "order" : "orders"}`}
          </p>
        </div>
        <Link href="/order/status" className="text-sm text-[#0065CC] hover:underline">
          Track an order placed as a guest
        </Link>
      </header>

      {orders.length === 0 ? (
        <div className="rounded-2xl bg-muted/40 p-10 text-center">
          <p className="text-lg">You haven&rsquo;t ordered anything yet.</p>
          <Link href="/shop" className="mt-2 inline-flex items-center text-[#0065CC] hover:underline">
            Visit the store <ChevronRight size={18} />
          </Link>
        </div>
      ) : (
        <ul className="grid gap-3">
          {orders.map((o) => (
            <li key={o.orderNumber}>
              <Link
                href={`/order/${o.orderNumber}`}
                className="grid gap-3 rounded-2xl border p-5 transition-colors hover:bg-muted/40 md:grid-cols-[1fr_auto] md:items-center"
              >
                <div className="grid gap-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono font-semibold">{o.orderNumber}</span>
                    <StatusPill status={o.shipmentStatus ?? o.status} kind={o.shipmentStatus ? "parcel" : "order"} />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {longDate(o.createdAt)} · {o.units} {o.units === 1 ? "item" : "items"} · {money(o.total)}
                  </p>
                  <p className="truncate text-sm">{o.items}</p>
                  {o.expectedAt && o.shipmentStatus !== "DELIVERED" && (
                    <p className="text-sm font-medium">Arriving {shortDate(o.expectedAt)}</p>
                  )}
                </div>
                <span className="inline-flex items-center text-sm text-[#0065CC]">
                  View <ChevronRight size={18} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <SetBreadcrumb items={[{ label: "Your orders" }]} />
    </main>
  );
}
