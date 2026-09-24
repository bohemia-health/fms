CREATE TABLE "departments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"dept_name" text NOT NULL,
	"code" varchar(3) NOT NULL,
	"parent_department_id" uuid,
	CONSTRAINT "departments_code_unique" UNIQUE("code")
);
--> statement-breakpoint
ALTER TABLE "departments" ADD CONSTRAINT "departments_parent_department_id_fkey" FOREIGN KEY ("parent_department_id") REFERENCES "public"."departments"("id") ON DELETE no action ON UPDATE no action;