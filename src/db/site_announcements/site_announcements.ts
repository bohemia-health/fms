import { pgTable, pgEnum, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const announcementVariant = pgEnum("announcement_variant", [
  "info",
  "warning",
  "critical",
]);

export const siteAnnouncements = pgTable("site_announcements", {
  id: text("id")
    .primaryKey()
    .default(sql`lpad(floor(random() * 1000000)::int::text, 6, '0')`),
  message: text("message").notNull(),
  href: text("href"),
  linkLabel: text("link_label"),
  variant: announcementVariant("variant").notNull().default("info"),
  dismissable: boolean("dismissable").notNull().default(true),
  isActive: boolean("is_active").notNull().default(true),
  startsAt: timestamp("starts_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  endsAt: timestamp("ends_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
