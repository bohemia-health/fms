import { pgTable, integer, text } from "drizzle-orm/pg-core";

export const manufacturer = pgTable("manufacturer", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity({ startWith: 100000 }),
  name: text().notNull(),
});
