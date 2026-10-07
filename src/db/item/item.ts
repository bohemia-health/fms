import { pgTable, pgEnum, integer, text, numeric } from "drizzle-orm/pg-core";
import { manufacturer } from "../manufacturer";

export const itemFormTypes = pgEnum("item_form_types", [
  "injectable",
  "capsule",
  "tablet",
  "liquid",
]);

export const productCode = pgEnum("product_code", [
  "RE",
  "ZE",
  "OZ",
  "H",
  "BP",
  "TB4",
  "BB",
  "CJND",
  "IP",
  "CI",
  "TE",
  "SS",
  "MO",
]);

export const itemTable = pgTable("items", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity({ startWith: 100000 }),
  manufacturer_id: integer("manufacturer_id")
    .notNull()
    .references(() => manufacturer.id),
  name: text("name").notNull().default("Untitled Item"),
  product_code: productCode().notNull(),
  size: text("size").notNull(),
  form: itemFormTypes().notNull().default("injectable"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull().default("0.00"),
});
