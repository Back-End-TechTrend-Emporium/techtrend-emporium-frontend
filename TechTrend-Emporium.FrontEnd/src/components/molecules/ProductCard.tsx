import Button from "../atoms/Button";

export default function ProductCard({
  product,
}: {
  product: { id: string; title: string; image?: string; price: number };
}) {
  return (
    <div className="rounded-lg overflow-hidden border hover:shadow-md transition flex flex-col">
      <img src={product.image ?? `https://picsum.photos/400/300?random=${product.id}`} alt={product.title} className="h-48 w-full object-cover" />
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          <p className="font-medium mb-1">{product.title}</p>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-sm text-neutral-600">${product.price.toFixed(2)}</p>
          <Button variant="ghost" size="sm">Add</Button>
        </div>
      </div>
    </div>
  );
}
