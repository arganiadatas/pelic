import { ContentDetail } from "../ContentDetail";
import { RankedContent } from "@shared/schema";
import { ThemeProvider } from "../ThemeProvider";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const mockContent: RankedContent = {
  id: "1",
  type: "movie",
  title: "Nexus Protocol",
  description: "En un futuro distópico, un hacker brillante descubre un protocolo secreto que podría cambiar el destino de la humanidad.",
  category: "Ciencia Ficción",
  qualityRating: 92,
  hypeLevel: 95,
  releaseDate: "2024-10-15",
  director: "Alex Chen",
  cast: ["Marcus Rivera", "Elena Zhang", "David Kowalski"],
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

export default function ContentDetailExample() {
  const [open, setOpen] = useState(false);

  return (
    <ThemeProvider>
      <div className="p-8 bg-background min-h-screen">
        <Button onClick={() => setOpen(true)}>Open Detail</Button>
        <ContentDetail
          content={mockContent}
          open={open}
          onClose={() => setOpen(false)}
        />
      </div>
    </ThemeProvider>
  );
}
