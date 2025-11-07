import { http } from "./http";

const BASE = "/store";

/* ---------------- Existing types (kept intact) ---------------- */

export type ProductRating = {
  rate: number;
  count: number;
};

export type Product = {
  id: string;
  title: string;
  price: number;
  /** Your API exposes category as a string (name). We keep it as-is. */
  category: string;
  image: string;
  description: string;
  rating: ProductRating;

  /** Optional fields added for F-502 (won’t break existing consumers). */
  inventory?: number;
  status?: ProductStatus;
};

/**
 * Detailed product shape as returned by GET api/product/{id}
 */
export type ProductDetail = {
  id: string;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: ProductRating;
  inventoryTotal: number;
  inventoryAvailable: number;
  isLowStock: boolean;
  isOutOfStock: boolean;
  isInStock: boolean;
};

/* ---------------- New types for F-502 ---------------- */

/** Business state for product moderation. */
export type ProductStatus = "approved" | "unapproved";

/**
 * Draft payload to create a product.
 * - Prefer sending `categoryId` if your backend supports IDs.
 * - If your backend expects category name, use `category`.
 */
export type ProductDraft = {
  title: string;
  price: number;
  categoryId?: string;                  // preferred if your API uses IDs
  category?: string;                    // fallback if your API expects name
  description: string;
  image: string;                        // your API uses `image`, not `imageUrl`
  inventory: number;
  status: ProductStatus;                // admin: approved | employee: unapproved
  createdBy?: { id: string; role: "employee" | "admin" };
};

/* ---------------- Internal helpers ---------------- */

/** Map our Draft to API payload keys. Adjust here if your API uses PascalCase. */
function mapDraftToApi(d: ProductDraft) {
  return {
    title: d.title,
    price: d.price,
    description: d.description,
    image: d.image,
    inventory: d.inventory,
    status: d.status,
    // Send both and let the backend decide which one to use.
    categoryId: d.categoryId ?? undefined,
    category: d.category ?? undefined,
    createdBy: d.createdBy ?? undefined,
  };
}

/**
 * Try several strategies to check duplicates without breaking if an endpoint is missing:
 * 1) `/products/exists?title=&categoryId=` (preferred if available)
 * 2) Filtered listing if your API supports query params
 * 3) Fallback: pull a big page and check client-side
 */
async function checkDuplicateServerSide(
  title: string,
  categoryIdOrName?: string
): Promise<boolean> {
  const titleQ = encodeURIComponent(title.trim());
  const catQ = categoryIdOrName ? encodeURIComponent(categoryIdOrName) : "";

  // 1) Direct exists endpoint (best case)
  try {
    const url = categoryIdOrName
      ? `${BASE}/products/exists?title=${titleQ}&categoryId=${catQ}`
      : `${BASE}/products/exists?title=${titleQ}`;
    const res = await http.get<{ exists: boolean }>(url);
    if (typeof res.data?.exists === "boolean") return res.data.exists;
  } catch {
    // ignore and try next option
  }

  // 2) Filtered listing (if supported by your API)
  try {
    const url = categoryIdOrName
      ? `${BASE}/products?page=1&pageSize=1&title=${titleQ}&categoryId=${catQ}`
      : `${BASE}/products?page=1&pageSize=1&title=${titleQ}`;
    const res = await http.get<PagedProductsResponse>(url);
    if (Array.isArray(res.data?.items)) return res.data.items.length > 0;
  } catch {
    // ignore and try fallback
  }

  // 3) Fallback: fetch a large page and check locally
  try {
    const res = await http.get<PagedProductsResponse>(`${BASE}/products?page=1&pageSize=1000`);
    const items = res.data?.items ?? [];
    const t = title.trim().toLowerCase();
    return items.some((p) => {
      const sameTitle = p.title.trim().toLowerCase() === t;
      if (!categoryIdOrName) return sameTitle;
      // If the API returns category name but we got an ID, we cannot match by ID.
      // We compare with the name when possible.
      const sameCat = p.category?.toString().toLowerCase() === categoryIdOrName.toLowerCase();
      return sameTitle && sameCat;
    });
  } catch {
    // If everything fails, assume not duplicated to avoid blocking creation.
    return false;
  }
}

/* ---------------- Existing API (kept) ---------------- */

export type PagedProductsResponse = {
  items: Product[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasMore: boolean;
};

export const ProductService = {
  /**
   * Obtener todos los productos aprobados
   */
  getApprovedProducts: async (): Promise<ProductDetail[]> => {
    const res = await http.get<ProductDetail[]>(`/api/product/approved`);
    return Array.isArray(res.data) ? res.data : [];
  },
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

  /**
   * Gets details from endpoint api/product/{id}
   */
  getById: async (id: string): Promise<ProductDetail> => {
    const res = await http.get<ProductDetail>(`/api/product/${encodeURIComponent(id)}`);
    return res.data;
  },

  /* ---------------- New methods for F-502 ---------------- */

  /**
   * Check duplication by (title + category). Prefer passing categoryId if you have it.
   */
  existsByTitleAndCategory: async (
    title: string,
    categoryIdOrName?: string
  ): Promise<boolean> => {
    return checkDuplicateServerSide(title, categoryIdOrName);
  },

  /**
   * Create a product.
   * - Admin => `status: "approved"`
   * - Employee => `status: "unapproved"`
   * Returns the created product as the backend responds.
   */
  create: async (draft: ProductDraft): Promise<Product> => {
    // Fast duplication guard (client-side + server attempts)
    const duplicated = await ProductService.existsByTitleAndCategory(
      draft.title,
      draft.categoryId ?? draft.category
    );
    if (duplicated) {
      throw new Error("Product already exists in this category.");
    }

    // POST to backend
    const payload = mapDraftToApi(draft);
    const res = await http.post<Product>(`${BASE}/products`, payload);
    return res.data;
  },
};
