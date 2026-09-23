import { pgTable, uuid, integer, varchar, numeric } from "drizzle-orm/pg-core";
import { ordersTable } from "./orders";
import { productsTable } from "../products/products";

// One row per line item. The same product can appear more than once on an
// order (different options), so this has its own id rather than a
// composite (order_id, product_id) key.
export const orderItemsTable = pgTable(
  "order_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    order_id: uuid("order_id")
      .notNull()
      .references(() => ordersTable.id),

    product_id: uuid("product_id")
      .notNull()
      .references(() => productsTable.id),

    quantity: integer("quantity").notNull(),
    priceAtPurchase: numeric("price_at_purchase", {
      precision: 10,
      scale: 2,
    }).notNull(),
    nameAtPurchase: varchar("name_at_purchase", { length: 255 }).notNull(),
  },
);
