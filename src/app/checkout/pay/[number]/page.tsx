import { notFound } from "next/navigation";
import { container, SetLocalNav, SetNavbar } from "@asclepius/ui";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { paymentStatus } from "@/app/checkout/actions";
import PayWithUsdc from "@/components/checkout/PayWithUsdc";

// The pay page: where to send the USDC and how much, with a clock. Reached
// right after placing the order, and again from the order's email or link
// while the payment is still open. Not behind the checkout gate: the
// checkout cookies are gone by now and the order number is the ticket.
export default async function PayPage({
  params,
}: {
  params: Promise<{ number: string }>;
}) {
  const { number } = await params;
  const payment = await paymentStatus(number.toUpperCase());
  if (!payment) notFound();

  // The QR comes as SVG from the API; shown as an image so the markup never
  // runs as part of the page.
  let qrSvg: string | null = null;
  try {
    const res = await api.orders[":number"].payment.qr.$get({ param: { number: payment.orderNumber } });
    if (res.status === 200) qrSvg = await res.text();
  } catch (e) {
    console.error("payment qr unreachable", e);
  }

  return (
    <main>
      <section className={cn(container, "py-16")}>
        <PayWithUsdc initial={payment} qrSvg={qrSvg} />
      </section>
      {/* The bar sticks in the navbar's place: same as the shop and repository pages. */}
      <SetNavbar sticky={false} />
      <SetLocalNav sticky title="Checkout" titleClassName="font-medium" links={[]} />
    </main>
  );
}
