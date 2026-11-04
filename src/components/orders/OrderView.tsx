import Link from "next/link";
import { ArrowUpRight, PackageCheck, Truck } from "lucide-react";
import type { OrderDetail, Parcel } from "@/lib/orders";
import { StatusPill } from "./StatusPill";
import { carrierUrl, dateTime, longDate, money, shortDate } from "./words";

// One order, as the customer sees it: where it is first, then what is in it
// and where it is going. Used by the signed-in page and the guest lookup.
export default function OrderView({ order }: { order: OrderDetail }) {
  const a = order.address;
  return (
    <div className="grid gap-10">
      <header className="flex flex-col gap-3 border-b pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Order</p>
          <h1 className="font-mono text-3xl font-semibold tracking-tight md:text-4xl">{order.orderNumber}</h1>
          {order.createdAt && <p className="mt-1 text-muted-foreground">Placed {longDate(order.createdAt)}</p>}
        </div>
        <StatusPill status={order.status} kind="order" />
      </header>

      <section className="grid gap-4">
        <h2 className="text-xl font-semibold tracking-tight">Delivery</h2>
        {order.shipments.length === 0 ? (
          <p className="rounded-2xl bg-muted/40 p-6 text-muted-foreground">
            {order.status === "CANCELLED"
              ? "This order was cancelled and will not ship."
              : "Not shipped yet. You will get an email with tracking the moment it leaves the warehouse."}
          </p>
        ) : (
          order.shipments.map((p) => <ParcelCard key={p.id} parcel={p} />)
        )}
      </section>

      <div className="grid gap-10 md:grid-cols-[1.5fr_1fr]">
        <section className="grid gap-4">
          <h2 className="text-xl font-semibold tracking-tight">Items</h2>
          <ul className="divide-y rounded-2xl border">
            {order.lines.map((l) => (
              <li key={l.id} className="flex items-center justify-between gap-4 px-5 py-4">
                <span>
                  <span className="pr-2 font-medium tabular-nums">{l.quantity} ×</span>
                  {l.name}
                </span>
                <span className="tabular-nums">{money(Number(l.price) * l.quantity)}</span>
              </li>
            ))}
            <li className="grid gap-1 bg-muted/40 px-5 py-4 text-sm">
              <Row label="Subtotal" value={money(order.subtotal)} />
              <Row label="Shipping" value={money(order.shipping)} />
              <Row label="Tax" value={money(order.tax)} />
              <Row label="Total" value={money(order.total)} strong />
            </li>
          </ul>
        </section>

        <section className="grid content-start gap-4">
          <h2 className="text-xl font-semibold tracking-tight">Shipping to</h2>
          {a ? (
            <address className="rounded-2xl border px-5 py-4 not-italic leading-relaxed">
              {a.name && <div className="font-medium">{a.name}</div>}
              <div>{a.line1}</div>
              {a.line2 && <div>{a.line2}</div>}
              {a.line3 && <div>{a.line3}</div>}
              <div>
                {[a.city, a.state].filter(Boolean).join(", ")} {a.postalCode}
              </div>
              <div className="text-muted-foreground">{a.country}</div>
            </address>
          ) : (
            <p className="text-muted-foreground">No address on file.</p>
          )}
          <p className="text-sm text-muted-foreground">
            Something wrong?{" "}
            <Link href="/contact-us" className="text-[#0065CC] hover:underline">
              Contact support
            </Link>{" "}
            with your order number.
          </p>
        </section>
      </div>
    </div>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={strong ? "flex justify-between font-medium text-foreground" : "flex justify-between text-muted-foreground"}>
      <span>{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}

function ParcelCard({ parcel: p }: { parcel: Parcel }) {
  const url = carrierUrl(p.carrierCode, p.trackingNumber);
  const delivered = p.status === "DELIVERED";
  const headline = delivered
    ? `Delivered ${shortDate(p.receivedAt) ?? ""}`
    : p.expectedAt
      ? `Arriving ${shortDate(p.expectedAt)}`
      : p.shippedAt
        ? `Shipped ${shortDate(p.shippedAt)}`
        : "Label created";
  return (
    <div className="grid gap-5 rounded-2xl border p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          {delivered ? (
            <PackageCheck size={28} strokeWidth={1.25} className="mt-0.5 shrink-0" />
          ) : (
            <Truck size={28} strokeWidth={1.25} className="mt-0.5 shrink-0" />
          )}
          <div>
            <p className="text-lg font-semibold leading-tight">{headline}</p>
            <p className="text-sm text-muted-foreground">
              {p.courier}
              {p.currentLocation && !delivered && ` · last seen ${p.currentLocation}`}
            </p>
          </div>
        </div>
        <StatusPill status={p.status} kind="parcel" />
      </div>

      {p.trackingNumber && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          <span className="text-muted-foreground">Tracking</span>
          <span className="font-mono">{p.trackingNumber}</span>
          {url && (
            <a href={url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-0.5 text-[#0065CC] hover:underline">
              Track on {p.courierShort ?? p.courier}
              <ArrowUpRight size={16} />
            </a>
          )}
        </div>
      )}

      {p.events.length > 0 && (
        <ol className="grid gap-2 border-t pt-4 text-sm">
          {p.events.slice(0, 6).map((e, i) => (
            <li key={i} className="grid grid-cols-[8rem_1fr] gap-3">
              <span className="text-muted-foreground tabular-nums">{dateTime(e.at) ?? "—"}</span>
              <span>
                {e.location ?? "Update"}
                {e.country && e.country !== "US" && ` (${e.country})`}
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
