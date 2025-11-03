import { RankedContent, RankingPeriod } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, Eye, Heart } from "lucide-react";
import { soundManager } from "@/lib/soundEffects";
import { motion } from "framer-motion";

interface TopRankingsProps {
  weeklyTop: RankedContent[];
  monthlyTop: RankedContent[];
  alltimeTop: RankedContent[];
  onContentClick: (content: RankedContent) => void;
}

export function TopRankings({ weeklyTop, monthlyTop, alltimeTop, onContentClick }: TopRankingsProps) {
  const handleTabChange = () => {
    soundManager.click();
  };

  const handleCardClick = (content: RankedContent) => {
    soundManager.pop();
    onContentClick(content);
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-6 w-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />;
    if (rank === 3) return <Award className="h-6 w-6 text-amber-600" />;
    return null;
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const RankingCard = ({ content, index }: { content: RankedContent; index: number }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card
        className="group cursor-pointer hover-elevate active-elevate-2 overflow-hidden"
        onClick={() => handleCardClick(content)}
        data-testid={`card-ranking-${content.id}`}
      >
        <div className="flex items-center gap-4 p-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-md bg-muted flex-shrink-0">
            {getRankIcon(index + 1) || (
              <span className="text-2xl font-bold text-muted-foreground">{index + 1}</span>
            )}
          </div>

          <div className="relative w-20 h-28 flex-shrink-0 overflow-hidden rounded-md">
            <img
              src={content.posterUrl}
              alt={content.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="font-serif font-semibold text-lg line-clamp-1 mb-1">
              {content.title}
            </h4>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="text-xs">
                {content.category}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {content.type === "movie" ? content.duration : `${content.seasons} temporadas`}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{formatNumber(content.stats.views)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                <span>{formatNumber(content.stats.likes)}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );

  return (
    <div className="w-full">
      <h2 className="font-serif text-3xl font-bold mb-6 px-8">Top Rankings</h2>
      
      <Tabs defaultValue="weekly" className="w-full" onValueChange={handleTabChange}>
        <div className="px-8 mb-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="weekly" data-testid="tab-weekly">Semanal</TabsTrigger>
            <TabsTrigger value="monthly" data-testid="tab-monthly">Mensual</TabsTrigger>
            <TabsTrigger value="alltime" data-testid="tab-alltime">Todo el tiempo</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="weekly" className="px-8 space-y-4">
          {weeklyTop.map((content, index) => (
            <RankingCard key={content.id} content={content} index={index} />
          ))}
        </TabsContent>

        <TabsContent value="monthly" className="px-8 space-y-4">
          {monthlyTop.map((content, index) => (
            <RankingCard key={content.id} content={content} index={index} />
          ))}
        </TabsContent>

        <TabsContent value="alltime" className="px-8 space-y-4">
          {alltimeTop.map((content, index) => (
            <RankingCard key={content.id} content={content} index={index} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
