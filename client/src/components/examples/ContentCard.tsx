import { ContentCard } from "../ContentCard";
import { RankedContent } from "@shared/schema";
import { ThemeProvider } from "../ThemeProvider";

const mockContent: RankedContent = {
  id: "1",
  type: "movie",
  title: "Nexus Protocol",
  description: "Un thriller de ciencia ficción épico",
  category: "Ciencia Ficción",
  qualityRating: 92,
  hypeLevel: 95,
  releaseDate: "2024-10-15",
  director: "Alex Chen",
  cast: ["Marcus Rivera", "Elena Zhang"],
  production: "CyberVision Studios",
  posterUrl: "/src/assets/generated_images/Sci-fi_thriller_poster_c51df235.png",
  duration: "2h 18m",
  stats: {
    contentId: "1",
    views: 1250000,
    likes: 95000,
    weeklyViews: 350000,
    weeklyLikes: 28000,
    monthlyViews: 850000,
    monthlyLikes: 65000,
    lastUpdated: new Date().toISOString()
  }
};

export default function ContentCardExample() {
  return (
    <ThemeProvider>
      <div className="p-8 bg-background min-h-screen">
        <div className="max-w-xs">
          <ContentCard content={mockContent} onClick={() => console.log("Card clicked")} />
        </div>
      </div>
    </ThemeProvider>
  );
}
