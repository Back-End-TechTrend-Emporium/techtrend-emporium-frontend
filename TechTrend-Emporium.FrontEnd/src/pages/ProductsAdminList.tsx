import { useEffect, useState } from "react";
import { type Product } from "../lib/ProductService";
import { AdminProductService } from "../lib/AdminProductService";
import Button from "../components/atoms/Button/Button";
import { useAuth } from "../auth/AuthContext";
import Input from "../components/atoms/Input";

export default function ProductsAdminList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { user } = useAuth();

  const isAdmin = user?.role === "admin";

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Use admin API to list products
      const res = await AdminProductService.getProducts();
      setProducts(res as Product[]);
    } catch (err) {
      console.error("Error loading products", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startEdit = (p: Product) => {
    setEditing({ ...p });
    setErrors({});
  };

  const validate = (p: Partial<Product>) => {
    const e: Record<string, string> = {};
    if (!p.title || !p.title.trim()) e.title = "Title is required";
    if (p.price == null || Number.isNaN(Number(p.price)) || Number(p.price) < 0) e.price = "Price must be a non-negative number";
    if (p.inventory == null || Number.isNaN(Number(p.inventory)) || Number(p.inventory) < 0) e.inventory = "Inventory must be a non-negative integer";
    if (!p.category || !p.category.trim()) e.category = "Category is required";
    return e;
  };

  const saveEdit = async () => {
    if (!editing) return;
    const payload: Partial<Product> = {
      title: editing.title,
      price: editing.price,
      category: editing.category,
      description: editing.description,
      inventory: editing.inventory,
    };
    const e = validate(payload);
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    try {
      // Call admin API PUT /api/product/{id}
      await AdminProductService.updateProduct(editing.id, payload);
      setEditing(null);
      await fetchProducts();
    } catch (err: any) {
      console.error("Error updating product", err);
      setErrors({ form: err?.message ?? "Update failed" });
    }
  };

  const confirmDelete = async (p: Product) => {
    const ok = window.confirm(`Delete product "${p.title}"?`);
    if (!ok) return;
    try {
      await AdminProductService.deleteProduct(p.id);
      await fetchProducts();
    } catch (err) {
      console.error("Delete failed", err);
      alert("Delete failed");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Products List</h1>

      {loading ? (
        <div className="py-8 flex justify-center"><span className="text-neutral-600">Loading products...</span></div>
      ) : null}

      <div className="overflow-x-auto bg-white rounded border">
        <table className="w-full text-left">
          <thead className="bg-neutral-50">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Title</th>
              <th className="p-3">Category</th>
              <th className="p-3">Inventory</th>
              <th className="p-3">Created At</th>
              <th className="p-3">Created By</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-3 align-top">{p.id}</td>
                <td className="p-3 align-top">{p.title}</td>
                <td className="p-3 align-top">{p.category}</td>
                <td className="p-3 align-top">{p.inventory ?? "-"}</td>
                <td className="p-3 align-top">{p.createdAt ?? "-"}</td>
                <td className="p-3 align-top">{p.createdBy ?? "-"}</td>
                <td className="p-3 align-top">
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => startEdit(p)}>Update</Button>
                    <Button variant="ghost" size="sm" className="text-red-600" onClick={() => confirmDelete(p)}>Delete</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Simple edit modal */}
      {editing ? (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-2xl">
            <h2 className="text-xl font-semibold mb-3">Edit product</h2>
            {errors.form ? <div className="mb-2 text-sm text-red-600">{errors.form}</div> : null}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium">Title</label>
                <Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
                {errors.title ? <div className="text-red-600 text-sm">{errors.title}</div> : null}
              </div>
              <div>
                <label className="block text-sm font-medium">Category</label>
                <Input value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} />
                {errors.category ? <div className="text-red-600 text-sm">{errors.category}</div> : null}
              </div>
              <div>
                <label className="block text-sm font-medium">Price</label>
                <Input type="number" value={String(editing.price ?? "")} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} />
                {errors.price ? <div className="text-red-600 text-sm">{errors.price}</div> : null}
              </div>
              <div>
                <label className="block text-sm font-medium">Inventory</label>
                <Input type="number" value={String(editing.inventory ?? 0)} onChange={(e) => setEditing({ ...editing, inventory: Number(e.target.value) })} />
                {errors.inventory ? <div className="text-red-600 text-sm">{errors.inventory}</div> : null}
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium">Description</label>
                <textarea value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="w-full border p-2 rounded" />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-4">
              <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
              <Button onClick={saveEdit}>{isAdmin ? "Update & Approve" : "Update (unapproved)"}</Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
