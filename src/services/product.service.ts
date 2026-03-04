import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "./client";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import type {
  Category,
  Product,
  ProductsParams,
  ProductsResponse,
} from "@/types";

// Payloads for creating products against backend schema
export type ProductAttributeInput = {
  attributeId: string | number;
  value: string;
};

export type CreateProductPayload = {
  title: string;
  categoryId: string | number;
  condition: Product["condition"]; // UI uses "like-new"; backend expects "like_new"
  price: number;
  isNegotiable?: boolean;
  images?: File[]; // optional for draft, recommended for pending
  attributes?: ProductAttributeInput[]; // required for pending
};

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
  condition?: string; // backend may return underscore variant
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
        condition: (item.condition?.replace("_", "-") as Product["condition"]) ??
          "good",
        createdAt: item.createdAt ?? new Date().toISOString(),
        updatedAt: item.updatedAt ?? item.createdAt ?? new Date().toISOString(),
      })),
      total: backend.total ?? 0,
      page: backend.page ?? 1,
      totalPages: backend.totalPages ?? 1,
      limit: backend.limit,
    };
  },

  // Listings for current authenticated user (all statuses)
  getMine: async (params?: ProductsParams): Promise<ProductsResponse> => {
    const responseData = await api.get<
      RawProductsPayload | { data?: RawProductsPayload }
    >(API_ENDPOINTS.PRODUCTS.MY ?? "/products/my", { params });

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
              .map((img) => (typeof img === "string" ? img : img?.url ?? ""))
              .filter((image): image is string => Boolean(image))
          : [],
        condition: (item.condition?.replace("_", "-") as Product["condition"]) ??
          "good",
        createdAt: item.createdAt ?? new Date().toISOString(),
        updatedAt: item.updatedAt ?? item.createdAt ?? new Date().toISOString(),
      })),
      total: backend.total ?? 0,
      page: backend.page ?? 1,
      totalPages: backend.totalPages ?? 1,
      limit: backend.limit,
    };
  },

  getById: async (id: string): Promise<Product> => {
    const raw = await api.get<any>(API_ENDPOINTS.PRODUCTS.BY_ID(id));
    const data = raw && typeof raw === "object" && "data" in raw ? (raw as any).data : raw;
    const item: RawProduct = data as RawProduct;
    return {
      id: String(item.id ?? id),
      title: item.title ?? item.name ?? "",
      price: item.price ?? 0,
      sellerId: String(item.sellerId ?? ""),
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
            .map((img) => (typeof img === "string" ? img : img?.url ?? ""))
            .filter((image): image is string => Boolean(image))
        : [],
      condition: (item.condition?.replace("_", "-") as Product["condition"]) ??
        "good",
      createdAt: item.createdAt ?? new Date().toISOString(),
      updatedAt: item.updatedAt ?? item.createdAt ?? new Date().toISOString(),
    };
  },

  // Draft creation (minimal fields, optional images/attributes)
  create: async (payload: Partial<Product> | CreateProductPayload): Promise<Product> => {
    const toBackendCondition = (val?: Product["condition"]): string | undefined =>
      val ? val.replace("-", "_") : undefined;

    const form = new FormData();
    const anyPayload = payload as any;
    if (anyPayload.title) form.append("title", String(anyPayload.title));
    if (anyPayload.categoryId)
      form.append("categoryId", String(anyPayload.categoryId));
    if (anyPayload.price !== undefined)
      form.append("price", String(anyPayload.price));
    if (anyPayload.isNegotiable !== undefined)
      form.append("isNegotiable", String(Boolean(anyPayload.isNegotiable)));
    if (anyPayload.condition)
      form.append("condition", toBackendCondition(anyPayload.condition)!);
    if (Array.isArray(anyPayload.images)) {
      anyPayload.images.forEach((file: File) => form.append("images", file));
    }
    if (Array.isArray(anyPayload.attributes)) {
      // Send as JSON string for robust parsing on backend
      form.append("attributes", JSON.stringify(anyPayload.attributes));
    }

    try {
      return await api.post<Product>(API_ENDPOINTS.PRODUCTS.CREATE, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (e: any) {
      const status = e?.response?.status;
      if (status === 404 || status === 405) {
        // Fallback to generic /products create if draft route is unavailable on env
        return api.post<Product>(API_ENDPOINTS.PRODUCTS.LIST, form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      throw e;
    }
  },

  // Pending creation (requires attributes and typically images)
  createPending: async (payload: CreateProductPayload): Promise<Product> => {
    const toBackendCondition = (val: Product["condition"]): string =>
      val.replace("-", "_");

    const form = new FormData();
    form.append("title", String(payload.title));
    form.append("categoryId", String(payload.categoryId));
    form.append("condition", toBackendCondition(payload.condition));
    form.append("price", String(payload.price));
    if (payload.isNegotiable !== undefined)
      form.append("isNegotiable", String(Boolean(payload.isNegotiable)));
    if (Array.isArray(payload.images)) {
      payload.images.forEach((file) => form.append("images", file));
    }
    if (Array.isArray(payload.attributes)) {
      form.append("attributes", JSON.stringify(payload.attributes));
    }

    try {
      return await api.post<Product>(
        API_ENDPOINTS.PRODUCTS.CREATE_PENDING,
        form,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
    } catch (e1: any) {
      const status1 = e1?.response?.status;
      if (status1 !== 404 && status1 !== 405) throw e1;
      // Fallback 1: try draft
      try {
        return await api.post<Product>(API_ENDPOINTS.PRODUCTS.CREATE, form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } catch (e2: any) {
        const status2 = e2?.response?.status;
        if (status2 !== 404 && status2 !== 405) throw e2;
        // Fallback 2: try generic /products
        return await api.post<Product>(API_ENDPOINTS.PRODUCTS.LIST, form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
    }
  },

  update: (id: string, productData: Partial<Product>): Promise<Product> =>
    api.put<Product>(API_ENDPOINTS.PRODUCTS.UPDATE(id), productData),

  delete: (id: string): Promise<void> =>
    api.delete<void>(API_ENDPOINTS.PRODUCTS.DELETE(id)),

  search: (query: string): Promise<ProductsResponse> =>
    api.get<ProductsResponse>(API_ENDPOINTS.PRODUCTS.SEARCH, {
      params: { q: query },
    }),

  getCategories: async (): Promise<Category[]> => {
    const raw = await api.get<
      Category[] | { data?: unknown } | { categories?: unknown }
    >(API_ENDPOINTS.PRODUCTS.CATEGORIES);

    const extract = (value: unknown): unknown[] => {
      if (Array.isArray(value)) return value;
      if (
        value &&
        typeof value === "object" &&
        Array.isArray((value as any).data)
      )
        return (value as any).data as unknown[];
      if (
        value &&
        typeof value === "object" &&
        Array.isArray((value as any).categories)
      )
        return (value as any).categories as unknown[];
      return [];
    };

    const items = extract(raw);
    const now = new Date().toISOString();
    return items.map((item: any) => ({
      id: String(item?.id ?? ""),
      name: String(item?.name ?? ""),
      icon: {
        id: String(item?.icon?.id ?? ""),
        url: String(item?.icon?.url ?? ""),
        fileName: String(item?.icon?.fileName ?? ""),
        type: String(item?.icon?.type ?? "category_icon"),
        createdAt: String(item?.icon?.createdAt ?? now),
      },
      isActive: Boolean(item?.isActive ?? true),
      createdAt: String(item?.createdAt ?? now),
      updatedAt: String(item?.updatedAt ?? item?.createdAt ?? now),
    }));
  },

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

// Create pending product (publish flow)
export const useCreatePendingProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productService.createPending,
    onSuccess: () => {
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
