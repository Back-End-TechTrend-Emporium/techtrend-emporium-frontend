// src/pages/HomePage.tsx
import { useEffect, useState } from "react";
import LandingPage from "../templates/LandingPage";
import type { Category } from "../components/molecules/CategoryGrid";
import type { Product } from "../components/molecules/ProductGrid";
import { CategoryService } from "../lib/CategoryService";
import { ProductService } from "../lib/ProductService";

const isDev = import.meta.env.MODE === "development";

// Productos de respaldo SOLO para desarrollo (no tocan prod)
const DEV_FALLBACK: Product[] = [
  { id: 101, name: "Jae Namaz",  imageUrl: "https://picsum.photos/seed/101/800/600", price: 99 },
  { id: 102, name: "Dates",      imageUrl: "https://picsum.photos/seed/102/800/600", price: 12 },
  { id: 103, name: "Miswak",     imageUrl: "https://picsum.photos/seed/103/800/600", price: 7 },
  { id: 104, name: "Prayer Rug", imageUrl: "https://picsum.photos/seed/104/800/600", price: 59 },
];

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [latest, setLatest] = useState<Product[]>([]);
  const [best, setBest] = useState<Product[]>([]);

  useEffect(() => {
    // Categories
    (async () => {
      try {
        const apiCategories = await CategoryService.getCategories();
        const list = Array.isArray(apiCategories) ? apiCategories : [];
        const mapped = list.map((cat: any) => ({
          id: cat.id,
          name: cat.name,
          imageUrl: `https://picsum.photos/400/300?${cat.slug || cat.name.toLowerCase().replace(/\s+/g, "-")}`,
        }));
        setCategories(mapped);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setCategories([]);
      }
    })();

    // Latest
    (async () => {
      try {
        const apiProducts = await ProductService.getLatestProducts();
        const list = Array.isArray(apiProducts) ? apiProducts : [];
        const mapped = list.map((p: any) => ({
          id: p.id,
          name: p.title,
          imageUrl: p.image || `https://picsum.photos/seed/${p.id}/800/600`,
          price: p.price,
        }));
        setLatest(mapped.length > 0 ? mapped : (isDev ? DEV_FALLBACK : []));
      } catch (err) {
        console.error("Error fetching latest products:", err);
        setLatest(isDev ? DEV_FALLBACK : []);
      }
    })();

    // Best sellers
    (async () => {
      try {
        const apiProducts = await ProductService.getBestProducts();
        const list = Array.isArray(apiProducts) ? apiProducts : [];
        const mapped = list.map((p: any) => ({
          id: p.id,
          name: p.title,
          imageUrl: p.image || `https://picsum.photos/seed/${p.id}/800/600`,
          price: p.price,
        }));
        setBest(mapped.length > 0 ? mapped : (isDev ? DEV_FALLBACK : []));
      } catch (err) {
        console.error("Error fetching best products:", err);
        setBest(isDev ? DEV_FALLBACK : []);
      }
    })();
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
