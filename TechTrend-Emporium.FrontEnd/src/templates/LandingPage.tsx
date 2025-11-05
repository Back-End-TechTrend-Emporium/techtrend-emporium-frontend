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
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Hero / Banner */}
      <section className="pt-4 lg:pt-6">
        <Carousel source={bannerSource} />
      </section>

      {/* Categories */}
      <section className="mt-10">
        {categories?.length ? (
          <CategoryGrid categories={categories} />
        ) : (
          <EmptyBlock title="No categories to show yet" hint="We’re curating the best tech for you." />
        )}
      </section>

      {/* Latest */}
      <section className="mt-12">
        {latest?.length ? (
          <ProductGrid title="Our latest arrivals" products={latest} />
        ) : (
          <EmptyBlock title="No new arrivals yet" hint="Check back soon for fresh drops." />
        )}
      </section>

      {/* Best Sellers / All Products */}
      <section className="my-12">
        {bestSellers?.length ? (
          <ProductGrid title="Our products" products={bestSellers} />
        ) : (
          <EmptyBlock title="No products available" hint="We’ll restock shortly." />
        )}
      </section>
    </main>
  );
}

/** Pequeño bloque reutilizable para estados vacíos */
function EmptyBlock({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
      <h3 className="text-lg font-semibold">{title}</h3>
      {hint && <p className="mt-1 text-sm text-neutral-500">{hint}</p>}
      {/* Skeleton simple para mantener layout estable */}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-lg border border-neutral-200 p-4"
          >
            <div className="h-28 w-full rounded-md bg-neutral-200" />
            <div className="mt-3 h-4 w-3/4 rounded bg-neutral-200" />
            <div className="mt-2 h-4 w-1/2 rounded bg-neutral-200" />
          </div>
        ))}
      </div>
    </div>
  );
}
