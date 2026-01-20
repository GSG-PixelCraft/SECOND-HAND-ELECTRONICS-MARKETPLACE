import { api } from ".";
import { API_ENDPOINTS } from "@/constants/api-endpoints";

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

export const authApi = {
  login: (credentials: LoginCredentials) =>
    api.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials),

  register: (userData: RegisterData) =>
    api.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, userData),

  logout: () => api.post(API_ENDPOINTS.AUTH.LOGOUT),

  getMe: () => api.get<User>(API_ENDPOINTS.AUTH.ME),

  refreshToken: () => api.post<{ token: string }>(API_ENDPOINTS.AUTH.REFRESH),
};
