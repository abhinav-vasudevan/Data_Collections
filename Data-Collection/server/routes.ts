import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import fs from "fs";
import { insertParticipantSchema } from "@shared/schema";
import { z } from "zod";
import { putObject } from "./s3";

// Configure multer for file uploads
const uploadRoot = process.env.UPLOAD_DIR
  || (process.env.NODE_ENV === 'production' ? '/tmp' : process.cwd());
const uploadDir = path.join(uploadRoot, 'uploads', 'images');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const uploadStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
  }
});

const upload = multer({
  storage: uploadStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Define expected file fields for upload
const expectedFields = [
  { name: 'skin1', maxCount: 1 },
  { name: 'skin2', maxCount: 1 },
  { name: 'skin3', maxCount: 1 },
  { name: 'hair1', maxCount: 1 },
  { name: 'hair2', maxCount: 1 },
];

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve uploaded images statically (dev only). In production, images are stored on S3.
  if (process.env.NODE_ENV !== 'production') {
    app.use('/api/images', express.static(uploadDir));
  }

  // Submit research data with images
  app.post('/api/submit', upload.fields(expectedFields), async (req, res) => {
    try {
      console.log('Received submission request');
      
      // Validate and parse participant data
      const participantData = JSON.parse(req.body.participantData || '{}');
      console.log('Participant data:', participantData);
      
      // Convert age to number
      if (participantData.age) {
        participantData.age = parseInt(participantData.age, 10);
      }
      
      // Validate using schema
      const validatedData = insertParticipantSchema.parse(participantData);
      
      // Create participant record
      const participant = await storage.createParticipant(validatedData);
      console.log('Created participant:', participant.id);
      
      // Process uploaded images
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const imageRecords = [];
      
      for (const [imageType, fileArray] of Object.entries(files)) {
        if (fileArray && fileArray[0]) {
          const file = fileArray[0];
          console.log(`Processing image: ${imageType}`, file.filename);
          // Upload to S3 in production; keep local filename in dev
          let storedFilename = file.filename;
          if (process.env.NODE_ENV === 'production') {
            const s3Key = `uploads/${participant.id}/${imageType}/${file.filename}`;
            const buffer = await fs.promises.readFile(file.path);
            await putObject({ key: s3Key, body: buffer, contentType: file.mimetype });
            storedFilename = s3Key;
          }

          const imageRecord = await storage.saveParticipantImage({
            participantId: participant.id,
            imageType,
            filename: storedFilename,
            originalName: file.originalname,
            mimeType: file.mimetype,
            fileSize: file.size,
          });
          
          imageRecords.push(imageRecord);
        }
      }
      
      console.log(`Saved ${imageRecords.length} images for participant ${participant.id}`);
      
      res.json({
        success: true,
        participantId: participant.id,
        message: 'Data submitted successfully',
        imagesCount: imageRecords.length
      });
      
    } catch (error) {
      console.error('Submission error:', error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Invalid data provided',
          errors: error.errors
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
  
  // Get all participants (for admin/research purposes)
  app.get('/api/participants', async (req, res) => {
    try {
      const participants = await storage.getAllParticipants();
      res.json({
        success: true,
        count: participants.length,
        participants
      });
    } catch (error) {
      console.error('Error fetching participants:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch participants'
      });
    }
  });
  
  // Get participant with images
  app.get('/api/participants/:id', async (req, res) => {
    try {
      const participantId = req.params.id;
      const participant = await storage.getParticipant(participantId);
      
      if (!participant) {
        return res.status(404).json({
          success: false,
          message: 'Participant not found'
        });
      }
      
      const images = await storage.getParticipantImages(participantId);
      
      res.json({
        success: true,
        participant,
        images
      });
    } catch (error) {
      console.error('Error fetching participant:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch participant data'
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
