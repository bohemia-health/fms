import { test } from "node:test";
import assert from "node:assert/strict";
import { parsePostal } from "./postal.ts";

test("a UK postcode is recognised whatever country was guessed", () => {
  assert.deepEqual(parsePostal("b98 7yd", "US"), { country: "GB", postal: "B98 7YD" });
  assert.deepEqual(parsePostal("SW1A1AA", "US"), { country: "GB", postal: "SW1A 1AA" });
  assert.deepEqual(parsePostal("EC1A 1BB", "DE"), { country: "GB", postal: "EC1A 1BB" });
});

test("a Canadian postal code is recognised too", () => {
  assert.deepEqual(parsePostal("m5v 3l9", "US"), { country: "CA", postal: "M5V 3L9" });
  assert.deepEqual(parsePostal("M5V3L9", "US"), { country: "CA", postal: "M5V 3L9" });
});

test("digits keep the guessed country, and US needs a real zip", () => {
  assert.deepEqual(parsePostal("37201", "US"), { country: "US", postal: "37201" });
  assert.deepEqual(parsePostal("37201-1234", "US"), { country: "US", postal: "37201-1234" });
  assert.deepEqual(parsePostal("10115", "DE"), { country: "DE", postal: "10115" });
  assert.deepEqual(parsePostal("110001", "IN"), { country: "IN", postal: "110001" });
  assert.equal(parsePostal("1234", "US"), null);
  assert.equal(parsePostal("", "US"), null);
  assert.equal(parsePostal("B98 7YD!", "US"), null);
});
