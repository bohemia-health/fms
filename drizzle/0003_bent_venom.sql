ALTER TABLE "items" ADD COLUMN "ezformz_id" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "ezformz_id" text;--> statement-breakpoint
ALTER TABLE "items" ADD CONSTRAINT "items_ezformz_id_unique" UNIQUE("ezformz_id");--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_ezformz_id_unique" UNIQUE("ezformz_id");