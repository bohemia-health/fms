import assert from "node:assert/strict";
import { test } from "node:test";
import { formatCampaignTime } from "./campaign-timing.ts";

test("UTC midnight is shown on the correct Central calendar date", () => {
  assert.deepEqual(formatCampaignTime("2026-11-09T00:00:00.000Z"), {
    iso: "2026-11-09T00:00:00.000Z",
    date: "Nov 8, 2026",
    time: "6:00 PM CST",
  });
  assert.equal(formatCampaignTime("2026-11-23T00:00:00.000Z")?.date, "Nov 22, 2026");
});

test("Central daylight saving time is handled without a fixed UTC offset", () => {
  assert.equal(formatCampaignTime("2026-07-09T00:00:00.000Z")?.time, "7:00 PM CDT");
});

test("missing or invalid dates are left unannounced", () => {
  assert.equal(formatCampaignTime(null), null);
  assert.equal(formatCampaignTime(undefined), null);
  assert.equal(formatCampaignTime("not-a-date"), null);
});
