// src/pages/HomePage.tsx
import { useEffect, useState } from "react";
import LandingPage from "../templates/LandingPage";
import type { Category } from "../components/molecules/CategoryGrid";
import type { Product } from "../components/molecules/ProductGrid";
import { CategoryService } from "../lib/CategoryService";
import { ProductService } from "../lib/ProductService";

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [latest, setLatest] = useState<Product[]>([]);
  const [best, setBest] = useState<Product[]>([]);

  useEffect(() => {
    // Fetch categories from API
    const fetchCategories = async () => {
      try {
        const apiCategories = await CategoryService.getCategories();
        // Map API response to component format
        const mappedCategories = apiCategories.map((cat) => ({
          id: cat.id,
          name: cat.name,
          imageUrl: `https://picsum.photos/400/300?${cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-')}`
        }));
        setCategories(mappedCategories);
      } catch (err) {
        console.error("Error fetching categories:", err);
        // Fallback to empty array or default categories if needed
        setCategories([]);
      }
    };

    fetchCategories();

    // Fetch latest products from API
    const fetchLatestProducts = async () => {
      try {
        const apiProducts = await ProductService.getLatestProducts();
        // Map API response to component format
        const mappedProducts = apiProducts.map((product) => ({
          id: product.id,
          name: product.title,
          imageUrl: product.image,
          price: product.price
        }));
        setLatest(mappedProducts);
      } catch (err) {
        console.error("Error fetching latest products:", err);
        // Fallback to empty array
        setLatest([]);
      }
    };

    // Fetch best products from API
    const fetchBestProducts = async () => {
      try {
        const apiProducts = await ProductService.getBestProducts();
        // Map API response to component format
        const mappedProducts = apiProducts.map((product) => ({
          id: product.id,
          name: product.title,
          imageUrl: product.image,
          price: product.price
        }));
        setBest(mappedProducts);
      } catch (err) {
        console.error("Error fetching best products:", err);
        // Fallback to empty array
        setBest([]);
      }
    };

    fetchLatestProducts();
    fetchBestProducts();
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
