import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { csvConversionSchema } from "@shared/schema";
import { ZodError } from "zod";
import multer from "multer";
import { parse } from "csv-parse";
import { stringify } from "csv-stringify/sync";
import { Readable } from "stream";
import { z } from "zod";

// Set up multer for file handling
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

export async function registerRoutes(app: Express): Promise<Server> {
  // CSV conversion endpoint
  app.post('/api/convert-csv', upload.single('file'), async (req: Request, res: Response) => {
    try {
      // Extract data from request
      const walletAddress = req.body.walletAddress;
      const file = req.file;

      // Validate input
      if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Validate using schema
      const validatedInput = await z.object({
        walletAddress: csvConversionSchema.shape.walletAddress,
        file: z.any() // Since multer handles file validation differently
      }).parseAsync({
        walletAddress,
        file
      });

      // Process the CSV file
      const csvData = await processCsvFile(file.buffer, validatedInput.walletAddress);
      
      // Send the converted CSV data
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="converted_${file.originalname}"`);
      res.send(csvData);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      console.error("Error converting CSV:", error);
      res.status(500).json({ message: "Failed to process CSV file" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Process CSV file
async function processCsvFile(buffer: Buffer, walletAddress: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const records: any[] = [];
    
    // Create a readable stream from the buffer
    const stream = Readable.from(buffer);

    // Parse the CSV file
    stream
      .pipe(parse({ columns: true, trim: true }))
      .on('data', (record) => {
        // Add wallet address to each record
        record.walletAddress = walletAddress;
        records.push(record);
      })
      .on('error', (error) => {
        reject(error);
      })
      .on('end', () => {
        // Convert back to CSV
        try {
          const columns = records.length > 0 
            ? Object.keys(records[0]) 
            : ['walletAddress'];
          
          const result = stringify(records, { header: true, columns });
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
  });
}
