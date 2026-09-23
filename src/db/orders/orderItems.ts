import {
  pgTable,
  uuid,
  integer,
  varchar,
  numeric,
  primaryKey,
} from "drizzle-orm/pg-core";
import { ordersTable } from "./orders";
import { productsTable } from "../products/products";

/* TO-DO: FINISH IMPLEMENTING ORDER_ITEMS DB TABLE */
export const orderItemsTable = pgTable(
  "order_items",
  {
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
  (table) => [primaryKey({ columns: [table.order_id, table.product_id] })],
);
