CREATE TABLE "waitlist" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"source" text NOT NULL,
	"referrer" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "waitlist_email_source_uniq" UNIQUE("email","source")
);
