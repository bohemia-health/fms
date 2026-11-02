// Set when a guest chooses to continue without signing in.
export const GUEST_COOKIE = "checkout_guest";

// How long an idle checkout lives. Every checkout action re-sets all of its
// cookies with this age, so the clock restarts on each step and an
// abandoned checkout (guest flag, delivery choice, typed address) clears
// itself an hour after the last one.
export const CHECKOUT_TTL_SECONDS = 60 * 60;

/** Every cookie a checkout leaves behind; renewed together, expired together. */
export const CHECKOUT_COOKIES = [
  GUEST_COOKIE,
  "checkout_delivery", // DELIVERY_COOKIE in delivery.ts
  "checkout_address", // ADDRESS_COOKIE in address.ts
] as const;

export function checkoutCookieOptions() {
  return {
    sameSite: "lax" as const,
    path: "/",
    httpOnly: true,
    maxAge: CHECKOUT_TTL_SECONDS,
  };
}

// Where /checkout sends someone. Pure so it is unit tested; the page gathers
// the three facts and acts on the answer.
export type CheckoutDestination = "bag" | "gate" | "checkout";

export function checkoutDestination(input: {
  hasLines: boolean; // anything in the bag
  signedIn: boolean; // a Bohemia session cookie the API accepts
  guest: boolean; // chose "Continue as Guest" earlier this visit
}): CheckoutDestination {
  if (!input.hasLines) return "bag";
  if (input.signedIn || input.guest) return "checkout";
  return "gate";
}
