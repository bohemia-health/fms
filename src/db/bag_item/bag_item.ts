import {
  pgTable,
  uuid,
  integer,
  primaryKey,
  timestamp,
} from "drizzle-orm/pg-core";
import { bag } from "../bag/bag";
import { itemTable } from "../item";

export const bag_items = pgTable(
  "bag_items",
  {
    bag_id: uuid("bag_id")
      .notNull()
      .references(() => bag.id, {
        onDelete: "cascade",
      }),
    item_id: uuid("item_id")
      .notNull()
      .references(() => itemTable.id),

    quantity: integer().notNull().default(1),
    added_at: timestamp().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.bag_id, t.item_id] })],
);
