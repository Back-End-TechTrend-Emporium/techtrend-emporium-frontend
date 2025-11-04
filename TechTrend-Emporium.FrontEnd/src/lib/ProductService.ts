import { http } from "./http";

const BASE = "/store";

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
};