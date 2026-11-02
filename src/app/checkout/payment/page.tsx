import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { container } from "@asclepius/ui";
import { cn } from "@/lib/utils";
import { getBagLines } from "@/app/bag/bag";
import { getSessionUser } from "@/lib/session";
import CheckoutBar from "@/components/checkout/CheckoutBar";
import PaymentMethods from "@/components/checkout/PaymentMethods";
import { ADDRESS_COOKIE, readAddress } from "../address";
import { PAYMENT_GROUPS } from "../payment-methods";
import { checkoutTotals } from "../totals";
import { GUEST_COOKIE, checkoutDestination } from "../gate";

const ERRORS: Record<string, string> = {
  payment:
    "We couldn't open the payment just now. Nothing was charged; please try again in a moment.",
  order: "The order couldn't be placed. Please check your bag and try again.",
};

// Step 3 of checkout: how to pay. Same gate as the steps before it, plus the
// address from step 2 has to be there; a deep link without one goes back.
export default async function CheckoutPaymentPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const [lines, user, jar, { error }] = await Promise.all([
    getBagLines(),
    getSessionUser(),
    cookies(),
    searchParams,
  ]);
  const destination = checkoutDestination({
    hasLines: lines.length > 0,
    signedIn: user !== null,
    guest: jar.get(GUEST_COOKIE)?.value === "1",
  });
  if (destination !== "checkout") redirect("/checkout");
  if (!readAddress(jar.get(ADDRESS_COOKIE)?.value)) redirect("/checkout/shipping");

  const { summary } = await checkoutTotals(lines, jar);

  return (
    <main>
      <section className={cn(container, "py-16")}>
        <h1 className="text-[2.55rem] font-medium">How would you like to pay?</h1>
        <div className="mt-10 grid gap-10 md:grid-cols-[32rem_1fr] md:items-start">
          <PaymentMethods
            groups={PAYMENT_GROUPS}
            error={error ? (ERRORS[error] ?? ERRORS.order) : null}
          />
        </div>
      </section>
      <CheckoutBar summary={summary} />
    </main>
  );
}
