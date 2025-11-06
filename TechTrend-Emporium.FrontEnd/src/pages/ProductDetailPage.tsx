import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ProductService, type ProductDetail } from "../lib/ProductService";
import Button from "../components/atoms/Button/Button";
import { useFavorites } from "../context/FavoritesContext";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isFavorite, toggle } = useFavorites();

  useEffect(() => {
    let active = true;
    (async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const data = await ProductService.getById(id);
        if (active) setProduct(data);
      } catch (e: any) {
        if (active) setError(e?.message || "Error loading product");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 animate-pulse">
        <div className="h-6 w-40 bg-gray-200 rounded mb-4" />
        <div className="grid gap-6 md:grid-cols-2">
          <div className="aspect-[4/3] bg-gray-200 rounded" />
          <div className="space-y-3">
            <div className="h-4 w-3/4 bg-gray-200 rounded" />
            <div className="h-4 w-1/2 bg-gray-200 rounded" />
            <div className="h-24 w-full bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-600 font-medium">{error}</p>
        <p className="text-sm text-gray-600 mt-2">Try reloading the page.</p>
      </div>
    );
  }

  if (!product) {
    return <div className="p-6">Product not found.</div>;
  }

  const fav = isFavorite(product.id);
  const stockInfo = product.isOutOfStock
    ? { label: "Out of stock", color: "text-red-600" }
    : product.isLowStock
    ? { label: "Low stock", color: "text-orange-600" }
    : { label: "In stock", color: "text-green-600" };

  return (
    <main className="p-6 mx-auto max-w-6xl">
      <div className="grid gap-10 md:grid-cols-2">
        {/* Simple gallery */}
        <div>
          <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 border">
            {product.image ? (
              <img
                src={product.image}
                alt={product.title}
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div className="grid place-items-center h-full text-gray-500">Sin imagen</div>
            )}
          </div>
        </div>

        {/* Info */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{product.title}</h1>
          <p className="mt-2 text-lg font-medium">${product.price}</p>
          <p className="mt-4 text-sm leading-relaxed text-gray-700 max-w-prose">
            {product.description || "No description available."}
          </p>

            {/* Rating */}
            <div className="mt-4 flex items-center gap-2 text-sm">
              <span className="font-medium">Rating:</span>
              <span>{product.rating.rate.toFixed(1)} / 5</span>
              <span className="text-gray-500">({product.rating.count} reviews)</span>
            </div>

            {/* Stock */}
            <div className="mt-2 text-sm">
              <span className={`font-medium ${stockInfo.color}`}>{stockInfo.label}</span>{" "}
              <span className="text-gray-600">
                ({product.inventoryAvailable}/{product.inventoryTotal} available)
              </span>
            </div>

          {/* Actions */}
          <div className="mt-6 flex items-center gap-4">
            <Button disabled={product.isOutOfStock}>Add to cart</Button>
            <Button
              variant="ghost"
              aria-label={fav ? "Remove from favorites" : "Add to favorites"}
              onClick={() => toggle(product.id)}
            >
              {fav ? "♥ Favorite" : "♡ Favorite"}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
