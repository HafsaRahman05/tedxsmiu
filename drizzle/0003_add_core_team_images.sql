CREATE TABLE "core_team" (
  "id" text PRIMARY KEY NOT NULL,
  "team_id" text NOT NULL REFERENCES "team"("id") ON DELETE CASCADE,
  "image_url" text NOT NULL,
  "sort_order" integer DEFAULT 0 NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX "core_team_teamId_idx" ON "core_team" ("team_id");
