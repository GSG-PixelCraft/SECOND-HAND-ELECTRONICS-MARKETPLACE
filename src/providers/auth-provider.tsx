import type { ReactNode } from "react";
import { createContext, useContext, useMemo } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import type { User } from "@/types";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { user, token, setUser, setToken, logout } = useAuthStore();
  const isAuthenticated = Boolean(user && token);

  const value = useMemo(
    () => ({ user, token, isAuthenticated, setUser, setToken, logout }),
    [user, token, isAuthenticated, setUser, setToken, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
};
