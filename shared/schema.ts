import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type ContentType = "movie" | "series";
export type Category = "Acción" | "Drama" | "Comedia" | "Ciencia Ficción" | "Terror" | "Fantasía" | "Romance" | "Misterio" | "Thriller" | "Aventura";

export interface Content {
  id: string;
  type: ContentType;
  title: string;
  description: string;
  category: Category;
  qualityRating: number;
  hypeLevel: number;
  releaseDate: string;
  director: string;
  cast: string[];
  production: string;
  posterUrl: string;
  heroImageUrl?: string;
  duration?: string;
  seasons?: number;
}

export interface ContentStats {
  contentId: string;
  views: number;
  likes: number;
  weeklyViews: number;
  weeklyLikes: number;
  monthlyViews: number;
  monthlyLikes: number;
  lastUpdated: string;
}

export type RankingPeriod = "weekly" | "monthly" | "alltime";

export interface RankedContent extends Content {
  stats: ContentStats;
  rank?: number;
}
