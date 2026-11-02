import { container, SetLocalNav, SetNavbar } from "@asclepius/ui";
import { cn } from "@/lib/utils";

// Step 3 of checkout. Placeholder until the payment provider is chosen; it
// proves the address form's continue button lands somewhere.
export default function CheckoutPaymentPage() {
  return (
    <main>
      <section className={cn(container, "py-24")}>
        <h1 className="text-[1.75rem] font-semibold tracking-tight md:text-[2.45rem]">
          Payment
        </h1>
      </section>
      {/* The bar sticks in the navbar's place: same as the shop and repository pages. */}
      <SetNavbar sticky={false} />
      <SetLocalNav
        sticky
        title="Checkout"
        titleClassName="font-medium"
        links={[]}
      />
    </main>
  );
}
