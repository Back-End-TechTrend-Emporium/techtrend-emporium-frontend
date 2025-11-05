import { useEffect, useState } from "react";
import SearchBar from "../components/molecules/SearchBar/SearchBar";
import ProductCard from "../components/molecules/ProductCard";
import { CategoryService } from "../lib/CategoryService";
import { StoreService, type ProductItem } from "../lib/StoreService";
import Button from "../components/atoms/Button/Button";

type SortOption = { label: string; sortBy: string; sortDir: "Asc" | "Desc" };

export default function ShopList() {
  const [categories, setCategories] = useState<{ id: string; name: string; slug?: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState<boolean>(true);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [query, setQuery] = useState("");
  const [searchKey, setSearchKey] = useState(0);
  const [sort, setSort] = useState<SortOption>({ label: "Title ▲", sortBy: "Title", sortDir: "Asc" });

  const sortOptions: SortOption[] = [
    { label: "Title ▲", sortBy: "Title", sortDir: "Asc" },
    { label: "Title ▼", sortBy: "Title", sortDir: "Desc" },
    { label: "Price ▲", sortBy: "Price", sortDir: "Asc" },
    { label: "Price ▼", sortBy: "Price", sortDir: "Desc" },
  ];

  useEffect(() => {
    // load categories
    CategoryService.getCategories()
      .then((cats) => setCategories(cats.map((c) => ({ id: c.id, name: c.name, slug: c.slug })) ))
      .catch((e) => console.error("Error loading categories", e));

    const onToggle = () => setShowFilters((s) => !s);
    window.addEventListener("shop:toggleFilters", onToggle as EventListener);
    return () => window.removeEventListener("shop:toggleFilters", onToggle as EventListener);
  }, []);

  const clearFilters = async () => {
    // reset UI state
    setSelectedCategory(null);
    setSort(sortOptions[0]);
    setProducts([]);
    setPage(1);
    // force SearchBar remount so its internal input clears
    setSearchKey((k) => k + 1);

    // fetch first page with cleared filters
    setLoading(true);
    try {
      const res = await StoreService.getProducts({ page: 1, pageSize, sortBy: sortOptions[0].sortBy, sortDir: sortOptions[0].sortDir });
      setProducts(res.items);
      setHasMore(res.hasMore ?? (res.items.length === pageSize));
      setQuery("");
    } catch (err) {
      console.error("Error clearing filters:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async (reset = false) => {
    setLoading(true);
    try {
      // If a category is selected, call the category-specific endpoint (backend accepts one category)
      if (selectedCategory) {
        const res = await StoreService.getProductsByCategory({
          category: selectedCategory,
          page: reset ? 1 : page,
          pageSize,
          title: query || undefined,
          sortBy: sort.sortBy,
          sortDir: sort.sortDir,
        });
        if (reset) {
          setProducts(res.filteredProducts);
          setPage(1);
        } else {
          setProducts((p) => [...p, ...res.filteredProducts]);
        }
        setHasMore(res.filteredProducts.length === pageSize);
      } else {
        const params: any = { page: reset ? 1 : page, pageSize, sortBy: sort.sortBy, sortDir: sort.sortDir };
        if (query) params.title = query;
        const res = await StoreService.getProducts(params);
        if (reset) {
          setProducts(res.items);
          setPage(1);
        } else {
          setProducts((p) => [...p, ...res.items]);
        }
        setHasMore(res.hasMore ?? (res.items.length === pageSize));
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  // refetch when filters change
  useEffect(() => {
    // reset to page 1
    setProducts([]);
    setPage(1);
    fetchProducts(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, sort, query]);

  const loadMore = async () => {
    setPage((p) => p + 1);
    try {
      const next = page + 1;
      if (selectedCategory) {
        const res = await StoreService.getProductsByCategory({
          category: selectedCategory,
          page: next,
          pageSize,
          title: query || undefined,
          sortBy: sort.sortBy,
          sortDir: sort.sortDir,
        });
        setProducts((p) => [...p, ...res.filteredProducts]);
        setHasMore(res.filteredProducts.length === pageSize);
      } else {
        const params: any = { page: next, pageSize, sortBy: sort.sortBy, sortDir: sort.sortDir };
        if (query) params.title = query;
        const res = await StoreService.getProducts(params);
        setProducts((p) => [...p, ...res.items]);
        setHasMore(res.hasMore ?? (res.items.length === pageSize));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleCategory = (value: string) => {
    // radio behaviour: select or unselect the single category
    setSelectedCategory((prev) => (prev === value ? null : value));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
    <div className="flex gap-6">
      {/* Left - Filters */}
      <aside className={`${showFilters ? "block" : "hidden"} sm:block w-64`}>
          <h3 className="font-semibold mb-3">Filters</h3>
          <div className="bg-white p-4 rounded border">
            <div className="mb-2 font-medium">Categories</div>
            <div className="flex flex-col gap-2">
              {categories.map((c) => {
                const val = c.slug ?? c.name;
                return (
                  <label key={c.id} className="inline-flex items-center gap-2">
                    <input type="radio" name="category" checked={selectedCategory === val} onChange={() => toggleCategory(val)} />
                    <span>{c.name}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <div className="w-1/2 flex items-center gap-2">
                <SearchBar key={searchKey} onSearch={(q) => setQuery(q)} placeholder="Search products" />
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear filters
                </Button>
              </div>

            <div className="flex items-center gap-3">
              <label className="sr-only">Sort by</label>
              <select value={sort.label} onChange={(e) => setSort(sortOptions.find(s => s.label === e.target.value) ?? sortOptions[0])} className="border rounded p-2">
                {sortOptions.map((s) => (
                  <option key={s.label} value={s.label}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {products.slice(0, 999).map((p) => (
              <ProductCard key={p.id} product={{ id: p.id, title: p.title, image: p.image, price: p.price }} />
            ))}
          </div>

          <div className="mt-6 text-center">
            {loading ? (
              <div>Loading...</div>
            ) : hasMore ? (
              <Button onClick={loadMore} variant="ghost">Load more products</Button>
            ) : (
              <div className="text-neutral-500">No more products</div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
