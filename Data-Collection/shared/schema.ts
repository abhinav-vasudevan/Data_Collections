import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const participants = pgTable("participants", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  gender: text("gender").notNull(),
  city: text("city").notNull(),
  country: text("country").notNull(),
  hairType: text("hair_type").notNull(),
  hairLength: text("hair_length").notNull(),
  hairDensity: text("hair_density").notNull(),
  hairCondition: text("hair_condition").notNull(),
  scalpType: text("scalp_type").notNull(),
  recentTreatments: text("recent_treatments").notNull(),
  treatmentDetails: text("treatment_details"),
  scalpConditions: text("scalp_conditions").notNull(),
  conditionDetails: text("condition_details"),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
});

export const participantImages = pgTable("participant_images", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  participantId: varchar("participant_id").references(() => participants.id).notNull(),
  imageType: text("image_type").notNull(), // 'skin1', 'skin2', 'skin3', 'hair1', 'hair2'
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type").notNull(),
  fileSize: integer("file_size").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
});

export const insertParticipantSchema = createInsertSchema(participants).omit({
  id: true,
  submittedAt: true,
});

export const insertParticipantImageSchema = createInsertSchema(participantImages).omit({
  id: true,
  uploadedAt: true,
});

export type InsertParticipant = z.infer<typeof insertParticipantSchema>;
export type Participant = typeof participants.$inferSelect;
export type InsertParticipantImage = z.infer<typeof insertParticipantImageSchema>;
export type ParticipantImage = typeof participantImages.$inferSelect;
