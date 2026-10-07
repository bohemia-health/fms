CREATE TYPE "public"."item_code" AS ENUM('RE', 'ZE', 'OZ', 'H', 'BP', 'TB4', 'BB', 'CJND', 'IP', 'CI', 'TE', 'SS', 'MO');--> statement-breakpoint
CREATE TYPE "public"."item_form_types" AS ENUM('injectable', 'capsule', 'tablet', 'liquid');--> statement-breakpoint
CREATE TYPE "public"."announcement_variant" AS ENUM('info', 'warning', 'critical');--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ezformz_id" text,
	"image" text,
	"title" text NOT NULL,
	"url" text,
	"description" text,
	"weight_oz" numeric(6, 2),
	CONSTRAINT "products_ezformz_id_unique" UNIQUE("ezformz_id")
);
--> statement-breakpoint
CREATE TABLE "campaigns" (
	"campaign_id" text PRIMARY KEY DEFAULT lpad(floor(random() * 1000000)::int::text, 6, '0') NOT NULL,
	"title" text DEFAULT 'Untitled Group Buy' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "batch" (
	"id" uuid DEFAULT gen_random_uuid(),
	"item_id" integer NOT NULL,
	"batch_number" text NOT NULL,
	"stock_quantity" integer
);
--> statement-breakpoint
CREATE TABLE "coa" (
	"id" uuid DEFAULT gen_random_uuid(),
	"coa_id" uuid PRIMARY KEY DEFAULT lpad(floor(random() * 1000000)::int::text, 6, '0') NOT NULL,
	"batch_id" text NOT NULL,
	"lab_id" text NOT NULL,
	"test_performed" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lab" (
	"id" uuid DEFAULT gen_random_uuid(),
	"name" text
);
--> statement-breakpoint
CREATE TABLE "site_announcements" (
	"id" text PRIMARY KEY DEFAULT lpad(floor(random() * 1000000)::int::text, 6, '0') NOT NULL,
	"message" text NOT NULL,
	"href" text,
	"link_label" text,
	"variant" "announcement_variant" DEFAULT 'info' NOT NULL,
	"dismissable" boolean DEFAULT true NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"starts_at" timestamp with time zone DEFAULT now() NOT NULL,
	"ends_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "items" DROP CONSTRAINT "items_ezformz_id_unique";--> statement-breakpoint
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_product_id_items_id_fk";
--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'items'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "items" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
ALTER TABLE "items" ALTER COLUMN "id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "items" ADD COLUMN "manufacturer_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "items" ADD COLUMN "name" text DEFAULT 'Untitled Item' NOT NULL;--> statement-breakpoint
ALTER TABLE "items" ADD COLUMN "item_code" "item_code" NOT NULL;--> statement-breakpoint
ALTER TABLE "items" ADD COLUMN "form" "item_form_types" DEFAULT 'injectable' NOT NULL;--> statement-breakpoint
ALTER TABLE "items" ADD COLUMN "sell_price" numeric(10, 2) DEFAULT '0.00' NOT NULL;--> statement-breakpoint
ALTER TABLE "items" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "batch" ADD CONSTRAINT "batch_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coa" ADD CONSTRAINT "coa_batch_id_batch_id_fk" FOREIGN KEY ("batch_id") REFERENCES "public"."batch"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coa" ADD CONSTRAINT "coa_lab_id_lab_id_fk" FOREIGN KEY ("lab_id") REFERENCES "public"."lab"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "items" ADD CONSTRAINT "items_manufacturer_id_manufacturer_id_fk" FOREIGN KEY ("manufacturer_id") REFERENCES "public"."manufacturer"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "items" DROP COLUMN "ezformz_id";--> statement-breakpoint
ALTER TABLE "items" DROP COLUMN "image";--> statement-breakpoint
ALTER TABLE "items" DROP COLUMN "title";--> statement-breakpoint
ALTER TABLE "items" DROP COLUMN "url";--> statement-breakpoint
ALTER TABLE "items" DROP COLUMN "description";--> statement-breakpoint
ALTER TABLE "items" DROP COLUMN "weight_oz";