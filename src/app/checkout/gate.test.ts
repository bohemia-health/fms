import { test } from "node:test";
import assert from "node:assert/strict";
import {
  CHECKOUT_COOKIES,
  CHECKOUT_TTL_SECONDS,
  checkoutCookieOptions,
  checkoutDestination,
} from "./gate.ts";
import { DELIVERY_COOKIE } from "./delivery.ts";
import { ADDRESS_COOKIE } from "./address.ts";

test("an empty bag has nothing to check out: back to the bag", () => {
  assert.equal(
    checkoutDestination({ hasLines: false, signedIn: true, guest: false }),
    "bag",
  );
  assert.equal(
    checkoutDestination({ hasLines: false, signedIn: false, guest: true }),
    "bag",
  );
});

test("a signed-in shopper goes straight to checkout", () => {
  assert.equal(
    checkoutDestination({ hasLines: true, signedIn: true, guest: false }),
    "checkout",
  );
});

test("a guest who has not chosen yet sees the gate", () => {
  assert.equal(
    checkoutDestination({ hasLines: true, signedIn: false, guest: false }),
    "gate",
  );
});

test("a guest who chose to continue as guest goes to checkout", () => {
  assert.equal(
    checkoutDestination({ hasLines: true, signedIn: false, guest: true }),
    "checkout",
  );
});

test("signing in outranks an earlier guest choice", () => {
  assert.equal(
    checkoutDestination({ hasLines: true, signedIn: true, guest: true }),
    "checkout",
  );
});

test("checkout cookies expire together after the idle window", () => {
  assert.deepEqual(
    [...CHECKOUT_COOKIES],
    ["checkout_guest", DELIVERY_COOKIE, ADDRESS_COOKIE],
  );
  assert.equal(checkoutCookieOptions().maxAge, CHECKOUT_TTL_SECONDS);
  assert.equal(checkoutCookieOptions().httpOnly, true);
  assert.equal(CHECKOUT_TTL_SECONDS, 3600);
});
