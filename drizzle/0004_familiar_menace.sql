ALTER TABLE "order_items" DROP CONSTRAINT "order_items_order_id_product_id_pk";--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL;