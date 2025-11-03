import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { contentData } from "./initialData";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize content data
  for (const content of contentData) {
    await storage.addContent(content);
  }

  // Get all content with stats
  app.get("/api/content", async (req, res) => {
    try {
      const allRankedContent = await storage.getAllRankedContent();
      res.json(allRankedContent);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch content" });
    }
  });

  // Get content by ID
  app.get("/api/content/:id", async (req, res) => {
    try {
      const content = await storage.getContentById(req.params.id);
      if (!content) {
        res.status(404).json({ error: "Content not found" });
        return;
      }
      const stats = await storage.getStats(req.params.id);
      res.json({ ...content, stats });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch content" });
    }
  });

  // Get rankings by period
  app.get("/api/rankings/:period", async (req, res) => {
    try {
      const period = req.params.period as "weekly" | "monthly" | "alltime";
      if (!["weekly", "monthly", "alltime"].includes(period)) {
        res.status(400).json({ error: "Invalid period" });
        return;
      }
      const rankings = await storage.getRankedContent(period);
      res.json(rankings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch rankings" });
    }
  });

  // Update stats for a specific content (simulates time passing)
  app.post("/api/content/:id/update-stats", async (req, res) => {
    try {
      const stats = await storage.updateStats(req.params.id);
      res.json(stats);
    } catch (error: any) {
      if (error.message && error.message.includes("Content not found")) {
        res.status(404).json({ error: "Content not found" });
        return;
      }
      res.status(500).json({ error: "Failed to update stats" });
    }
  });

  // Periodic stats update (runs every hour)
  setInterval(async () => {
    const allContent = await storage.getAllContent();
    for (const content of allContent) {
      await storage.updateStats(content.id);
    }
    console.log("Stats updated for all content");
  }, 60 * 60 * 1000); // Every hour

  const httpServer = createServer(app);

  return httpServer;
}
