import postgres from 'postgres';
import 'dotenv/config';

async function createTables() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL must be set. Did you forget to set it?');
  }

  const client = postgres(process.env.DATABASE_URL);

  try {
    console.log('Creating tables...');

    await client.unsafe(`
      CREATE TABLE IF NOT EXISTS participants (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        age INTEGER NOT NULL,
        gender TEXT NOT NULL,
        city TEXT NOT NULL,
        country TEXT NOT NULL,
        hairType TEXT NOT NULL,
        hairLength TEXT NOT NULL,
        hairDensity TEXT NOT NULL,
        hairCondition TEXT NOT NULL,
        scalpType TEXT NOT NULL,
        recentTreatments TEXT NOT NULL,
        treatmentDetails TEXT,
        scalpConditions TEXT NOT NULL,
        conditionDetails TEXT,
        submittedAt TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    await client.unsafe(`
      CREATE TABLE IF NOT EXISTS participant_images (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        participantId VARCHAR REFERENCES participants(id) NOT NULL,
        imageType TEXT NOT NULL,
        filename TEXT NOT NULL,
        originalName TEXT NOT NULL,
        mimeType TEXT NOT NULL,
        fileSize INTEGER NOT NULL,
        uploadedAt TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    console.log('Tables created successfully (or already exist).');

  } catch (error) {
    console.error('Error creating tables:', error);
  } finally {
    await client.end();
  }
}

createTables();
