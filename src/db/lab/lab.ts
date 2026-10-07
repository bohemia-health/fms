import { pgTable, uuid, text } from "drizzle-orm/pg-core";

export const labTable = pgTable("lab", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text(),
});
