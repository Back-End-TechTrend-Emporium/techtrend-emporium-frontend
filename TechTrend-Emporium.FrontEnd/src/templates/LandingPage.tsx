// src/templates/LandingPage.tsx
import Carousel from "../components/molecules/Carousel";
import CategoryGrid, { type Category } from "../components/molecules/CategoryGrid";
import ProductGrid, { type Product } from "../components/molecules/ProductGrid";

export default function LandingPage({
  bannerSource,
  categories,
  latest,
  bestSellers,
}: {
  bannerSource: string;
  categories: Category[];
  latest: Product[];
  bestSellers: Product[];
}) {
  return (
    <div>
      <Carousel source={bannerSource} />
      <CategoryGrid categories={categories} />
      <ProductGrid title="Our latest arrivals" products={latest} />
      <ProductGrid title="Our products" products={bestSellers} />
    </div>
  );
}
