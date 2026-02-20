// Product-related types
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
  sellerIds?: number[];
  categoryIds?: number[];
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
