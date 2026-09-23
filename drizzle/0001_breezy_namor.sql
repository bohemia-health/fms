CREATE TYPE "public"."order_address_type" AS ENUM('shipping', 'billing');--> statement-breakpoint
CREATE TYPE "public"."order_status_type" AS ENUM('order received', 'open', 'shipped', 'completed', 'cancelled', 'action required');--> statement-breakpoint
CREATE TABLE "order_addresses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"type" "order_address_type" NOT NULL,
	"name" text,
	"line1" text NOT NULL,
	"line2" text,
	"line3" text,
	"city" text,
	"state/province" text,
	"zipcode" text,
	"country" text DEFAULT 'US' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_number" text NOT NULL,
	"customer_id" integer NOT NULL,
	"status" "order_status_type" DEFAULT 'order received' NOT NULL,
	CONSTRAINT "orders_order_number_unique" UNIQUE("order_number")
);
--> statement-breakpoint
ALTER TABLE "order_addresses" ADD CONSTRAINT "order_addresses_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;