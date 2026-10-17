import { pgTable, uuid, integer, text, uniqueIndex } from "drizzle-orm/pg-core";

export const category = pgTable("category_table", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  slug: text("slug").notNull(),
});
