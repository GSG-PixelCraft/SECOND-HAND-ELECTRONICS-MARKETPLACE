// Order-related types
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
