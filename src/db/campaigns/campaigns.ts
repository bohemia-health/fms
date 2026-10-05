import { pgTable, text } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const campaigns = pgTable("campaigns", {
  id: text("campaign_id")
    .primaryKey()
    .default(sql`lpad(floor(random() * 1000000)::int::text, 6, '0')`),
  title: text("").notNull().default("Untitled Group Buy"),
});
