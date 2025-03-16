import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core"
import { createInsertSchema } from "drizzle-zod"
import { z } from "zod"

// Define user table (keeping from original schema)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
})

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
})

// Define CSV conversion related schemas
export const walletAddressSchema = z
  .string()
  .trim()
  .min(10, "Wallet address must be at least 10 characters")

export const csvFileSchema = z
  .instanceof(File)
  .refine((file) => file.type === "text/csv" || file.name.endsWith(".csv"), {
    message: "File must be a CSV file",
  })

export const csvConversionSchema = z.object({
  walletAddress: walletAddressSchema,
  file: csvFileSchema,
})

export type InsertUser = z.infer<typeof insertUserSchema>
export type User = typeof users.$inferSelect
export type CsvConversionInput = z.infer<typeof csvConversionSchema>
