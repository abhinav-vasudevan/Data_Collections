// blueprint: javascript_database integration
import { participants, participantImages, type Participant, type InsertParticipant, type ParticipantImage, type InsertParticipantImage } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  createParticipant(participant: InsertParticipant): Promise<Participant>;
  getParticipant(id: string): Promise<Participant | undefined>;
  saveParticipantImage(image: InsertParticipantImage): Promise<ParticipantImage>;
  getParticipantImages(participantId: string): Promise<ParticipantImage[]>;
  getAllParticipants(): Promise<Participant[]>;
}

export class DatabaseStorage implements IStorage {
  async createParticipant(insertParticipant: InsertParticipant): Promise<Participant> {
    const [participant] = await db
      .insert(participants)
      .values(insertParticipant)
      .returning();
    return participant;
  }

  async getParticipant(id: string): Promise<Participant | undefined> {
    const [participant] = await db.select().from(participants).where(eq(participants.id, id));
    return participant || undefined;
  }

  async saveParticipantImage(insertImage: InsertParticipantImage): Promise<ParticipantImage> {
    const [image] = await db
      .insert(participantImages)
      .values(insertImage)
      .returning();
    return image;
  }

  async getParticipantImages(participantId: string): Promise<ParticipantImage[]> {
    return await db.select().from(participantImages).where(eq(participantImages.participantId, participantId));
  }

  async getAllParticipants(): Promise<Participant[]> {
    return await db.select().from(participants);
  }
}

export const storage = new DatabaseStorage();
