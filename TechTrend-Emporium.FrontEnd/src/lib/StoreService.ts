import { http } from "./http";

export type ProductItem = {
  id: string;
  title: string;
  price: number;
  category?: string;
  image?: string;
  description?: string;
};

export type PagedResult<T> = {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasMore: boolean;
};

export const StoreService = {
  getProducts: async (params: {
    page?: number;
    pageSize?: number;
    title?: string;
    price?: number;
    sortBy?: string;
    sortDir?: "Asc" | "Desc";
    category?: string; // comma-separated list or single
  }): Promise<PagedResult<ProductItem>> => {
    if (typeof (import.meta as any).env !== "undefined" && (import.meta as any).env.MODE === "test") {
      return {
        items: [],
        page: params.page ?? 1,
        pageSize: params.pageSize ?? 6,
        totalItems: 0,
        totalPages: 0,
        hasMore: false,
      } as PagedResult<ProductItem>;
    }

    const response = await http.get<PagedResult<ProductItem>>("/store/products", {
      params: params,
    } as any);
    return response.data;
  },
  getProductsByCategory: async (opts: {
    category: string;
    page?: number;
    pageSize?: number;
    title?: string;
    price?: number;
    sortBy?: string;
    sortDir?: "Asc" | "Desc";
  }): Promise<{ selectedCategory: string; filteredProducts: ProductItem[] }> => {
    if (typeof (import.meta as any).env !== "undefined" && (import.meta as any).env.MODE === "test") {
      return { selectedCategory: opts.category, filteredProducts: [] };
    }

    const response = await http.get<{ selectedCategory: string; filteredProducts: ProductItem[] }>(
      "/store/products/category",
      { params: opts } as any
    );
    return response.data;
  },
};
