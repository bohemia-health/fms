import { pgTable, pgEnum, uuid, text } from "drizzle-orm/pg-core";
import { ordersTable } from "./orders";

export const orderAddressType = pgEnum("order_address_type", [
  "shipping",
  "billing",
]);

export const orderAddressesTable = pgTable("order_addresses", {
  id: uuid("id").primaryKey().defaultRandom(),
  order_id: uuid("order_id")
    .notNull()
    .references(() => ordersTable.id),
  type: orderAddressType("type").notNull(),
  name: text("name"),
  line1: text("line1").notNull(),
  line2: text("line2"),
  line3: text("line3"),
  city: text("city"),
  state: text("state/province"),
  postal_code: text("zipcode"),
  country: text("country").notNull().default("US"),
});
