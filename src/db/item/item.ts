import { pgTable, pgEnum, text, numeric, uuid } from "drizzle-orm/pg-core";
import { itemCodes } from "../item_code";

export const itemFormTypes = pgEnum("item_form_types", [
  "injectable",
  "capsule",
  "tablet",
  "liquid",
]);

export const itemTable = pgTable("items", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().default("Untitled Item"),
  item_code_id: uuid("item_code_id").references(() => itemCodes.id),
  size: text("size").notNull(),
  form: itemFormTypes().notNull().default("injectable"),
  price: numeric("price", { precision: 10, scale: 2 })
    .notNull()
    .default("0.00"),
});
