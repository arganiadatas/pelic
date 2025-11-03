import { Button } from "@/components/ui/button";
import { Play, Info } from "lucide-react";
import { soundManager } from "@/lib/soundEffects";
import { motion } from "framer-motion";
import heroImage from "@assets/generated_images/Space_hero_banner_a8792227.png";

interface HeroSectionProps {
  onViewDetails?: () => void;
}

export function HeroSection({ onViewDetails }: HeroSectionProps) {
  const handlePlay = () => {
    soundManager.bloom();
    console.log("Play clicked");
  };

  const handleInfo = () => {
    soundManager.click();
    if (onViewDetails) onViewDetails();
  };

  return (
    <div className="relative w-full h-[70vh] overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Featured Content"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      <div className="relative h-full container mx-auto px-8 flex items-center">
        <motion.div
          className="max-w-2xl space-y-6"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-serif text-5xl md:text-6xl font-bold text-white">
            Nexus Protocol
          </h2>
          
          <p className="text-lg text-white/90 max-w-xl">
            En un futuro distópico, un hacker brillante descubre un protocolo secreto 
            que podría cambiar el destino de la humanidad. Una carrera contra el tiempo 
            en un mundo de neones y secretos corporativos.
          </p>

          <div className="flex items-center gap-4">
            <Button
              size="lg"
              onClick={handlePlay}
              data-testid="button-hero-play"
              className="gap-2 bg-primary/90 backdrop-blur-sm border border-primary-border hover-elevate active-elevate-2"
            >
              <Play className="h-5 w-5 fill-current" />
              Reproducir
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleInfo}
              data-testid="button-hero-info"
              className="gap-2 bg-background/20 backdrop-blur-md border-white/30 text-white hover:bg-background/30 hover-elevate active-elevate-2"
            >
              <Info className="h-5 w-5" />
              Más información
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
