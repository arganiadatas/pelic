import { TopRankings } from "../TopRankings";
import { RankedContent } from "@shared/schema";
import { ThemeProvider } from "../ThemeProvider";

const mockContent: RankedContent[] = [
  {
    id: "1",
    type: "movie",
    title: "Nexus Protocol",
    description: "Un thriller de ciencia ficción",
    category: "Ciencia Ficción",
    qualityRating: 92,
    hypeLevel: 95,
    releaseDate: "2024-10-15",
    director: "Alex Chen",
    cast: ["Marcus Rivera"],
    production: "CyberVision",
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
  }
];

export default function TopRankingsExample() {
  return (
    <ThemeProvider>
      <div className="p-8 bg-background min-h-screen">
        <TopRankings
          weeklyTop={mockContent}
          monthlyTop={mockContent}
          alltimeTop={mockContent}
          onContentClick={(c) => console.log("Content clicked:", c.title)}
        />
      </div>
    </ThemeProvider>
  );
}
