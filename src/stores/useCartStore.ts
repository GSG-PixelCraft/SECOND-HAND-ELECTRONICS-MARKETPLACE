import { create } from "zustand";

import type { CartItem } from "../types";

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: CartItem["productId"]) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  addItem: (item: CartItem) => {
    set((state) => ({ items: [...state.items, item] }));
  },
  removeItem: (productId: CartItem["productId"]) => {
    set((state) => ({
      items: state.items.filter((item) => item.productId !== productId),
    }));
  },
  clearCart: () => {
    set({ items: [] });
  },
}));
