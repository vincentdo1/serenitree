CREATE TABLE IF NOT EXISTS "plant" (
	"id" text PRIMARY KEY NOT NULL,
	"stage" text NOT NULL,
	"exp" numeric NOT NULL,
	"user_id" text,
	CONSTRAINT "plant_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "quest" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"create_date" timestamp with time zone DEFAULT now() NOT NULL,
	"end_date" timestamp with time zone NOT NULL,
	"completed" boolean DEFAULT false,
	"difficulty" text,
	"category" text,
	"user_id" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reflection" (
	"id" text PRIMARY KEY NOT NULL,
	"date" timestamp with time zone DEFAULT now() NOT NULL,
	"message" text NOT NULL,
	"quest_id" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "spell" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"exp" numeric NOT NULL,
	"quest_id" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "plant" ADD CONSTRAINT "plant_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "quest" ADD CONSTRAINT "quest_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reflection" ADD CONSTRAINT "reflection_quest_id_quest_id_fk" FOREIGN KEY ("quest_id") REFERENCES "quest"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "spell" ADD CONSTRAINT "spell_quest_id_quest_id_fk" FOREIGN KEY ("quest_id") REFERENCES "quest"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
