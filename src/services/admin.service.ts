import { useQuery } from "@tanstack/react-query";
import type {
  AdminDashboardData,
  DashboardStats,
  RevenueData,
  CategoryData,
  UserActivity,
  RecentUser,
  RecentProduct,
  RecentOrder,
} from "@/types/admin";
import apiClient from "./client";
import { API_ENDPOINTS } from "@/constants/api-endpoints";

// ============================================================================
// Mock Data for Development (Remove when backend is ready)
// ============================================================================

const mockStats: DashboardStats = {
  totalUsers: 1284,
  totalProducts: 3421,
  totalOrders: 856,
  totalRevenue: 127450,
  userGrowth: 12.5,
  productGrowth: 8.3,
  orderGrowth: 15.7,
  revenueGrowth: 23.4,
};

const mockRevenueChart: RevenueData[] = [
  { date: "2024-01-01", revenue: 12000, orders: 45 },
  { date: "2024-01-02", revenue: 15000, orders: 52 },
  { date: "2024-01-03", revenue: 13500, orders: 48 },
  { date: "2024-01-04", revenue: 18000, orders: 65 },
  { date: "2024-01-05", revenue: 16500, orders: 58 },
  { date: "2024-01-06", revenue: 21000, orders: 72 },
  { date: "2024-01-07", revenue: 19000, orders: 68 },
];

const mockCategoryChart: CategoryData[] = [
  { name: "Smartphones", value: 450, percentage: 35 },
  { name: "Laptops", value: 320, percentage: 25 },
  { name: "Tablets", value: 256, percentage: 20 },
  { name: "Accessories", value: 192, percentage: 15 },
  { name: "Others", value: 64, percentage: 5 },
];

const mockUserActivityChart: UserActivity[] = [
  { date: "2024-01-01", newUsers: 12, activeUsers: 145 },
  { date: "2024-01-02", newUsers: 18, activeUsers: 162 },
  { date: "2024-01-03", newUsers: 15, activeUsers: 158 },
  { date: "2024-01-04", newUsers: 22, activeUsers: 178 },
  { date: "2024-01-05", newUsers: 19, activeUsers: 165 },
  { date: "2024-01-06", newUsers: 25, activeUsers: 192 },
  { date: "2024-01-07", newUsers: 21, activeUsers: 185 },
];

const mockRecentUsers: RecentUser[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "buyer",
    status: "active",
    joinedAt: "2024-01-07T10:30:00Z",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "seller",
    status: "active",
    joinedAt: "2024-01-07T09:15:00Z",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    role: "buyer",
    status: "pending",
    joinedAt: "2024-01-07T08:45:00Z",
  },
  {
    id: "4",
    name: "Alice Brown",
    email: "alice.brown@example.com",
    role: "seller",
    status: "active",
    joinedAt: "2024-01-06T16:20:00Z",
  },
  {
    id: "5",
    name: "Charlie Wilson",
    email: "charlie.wilson@example.com",
    role: "buyer",
    status: "active",
    joinedAt: "2024-01-06T14:10:00Z",
  },
];

const mockRecentProducts: RecentProduct[] = [
  {
    id: "1",
    name: "iPhone 13 Pro",
    price: 899,
    category: "Smartphones",
    condition: "like-new",
    seller: "Jane Smith",
    status: "active",
    createdAt: "2024-01-07T11:00:00Z",
  },
  {
    id: "2",
    name: "MacBook Pro 14",
    price: 1799,
    category: "Laptops",
    condition: "good",
    seller: "Alice Brown",
    status: "active",
    createdAt: "2024-01-07T10:30:00Z",
  },
  {
    id: "3",
    name: "iPad Air",
    price: 499,
    category: "Tablets",
    condition: "new",
    seller: "Jane Smith",
    status: "pending",
    createdAt: "2024-01-07T09:45:00Z",
  },
  {
    id: "4",
    name: "AirPods Pro",
    price: 199,
    category: "Accessories",
    condition: "like-new",
    seller: "Bob Johnson",
    status: "active",
    createdAt: "2024-01-07T09:00:00Z",
  },
  {
    id: "5",
    name: "Samsung Galaxy S21",
    price: 699,
    category: "Smartphones",
    condition: "good",
    seller: "Alice Brown",
    status: "active",
    createdAt: "2024-01-06T18:30:00Z",
  },
];

const mockRecentOrders: RecentOrder[] = [
  {
    id: "1",
    customer: "John Doe",
    product: "iPhone 13 Pro",
    amount: 899,
    status: "completed",
    createdAt: "2024-01-07T12:00:00Z",
  },
  {
    id: "2",
    customer: "Charlie Wilson",
    product: "MacBook Pro 14",
    amount: 1799,
    status: "processing",
    createdAt: "2024-01-07T11:30:00Z",
  },
  {
    id: "3",
    customer: "John Doe",
    product: "AirPods Pro",
    amount: 199,
    status: "completed",
    createdAt: "2024-01-07T10:45:00Z",
  },
  {
    id: "4",
    customer: "Bob Johnson",
    product: "iPad Air",
    amount: 499,
    status: "pending",
    createdAt: "2024-01-07T10:00:00Z",
  },
  {
    id: "5",
    customer: "Jane Smith",
    product: "Samsung Galaxy S21",
    amount: 699,
    status: "processing",
    createdAt: "2024-01-07T09:15:00Z",
  },
];

// ============================================================================
// API Functions
// ============================================================================

export const adminService = {
  getDashboard: async (): Promise<DashboardStats> => {
    try {
      const response = await apiClient.get<DashboardStats>(
        API_ENDPOINTS.ADMIN.DASHBOARD,
      );

      return response.data;
    } catch (error) {
      // Temporary fallback until backend API is ready
      await new Promise((resolve) => setTimeout(resolve, 500));
      return mockStats;
    }
  },

  getStats: async (): Promise<DashboardStats> => {
    // TODO: Replace with actual API call
    // return api.get<DashboardStats>(API_ENDPOINTS.ADMIN.STATS);
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockStats;
  },

  getRevenueChart: async (): Promise<RevenueData[]> => {
    // TODO: Replace with actual API call
    // return api.get<RevenueData[]>(API_ENDPOINTS.ADMIN.REVENUE_CHART);
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockRevenueChart;
  },

  getCategoryChart: async (): Promise<CategoryData[]> => {
    // TODO: Replace with actual API call
    // return api.get<CategoryData[]>(API_ENDPOINTS.ADMIN.CATEGORY_CHART);
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockCategoryChart;
  },

  getUserActivityChart: async (): Promise<UserActivity[]> => {
    // TODO: Replace with actual API call
    // return api.get<UserActivity[]>(API_ENDPOINTS.ADMIN.USER_ACTIVITY_CHART);
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockUserActivityChart;
  },

  getRecentUsers: async (): Promise<RecentUser[]> => {
    // TODO: Replace with actual API call
    // return api.get<RecentUser[]>(API_ENDPOINTS.ADMIN.RECENT_USERS);
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockRecentUsers;
  },

  getRecentProducts: async (): Promise<RecentProduct[]> => {
    // TODO: Replace with actual API call
    // return api.get<RecentProduct[]>(API_ENDPOINTS.ADMIN.RECENT_PRODUCTS);
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockRecentProducts;
  },

  getRecentOrders: async (): Promise<RecentOrder[]> => {
    // TODO: Replace with actual API call
    // return api.get<RecentOrder[]>(API_ENDPOINTS.ADMIN.RECENT_ORDERS);
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockRecentOrders;
  },
};

// ============================================================================
// Query Keys
// ============================================================================

export const ADMIN_KEYS = {
  all: ["admin"] as const,
  dashboard: () => [...ADMIN_KEYS.all, "dashboard"] as const,
  stats: () => [...ADMIN_KEYS.all, "stats"] as const,
  revenueChart: () => [...ADMIN_KEYS.all, "revenue-chart"] as const,
  categoryChart: () => [...ADMIN_KEYS.all, "category-chart"] as const,
  userActivityChart: () => [...ADMIN_KEYS.all, "user-activity-chart"] as const,
  recentUsers: () => [...ADMIN_KEYS.all, "recent-users"] as const,
  recentProducts: () => [...ADMIN_KEYS.all, "recent-products"] as const,
  recentOrders: () => [...ADMIN_KEYS.all, "recent-orders"] as const,
};

// ============================================================================
// React Query Hooks
// ============================================================================

export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ADMIN_KEYS.dashboard(),
    queryFn: adminService.getDashboard,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAdminStats = () => {
  return useQuery({
    queryKey: ADMIN_KEYS.stats(),
    queryFn: adminService.getStats,
    staleTime: 5 * 60 * 1000,
  });
};

export const useRevenueChart = () => {
  return useQuery({
    queryKey: ADMIN_KEYS.revenueChart(),
    queryFn: adminService.getRevenueChart,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCategoryChart = () => {
  return useQuery({
    queryKey: ADMIN_KEYS.categoryChart(),
    queryFn: adminService.getCategoryChart,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUserActivityChart = () => {
  return useQuery({
    queryKey: ADMIN_KEYS.userActivityChart(),
    queryFn: adminService.getUserActivityChart,
    staleTime: 5 * 60 * 1000,
  });
};

export const useRecentUsers = () => {
  return useQuery({
    queryKey: ADMIN_KEYS.recentUsers(),
    queryFn: adminService.getRecentUsers,
    staleTime: 2 * 60 * 1000,
  });
};

export const useRecentProducts = () => {
  return useQuery({
    queryKey: ADMIN_KEYS.recentProducts(),
    queryFn: adminService.getRecentProducts,
    staleTime: 2 * 60 * 1000,
  });
};

export const useRecentOrders = () => {
  return useQuery({
    queryKey: ADMIN_KEYS.recentOrders(),
    queryFn: adminService.getRecentOrders,
    staleTime: 2 * 60 * 1000,
  });
};
