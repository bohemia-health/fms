import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { SetBreadcrumb } from "@asclepius/ui";
import { loginUrl } from "@/lib/auth-site";
import { myOrder } from "@/lib/orders";
import OrderView from "@/components/orders/OrderView";

export default async function Page({ params }: { params: Promise<{ number: string }> }) {
  const { number } = await params;
  const order = await myOrder(number);
  if (order === "unauthenticated") redirect(loginUrl(`/order/${number}`));
  if (!order) notFound();

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-12 md:py-16">
      <Link href="/order/list" className="mb-6 inline-flex items-center text-sm text-[#0065CC] hover:underline">
        <ChevronLeft size={18} /> All orders
      </Link>
      <OrderView order={order} />
      <SetBreadcrumb items={[{ label: "Your orders", href: "/order/list" }, { label: order.orderNumber }]} />
    </main>
  );
}
