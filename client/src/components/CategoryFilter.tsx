import { Category } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { soundManager } from "@/lib/soundEffects";
import { motion } from "framer-motion";

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: Category | "Todas";
  onSelectCategory: (category: Category | "Todas") => void;
}

export function CategoryFilter({ categories, selectedCategory, onSelectCategory }: CategoryFilterProps) {
  const allCategories: (Category | "Todas")[] = ["Todas", ...categories];

  const handleSelect = (category: Category | "Todas") => {
    soundManager.click();
    onSelectCategory(category);
  };

  return (
    <div className="w-full overflow-x-auto pb-4">
      <motion.div
        className="flex items-center gap-3 min-w-max px-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {allCategories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => handleSelect(category)}
            data-testid={`button-category-${category.toLowerCase().replace(/\s+/g, "-")}`}
            className={`rounded-full px-6 hover-elevate active-elevate-2 whitespace-nowrap ${
              selectedCategory === category ? "toggle-elevate toggle-elevated" : ""
            }`}
          >
            {category}
          </Button>
        ))}
      </motion.div>
    </div>
  );
}
