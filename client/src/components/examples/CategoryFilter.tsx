import { CategoryFilter } from "../CategoryFilter";
import { Category } from "@shared/schema";
import { ThemeProvider } from "../ThemeProvider";
import { useState } from "react";

const categories: Category[] = ["Acción", "Drama", "Comedia", "Ciencia Ficción", "Terror", "Fantasía"];

export default function CategoryFilterExample() {
  const [selected, setSelected] = useState<Category | "Todas">("Todas");

  return (
    <ThemeProvider>
      <div className="p-8 bg-background min-h-screen">
        <CategoryFilter
          categories={categories}
          selectedCategory={selected}
          onSelectCategory={setSelected}
        />
      </div>
    </ThemeProvider>
  );
}
