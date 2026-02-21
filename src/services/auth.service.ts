import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { api } from "./client";
import { removeToken, setToken, removeUser, setUser } from "@/lib/storage";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import { ROUTES } from "@/constants/routes";
import type { User } from "@/types";

// ============================================================================
// Types
// ============================================================================

export interface LoginCredentials {
  email?: string;
  phoneNumber?: string;
  password: string;
}

export interface RegisterData {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  path: string;
  timestamp: string;
  message: string;
  data: T;
}

export type VerificationOtpType = "email_verification" | "phone_verification";

export interface VerificationCodeRequest {
  email?: string;
  phoneNumber?: string;
}

export interface VerifyCodeRequest {
  code: string;
  type: "password_reset" | VerificationOtpType;
  email?: string;
  phoneNumber?: string;
}

export interface VerifyCodeResponse {
  message: string;
  email?: string;
  phoneNumber?: string;
  token?: string;
}

export interface ResetPasswordRequest {
  newPassword: string;
  confirmPassword: string;
}

// ============================================================================
// API Functions
// ============================================================================

export const authService = {
  login: (credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> =>
    api.post<ApiResponse<AuthResponse>>(API_ENDPOINTS.AUTH.LOGIN, credentials),

  register: (userData: RegisterData): Promise<ApiResponse<AuthResponse>> =>
    api.post<ApiResponse<AuthResponse>>(API_ENDPOINTS.AUTH.REGISTER, userData),

  logout: (): Promise<ApiResponse<string>> =>
    api.post<ApiResponse<string>>(API_ENDPOINTS.AUTH.LOGOUT),

  getMe: (): Promise<ApiResponse<User>> =>
    api.get<ApiResponse<User>>(API_ENDPOINTS.AUTH.ME),

  refreshToken: (): Promise<ApiResponse<{ token: string }>> =>
    api.post<ApiResponse<{ token: string }>>(API_ENDPOINTS.AUTH.REFRESH),

  getProfile: (): Promise<ApiResponse<User>> =>
    api.get<ApiResponse<User>>("/auth/profile"),

  updateProfile: (data: Partial<User>): Promise<ApiResponse<User>> =>
    api.put<ApiResponse<User>>("/auth/profile", data),

  sendVerificationCode: (
    payload: VerificationCodeRequest,
  ): Promise<ApiResponse<string>> =>
    api.post<ApiResponse<string>>(API_ENDPOINTS.AUTH.VERIFICATION, payload),

  verifyCode: (
    payload: VerifyCodeRequest,
  ): Promise<ApiResponse<VerifyCodeResponse>> =>
    api.post<ApiResponse<VerifyCodeResponse>>(
      API_ENDPOINTS.AUTH.VERIFY_CODE,
      payload,
    ),

  resetPassword: (
    payload: ResetPasswordRequest,
    token?: string | null,
  ): Promise<ApiResponse<{ message: string }>> =>
    api.post<ApiResponse<{ message: string }>>(
      API_ENDPOINTS.AUTH.RESET_PASSWORD,
      payload,
      token
        ? {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        : undefined,
    ),
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
    select: (response) => response.data,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      setToken(data.data.token);
      setUser(data.data.user);
      queryClient.setQueryData(AUTH_KEYS.me, data.data.user);
      navigate(ROUTES.PROFILE);
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      setToken(data.data.token);
      setUser(data.data.user);
      queryClient.setQueryData(AUTH_KEYS.me, data.data.user);
      navigate(ROUTES.PROFILE);
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      removeToken();
      removeUser();
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
