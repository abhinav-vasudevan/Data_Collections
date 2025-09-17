import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import postgres from 'postgres';
import * as schema from './shared/schema.ts';
import 'dotenv/config';
import fs from 'fs';
import path from 'path';

async function generateParticipantReports() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL must be set. Did you forget to set it?');
  }

  const client = postgres(process.env.DATABASE_URL);
  const db = drizzle(client, { schema });

  const outputDir = path.join(process.cwd(), 'participant_reports');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  try {
    console.log('Fetching all participants...');
    const participants = await db.select().from(schema.participants);

    for (const participant of participants) {
      console.log(`Generating report for participant: ${participant.id}`);
      const images = await db.select().from(schema.participantImages).where(eq(schema.participantImages.participantId, participant.id));

      let htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Participant Report: ${participant.name}</title>
          <style>
            body { font-family: sans-serif; }
            .container { max-width: 800px; margin: 0 auto; padding: 20px; }
            h1, h2 { color: #333; }
            .participant-data { background-color: #f4f4f4; padding: 15px; border-radius: 5px; }
            .images { margin-top: 20px; }
            .image-container { margin-bottom: 15px; }
            img { max-width: 100%; height: auto; border: 1px solid #ddd; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Participant Report</h1>
            <div class="participant-data">
              <h2>${participant.name}</h2>
              <p><strong>ID:</strong> ${participant.id}</p>
              <p><strong>Age:</strong> ${participant.age}</p>
              <p><strong>Gender:</strong> ${participant.gender}</p>
              <p><strong>City:</strong> ${participant.city}</p>
              <p><strong>Country:</strong> ${participant.country}</p>
              <p><strong>Hair Type:</strong> ${participant.hairType}</p>
              <p><strong>Hair Length:</strong> ${participant.hairLength}</p>
              <p><strong>Hair Density:</strong> ${participant.hairDensity}</p>
              <p><strong>Hair Condition:</strong> ${participant.hairCondition}</p>
              <p><strong>Scalp Type:</strong> ${participant.scalpType}</p>
              <p><strong>Recent Treatments:</strong> ${participant.recentTreatments}</p>
              <p><strong>Treatment Details:</strong> ${participant.treatmentDetails || 'N/A'}</p>
              <p><strong>Scalp Conditions:</strong> ${participant.scalpConditions}</p>
              <p><strong>Condition Details:</strong> ${participant.conditionDetails || 'N/A'}</p>
              <p><strong>Submitted At:</strong> ${participant.submittedAt}</p>
            </div>
            <div class="images">
              <h2>Images</h2>
      `;

      for (const image of images) {
        const imagePath = path.join(process.cwd(), 'uploads', 'images', image.filename);
        // Ensure the image file exists before trying to read it
        if (fs.existsSync(imagePath)) {
          const imageSrc = `data:${image.mimeType};base64,${fs.readFileSync(imagePath).toString('base64')}`;
          htmlContent += `
            <div class="image-container">
              <h3>${image.imageType}</h3>
              <img src="${imageSrc}" alt="${image.imageType}">
            </div>
          `;
        } else {
          console.warn(`Image file not found for participant ${participant.id}, image ${image.filename}`);
        }
      }

      htmlContent += `
            </div>
          </div>
        </body>
        </html>
      `;

      const reportPath = path.join(outputDir, `participant_${participant.id}.html`);
      fs.writeFileSync(reportPath, htmlContent);
      console.log(`Report saved to: ${reportPath}`);
    }

  } catch (error) {
    console.error('Error generating reports:', error);
  } finally {
    await client.end();
  }
}

generateParticipantReports();
