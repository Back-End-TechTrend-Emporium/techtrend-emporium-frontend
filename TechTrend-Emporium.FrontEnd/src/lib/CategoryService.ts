import { http } from "./http";

const BASE = "/Test";

export type CategoryCreator = {
  id: string;
  name: string;
  email: string;
};

export type CategoryProduct = {
  id: string;
  title: string;
  price: number;
  category: string;
  image: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  state: number;
  createdBy: string;
  approvedBy: string | null;
  createdAt: string;
  updatedAt: string | null;
  approvedAt: string | null;
  creator: CategoryCreator | null;
  approver: CategoryCreator | null;
  products: CategoryProduct[];
};

export const CategoryService = {
  getCategories: async (): Promise<Category[]> => {
  // During unit tests we avoid real network calls
  if (typeof (import.meta as any).env !== "undefined" && (import.meta as any).env.MODE === "test") return [];
    const response = await http.get<Category[]>(`${BASE}/categories`);
    return response.data;
  },
};