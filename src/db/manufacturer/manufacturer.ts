import { pgTable, integer, text } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const manufacturer = pgTable("manufacturer", {
  id: integer("public_id")
    .primaryKey()
    .default(sql`floor(random() * 900000 + 100000)::int`),
  name: text().notNull(),
  short_name: text(),
});
