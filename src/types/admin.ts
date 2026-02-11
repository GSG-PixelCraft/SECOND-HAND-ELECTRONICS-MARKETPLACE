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

// Listings Management types

export type ListingStatus =
  | "pending"
  | "active"
  | "rejected"
  | "sold"
  | "hidden"
  | "removed";

export type HideReason =
  | "inappropriate_content"
  | "spam"
  | "duplicate"
  | "policy_violation"
  | "other";

export type RejectionReason =
  | "incomplete_information"
  | "poor_quality_images"
  | "inappropriate_content"
  | "prohibited_item"
  | "pricing_issue"
  | "other";

export interface AdminListing extends RecentProduct {
  description: string;
  images: string[];
  sellerId: string;
  sellerName: string;
  sellerEmail: string;
  sellerAvatar?: string;
  views: number;
  favorites: number;
  rejectionReason?: RejectionReason;
  rejectionComment?: string;
  hideReason?: HideReason;
  hideComment?: string;
  hiddenAt?: string;
  hiddenBy?: string;
  rejectedAt?: string;
  rejectedBy?: string;
  approvedAt?: string;
  approvedBy?: string;
  soldAt?: string;
  soldTo?: string;
  removedAt?: string;
  removedBy?: string;
  removalReason?: string;
  removalComment?: string;
  updatedAt: string;
}

export interface ListingFilterParams {
  search?: string;
  status?: ListingStatus | "all";
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "updatedAt" | "price" | "name";
  sortOrder?: "asc" | "desc";
}

export interface PaginatedListingsResponse {
  items: AdminListing[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

// Verification Management types

export type VerificationDocumentType =
  | "National ID"
  | "Passport"
  | "Driver License";

export type AdminVerificationStatus = "pending" | "approved" | "rejected";

export interface VerificationSubmission {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  documentType: VerificationDocumentType;
  submittedDate: string;
  status: AdminVerificationStatus;
  frontImage: string;
  backImage?: string;
  selfieImage?: string;
  rejectionReasons?: string[];
  additionalNotes?: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface VerificationFilterParams {
  status?: AdminVerificationStatus | "all";
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: "submittedDate" | "userName";
  sortOrder?: "asc" | "desc";
}

export interface PaginatedVerificationsResponse {
  items: VerificationSubmission[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
  statusCounts: {
    all: number;
    pending: number;
    approved: number;
    rejected: number;
  };
}

export interface RejectVerificationData {
  verificationId: string;
  reasons: string[];
  additionalNotes?: string;
}

export interface HideListingData {
  listingId: string;
  reason: HideReason;
  comment?: string;
}

export interface RejectListingData {
  listingId: string;
  reason: RejectionReason;
  comment: string;
}

export interface BulkActionPayload {
  listingIds: string[];
  action: "approve" | "reject" | "delete";
  reason?: RejectionReason;
  comment?: string;
}
