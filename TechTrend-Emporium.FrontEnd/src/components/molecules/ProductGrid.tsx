export type Product = { id: string; name: string; imageUrl: string; price: number };

export default function ProductGrid({
  title,
  products,
}: {
  title: string;
  products: Product[];
}) {
  return (
    <section className="py-10 text-center">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {products.slice(0, 3).map((p) => (
          <div key={p.id} className="rounded-lg overflow-hidden border hover:shadow-md transition">
            <img src={p.imageUrl} alt={p.name} className="h-56 w-full object-cover" />
            <div className="p-3 text-left">
              <p className="font-medium">{p.name}</p>
              <p className="text-sm text-neutral-600">${p.price.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
