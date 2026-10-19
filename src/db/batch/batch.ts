import { pgTable, integer, text, uuid } from "drizzle-orm/pg-core";
import { itemTable } from "../item";
import { manufacturer } from "../manufacturer";
import { itemCodes } from "../item_code";

export const batch = pgTable("batch", {
  id: integer("id")
    .primaryKey()
    .generatedAlwaysAsIdentity({ startWith: 100000 }),
  item_id: uuid("item_id").references(() => itemTable.id),
  item_code_id: uuid("item_code_id")
    .notNull()
    .references(() => itemCodes.id),
  manufacturer_id: integer("manufacturer_id")
    .notNull()
    .references(() => manufacturer.id)
    .default(110000),
  batch_number: text("batch_number").notNull(),
  quantity: integer(),
  // Vial appearance, shown under a bag line so the customer can match the
  // vial in hand to the batch and its lab report.
  cap_color: text("cap_color"),
  crimp_color: text("crimp_color"),
});
