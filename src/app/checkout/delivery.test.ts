import { test } from "node:test";
import assert from "node:assert/strict";
import {
  checkoutSections,
  parseDeliveryChoices,
  shipsIn,
} from "./delivery.ts";

const line = (itemId: string, campaign: null | { id: string; title: string; shipsInWeeksMin: number | null; shipsInWeeksMax: number | null }) =>
  ({ itemId, campaign }) as never;

test("stock items share one section headed in stock", () => {
  const s = checkoutSections([line("a", null), line("b", null)]);
  assert.equal(s.length, 1);
  assert.equal(s[0].key, "ready");
  assert.equal(s[0].heading, "In stock and ready to ship.");
  assert.equal(s[0].lines.length, 2);
});

test("a group buy item gets its own section after stock", () => {
  const c = { id: "123456", title: "Elo", shipsInWeeksMin: 4, shipsInWeeksMax: 8 };
  const s = checkoutSections([line("pre", c), line("a", null)]);
  assert.deepEqual(
    s.map((x) => [x.key, x.heading, x.shipsLater]),
    [
      ["ready", "In stock and ready to ship.", false],
      ["campaign:123456", "Ships in 4-8 weeks.", true],
    ],
  );
});

test("ship window copy handles one bound and none", () => {
  assert.equal(shipsIn({ shipsInWeeksMin: 6, shipsInWeeksMax: 6 }), "Ships in 6 weeks.");
  assert.equal(shipsIn({ shipsInWeeksMin: null, shipsInWeeksMax: 8 }), "Ships in 8 weeks.");
  assert.equal(shipsIn({ shipsInWeeksMin: null, shipsInWeeksMax: null }), "Ships after the group buy closes.");
});

test("delivery choices default to standard and ignore junk", () => {
  assert.deepEqual(parseDeliveryChoices(undefined), {});
  assert.deepEqual(
    parseDeliveryChoices('{"ready":"expedited","campaign:1":"nope","x":"standard"}'),
    { ready: "expedited" },
  );
  assert.deepEqual(parseDeliveryChoices("not json"), {});
});
