import Link from "next/link";
import { SetBreadcrumb } from "@asclepius/ui";
import { getSessionUser } from "@/lib/session";
import { StatusForm } from "./StatusForm";

export const metadata = { title: "Order status" };

// Where the footer's "Order Status" and "Track An Order" land. No account
// needed: the order number and the checkout email together open it.
export default async function Page() {
  const me = await getSessionUser();
  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-12 md:py-16">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Order status</h1>
        <p className="mt-1 max-w-xl text-muted-foreground">
          See where your order is and follow the parcel with the carrier.
          {me && (
            <>
              {" "}
              <Link href="/order/list" className="text-[#0065CC] hover:underline">
                Your orders are listed here.
              </Link>
            </>
          )}
        </p>
      </header>
      <StatusForm />
      <SetBreadcrumb items={[{ label: "Order status" }]} />
    </main>
  );
}
