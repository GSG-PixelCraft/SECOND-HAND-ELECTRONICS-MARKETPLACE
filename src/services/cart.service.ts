import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "./client";

// ============================================================================
// Types
// ============================================================================

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

// ============================================================================
// API Functions
// ============================================================================

export const cartService = {
  get: (): Promise<CartItem[]> => api.get<CartItem[]>("/cart"),

  addItem: (item: CartItem): Promise<CartItem[]> =>
    api.post<CartItem[]>("/cart", item),

  updateItem: (
    productId: string,
    updates: Partial<CartItem>,
  ): Promise<CartItem[]> =>
    api.patch<CartItem[]>(`/cart/${productId}`, updates),

  removeItem: (productId: string): Promise<CartItem[]> =>
    api.delete<CartItem[]>(`/cart/${productId}`),

  clear: (): Promise<void> => api.delete<void>("/cart"),
};

// ============================================================================
// Query Keys
// ============================================================================

export const CART_KEYS = {
  cart: ["cart"] as const,
};

// ============================================================================
// React Query Hooks
// ============================================================================

export const useCart = () => {
  const queryClient = useQueryClient();

  const { data: cart, isLoading } = useQuery({
    queryKey: CART_KEYS.cart,
    queryFn: cartService.get,
  });

  const addItemMutation = useMutation({
    mutationFn: cartService.addItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_KEYS.cart });
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<CartItem> }) =>
      cartService.updateItem(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_KEYS.cart });
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: cartService.removeItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_KEYS.cart });
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: cartService.clear,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_KEYS.cart });
    },
  });

  return {
    cart,
    isLoading,
    addItem: addItemMutation.mutate,
    updateItem: updateItemMutation.mutate,
    removeItem: removeItemMutation.mutate,
    clearCart: clearCartMutation.mutate,
    isAddingItem: addItemMutation.isPending,
  };
};
