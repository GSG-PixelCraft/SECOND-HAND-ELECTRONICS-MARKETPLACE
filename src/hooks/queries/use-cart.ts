import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi } from '@/lib/api';

export const CART_KEYS = {
  cart: ['cart'] as const,
};

export const useCart = () => {
  const queryClient = useQueryClient();

  const { data: cart, isLoading } = useQuery({
    queryKey: CART_KEYS.cart,
    queryFn: cartApi.get,
  });

  const addItemMutation = useMutation({
    mutationFn: cartApi.addItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_KEYS.cart });
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: unknown }) =>
      cartApi.updateItem(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_KEYS.cart });
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: cartApi.removeItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_KEYS.cart });
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: cartApi.clear,
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