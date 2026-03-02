import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "./client";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import type {
  Category,
  Product,
  ProductsParams,
  ProductsResponse,
} from "@/types";

type RawCategory = {
  id?: string | number;
  name?: string;
};

type RawImage = string | { url?: string } | null;

type RawProduct = {
  id?: string | number;
  title?: string;
  name?: string;
  price?: number;
  sellerId?: string | number;
  categoryId?: string | number;
  category?: RawCategory;
  status?: string;
  viewCount?: number;
  isNegotiable?: boolean;
  images?: RawImage[];
  condition?: Product["condition"];
  createdAt?: string;
  updatedAt?: string;
};

type RawProductsPayload = {
  data?: RawProduct[];
  total?: number;
  page?: number;
  totalPages?: number;
  limit?: number;
};

// ============================================================================
// API Functions
// ============================================================================

export const productService = {
  getAll: async (params?: ProductsParams): Promise<ProductsResponse> => {
    const responseData = await api.get<
      RawProductsPayload | { data?: RawProductsPayload }
    >(API_ENDPOINTS.PRODUCTS.LIST, { params });

    const nestedData = (responseData as { data?: RawProductsPayload }).data;
    const backend: RawProductsPayload =
      nestedData && !Array.isArray(nestedData)
        ? nestedData
        : (responseData as RawProductsPayload);
    const products = Array.isArray(backend.data) ? backend.data : [];

    return {
      products: products.map((item) => ({
        id: String(item.id),
        title: item.title ?? item.name ?? "",
        price: item.price ?? 0,
        sellerId: String(item.sellerId),
        categoryId: String(item.categoryId ?? item.category?.id ?? ""),
        category: {
          id: String(item.category?.id ?? item.categoryId ?? ""),
          name: item.category?.name ?? "",
        },
        status: item.status ?? "pending",
        viewCount: Number(item.viewCount ?? 0),
        isNegotiable: Boolean(item.isNegotiable),
        images: Array.isArray(item.images)
          ? item.images
              .map((img) => {
                if (typeof img === "string") {
                  return img;
                }

                return img?.url ?? "";
              })
              .filter((image): image is string => Boolean(image))
          : [],
        condition: item.condition ?? "good",
        createdAt: item.createdAt ?? new Date().toISOString(),
        updatedAt: item.updatedAt ?? item.createdAt ?? new Date().toISOString(),
      })),
      total: backend.total ?? 0,
      page: backend.page ?? 1,
      totalPages: backend.totalPages ?? 1,
      limit: backend.limit,
    };
  },

  getById: (id: string): Promise<Product> =>
    api.get<Product>(API_ENDPOINTS.PRODUCTS.BY_ID(id)),

  create: (productData: Partial<Product>): Promise<Product> =>
    api.post<Product>(API_ENDPOINTS.PRODUCTS.CREATE, productData),

  update: (id: string, productData: Partial<Product>): Promise<Product> =>
    api.put<Product>(API_ENDPOINTS.PRODUCTS.UPDATE(id), productData),

  delete: (id: string): Promise<void> =>
    api.delete<void>(API_ENDPOINTS.PRODUCTS.DELETE(id)),

  search: (query: string): Promise<ProductsResponse> =>
    api.get<ProductsResponse>(API_ENDPOINTS.PRODUCTS.SEARCH, {
      params: { q: query },
    }),

  getCategories: (): Promise<Category[]> =>
    api.get<Category[]>(API_ENDPOINTS.PRODUCTS.CATEGORIES),

  getProducts: (params?: ProductsParams): Promise<ProductsResponse> =>
    api.get<ProductsResponse>("/products", { params }),

  getProduct: (id: string): Promise<Product> =>
    api.get<Product>(`/products/${id}`),

  createProduct: (
    data: Omit<Product, "id" | "createdAt" | "updatedAt">,
  ): Promise<Product> => api.post<Product>("/products", data),

  updateProduct: (id: string, data: Partial<Product>): Promise<Product> =>
    api.put<Product>(`/products/${id}`, data),

  deleteProduct: (id: string): Promise<void> =>
    api.delete<void>(`/products/${id}`),
};

// ============================================================================
// Query Keys
// ============================================================================

export const PRODUCTS_KEYS = {
  all: ["products"] as const,
  lists: () => [...PRODUCTS_KEYS.all, "list"] as const,
  list: (params?: ProductsParams) =>
    [...PRODUCTS_KEYS.lists(), params] as const,
  details: () => [...PRODUCTS_KEYS.all, "detail"] as const,
  detail: (id: string) => [...PRODUCTS_KEYS.details(), id] as const,
  categories: ["products", "categories"] as const,
};

// ============================================================================
// React Query Hooks
// ============================================================================

// Get all products with filters
export const useProducts = (params?: ProductsParams) => {
  return useQuery({
    queryKey: PRODUCTS_KEYS.list(params),
    queryFn: () => productService.getAll(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get single product
export const useProduct = (id: string) => {
  return useQuery({
    queryKey: PRODUCTS_KEYS.detail(id),
    queryFn: () => productService.getById(id),
    enabled: !!id,
  });
};

// Get categories
export const useCategories = () => {
  return useQuery({
    queryKey: PRODUCTS_KEYS.categories,
    queryFn: productService.getCategories,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Create product
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_KEYS.lists() });
    },
  });
};

// Update product
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) =>
      productService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: PRODUCTS_KEYS.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: PRODUCTS_KEYS.lists() });
    },
  });
};

// Delete product
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_KEYS.lists() });
    },
  });
};
