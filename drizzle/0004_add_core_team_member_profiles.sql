ALTER TABLE "core_team"
  ADD COLUMN "name" text,
  ADD COLUMN "designation" text,
  ADD COLUMN "bio" text,
  ADD COLUMN "social_links" text DEFAULT '[]' NOT NULL;
