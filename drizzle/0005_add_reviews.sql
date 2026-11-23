CREATE TABLE IF NOT EXISTS "reviews" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"rating" integer NOT NULL,
	"message" text NOT NULL,
	"approved" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "reviews_rating_range" CHECK ("rating" BETWEEN 1 AND 5)
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "reviews_approved_idx" ON "reviews" USING btree ("approved");
