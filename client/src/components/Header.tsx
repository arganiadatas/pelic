import { Film, Volume2, VolumeX } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { soundManager } from "@/lib/soundEffects";
import { useState } from "react";

export function Header() {
  const [soundEnabled, setSoundEnabled] = useState(true);

  const handleSoundToggle = () => {
    const enabled = soundManager.toggle();
    setSoundEnabled(enabled);
    if (enabled) soundManager.click();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Film className="h-8 w-8 text-primary" />
          <h1 className="font-serif text-2xl font-bold">CineVault</h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSoundToggle}
            data-testid="button-sound-toggle"
            className="hover-elevate active-elevate-2"
          >
            {soundEnabled ? (
              <Volume2 className="h-5 w-5" />
            ) : (
              <VolumeX className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle sound</span>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
