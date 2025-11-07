// src/pages/HomePage.tsx
import { useEffect, useState } from "react";
import LandingPage from "../templates/LandingPage";
import type { Category } from "../components/molecules/CategoryGrid";
import type { Product } from "../components/molecules/ProductGrid";
import { CategoryService } from "../lib/CategoryService";
import { ProductService, type ProductDetail } from "../lib/ProductService";

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
  const [banner, setBanner] = useState<string>("https://picsum.photos/id/1069/1600/500");

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

    // Approved products for cards
    (async () => {
      try {
        const approved: ProductDetail[] = await ProductService.getApprovedProducts();
        const mapped: Product[] = (approved ?? []).map((p) => ({
          id: p.id,
          name: p.title,
          imageUrl: p.image || `https://picsum.photos/seed/${p.id}/800/600`,
          price: p.price,
        }));
        const allApproved = mapped.length > 0 ? mapped : (isDev ? DEV_FALLBACK : []);
  setBest(allApproved);
  // Latest: same dataset from last approved to oldest
  const latestList = [...allApproved].reverse().slice(0, 8);
  setLatest(latestList);

        // Banner: use the image of the first approved product
        const firstImg = (approved?.[0]?.image as string | undefined) || allApproved?.[0]?.imageUrl;
        if (firstImg) setBanner(firstImg);

        // Fallback of categories derived from approved products if API fails
        if (!Array.isArray(allApproved) || allApproved.length === 0) return;
        setCategories((prev) => {
          if (prev.length) return prev; // maintain if already set
          // Derivate unique categories with the first image found
          const uniqueNames = Array.from(new Set((approved || []).map((p) => p.category)));
          const derived: Category[] = uniqueNames.map((name) => {
            const first = (approved || []).find((p) => p.category === name);
            return {
              id: name,
              name,
              imageUrl: (first?.image as string | undefined) || `https://picsum.photos/seed/${name}/400/300`,
            } as Category;
          });
          return derived;
        });
      } catch (err) {
        console.error("Error fetching best products:", err);
        setBest(isDev ? DEV_FALLBACK : []);
        setLatest(isDev ? DEV_FALLBACK : []);
        setBanner("https://picsum.photos/id/1069/1600/500");
      }
    })();
  }, []);

  return (
    <LandingPage
      bannerSource={banner}
      categories={categories}
      latest={latest}
      bestSellers={best}
    />
  );
}
