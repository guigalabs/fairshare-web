CREATE TABLE "case_folder" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "case" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"client_id" text,
	"folder_id" text,
	"deceased_name" text NOT NULL,
	"date_of_death" date,
	"place_of_death" text,
	"jurisdiction" text,
	"deceased_identifier" text,
	"hearing_date" date,
	"notes" text,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"subject_gender" text NOT NULL,
	"madhhab" text NOT NULL,
	"heirs" jsonb NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"gross_estate" numeric(18, 2),
	"funeral_expenses" numeric(18, 2) DEFAULT '0' NOT NULL,
	"debts" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"bequests" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"special_flags" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"advisory_notes" text,
	"result_snapshot" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "client" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"display_name" text NOT NULL,
	"primary_contact_name" text,
	"primary_contact_email" text,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "firm_branding" (
	"user_id" text PRIMARY KEY NOT NULL,
	"logo_object_key" text,
	"letterhead_text" text,
	"custom_disclaimer_en" text,
	"custom_disclaimer_ar" text,
	"primary_color" text,
	"signature_block" text,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "case_folder" ADD CONSTRAINT "case_folder_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "case" ADD CONSTRAINT "case_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "case" ADD CONSTRAINT "case_client_id_client_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "case" ADD CONSTRAINT "case_folder_id_case_folder_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."case_folder"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client" ADD CONSTRAINT "client_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "firm_branding" ADD CONSTRAINT "firm_branding_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;