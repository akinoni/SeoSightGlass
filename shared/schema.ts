import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Define the MetaTag interface for frontend and backend usage
export const metaTagSchema = z.object({
  name: z.string(),
  content: z.string().nullable(),
  status: z.enum(["good", "warning", "error", "info"]),
  statusMessage: z.string(),
});

export type MetaTag = z.infer<typeof metaTagSchema>;

// Define the AnalysisResult interface
export const analysisResultSchema = z.object({
  url: z.string().url(),
  title: z.string().nullable(),
  description: z.string().nullable(),
  canonical: z.string().nullable(),
  metaTags: z.array(metaTagSchema),
  score: z.object({
    overall: z.number().min(0).max(100),
    essential: z.number().min(0).max(10),
    social: z.number().min(0).max(10),
    structure: z.number().min(0).max(10),
    performance: z.number().min(0).max(10),
  }),
  recommendations: z.array(z.object({
    type: z.enum(["warning", "error", "info"]),
    title: z.string(),
    description: z.string(),
  })),
});

export type AnalysisResult = z.infer<typeof analysisResultSchema>;

// Keep the original user schema as it may be needed for other purposes
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
