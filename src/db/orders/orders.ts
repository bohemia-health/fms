import {
  pgTable,
  uuid,
  integer,
  text,
  pgEnum,
  check,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { customersTable } from "../customers/customers";

export const orderStatus = pgEnum("order_status_type", [
  "order received",
  "open",
  "shipped",
  "completed",
  "cancelled",
  "action required",
]);

export const ordersTable = pgTable(
  "orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    order_number: text("order_number").notNull().unique(),
    customer_id: integer("customer_id")
      .notNull()
      .references(() => customersTable.id),
    status: orderStatus("status").notNull().default("order received"),
  },
  (table) => [
    check(
      "order_number_upper_check",
      sql`${table.order_number} =
      upper(${table.order_number})`,
    ),
  ],
);
