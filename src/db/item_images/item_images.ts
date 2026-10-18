import { pgTable, uuid, text, integer } from "drizzle-orm/pg-core";
import { itemTable } from "../item/item";

export const item_images = pgTable("item_images", {
  id: uuid("id").defaultRandom().primaryKey(),
  item_id: uuid("item_id").references(() => itemTable.id, {
    onDelete: "cascade",
  }),
  file_key: text().unique(),
  position: integer(),
  alt: text(),
});
