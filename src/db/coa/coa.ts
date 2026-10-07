import { pgTable, pgEnum, integer, uuid, text, date } from "drizzle-orm/pg-core";
import { batch } from "../batch";
import { labTable } from "../lab";

export const coaTestType = pgEnum("coa_test_type", [
  "mass_purity",
  "endotoxin",
  "lcms",
  "sterility",
]);

export const coa = pgTable("coa", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity({ startWith: 100000 }),
  public_id: text("public_id").notNull().unique(),
  batch_id: integer("batch_id")
    .notNull()
    .references(() => batch.id, { onDelete: "cascade" }),
  lab_id: uuid("lab_id")
    .notNull()
    .references(() => labTable.id),
  test_type: coaTestType().notNull(),
  tested_at: date("tested_at"),
  image: text(),
  result_url: text(),
});
