import { Fragment } from "react";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { container, SetLocalNav, SetNavbar } from "@asclepius/ui";
import { TruckIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { getBagLines } from "@/app/bag/bag";
import {
  ShipToAccordion,
  ShipToPanel,
  ShipToTrigger,
} from "@/components/bag/ShipTo";
import { getSessionUser } from "@/lib/session";
import BagButton from "@/components/bag/BagButton";
import CheckoutBar from "@/components/checkout/CheckoutBar";
import CheckoutGate from "@/components/checkout/CheckoutGate";
import CheckoutItem from "@/components/checkout/CheckoutItem";
import DeliveryNotes from "@/components/checkout/DeliveryNotes";
import DeliveryOptions from "@/components/checkout/DeliveryOptions";
import { GUEST_COOKIE, checkoutDestination } from "./gate";
import { checkoutTotals } from "./totals";
import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import { CheckoutLogoBag } from "@/components/icons/checkout-logo-bag";
import { Separator } from "@/components/ui/separator";


export default async function CheckoutPage() {
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
  if (destination === "bag") redirect("/bag");
  if (destination === "gate") {
    return (
      <main>
        <section className={cn(container)}>
          <CheckoutGate />
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

  const { shipping, sections, summary } = await checkoutTotals(lines, jar);
  const single = lines.length === 1;

  return (
    <main>
      <div className={cn(container)}>
        <div className="flex flex-col items-center justify-center gap-8 py-16">
          <h1 className="text-[2.65rem] text-center font-medium">
            How would you like to get your order?
          </h1>
          <ButtonGroup className="ring-2 ring-muted-foreground/50 rounded-md">
            <Button className="inline-flex gap-2 items-center max-w-lg py-10 px-4 bg-transparent text-foreground hover:bg-transparent">
              <TruckIcon className="size-5" />
              <span className="text-lg">I'd like it delivered.</span>
            </Button>
            <Separator orientation="vertical" className="w-6 bg-foreground" />
            <Button className="inline-flex gap-2 items-center max-w-lg py-10 px-4 bg-transparent text-foreground hover:bg-transparent">
              <CheckoutLogoBag className="size-5 stroke-2" />
              <span className="text-lg">I'd like to pick it up.</span>
            </Button>
          </ButtonGroup>

          {/* Where the quotes below are for. Same disclosure as the bag page;
            applying a zip re-renders the page with real rates. */}
          <ShipToAccordion
            country={shipping.country}
            postalCode={shipping.postalCode}
            className="flex flex-col items-center text-base"
          >
            <div className="flex items-baseline gap-1.5 whitespace-nowrap">
              <span>Delivers to:</span>
              <ShipToTrigger className="text-base" />
            </div>
            <ShipToPanel className="w-full max-w-md" />
          </ShipToAccordion>
        </div>

        <Separator />

        {single ? (
          <div className="py-10">
            <h2 className="font-medium text-2xl">{sections[0].heading}</h2>

            <CheckoutItem line={lines[0]} />

            <div>
              <h4 className="text-lg font-medium mb-4">
                Select your delivery method:
              </h4>
              <div className="grid gap-10 md:grid-cols-[32rem_1fr] md:items-start">
                <DeliveryOptions
                  section={sections[0].key}
                  selected={sections[0].selected}
                  options={sections[0].options}
                  reason={shipping.reason}
                  className="py-12"
                />
                <DeliveryNotes variant="aside" />
              </div>
            </div>
          </div>
        ) : (
          <section className="flex-col gap-8">
            {sections.map((s, i) => (
              <Fragment key={s.key}>
                {i > 0 && <Separator className=" bg-foreground/30" />}
                {/* The first section's top space comes from the heading's pt-8;
                  every section keeps the divider off its last card. */}
                <div className={i > 0 ? "py-12" : "pb-12"}>
                  <h2 className={cn("font-medium text-2xl", i === 0 && "pt-8")}>
                    {s.heading}
                  </h2>
                  <div className="flex flex-col">
                    {s.lines.map((line) => (
                      <CheckoutItem key={line.itemId} line={line} />
                    ))}
                  </div>
                  <div>
                    <h4 className="text-lg font-medium mb-4">
                      Select your delivery method:
                    </h4>
                    <div className="grid gap-10 md:grid-cols-[32rem_1fr] md:items-start">
                      <DeliveryOptions
                        section={s.key}
                        selected={s.selected}
                        options={s.options}
                        reason={shipping.reason}
                        className="py-4"
                      />
                    </div>
                  </div>
                </div>
              </Fragment>
            ))}

            <Separator />

            <DeliveryNotes variant="footer" />
          </section>
        )}

        <div className="flex justify-start border-t border-foreground/15 py-8">
          <Link
            href="/checkout/shipping"
            className="w-full md:w-auto md:min-w-80"
          >
            <BagButton label="Continue to shipping and fulfillment" />
          </Link>
        </div>
      </div>

      <div className="border-t border-b border-foreground/20">
        <div className={cn(container)}>
          <p className="font-normal text-[1.0rem] px-4 py-4.5">
            Need some help?{" "}
            <Link href="/support" className="text-[#0065CC] underline">
              Chat now.
            </Link>
          </p>
        </div>
      </div>

      <CheckoutBar summary={summary} />
    </main>
  );
}
