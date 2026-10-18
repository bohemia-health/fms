import { pgTable, uuid, varchar, text, boolean } from "drizzle-orm/pg-core";
import { category } from "../category";
export const itemCodes = pgTable("item_codes", {
  id: uuid("id").defaultRandom().primaryKey(),
  category_id: uuid("category_id").references(() => category.id),
  name: text("name").notNull().default("Untitled Item"),
  code: varchar("code", { length: 20 }).notNull().unique(),
  codeTitle: text("title").notNull(),
  // URL segment for the product page: /shop/<slug>. One per product; the
  // size variants live in `items` and share this row.
  slug: text("slug").unique(),
  isActive: boolean("is_active").default(true),
});
