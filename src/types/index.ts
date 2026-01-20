// Global TypeScript types
export interface User {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin" | "seller";
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  condition: "new" | "like-new" | "good" | "fair";
  images: string[];
  sellerId: string;
  createdAt: string;
}

export interface Order {
  id: string;
  userId: string;
  products: CartItem[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered";
  createdAt: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
}
