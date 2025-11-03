import { RankedContent } from "@shared/schema";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, X, Star, Eye, Heart, TrendingUp, Calendar, Clock, Users } from "lucide-react";
import { soundManager } from "@/lib/soundEffects";
import { motion } from "framer-motion";

interface ContentDetailProps {
  content: RankedContent | null;
  open: boolean;
  onClose: () => void;
}

export function ContentDetail({ content, open, onClose }: ContentDetailProps) {
  if (!content) return null;

  const handleClose = () => {
    soundManager.click();
    onClose();
  };

  const handlePlay = () => {
    soundManager.bloom();
    console.log("Play content:", content.title);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden bg-background border-0">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative">
            <div className="absolute inset-0">
              <img
                src={content.posterUrl}
                alt={content.title}
                className="w-full h-full object-cover blur-3xl opacity-20"
              />
            </div>

            <div className="relative grid md:grid-cols-5 gap-8 p-8">
              <div className="md:col-span-2">
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden group">
                  <img
                    src={content.posterUrl}
                    alt={content.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      size="lg"
                      onClick={handlePlay}
                      data-testid="button-detail-play"
                      className="gap-2 hover-elevate active-elevate-2"
                    >
                      <Play className="h-5 w-5 fill-current" />
                      Reproducir
                    </Button>
                  </div>
                </div>
              </div>

              <div className="md:col-span-3 space-y-6">
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <h2 className="font-serif text-4xl font-bold pr-8">{content.title}</h2>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleClose}
                      data-testid="button-detail-close"
                      className="hover-elevate active-elevate-2"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-3 flex-wrap mb-4">
                    <div className="flex items-center gap-1 bg-muted px-3 py-1 rounded-md">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="font-semibold">{(content.qualityRating / 10).toFixed(1)}</span>
                      <span className="text-muted-foreground text-sm">/10</span>
                    </div>
                    <Badge className="gap-1">
                      {content.category}
                    </Badge>
                    {content.hypeLevel > 80 && (
                      <Badge variant="secondary" className="gap-1">
                        <TrendingUp className="h-3 w-3" />
                        Trending
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Vistas</div>
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      <span className="text-2xl font-bold" data-testid="text-views">
                        {formatNumber(content.stats.views)}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Me gusta</div>
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-muted-foreground" />
                      <span className="text-2xl font-bold" data-testid="text-likes">
                        {formatNumber(content.stats.likes)}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Sinopsis</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {content.description}
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold">Detalles de producción</h3>
                  
                  <div className="grid gap-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Estreno:</span>
                      <span>{formatDate(content.releaseDate)}</span>
                    </div>

                    {content.duration && (
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Duración:</span>
                        <span>{content.duration}</span>
                      </div>
                    )}

                    {content.seasons && (
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Temporadas:</span>
                        <span>{content.seasons}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Director:</span>
                      <span>{content.director}</span>
                    </div>

                    <div className="text-sm">
                      <span className="text-muted-foreground">Reparto: </span>
                      <span>{content.cast.join(", ")}</span>
                    </div>

                    <div className="text-sm">
                      <span className="text-muted-foreground">Producción: </span>
                      <span>{content.production}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
