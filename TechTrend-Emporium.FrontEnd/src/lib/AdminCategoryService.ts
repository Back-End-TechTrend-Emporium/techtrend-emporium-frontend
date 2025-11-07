import { http } from "./http";

// Backend uses PascalCase for this controller path; keep casing to match examples
const BASE = "/api/Categories";

export type CategoryDto = {
  id: string;
  name: string;
  slug?: string;
  createdBy?: string;
  createdAt?: string;
  isActive?: boolean;
  approved?: boolean;
};

export type CategoryCreateDto = { name: string; slug?: string };
export type CategoryUpdateDto = { id: string; name: string; slug?: string };
export type CategoryDeleteDto = { id: string };

export const AdminCategoryService = {
  // Public/simple (approved categories)
  getCategories: async (): Promise<CategoryDto[]> => {
    const res = await http.get<CategoryDto[]>(`${BASE}`);
    return res.data;
  },

  getCategory: async (id: string): Promise<CategoryDto> => {
    const res = await http.get<CategoryDto>(`${BASE}/${id}`);
    return res.data;
  },

  // Administrative full list
  getAllCategories: async (): Promise<CategoryDto[]> => {
    const res = await http.get<CategoryDto[]>(`${BASE}/all`);
    return res.data;
  },

  createCategory: async (payload: CategoryCreateDto) => {
    const res = await http.post(`${BASE}`, payload);
    return res.data;
  },

  updateCategory: async (payload: CategoryUpdateDto) => {
    const res = await http.put(`${BASE}`, payload as any);
    return res.data;
  },

  deleteCategory: async (payload: CategoryDeleteDto) => {
    // controller expects DELETE with a body containing the id
    const res = await http.request({ method: "DELETE", url: `${BASE}`, data: payload });
    return res.data;
  },

  getPendingApproval: async (): Promise<CategoryDto[]> => {
    const res = await http.get<CategoryDto[]>(`${BASE}/pending-approval`);
    return res.data;
  },

  approveCategory: async (id: string) => {
    const res = await http.post(`${BASE}/${id}/approve`);
    return res.data;
  },

  rejectCategory: async (id: string) => {
    const res = await http.post(`${BASE}/${id}/reject`);
    return res.data;
  },

  deactivateCategory: async (id: string) => {
    const res = await http.post(`${BASE}/${id}/deactivate`);
    return res.data;
  },

  getCategoriesFromFakeStore: async (): Promise<string[]> => {
    const res = await http.get<string[]>(`${BASE}/fakestore`);
    return res.data;
  },

  syncFromFakeStore: async () => {
    const res = await http.post(`${BASE}/sync-from-fakestore`);
    return res.data;
  },
};
