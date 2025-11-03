import { type User, type InsertUser, type Content, type ContentStats, type RankedContent, type RankingPeriod } from "@shared/schema";
import { randomUUID } from "crypto";

function getDaysSinceRelease(releaseDate: string): number {
  const release = new Date(releaseDate);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - release.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

function calculateInitialStats(content: Content): ContentStats {
  const daysSince = getDaysSinceRelease(content.releaseDate);
  const baseMultiplier = content.qualityRating / 100;
  const hypeMultiplier = content.hypeLevel / 100;
  
  const contentTypeMultiplier = content.type === "series" ? 1.3 : 1.0;
  
  const dailyViewsBase = (1000 + (content.qualityRating * 50)) * contentTypeMultiplier;
  const dailyLikesBase = (100 + (content.qualityRating * 5)) * contentTypeMultiplier;
  
  const totalViews = Math.floor(dailyViewsBase * daysSince * baseMultiplier);
  const totalLikes = Math.floor(dailyLikesBase * daysSince * baseMultiplier);
  
  const recentBoost = daysSince < 30 ? 1.5 : 1;
  const hypeBoost = hypeMultiplier > 0.8 ? 1.3 : 1;
  
  const weeklyViews = Math.floor(dailyViewsBase * 7 * baseMultiplier * recentBoost * hypeBoost);
  const weeklyLikes = Math.floor(dailyLikesBase * 7 * baseMultiplier * recentBoost * hypeBoost);
  const monthlyViews = Math.floor(dailyViewsBase * 30 * baseMultiplier * (1 + hypeMultiplier * 0.3));
  const monthlyLikes = Math.floor(dailyLikesBase * 30 * baseMultiplier * (1 + hypeMultiplier * 0.3));
  
  return {
    contentId: content.id,
    views: totalViews,
    likes: totalLikes,
    weeklyViews,
    weeklyLikes,
    monthlyViews,
    monthlyLikes,
    lastUpdated: new Date().toISOString()
  };
}

function calculateStatsUpdate(content: Content, previousStats: ContentStats): ContentStats {
  const baseMultiplier = content.qualityRating / 100;
  const hypeMultiplier = content.hypeLevel / 100;
  
  const contentTypeMultiplier = content.type === "series" ? 1.3 : 1.0;
  
  const hourlyViewsBase = ((1000 + (content.qualityRating * 50)) * contentTypeMultiplier) / 24;
  const hourlyLikesBase = ((100 + (content.qualityRating * 5)) * contentTypeMultiplier) / 24;
  
  const recentBoost = getDaysSinceRelease(content.releaseDate) < 30 ? 1.5 : 1;
  const hypeBoost = hypeMultiplier > 0.8 ? 1.3 : 1;
  
  const randomVariance = 0.8 + (Math.random() * 0.4);
  
  const viewsIncrement = Math.floor(hourlyViewsBase * baseMultiplier * recentBoost * hypeBoost * randomVariance);
  const likesIncrement = Math.floor(hourlyLikesBase * baseMultiplier * recentBoost * hypeBoost * randomVariance);
  
  const newTotalViews = previousStats.views + viewsIncrement;
  const newTotalLikes = previousStats.likes + likesIncrement;
  
  const weeklyViews = Math.floor(hourlyViewsBase * 24 * 7 * baseMultiplier * recentBoost * hypeBoost);
  const weeklyLikes = Math.floor(hourlyLikesBase * 24 * 7 * baseMultiplier * recentBoost * hypeBoost);
  const monthlyViews = Math.floor(hourlyViewsBase * 24 * 30 * baseMultiplier * (1 + hypeMultiplier * 0.3));
  const monthlyLikes = Math.floor(hourlyLikesBase * 24 * 30 * baseMultiplier * (1 + hypeMultiplier * 0.3));
  
  return {
    contentId: content.id,
    views: newTotalViews,
    likes: newTotalLikes,
    weeklyViews,
    weeklyLikes,
    monthlyViews,
    monthlyLikes,
    lastUpdated: new Date().toISOString()
  };
}

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getAllContent(): Promise<Content[]>;
  getContentById(id: string): Promise<Content | undefined>;
  addContent(content: Content): Promise<Content>;
  
  getStats(contentId: string): Promise<ContentStats | undefined>;
  updateStats(contentId: string): Promise<ContentStats>;
  
  getRankedContent(period: RankingPeriod): Promise<RankedContent[]>;
  getAllRankedContent(): Promise<RankedContent[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private content: Map<string, Content>;
  private stats: Map<string, ContentStats>;

  constructor() {
    this.users = new Map();
    this.content = new Map();
    this.stats = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllContent(): Promise<Content[]> {
    return Array.from(this.content.values());
  }

  async getContentById(id: string): Promise<Content | undefined> {
    return this.content.get(id);
  }

  async addContent(content: Content): Promise<Content> {
    this.content.set(content.id, content);
    const stats = calculateInitialStats(content);
    this.stats.set(content.id, stats);
    return content;
  }

  async getStats(contentId: string): Promise<ContentStats | undefined> {
    return this.stats.get(contentId);
  }

  async updateStats(contentId: string): Promise<ContentStats> {
    const content = this.content.get(contentId);
    if (!content) {
      throw new Error(`Content not found: ${contentId}`);
    }
    
    const previousStats = this.stats.get(contentId);
    if (!previousStats) {
      const stats = calculateInitialStats(content);
      this.stats.set(contentId, stats);
      return stats;
    }
    
    const stats = calculateStatsUpdate(content, previousStats);
    this.stats.set(contentId, stats);
    return stats;
  }

  async getRankedContent(period: RankingPeriod): Promise<RankedContent[]> {
    const allContent = Array.from(this.content.values());
    const ranked: RankedContent[] = [];

    for (const content of allContent) {
      const stats = this.stats.get(content.id);
      if (stats) {
        ranked.push({ ...content, stats });
      }
    }

    ranked.sort((a, b) => {
      let scoreA = 0;
      let scoreB = 0;

      if (period === "weekly") {
        scoreA = a.stats.weeklyViews + a.stats.weeklyLikes;
        scoreB = b.stats.weeklyViews + b.stats.weeklyLikes;
      } else if (period === "monthly") {
        scoreA = a.stats.monthlyViews + a.stats.monthlyLikes;
        scoreB = b.stats.monthlyViews + b.stats.monthlyLikes;
      } else {
        scoreA = a.stats.views + a.stats.likes;
        scoreB = b.stats.views + b.stats.likes;
      }

      return scoreB - scoreA;
    });

    return ranked.slice(0, 10);
  }

  async getAllRankedContent(): Promise<RankedContent[]> {
    const allContent = Array.from(this.content.values());
    const ranked: RankedContent[] = [];

    for (const content of allContent) {
      const stats = this.stats.get(content.id);
      if (stats) {
        ranked.push({ ...content, stats });
      }
    }

    return ranked;
  }
}

export const storage = new MemStorage();
