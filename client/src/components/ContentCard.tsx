import { RankedContent } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Eye, Heart, TrendingUp } from "lucide-react";
import { soundManager } from "@/lib/soundEffects";
import { motion } from "framer-motion";

interface ContentCardProps {
  content: RankedContent;
  onClick: () => void;
  index?: number;
}

export function ContentCard({ content, onClick, index = 0 }: ContentCardProps) {
  const handleClick = () => {
    soundManager.pop();
    onClick();
  };

  const handleHover = () => {
    soundManager.whoosh();
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const ratingColor = content.qualityRating >= 85 ? "text-yellow-500" : "text-muted-foreground";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card
        className="group relative overflow-hidden cursor-pointer hover-elevate active-elevate-2 border-0 bg-card transition-all duration-300"
        onClick={handleClick}
        onMouseEnter={handleHover}
        data-testid={`card-content-${content.id}`}
      >
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={content.posterUrl}
            alt={content.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-md">
            <Star className={`h-3.5 w-3.5 fill-current ${ratingColor}`} />
            <span className="text-xs font-medium text-white">{(content.qualityRating / 10).toFixed(1)}</span>
          </div>

          {content.hypeLevel > 80 && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-primary/90 backdrop-blur-sm border-0 gap-1 animate-pulse">
                <TrendingUp className="h-3 w-3" />
                <span className="text-xs">Trending</span>
              </Badge>
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-center gap-3 text-white/90 text-xs">
              <div className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                <span>{formatNumber(content.stats.views)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="h-3.5 w-3.5" />
                <span>{formatNumber(content.stats.likes)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/95 to-transparent">
          <h3 className="font-serif font-semibold text-white text-lg line-clamp-2 mb-1">
            {content.title}
          </h3>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {content.category}
            </Badge>
            <span className="text-xs text-white/70">
              {content.type === "movie" ? content.duration : `${content.seasons} temporadas`}
            </span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
