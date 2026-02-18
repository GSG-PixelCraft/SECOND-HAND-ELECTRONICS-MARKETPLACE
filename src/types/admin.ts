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
  datePreset?: "today" | "yesterday" | "last7" | "last30" | "custom" | "all";
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

// Categories Management types

export type CategoryIconKey =
  | "phone"
  | "tablet"
  | "laptop"
  | "pc-parts"
  | "gaming"
  | "audio"
  | "smartwatch"
  | "camera"
  | "smart-home"
  | "tv-monitor";

export interface AdminCategory {
  id: string;
  name: string;
  iconKey: CategoryIconKey;
  attributesCount: number;
  isActive: boolean;
}

export type CategoryAttributeType =
  | "select_dropdown"
  | "text_input"
  | "number_input"
  | "checkboxes"
  | "toggle"
  | "date_picker"
  | "textarea";

export interface CategoryAttribute {
  id: string;
  name: string;
  type: CategoryAttributeType;
  isActive: boolean;
  options?: string[];
  toggleOption1?: string;
  toggleOption2?: string;
}

export interface AdminCategoryDetail extends AdminCategory {
  iconUrl?: string;
  categoryStatus: boolean;
  attributes: CategoryAttribute[];
}

export interface CreateCategoryPayload {
  name: string;
  iconUrl?: string;
  categoryStatus: boolean;
  attributes: CategoryAttribute[];
}

export type UpdateCategoryPayload = CreateCategoryPayload;

export interface CategoryFilterParams {
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedCategoriesResponse {
  items: AdminCategory[];
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
  datePreset?: "today" | "yesterday" | "last7" | "last30" | "custom" | "all";
  startDate?: string;
  endDate?: string;
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

// Reports Management types

export type ReportType = "listing" | "user" | "chat";

export type ReportStatus = "open" | "under-review" | "resolved" | "dismissed";

export type ReportReason =
  | "Scam"
  | "Suspicious behavior"
  | "Prohibited item"
  | "Inappropriate content"
  | "Harassment"
  | "Impersonation"
  | "Fake account"
  | "Suspicious activity"
  | "Selling prohibited items"
  | (string & {});

export interface ReportUserSummary {
  id: string;
  name: string;
  avatar?: string;
  isVerified?: boolean;
  isFlagged?: boolean;
  memberSince?: string;
  location?: string;
  lastSeen?: string;
  avgResponseTime?: string;
  prevReports?: number;
  totalSales?: number;
}

export interface ReportEvidence {
  id: string;
  label: string;
  url: string;
}

export interface ReportChatMessage {
  id: string;
  sender: ReportUserSummary;
  message: string;
  sentAt: string;
  time?: string;
  direction?: "incoming" | "outgoing";
}

export interface BaseReport {
  id: string;
  type: ReportType;
  reason: ReportReason;
  status: ReportStatus;
  submittedAt: string;
  reporter: ReportUserSummary;
  description?: string;
  evidence?: ReportEvidence[];
}

export interface ListingReport extends BaseReport {
  type: "listing";
  listing: {
    id: string;
    title: string;
    image?: string;
    seller: ReportUserSummary;
  };
}

export interface UserReport extends BaseReport {
  type: "user";
  reportedUser: ReportUserSummary;
}

export interface ChatReport extends BaseReport {
  type: "chat";
  reportedUser: ReportUserSummary;
  chatId: string;
  chatMessages?: ReportChatMessage[];
}

export type Report = ListingReport | UserReport | ChatReport;

export interface ReportFilterParams {
  search?: string;
  datePreset?: "today" | "yesterday" | "last7" | "last30" | "custom" | "all";
  startDate?: string;
  endDate?: string;
  dateRange?: "7" | "30" | "90" | "all";
  page?: number;
  limit?: number;
}

export interface PaginatedReportsResponse<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

export type RiskLevel = "High Risk" | "Medium Risk" | "Low Risk";

export type ReportReasonDetail = string;

export interface ReportMetric {
  label: string;
  value: string | number;
  valueTone?: "default" | "success" | "warning" | "danger" | "primary";
}

export interface TrustIndicator {
  label: string;
  status: "verified" | "unverified";
  date?: string;
}

export interface RiskIndicator {
  label: string;
  count: number;
}

export interface AccountHistoryItem {
  label: string;
  date: string;
  reason?: string;
  iconType: "report" | "warning" | "suspension" | "ban";
}

export interface UserReportDetails extends UserReport {
  riskLevel?: RiskLevel;
  reasonTagDetail?: ReportReasonDetail;
  metrics?: ReportMetric[];
  trustIndicators?: TrustIndicator[];
  riskIndicators?: RiskIndicator[];
  accountHistory?: AccountHistoryItem[];
}

export interface ChatReportDetails extends ChatReport {
  riskLevel?: RiskLevel;
  reasonTagDetail?: ReportReasonDetail;
  chatContext?: {
    itemTitle: string;
    itemImage?: string;
    timestamp: string;
  };
  conversationMetrics?: ReportMetric[];
  riskIndicators?: RiskIndicator[];
}

export interface ListingReportDetails extends ListingReport {
  riskLevel?: RiskLevel;
  reasonTagDetail?: ReportReasonDetail;
  reportedUser?: ReportUserSummary;
  listingDetails?: {
    price: string | number;
    currency?: string;
    negotiable?: boolean;
    status?: string;
    category?: string;
    condition?: string;
    listedAt?: string;
    description?: string;
  };
  metrics?: ReportMetric[];
  riskIndicators?: RiskIndicator[];
}

export type ReportDetail =
  | UserReportDetails
  | ChatReportDetails
  | ListingReportDetails;
