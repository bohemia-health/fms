"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { CHECKOUT_COOKIES, GUEST_COOKIE, checkoutCookieOptions } from "./gate";
import { api } from "@/lib/api";
import { getBagLines } from "@/app/bag/bag";
import { getSessionUser } from "@/lib/session";
import { checkoutTotals } from "./totals";
import { isPaymentMethodId } from "./payment-methods";
import {
  ADDRESS_COOKIE,
  parseAddress,
  readAddress,
  type Address,
} from "./address";
import {
  DELIVERY_COOKIE,
  isDeliveryMethod,
  isSectionKey,
  parseDeliveryChoices,
} from "./delivery";

export async function continueAsGuest() {
  const jar = await cookies();
  jar.set(GUEST_COOKIE, "1", checkoutCookieOptions());
  renewCheckout(jar);
  redirect("/checkout");
}

// Remember which rate the customer picked for one shipment. A server action
// is a public endpoint, so both arguments are checked, not trusted.
export async function setDeliveryMethod(section: string, method: string) {
  if (!isSectionKey(section) || !isDeliveryMethod(method)) return;
  const jar = await cookies();
  const current = parseDeliveryChoices(jar.get(DELIVERY_COOKIE)?.value);
  jar.set(
    DELIVERY_COOKIE,
    JSON.stringify({ ...current, [section]: method }),
    checkoutCookieOptions(),
  );
  renewCheckout(jar);
  revalidatePath("/checkout");
}

// Step 2: what the address form hands back when the carrier knows a cleaner
// form of the typed address. The form shows both and asks which to keep.
export type AddressReview = { entered: Address; recommended: Address };

function keepAddress(
  jar: Awaited<ReturnType<typeof cookies>>,
  address: Address,
) {
  jar.set(ADDRESS_COOKIE, JSON.stringify(address), checkoutCookieOptions());
  renewCheckout(jar);
}

// Step 2: check the typed address with the carrier, then keep it until the
// order is placed and move on. A field the browser let through empty sends
// them back to the form. A close match comes back as a review for the
// "Use recommended address instead?" dialog; verification being unavailable
// is never a block, the typed address simply stands.
export async function saveShippingAddress(
  _prev: AddressReview | null,
  formData: FormData,
): Promise<AddressReview | null> {
  const parsed = parseAddress(formData);
  if ("missing" in parsed) redirect("/checkout/shipping");
  const entered = parsed.address;

  let review: AddressReview | null = null;
  try {
    const res = await api.shipping["validate-address"].$post({
      json: {
        address1: entered.address1,
        address2: entered.address2,
        city: entered.city,
        state: entered.state,
        postalCode: entered.postalCode,
        country: entered.country,
      },
    });
    if (res.status === 200) {
      const verdict = await res.json();
      if (verdict.status === "recommend") {
        review = {
          entered,
          recommended: { ...entered, ...verdict.recommended },
        };
      }
    }
  } catch (e) {
    console.error("validate-address unreachable", e);
  }
  if (review) return review;

  const jar = await cookies();
  keepAddress(jar, entered);
  redirect("/checkout/payment");
}

// The dialog's answer: the address they chose, as JSON in a hidden field.
export async function confirmShippingAddress(formData: FormData) {
  const address = readAddress(String(formData.get("address") ?? ""));
  if (!address) redirect("/checkout/shipping");
  const jar = await cookies();
  keepAddress(jar, address);
  redirect("/checkout/payment");
}

// Restart the idle clock on every checkout cookie that exists, so they all
// expire together an hour after the last step rather than one by one.
function renewCheckout(jar: Awaited<ReturnType<typeof cookies>>) {
  for (const name of CHECKOUT_COOKIES) {
    const value = jar.get(name)?.value;
    if (value !== undefined) jar.set(name, value, checkoutCookieOptions());
  }
}

// Step 3: place the order. The API writes the order from the bag and the
// saved address, prices it itself, opens the payment with Stablehand and
// empties the bag; we then drop every checkout cookie and send the shopper to
// the pay page. A failure goes back to the payment step with a reason.
export async function placeOrder(formData: FormData) {
  const method = formData.get("paymentMethod");
  if (!isPaymentMethodId(method)) redirect("/checkout/payment");

  const [lines, user, jar] = await Promise.all([
    getBagLines(),
    getSessionUser(),
    cookies(),
  ]);
  if (lines.length === 0) redirect("/bag");
  const address = readAddress(jar.get(ADDRESS_COOKIE)?.value);
  if (!address) redirect("/checkout/shipping");
  const { summary } = await checkoutTotals(lines, jar);

  let outcome: { orderNumber: string } | { error: string };
  try {
    const res = await api.orders.$post({
      json: {
        userId: user?.id ?? null,
        email: address.email || user?.email || "",
        bagToken: jar.get("bag_token")?.value ?? null,
        items: lines.map((l) => ({ itemId: l.itemId, quantity: l.quantity })),
        address: {
          firstName: address.firstName,
          lastName: address.lastName,
          company: address.company,
          address1: address.address1,
          address2: address.address2,
          address3: address.address3,
          city: address.city,
          state: address.state,
          postalCode: address.postalCode,
          country: address.country,
        },
        shipping: summary.shipping,
        paymentMethod: method,
      },
    });
    if (res.status === 201) {
      outcome = { orderNumber: (await res.json()).orderNumber };
    } else {
      console.error(`POST /orders answered ${res.status}`, await res.text());
      // 502/503 mean the order exists but Stablehand would not open the
      // payment; anything else is the order itself being refused.
      outcome = { error: res.status === 502 || res.status === 503 ? "payment" : "order" };
    }
  } catch (e) {
    console.error("POST /orders unreachable", e);
    outcome = { error: "order" };
  }
  if ("error" in outcome) redirect(`/checkout/payment?error=${outcome.error}`);

  for (const name of CHECKOUT_COOKIES) jar.delete(name);
  redirect(`/checkout/pay/${outcome.orderNumber}`);
}

// What the pay page shows and polls. Each read asks the API, which asks
// Stablehand while the payment is still open.
export type PaymentView = {
  orderNumber: string;
  method: string;
  status: string; // open | underpaid | paid | expired | cancelled
  amount: string; // "84.50"
  address: string;
  paymentUrl: string;
  expiresAt: string;
};

export async function paymentStatus(orderNumber: string): Promise<PaymentView | null> {
  if (!/^[A-Z0-9]{1,32}$/.test(orderNumber)) return null;
  const res = await api.orders[":number"].payment.$get({ param: { number: orderNumber } });
  if (res.status !== 200) return null;
  return await res.json();
}
