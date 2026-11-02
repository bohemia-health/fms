import { test } from "node:test";
import assert from "node:assert/strict";
import { parseAddress, readAddress } from "./address.ts";

const form = (fields: Record<string, string>) => {
  const f = new FormData();
  for (const [k, v] of Object.entries(fields)) f.set(k, v);
  return f;
};

const base = {
  firstName: " Janae ",
  lastName: "Dooley",
  address1: "1 Main St",
  postalCode: "37201",
  country: "us",
  email: "Janae@Example.com",
};

test("a picked City, State fills city and state", () => {
  const r = parseAddress(form({ ...base, place: "Nashville|TN" }));
  assert.ok("address" in r);
  assert.equal(r.address.firstName, "Janae");
  assert.equal(r.address.city, "Nashville");
  assert.equal(r.address.state, "TN");
  assert.equal(r.address.country, "US");
  assert.equal(r.address.business, false);
  assert.equal(r.address.company, "");
  assert.equal(r.address.email, "janae@example.com");
  assert.equal(r.address.phone, "");
});

test("Other uses the typed city and state, and the checkbox is read", () => {
  const r = parseAddress(
    form({
      ...base,
      place: "other",
      city: "Antioch",
      state: "TN",
      business: "1",
      company: "Bohemia Health",
      phone: "615 555 0100",
    }),
  );
  assert.ok("address" in r);
  assert.equal(r.address.city, "Antioch");
  assert.equal(r.address.business, true);
  assert.equal(r.address.company, "Bohemia Health");
  assert.equal(r.address.phone, "615 555 0100");
});

test("a company name is dropped when it is not a business address", () => {
  const r = parseAddress(
    form({ ...base, place: "Nashville|TN", company: "Acme" }),
  );
  assert.ok("address" in r);
  assert.equal(r.address.company, "");
});

test("email is required and must look like one", () => {
  const r = parseAddress(
    form({ ...base, place: "Nashville|TN", email: "nope" }),
  );
  assert.ok("missing" in r);
  assert.deepEqual(r.missing, ["email"]);
});

test("missing fields are named", () => {
  const r = parseAddress(form({ firstName: "J", country: "XX" }));
  assert.ok("missing" in r);
  assert.deepEqual(r.missing, [
    "lastName",
    "address1",
    "postalCode",
    "city",
    "state",
    "email",
    "phone",
    "country",
  ]);
});

test("a saved address round-trips and junk reads as none", () => {
  const r = parseAddress(form({ ...base, place: "Nashville|TN" }));
  assert.ok("address" in r);
  assert.deepEqual(readAddress(JSON.stringify(r.address)), r.address);
  assert.equal(readAddress("{"), null);
  assert.equal(readAddress(undefined), null);
});

test("a phone number is optional in the US and required elsewhere", () => {
  const us = parseAddress(form({ ...base, place: "Nashville|TN" }));
  assert.ok("address" in us);
  const gb = parseAddress(
    form({
      ...base,
      country: "GB",
      postalCode: "B98 7YD",
      city: "Redditch",
      state: "ENG",
    }),
  );
  assert.ok("missing" in gb);
  assert.deepEqual(gb.missing, ["phone"]);
});
