import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { container } from "@asclepius/ui";
import { cn } from "@/lib/utils";
import { getBagLines } from "@/app/bag/bag";
import { guessLocation } from "@/app/bag/tax";
import { getSessionUser } from "@/lib/session";
import AddressForm from "@/components/checkout/AddressForm";
import CheckoutBar from "@/components/checkout/CheckoutBar";
import { ADDRESS_COOKIE, countryOptions, readAddress } from "../address";
import { checkoutTotals } from "../totals";
import { GUEST_COOKIE, checkoutDestination } from "../gate";

// Step 2 of checkout: where it ships. Same gate as step 1, so a deep link
// cannot skip signing in or the bag.
export default async function CheckoutShippingPage() {
  const [lines, user, jar] = await Promise.all([
    getBagLines(),
    getSessionUser(),
    cookies(),
  ]);
  const destination = checkoutDestination({
    hasLines: lines.length > 0,
    signedIn: user !== null,
    guest: jar.get(GUEST_COOKIE)?.value === "1",
  });
  if (destination !== "checkout") redirect("/checkout");

  const saved = readAddress(jar.get(ADDRESS_COOKIE)?.value);
  const [{ country, postal }, { summary }] = await Promise.all([
    guessLocation(),
    checkoutTotals(lines, jar),
  ]);

  return (
    <main>
      <section className={cn(container, "py-16")}>
        <h1 className="text-[2.55rem] font-medium">
          Where should we send your order?
        </h1>
        <div className="mt-4">
          <AddressForm
            defaults={saved}
            country={country}
            postalCode={postal ?? null}
            email={user?.email}
            countries={countryOptions()}
          />
        </div>
      </section>
      <CheckoutBar summary={summary} />
    </main>
  );
}
