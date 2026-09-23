import {
  integer,
  pgTable,
  pgEnum,
  varchar,
  text,
  uuid,
} from "drizzle-orm/pg-core";

import { sql } from "drizzle-orm";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  first_name: varchar({ length: 255 }).notNull(),
  last_name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  phone: text("phone"),
});

export const customersTable = pgTable("customers", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  first_name: varchar({ length: 255 }).notNull(),
  last_name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  phone: text("phone"),
});

export const orderStatus = pgEnum("order_status_type", [
  "order received",
  "open",
  "shipped",
  "completed",
  "cancelled",
  "action required",
]);

export const orderAddressType = pgEnum("order_address_type", [
  "shipping",
  "billing",
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
    sql`CONSTRAINT order_number_upper_check CHECK (${table.order_number} = upper(${table.order_number}))`,
  ],
);

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
