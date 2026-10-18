import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "../users";

export const bag = pgTable("bag_table", {
  id: uuid("id").defaultRandom().primaryKey(),
  user_id: uuid("user_id").references(() => usersTable.id),
  session_token: text().unique(),
  created_at: timestamp().defaultNow(),
  updated_at: timestamp(),
});
