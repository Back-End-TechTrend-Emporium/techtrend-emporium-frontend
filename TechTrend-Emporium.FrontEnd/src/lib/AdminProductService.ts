import { http } from "./http";

const BASE = "/api/product";

export type AdminProduct = {
  id: string;
  title: string;
  price: number;
  category: string;
  inventoryTotal?: number;
  inventoryAvailable?: number;
  createdBy?: string;
  createdAt?: string;
  description?: string;
  approved?: boolean;
};

export const AdminProductService = {
  getProducts: async (): Promise<AdminProduct[]> => {
    const res = await http.get<AdminProduct[]>(`${BASE}`);
    return res.data;
  },

  getProduct: async (id: string): Promise<AdminProduct> => {
    const res = await http.get<AdminProduct>(`${BASE}/${id}`);
    return res.data;
  },

  updateProduct: async (id: string, payload: Partial<AdminProduct>): Promise<any> => {
    const res = await http.put(`${BASE}/${id}`, payload as any);
    return res.data;
  },

  deleteProduct: async (id: string): Promise<any> => {
    const res = await http.delete(`${BASE}/${id}`);
    return res.data;
  },

  getMyProducts: async (): Promise<AdminProduct[]> => {
    const res = await http.get<AdminProduct[]>(`${BASE}/my-products`);
    return res.data;
  },

  getPendingApproval: async (): Promise<AdminProduct[]> => {
    const res = await http.get<AdminProduct[]>(`${BASE}/pending-approval`);
    return res.data;
  },

  approveProduct: async (id: string): Promise<any> => {
    const res = await http.post(`${BASE}/${id}/approve`);
    return res.data;
  },

  rejectProduct: async (id: string): Promise<any> => {
    const res = await http.post(`${BASE}/${id}/reject`);
    return res.data;
  },
};
