import { api } from "../api";
import { API_ENDPOINTS } from "@/constants/api-endpoints";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  condition: "new" | "like-new" | "good" | "fair";
  sellerId: string;
  createdAt: string;
}

export interface ProductsParams {
  page?: number;
  limit?: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: string;
  search?: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}

export const productsApi = {
  getAll: (params?: ProductsParams) =>
    api.get<ProductsResponse>(API_ENDPOINTS.PRODUCTS.LIST, { params }),

  getById: (id: string) => api.get<Product>(API_ENDPOINTS.PRODUCTS.BY_ID(id)),

  create: (productData: Partial<Product>) =>
    api.post<Product>(API_ENDPOINTS.PRODUCTS.CREATE, productData),

  update: (id: string, productData: Partial<Product>) =>
    api.put<Product>(API_ENDPOINTS.PRODUCTS.UPDATE(id), productData),

  delete: (id: string) => api.delete(API_ENDPOINTS.PRODUCTS.DELETE(id)),

  search: (query: string) =>
    api.get<ProductsResponse>(API_ENDPOINTS.PRODUCTS.SEARCH, {
      params: { q: query },
    }),

  getCategories: () => api.get<string[]>(API_ENDPOINTS.PRODUCTS.CATEGORIES),
};
