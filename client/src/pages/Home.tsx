import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { CategoryFilter } from "@/components/CategoryFilter";
import { ContentCard } from "@/components/ContentCard";
import { TopRankings } from "@/components/TopRankings";
import { ContentDetail } from "@/components/ContentDetail";
import { contentData } from "@/data/content";
import { getOrCreateStats } from "@/lib/statsEngine";
import { Category, RankedContent } from "@shared/schema";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<Category | "Todas">("Todas");
  const [selectedContent, setSelectedContent] = useState<RankedContent | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const contentWithStats: RankedContent[] = useMemo(() => {
    return contentData.map(content => ({
      ...content,
      stats: getOrCreateStats(content)
    }));
  }, []);

  const filteredContent = useMemo(() => {
    if (selectedCategory === "Todas") return contentWithStats;
    return contentWithStats.filter(c => c.category === selectedCategory);
  }, [contentWithStats, selectedCategory]);

  const categories: Category[] = useMemo(() => {
    const unique = Array.from(new Set(contentData.map(c => c.category)));
    return unique.sort();
  }, []);

  const weeklyTop = useMemo(() => {
    return [...contentWithStats]
      .sort((a, b) => b.stats.weeklyViews + b.stats.weeklyLikes - (a.stats.weeklyViews + a.stats.weeklyLikes))
      .slice(0, 10);
  }, [contentWithStats]);

  const monthlyTop = useMemo(() => {
    return [...contentWithStats]
      .sort((a, b) => b.stats.monthlyViews + b.stats.monthlyLikes - (a.stats.monthlyViews + a.stats.monthlyLikes))
      .slice(0, 10);
  }, [contentWithStats]);

  const alltimeTop = useMemo(() => {
    return [...contentWithStats]
      .sort((a, b) => b.stats.views + b.stats.likes - (a.stats.views + a.stats.likes))
      .slice(0, 10);
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
