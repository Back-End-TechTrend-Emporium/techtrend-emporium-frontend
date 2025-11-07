import { http } from "./http";

const BASE = "/api/store";

export type ProductRating = {
  rate: number;
  count: number;
};

export type Product = {
  id: string;
  title: string;
  price: number;
  category: string;
  image: string;
  description: string;
  rating: ProductRating;
  inventory?: number;
  createdBy?: string;
  createdAt?: string;
  approved?: boolean;
};

export type PagedProductsResponse = {
  items: Product[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasMore: boolean;
};

export const ProductService = {
  getProducts: async (page = 1, pageSize = 12): Promise<PagedProductsResponse> => {
    const response = await http.get<PagedProductsResponse>(
      `${BASE}/products?page=${page}&pageSize=${pageSize}`
    );
    return response.data;
  },

  getLatestProducts: async (): Promise<Product[]> => {
    const response = await http.get<PagedProductsResponse>(
      `${BASE}/products?page=1&pageSize=6&sortBy=Title&sortDir=Desc`
    );
    return response.data.items;
  },

  getBestProducts: async (): Promise<Product[]> => {
    const response = await http.get<PagedProductsResponse>(
      `${BASE}/products?page=1&pageSize=3&sortBy=Rating&sortDir=Desc`
    );
    return response.data.items;
  },
  updateProduct: async (id: string, payload: Partial<Product>, approved?: boolean) => {
    const url = `${BASE}/products/${id}${typeof approved === 'boolean' ? `?approved=${approved}` : ''}`;
    const res = await http.put(url, payload as any);
    return res.data;
  },
  deleteProduct: async (id: string, approved?: boolean) => {
    const url = `${BASE}/products/${id}${typeof approved === 'boolean' ? `?approved=${approved}` : ''}`;
    const res = await http.delete(url);
    return res.data;
  }
};