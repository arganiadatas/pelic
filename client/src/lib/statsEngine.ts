import { Content, ContentStats } from "@shared/schema";

const STATS_STORAGE_KEY = "cinevault_stats";

function getDaysSinceRelease(releaseDate: string): number {
  const release = new Date(releaseDate);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - release.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

function getWeekStart(): string {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diff = now.getDate() - dayOfWeek;
  const weekStart = new Date(now.setDate(diff));
  weekStart.setHours(0, 0, 0, 0);
  return weekStart.toISOString();
}

function getMonthStart(): string {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  return monthStart.toISOString();
}

export function calculateStats(content: Content): ContentStats {
  const daysSince = getDaysSinceRelease(content.releaseDate);
  const baseMultiplier = content.qualityRating / 100;
  const hypeMultiplier = content.hypeLevel / 100;
  
  const dailyViewsBase = 1000 + (content.qualityRating * 50);
  const dailyLikesBase = 100 + (content.qualityRating * 5);
  
  const totalViews = Math.floor(dailyViewsBase * daysSince * baseMultiplier * (1 + Math.random() * 0.2));
  const totalLikes = Math.floor(dailyLikesBase * daysSince * baseMultiplier * (1 + Math.random() * 0.15));
  
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

export function getStoredStats(): Map<string, ContentStats> {
  const stored = localStorage.getItem(STATS_STORAGE_KEY);
  if (stored) {
    const data = JSON.parse(stored);
    return new Map(Object.entries(data));
  }
  return new Map();
}

export function saveStats(statsMap: Map<string, ContentStats>): void {
  const data = Object.fromEntries(statsMap);
  localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(data));
}

export function getOrCreateStats(content: Content): ContentStats {
  const storedStats = getStoredStats();
  let stats = storedStats.get(content.id);
  
  if (!stats) {
    stats = calculateStats(content);
    storedStats.set(content.id, stats);
    saveStats(storedStats);
  } else {
    const lastUpdate = new Date(stats.lastUpdated);
    const now = new Date();
    const hoursSinceUpdate = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);
    
    if (hoursSinceUpdate > 1) {
      const freshStats = calculateStats(content);
      stats = {
        ...freshStats,
        views: Math.max(stats.views, freshStats.views),
        likes: Math.max(stats.likes, freshStats.likes)
      };
      storedStats.set(content.id, stats);
      saveStats(storedStats);
    }
  }
  
  return stats;
}
