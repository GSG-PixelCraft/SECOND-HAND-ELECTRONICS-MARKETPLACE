import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { api } from "./client";
import { setToken, removeToken } from "@/lib/storage";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import { ROUTES } from "@/constants/routes";

// ============================================================================
// Types
// ============================================================================

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// ============================================================================
// API Functions
// ============================================================================

export const authService = {
  login: (credentials: LoginCredentials): Promise<AuthResponse> =>
    api.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials),

  register: (userData: RegisterData): Promise<AuthResponse> =>
    api.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, userData),

  logout: (): Promise<void> => api.post(API_ENDPOINTS.AUTH.LOGOUT),

  getMe: (): Promise<User> => api.get<User>(API_ENDPOINTS.AUTH.ME),

  refreshToken: (): Promise<{ token: string }> =>
    api.post<{ token: string }>(API_ENDPOINTS.AUTH.REFRESH),

  getProfile: (): Promise<User> => api.get<User>("/auth/profile"),

  updateProfile: (data: Partial<User>): Promise<User> =>
    api.put<User>("/auth/profile", data),
};

// ============================================================================
// Query Keys
// ============================================================================

export const AUTH_KEYS = {
  me: ["auth", "me"] as const,
};

// ============================================================================
// React Query Hooks
// ============================================================================

export const useAuth = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Get current user
  const { data: user, isLoading } = useQuery({
    queryKey: AUTH_KEYS.me,
    queryFn: authService.getMe,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      setToken(data.token);
      queryClient.setQueryData(AUTH_KEYS.me, data.user);
      navigate(ROUTES.PROFILE);
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      setToken(data.token);
      queryClient.setQueryData(AUTH_KEYS.me, data.user);
      navigate(ROUTES.PROFILE);
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      removeToken();
      queryClient.clear();
      navigate(ROUTES.SIGN_IN);
    },
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  };
};
