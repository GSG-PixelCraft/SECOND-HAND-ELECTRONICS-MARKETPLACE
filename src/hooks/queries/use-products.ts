import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productsApi, ProductsParams, Product } from "@/lib/api";

export const PRODUCTS_KEYS = {
  all: ["products"] as const,
  lists: () => [...PRODUCTS_KEYS.all, "list"] as const,
  list: (params?: ProductsParams) =>
    [...PRODUCTS_KEYS.lists(), params] as const,
  details: () => [...PRODUCTS_KEYS.all, "detail"] as const,
  detail: (id: string) => [...PRODUCTS_KEYS.details(), id] as const,
  categories: ["products", "categories"] as const,
};

// Get all products with filters
export const useProducts = (params?: ProductsParams) => {
  return useQuery({
    queryKey: PRODUCTS_KEYS.list(params),
    queryFn: () => productsApi.getAll(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get single product
export const useProduct = (id: string) => {
  return useQuery({
    queryKey: PRODUCTS_KEYS.detail(id),
    queryFn: () => productsApi.getById(id),
    enabled: !!id,
  });
};

// Get categories
export const useCategories = () => {
  return useQuery({
    queryKey: PRODUCTS_KEYS.categories,
    queryFn: productsApi.getCategories,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Create product
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productsApi.create,
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
      productsApi.update(id, data),
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
    mutationFn: productsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_KEYS.lists() });
    },
  });
};
