import type { Category } from "./category";

// Product-related types
export interface Product {
  id: string;
  title: string;
  price: number;
  sellerId: string;
  categoryId: string;
  category: Pick<Category, "id" | "name">;
  status: string;
  viewCount: number;
  isNegotiable: boolean;
  images: string[];
  condition: "new" | "like-new" | "good" | "fair";
  createdAt: string;
  updatedAt: string;
}

export interface ProductsParams {
  page?: number;
  limit?: number;
  sellerIds?: Array<string | number>;
  categoryIds?: Array<string | number>;
  condition?: string[];
  status?: string[];
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  minViews?: number;
  maxViews?: number;
  isNegotiable?: boolean;
  minCreatedAt?: string;
  maxCreatedAt?: string;
  minUpdatedAt?: string;
  maxUpdatedAt?: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
  limit?: number;
}
