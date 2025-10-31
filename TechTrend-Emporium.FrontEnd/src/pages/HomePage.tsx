// src/pages/HomePage.tsx
import { useEffect, useState } from "react";
import LandingPage from "../templates/LandingPage";
import type { Category } from "../components/molecules/CategoryGrid";
import type { Product } from "../components/molecules/ProductGrid";

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [latest, setLatest] = useState<Product[]>([]);
  const [best, setBest] = useState<Product[]>([]);

  useEffect(() => {
    // TODO: Replace with real API calls
    setCategories([
      { id: "1", name: "Food", imageUrl: "https://picsum.photos/400/300?food" },
      { id: "2", name: "Itar", imageUrl: "https://picsum.photos/400/300?itar" },
      { id: "3", name: "Tasbeeh", imageUrl: "https://picsum.photos/400/300?tasbeeh" },
    ]);
    setLatest([
      { id: "4", name: "New Product 1", imageUrl: "https://picsum.photos/400/300?latest1", price: 20 },
      { id: "5", name: "New Product 2", imageUrl: "https://picsum.photos/400/300?latest2", price: 25 },
      { id: "6", name: "New Product 3", imageUrl: "https://picsum.photos/400/300?latest3", price: 18 },
    ]);
    setBest([
      { id: "7", name: "Bestseller 1", imageUrl: "https://picsum.photos/400/300?best1", price: 30 },
      { id: "8", name: "Bestseller 2", imageUrl: "https://picsum.photos/400/300?best2", price: 32 },
      { id: "9", name: "Bestseller 3", imageUrl: "https://picsum.photos/400/300?best3", price: 29 },
    ]);
  }, []);

  return (
    <LandingPage
      bannerSource="https://picsum.photos/id/1069/1600/500"
      categories={categories}
      latest={latest}
      bestSellers={best}
    />
  );
}
