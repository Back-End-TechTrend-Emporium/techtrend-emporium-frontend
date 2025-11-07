import { useEffect, useState } from "react";
import Button from "../components/atoms/Button/Button";
import Input from "../components/atoms/Input";
import { useAuth } from "../auth/AuthContext";
import { AdminCategoryService, type CategoryDto, type CategoryCreateDto, type CategoryUpdateDto } from "../lib/AdminCategoryService";

export default function CategoriesAdminList() {
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<CategoryDto | null>(null);
  const [creating, setCreating] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { user } = useAuth();

  const isAdmin = user?.role === "admin";
  // lightweight flash messages to avoid requiring 'sonner' in dev
  const [flash, setFlash] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const showFlash = (type: "success" | "error", text: string) => {
    setFlash({ type, text });
    setTimeout(() => setFlash(null), 3500);
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await AdminCategoryService.getAllCategories();
      console.debug("GET /api/Categories/all =>", res);
      if (!res || (Array.isArray(res) && res.length === 0)) {
        // If backend returned empty, indicate it
        showFlash('error', 'No categories returned from server');
      }
      setCategories(res || []);
      try {
        localStorage.setItem("categories_cache", JSON.stringify(res || []));
      } catch (e) {
        // ignore storage errors
      }
    } catch (err) {
      console.error("Error loading categories", err);
      showFlash('error', (err as any)?.message ?? 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load cached categories quickly (if available) while fetching fresh data
    try {
      const cached = localStorage.getItem("categories_cache");
      if (cached) {
        const parsed = JSON.parse(cached) as CategoryDto[];
        if (Array.isArray(parsed) && parsed.length) setCategories(parsed);
      }
    } catch (e) {
      // ignore parse errors
    }
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startEdit = (c: CategoryDto) => {
    setEditing({ ...c });
    setErrors({});
  };

  const startCreate = () => {
    setCreating(true);
    setErrors({});
  };

  const validate = (payload: Partial<CategoryDto>) => {
    const e: Record<string, string> = {};
    if (!payload.name || !payload.name.trim()) e.name = "Name is required";
    return e;
  };

  const saveEdit = async () => {
    if (!editing) return;
    const payload: CategoryUpdateDto = { id: editing.id, name: editing.name, slug: editing.slug };
    const e = validate(payload);
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    try {
      await AdminCategoryService.updateCategory(payload);
      // Acceptance criteria: if admin updated, mark approved
      if (isAdmin) {
        try {
          await AdminCategoryService.approveCategory(editing.id);
        } catch (approveErr) {
          console.warn("Approve after update failed", approveErr);
        }
      }
      setEditing(null);
      await fetchCategories();
  showFlash('success', 'Category updated');
    } catch (err: any) {
      console.error("Error updating category", err);
      setErrors({ form: err?.message ?? "Update failed" });
  showFlash('error', err?.message ?? 'Update failed');
    }
  };

  const saveCreate = async (name: string, slug?: string) => {
    const payload: CategoryCreateDto = { name: name.trim(), slug };
    const e = validate(payload as any);
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    try {
      await AdminCategoryService.createCategory(payload);
      setCreating(false);
      await fetchCategories();
  showFlash('success', 'Category created');
    } catch (err: any) {
      console.error("Create category failed", err);
      setErrors({ form: err?.message ?? "Create failed" });
  showFlash('error', err?.message ?? 'Create failed');
    }
  };

  const confirmDelete = async (c: CategoryDto) => {
    const ok = window.confirm(`Delete category "${c.name}"?`);
    if (!ok) return;
    try {
      await AdminCategoryService.deleteCategory({ id: c.id });
      await fetchCategories();
  showFlash('success', 'Category deleted');
    } catch (err) {
      console.error("Delete failed", err);
  showFlash('error', 'Delete failed');
    }
  };

  const handleApprove = async (c: CategoryDto) => {
    try {
      await AdminCategoryService.approveCategory(c.id);
      await fetchCategories();
  showFlash('success', 'Category approved');
    } catch (err) {
      console.error("Approve failed", err);
  showFlash('error', 'Approve failed');
    }
  };

  const handleDeactivate = async (c: CategoryDto) => {
    const ok = window.confirm(`Deactivate category "${c.name}"?`);
    if (!ok) return;
    try {
      await AdminCategoryService.deactivateCategory(c.id);
      await fetchCategories();
  showFlash('success', 'Category deactivated');
    } catch (err) {
      console.error("Deactivate failed", err);
  showFlash('error', 'Deactivate failed');
    }
  };


  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Lightweight flash (temporary replacement for sonner) */}
      {flash ? (
        <div className={`fixed top-6 right-6 z-50 px-4 py-2 rounded shadow ${flash.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
          {flash.text}
        </div>
      ) : null}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Categories (Admin)</h1>
        <div className="text-sm text-neutral-500">{user ? `Role: ${user.role}` : "Not authenticated"}</div>
        <div className="flex gap-2">
          <Button onClick={startCreate}>Create</Button>
        </div>
      </div>

      {loading ? (
        <div className="py-8 flex justify-center"><span className="text-neutral-600">Loading categories...</span></div>
      ) : null}

      <div className="overflow-x-auto bg-white rounded border">
        <table className="w-full text-left">
          <thead className="bg-neutral-50">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Slug</th>
              <th className="p-3">Active</th>
              <th className="p-3">Created At</th>
              <th className="p-3">Created By</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="p-3 align-top">{c.name}</td>
                <td className="p-3 align-top">{c.slug ?? "-"}</td>
                <td className="p-3 align-top">{c.isActive ? "Yes" : "No"}</td>
                <td className="p-3 align-top">{c.createdAt ?? "-"}</td>
                <td className="p-3 align-top">{c.createdBy ?? "-"}</td>
                <td className="p-3 align-top">
                  <div className="flex gap-2 flex-wrap">
                    <Button size="sm" className="rounded-md px-2 py-1 bg-blue-600 text-white hover:opacity-95" onClick={() => startEdit(c)}>Edit</Button>
                    <Button size="sm" className="rounded-md px-2 py-1 border border-red-200 text-red-600 hover:bg-red-50" variant="ghost" onClick={() => confirmDelete(c)}>Delete</Button>
                    <Button size="sm" className="rounded-md px-2 py-1 border border-green-200 text-green-700 hover:bg-green-50" variant="ghost" onClick={() => handleApprove(c)}>Approve</Button>
                    <Button size="sm" className="rounded-md px-2 py-1 border border-yellow-200 text-yellow-800 hover:bg-yellow-50" variant="ghost" onClick={() => handleDeactivate(c)}>Deactivate</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create modal */}
      {creating ? (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-3">Create Category</h2>
            {errors.form ? <div className="mb-2 text-sm text-red-600">{errors.form}</div> : null}
            <CreateForm onCancel={() => setCreating(false)} onSave={saveCreate} errors={errors} />
          </div>
        </div>
      ) : null}

      {/* Edit modal */}
      {editing ? (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-3">Edit Category</h2>
            {errors.form ? <div className="mb-2 text-sm text-red-600">{errors.form}</div> : null}

            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-sm font-medium">Name</label>
                <Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
                {errors.name ? <div className="text-red-600 text-sm">{errors.name}</div> : null}
              </div>
              <div>
                <label className="block text-sm font-medium">Slug (optional)</label>
                <Input value={editing.slug ?? ""} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-4">
              <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
              <Button onClick={saveEdit}>{isAdmin ? "Update & Approve" : "Update"}</Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function CreateForm({ onCancel, onSave, errors }: { onCancel: () => void; onSave: (name: string, slug?: string) => void; errors: Record<string, string> }) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  return (
    <div>
      <div className="grid grid-cols-1 gap-3">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
          {errors.name ? <div className="text-red-600 text-sm">{errors.name}</div> : null}
        </div>
        <div>
          <label className="block text-sm font-medium">Slug (optional)</label>
          <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 mt-4">
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button onClick={() => onSave(name, slug)}>Create</Button>
      </div>
    </div>
  );
}
