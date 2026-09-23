import { pgTable, uuid, text, numeric } from "drizzle-orm/pg-core";

export const productsTable = pgTable("items", {
  id: uuid("id").primaryKey().defaultRandom(),
  ezformz_id: text("ezformz_id").unique(),
  image: text(),
  title: text().notNull(),
  url: text(),
  description: text(),
  weight: numeric("weight_oz", { precision: 6, scale: 2 }),
});
