import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/lib/api";
import { setToken, removeToken } from "@/lib/storage";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

export const AUTH_KEYS = {
  me: ["auth", "me"] as const,
};

export const useAuth = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Get current user
  const { data: user, isLoading } = useQuery({
    queryKey: AUTH_KEYS.me,
    queryFn: authApi.getMe,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setToken(data.token);
      queryClient.setQueryData(AUTH_KEYS.me, data.user);
      navigate(ROUTES.PROFILE);
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      setToken(data.token);
      queryClient.setQueryData(AUTH_KEYS.me, data.user);
      navigate(ROUTES.PROFILE);
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
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
