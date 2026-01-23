import { create } from "zustand";

import type { User } from "@/services/auth.service";

interface AuthState {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  setUser: (user: User | null) => {
    set({ user });
  },
  setToken: (token: string | null) => {
    set({ token });
  },
  logout: () => {
    set({ user: null, token: null });
  },
}));
