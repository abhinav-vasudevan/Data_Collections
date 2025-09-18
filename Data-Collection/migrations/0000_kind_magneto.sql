CREATE TABLE "participant_images" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"participant_id" varchar NOT NULL,
	"image_type" text NOT NULL,
	"filename" text NOT NULL,
	"original_name" text NOT NULL,
	"mime_type" text NOT NULL,
	"file_size" integer NOT NULL,
	"uploaded_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "participants" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"age" integer NOT NULL,
	"gender" text NOT NULL,
	"hair_type" text NOT NULL,
	"skin_type" text NOT NULL,
	"hair_condition" text NOT NULL,
	"scalp_type" text NOT NULL,
	"recent_treatments" text NOT NULL,
	"treatment_details" text,
	"scalp_conditions" text NOT NULL,
	"condition_details" text,
	"submitted_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "participant_images" ADD CONSTRAINT "participant_images_participant_id_participants_id_fk" FOREIGN KEY ("participant_id") REFERENCES "public"."participants"("id") ON DELETE no action ON UPDATE no action;