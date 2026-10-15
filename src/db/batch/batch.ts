import { pgTable, integer, text, uuid } from "drizzle-orm/pg-core";
import { itemTable } from "../item";

export const batch = pgTable("batch", {
  id: integer("id")
    .primaryKey()
    .generatedAlwaysAsIdentity({ startWith: 100000 }),
  item_id: uuid("item_id")
    .notNull()
    .references(() => itemTable.id),
  batch_number: text("batch_number").notNull(),
  quantity: integer(),
});
