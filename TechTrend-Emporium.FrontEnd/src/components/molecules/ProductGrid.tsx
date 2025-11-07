import { useNavigate } from "react-router-dom";
import { useFavorites } from "../../context/FavoritesContext";

export type Product = {
  id: string | number;
  name: string;
  imageUrl?: string;
  price: number;
};

export default function ProductGrid({
  title,
  products,
  withFavorites = true, // ⬅️ nuevo: activa/desactiva corazón
}: {
  title?: string;
  products: Product[];
  withFavorites?: boolean;
}) {
  const navigate = useNavigate();
  const { isFavorite, toggle } = useFavorites();

  return (
    <section className="mx-auto max-w-6xl">
      {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}

      {products.length === 0 ? (
        <div className="rounded-2xl border p-10 text-center text-gray-700 bg-white">
          <p className="text-lg font-medium">No items to show yet</p>
          <p className="text-gray-600 mt-1">We’re curating the best tech for you.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => {
            const fallback = `https://picsum.photos/seed/${p.id}/800/600`;
            const img = p.imageUrl || fallback;
            const fav = isFavorite(p.id);

            return (
              <div key={p.id} className="relative rounded-xl border bg-white p-3 shadow-sm hover:shadow-md transition">
                {/* Media: navega al detalle */}
                <button
                  onClick={() => navigate(`/product/${p.id}`)}
                  className="block w-full aspect-[4/3] rounded-lg bg-gray-100 overflow-hidden"
                  aria-label={`Go to ${p.name} details`}
                >
                  <img
                    src={img}
                    alt={p.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      // Fallback if remote URL is blocked by CORS/ORB or 404
                      if (e.currentTarget.src !== fallback) {
                        e.currentTarget.src = fallback;
                      }
                    }}
                  />
                </button>

                {/* Corazón */}
                {withFavorites && (
                  <button
                    type="button"
                    onClick={() => toggle(p.id)}
                    aria-label={fav ? "Remove from favorites" : "Add to favorites"}
                    title={fav ? "Remove from favorites" : "Add to favorites"}
                    className="absolute top-2 right-2 p-1 rounded-full border bg-white/90 hover:bg-white"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className={`h-5 w-5 ${fav ? "fill-current text-rose-600" : "stroke-current text-gray-700"}`}
                      fill="none"
                      strokeWidth="1.5"
                    >
                      <path d="M16.5 3.75c-1.657 0-3.09.99-4.5 3-1.41-2.01-2.843-3-4.5-3A4.75 4.75 0 0 0 2.75 8.5c0 5.25 7.75 9.75 9.25 10.75 1.5-1 9.25-5.5 9.25-10.75a4.75 4.75 0 0 0-4.75-4.75Z" />
                    </svg>
                  </button>
                )}

                {/* Info + navegación */}
                <div className="mt-3">
                  <button onClick={() => navigate(`/product/${p.id}`)} className="text-left text-sm">
                    <div className="font-medium">{p.name}</div>
                    <div className="text-gray-600">${p.price}</div>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
