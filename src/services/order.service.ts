import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "./client";

// ============================================================================
// Types
// ============================================================================

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  shippingAddress: ShippingAddress;
}

// ============================================================================
// API Functions
// ============================================================================

export const orderService = {
  getOrders: (userId?: string): Promise<Order[]> =>
    api.get<Order[]>(userId ? `/orders?userId=${userId}` : "/orders"),

  getOrder: (id: string): Promise<Order> => api.get<Order>(`/orders/${id}`),

  createOrder: (data: {
    items: OrderItem[];
    shippingAddress: ShippingAddress;
  }): Promise<Order> => api.post<Order>("/orders", data),

  updateOrderStatus: (id: string, status: Order["status"]): Promise<Order> =>
    api.patch<Order>(`/orders/${id}/status`, { status }),
};

// ============================================================================
// Query Keys
// ============================================================================

export const ORDER_KEYS = {
  all: ["orders"] as const,
  lists: () => [...ORDER_KEYS.all, "list"] as const,
  list: (userId?: string) => [...ORDER_KEYS.lists(), userId] as const,
  details: () => [...ORDER_KEYS.all, "detail"] as const,
  detail: (id: string) => [...ORDER_KEYS.details(), id] as const,
};

// ============================================================================
// React Query Hooks
// ============================================================================

export const useOrders = (userId?: string) => {
  return useQuery({
    queryKey: ORDER_KEYS.list(userId),
    queryFn: () => orderService.getOrders(userId),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useOrder = (id: string) => {
  return useQuery({
    queryKey: ORDER_KEYS.detail(id),
    queryFn: () => orderService.getOrder(id),
    enabled: !!id,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: orderService.createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDER_KEYS.lists() });
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Order["status"] }) =>
      orderService.updateOrderStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ORDER_KEYS.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: ORDER_KEYS.lists() });
    },
  });
};
