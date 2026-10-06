import { pgTable, pgEnum, text } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const itemCode = pgEnum("item_code_type", [
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
  id: text("id")
    .primaryKey()
    .default(sql`lpad(floor(random() * 1000000)::int::text, 6, '0')`),
  code: itemCode("item_code_type").notNull(),
  name: text("name"),
  vendor: text("vendor"),
});
