import { HeroSection } from "../HeroSection";
import { ThemeProvider } from "../ThemeProvider";

export default function HeroSectionExample() {
  return (
    <ThemeProvider>
      <div className="bg-background">
        <HeroSection onViewDetails={() => console.log("View details clicked")} />
      </div>
    </ThemeProvider>
  );
}
