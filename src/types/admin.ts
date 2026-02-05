// Admin dashboard types

export interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  userGrowth: number;
  productGrowth: number;
  orderGrowth: number;
  revenueGrowth: number;
}

export interface RevenueData {
  date: string;
  revenue: number;
  orders: number;
}

export interface CategoryData {
  name: string;
  value: number;
  percentage: number;
}

export interface UserActivity {
  date: string;
  newUsers: number;
  activeUsers: number;
}

export interface RecentUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  joinedAt: string;
  avatar?: string;
}

export interface RecentProduct {
  id: string;
  name: string;
  price: number;
  category: string;
  condition: string;
  seller: string;
  status: string;
  createdAt: string;
  image?: string;
}

export interface RecentOrder {
  id: string;
  customer: string;
  product: string;
  amount: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  createdAt: string;
}

export interface AdminDashboardData {
  stats: DashboardStats;
  revenueChart: RevenueData[];
  categoryChart: CategoryData[];
  userActivityChart: UserActivity[];
  recentUsers: RecentUser[];
  recentProducts: RecentProduct[];
  recentOrders: RecentOrder[];
}
