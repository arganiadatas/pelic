import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { CategoryFilter } from "@/components/CategoryFilter";
import { ContentCard } from "@/components/ContentCard";
import { TopRankings } from "@/components/TopRankings";
import { ContentDetail } from "@/components/ContentDetail";
import { Category, RankedContent } from "@shared/schema";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<Category | "Todas">("Todas");
  const [selectedContent, setSelectedContent] = useState<RankedContent | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const { data: contentWithStats = [], isLoading } = useQuery<RankedContent[]>({
    queryKey: ["/api/content"],
  });

  const { data: weeklyTop = [] } = useQuery<RankedContent[]>({
    queryKey: ["/api/rankings/weekly"],
  });

  const { data: monthlyTop = [] } = useQuery<RankedContent[]>({
    queryKey: ["/api/rankings/monthly"],
  });

  const { data: alltimeTop = [] } = useQuery<RankedContent[]>({
    queryKey: ["/api/rankings/alltime"],
  });

  const filteredContent = useMemo(() => {
    if (selectedCategory === "Todas") return contentWithStats;
    return contentWithStats.filter(c => c.category === selectedCategory);
  }, [contentWithStats, selectedCategory]);

  const categories: Category[] = useMemo(() => {
    const unique = Array.from(new Set(contentWithStats.map(c => c.category)));
    return unique.sort();
  }, [contentWithStats]);

  const handleContentClick = (content: RankedContent) => {
    setSelectedContent(content);
    setDetailOpen(true);
  };

  const handleHeroViewDetails = () => {
    if (contentWithStats.length > 0) {
      handleContentClick(contentWithStats[0]);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando contenido...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <HeroSection onViewDetails={handleHeroViewDetails} />

        <div className="py-12">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        <div className="container mx-auto px-8 pb-16">
          <h2 className="font-serif text-3xl font-bold mb-8">
            {selectedCategory === "Todas" ? "Todo el catálogo" : selectedCategory}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredContent.map((content, index) => (
              <ContentCard
                key={content.id}
                content={content}
                onClick={() => handleContentClick(content)}
                index={index}
              />
            ))}
          </div>
        </div>

        <div className="py-16 bg-card/50">
          <TopRankings
            weeklyTop={weeklyTop}
            monthlyTop={monthlyTop}
            alltimeTop={alltimeTop}
            onContentClick={handleContentClick}
          />
        </div>
      </main>

      <ContentDetail
        content={selectedContent}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
      />

      <footer className="border-t py-12">
        <div className="container mx-auto px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-serif text-xl font-bold mb-2">CineVault</h3>
              <p className="text-sm text-muted-foreground">
                Tu plataforma de streaming premium
              </p>
            </div>
            <div className="flex gap-8 text-sm text-muted-foreground">
              <span>© 2024 CineVault</span>
              <span>Todos los derechos reservados</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
