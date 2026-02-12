// User Management types

export type UserStatus = "active" | "suspended" | "banned";

export type ModerationType = "warn" | "suspend" | "ban";

export interface UserVerificationStatus {
  phoneVerified: boolean;
  identityVerified: boolean;
  emailVerified: boolean;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  joinedDate: string;
  status: UserStatus;
  avatar?: string;
  verificationStatus: UserVerificationStatus;
  role: "user" | "admin";
}

export interface UserDetailInfo extends AdminUser {
  location: string;
  avgResponseTime: string;
  memberSince: string;
  chatAccess: boolean;
  listingsCount: number;
  activeListingsCount: number;
  pendingListingsCount: number;
  rejectedListingsCount: number;
  soldListingsCount: number;
  archivedListingsCount: number;
  reportedListingsCount: number;
}

export interface UserFilterParams {
  search?: string;
  status?: UserStatus | "all" | "verified";
  datePreset?: "today" | "yesterday" | "last7" | "last30" | "custom" | "all";
  startDate?: string;
  endDate?: string;
  dateRange?: "7" | "30" | "90" | "all";
  page?: number;
  limit?: number;
}

export interface PaginatedUsersResponse {
  users: AdminUser[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  stats: {
    total: number;
    verified: number;
    active: number;
    suspended: number;
    banned: number;
  };
}

export interface UserListing {
  id: string;
  title: string;
  category: string;
  submissionDate: string;
  status: "active" | "pending" | "rejected" | "sold" | "archived" | "reported";
  image?: string;
}

export interface PaginatedUserListingsResponse {
  listings: UserListing[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface WarnUserPayload {
  reason: string;
}

export interface SuspendUserPayload {
  reason: string;
  duration?: number; // in days
}

export interface BanUserPayload {
  reason: string;
}

export interface UpdateChatAccessPayload {
  chatAccess: boolean;
}
