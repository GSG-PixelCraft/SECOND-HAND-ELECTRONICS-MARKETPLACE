// Admin Users Management Service

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  AdminUser,
  BanUserPayload,
  PaginatedUserListingsResponse,
  PaginatedUsersResponse,
  SuspendUserPayload,
  UpdateChatAccessPayload,
  UserDetailInfo,
  UserFilterParams,
  WarnUserPayload,
} from "@/types/user";

// ============================================================================
// Section 1: Types (Re-exported from types/user.ts)
// ============================================================================

export type {
  AdminUser,
  BanUserPayload,
  ModerationType,
  PaginatedUserListingsResponse,
  PaginatedUsersResponse,
  SuspendUserPayload,
  UpdateChatAccessPayload,
  UserDetailInfo,
  UserFilterParams,
  UserListing,
  UserStatus,
  UserVerificationStatus,
  WarnUserPayload,
} from "@/types/user";

// ============================================================================
// Section 2: Mock Data & API Functions
// ============================================================================

// Mock data generator
const generateMockUsers = (): AdminUser[] => {
  const names = [
    "Leen Omar",
    "Ahmad Khalil",
    "Mohammad Hassan",
    "Eleanor Vance",
    "Sara Nasser",
    "Omar Yousef",
    "Yasmeen Wehbe",
    "Yazan Abu Rmeileh",
    "Rawan Saleh",
    "Omar Abdullah",
    "Fatima Ali",
    "Khalid Mahmoud",
    "Nour Saeed",
    "Tariq Ibrahim",
    "Laila Youssef",
    "Hassan Zaki",
    "Dina Kamal",
    "Marwan Issa",
    "Reem Fares",
    "Amir Nabil",
  ];

  const statuses: AdminUser["status"][] = ["active", "suspended", "banned"];

  const users: AdminUser[] = [];

  for (let i = 0; i < names.length; i++) {
    const name = names[i];
    const email = "leenomar@gmail.com";
    const daysAgo = Math.floor(Math.random() * 365);
    const joinedDate = new Date(
      Date.now() - daysAgo * 24 * 60 * 60 * 1000,
    ).toISOString();
    const status = statuses[i % statuses.length];

    const user: AdminUser = {
      id: `#${1032 + i}`,
      name,
      email,
      phoneNumber: `+970 ${Math.floor(Math.random() * 900 + 500)} ${Math.floor(Math.random() * 900 + 100)} ${Math.floor(Math.random() * 900 + 100)}`,
      joinedDate,
      status,
      avatar: `https://i.pravatar.cc/150?img=${i + 1}`,
      verificationStatus: {
        phoneVerified: Math.random() > 0.3,
        identityVerified: Math.random() > 0.5,
        emailVerified: Math.random() > 0.2,
      },
      role: "user",
    };

    users.push(user);
  }

  return users;
};

// Mock user listings generator
const generateMockUserListings = (userId: string) => {
  const categories = ["Phone", "Laptop", "Audio", "Tablet", "Camera"];
  const statuses: Array<
    "active" | "pending" | "rejected" | "sold" | "archived" | "reported"
  > = ["active", "pending", "rejected", "sold", "archived", "reported"];

  const listings = [];
  const listingCount = Math.floor(Math.random() * 20) + 5;

  for (let i = 0; i < listingCount; i++) {
    listings.push({
      id: `listing-${userId}-${i}`,
      title: `${categories[i % categories.length]} ${i + 1}`,
      category: categories[i % categories.length],
      submissionDate: new Date(
        Date.now() - Math.floor(Math.random() * 60) * 24 * 60 * 60 * 1000,
      ).toISOString(),
      status: statuses[i % statuses.length],
      image: `https://picsum.photos/seed/${userId}-${i}/100/100`,
    });
  }

  return listings;
};

// In-memory mock data store
const mockUsers = generateMockUsers();

const addDays = (date: Date, days: number) =>
  new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() + days,
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
    date.getMilliseconds(),
  );

const parseLocalDate = (value?: string | null) => {
  if (!value) return null;
  const [yearText, monthText, dayText] = value.split("-");
  const year = Number.parseInt(yearText, 10);
  const month = Number.parseInt(monthText, 10);
  const day = Number.parseInt(dayText, 10);

  if (
    Number.isNaN(year) ||
    Number.isNaN(month) ||
    Number.isNaN(day) ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31
  ) {
    return null;
  }

  const parsed = new Date(year, month - 1, day);
  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) {
    return null;
  }

  return parsed;
};

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);

const endOfDay = (date: Date) =>
  new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    23,
    59,
    59,
    999,
  );

const resolveDateBounds = (params: {
  datePreset?: UserFilterParams["datePreset"];
  startDate?: string;
  endDate?: string;
  dateRange?: UserFilterParams["dateRange"];
}) => {
  const todayStart = startOfDay(new Date());

  if (params.datePreset === "all") {
    return { start: null as Date | null, end: null as Date | null };
  }

  if (params.datePreset === "today") {
    return { start: todayStart, end: endOfDay(todayStart) };
  }

  if (params.datePreset === "yesterday") {
    const yesterday = addDays(todayStart, -1);
    return { start: yesterday, end: endOfDay(yesterday) };
  }

  if (params.datePreset === "last7") {
    return { start: addDays(todayStart, -6), end: endOfDay(todayStart) };
  }

  if (params.datePreset === "last30") {
    return { start: addDays(todayStart, -29), end: endOfDay(todayStart) };
  }

  const parsedStart = parseLocalDate(params.startDate);
  const parsedEnd = parseLocalDate(params.endDate);

  if (params.datePreset === "custom" || parsedStart || parsedEnd) {
    if (
      parsedStart &&
      parsedEnd &&
      parsedStart.getTime() > parsedEnd.getTime()
    ) {
      return {
        start: startOfDay(parsedEnd),
        end: endOfDay(parsedStart),
      };
    }

    return {
      start: parsedStart ? startOfDay(parsedStart) : null,
      end: parsedEnd ? endOfDay(parsedEnd) : null,
    };
  }

  if (params.dateRange === "all") {
    return { start: null as Date | null, end: null as Date | null };
  }

  if (params.dateRange) {
    const days = Number.parseInt(params.dateRange, 10);
    if (!Number.isNaN(days) && days > 0) {
      return {
        start: addDays(todayStart, -(days - 1)),
        end: endOfDay(todayStart),
      };
    }
  }

  return { start: null as Date | null, end: null as Date | null };
};

const isWithinDateBounds = (
  dateValue: string,
  bounds: { start: Date | null; end: Date | null },
) => {
  if (!bounds.start && !bounds.end) return true;

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return false;

  if (bounds.start && date.getTime() < bounds.start.getTime()) return false;
  if (bounds.end && date.getTime() > bounds.end.getTime()) return false;

  return true;
};

// Helper function to filter and paginate users
const filterUsers = (params: UserFilterParams = {}): PaginatedUsersResponse => {
  let filtered = [...mockUsers];

  // Filter by status
  if (params.status && params.status !== "all") {
    if (params.status === "verified") {
      // Filter users who have completed verification
      filtered = filtered.filter(
        (user) =>
          user.verificationStatus.phoneVerified &&
          user.verificationStatus.identityVerified &&
          user.verificationStatus.emailVerified,
      );
    } else {
      filtered = filtered.filter((user) => user.status === params.status);
    }
  }

  // Filter by search (name, email, phone)
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filtered = filtered.filter(
      (user) =>
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.phoneNumber.toLowerCase().includes(searchLower),
    );
  }

  const dateBounds = resolveDateBounds({
    datePreset: params.datePreset,
    startDate: params.startDate,
    endDate: params.endDate,
    dateRange: params.dateRange,
  });
  filtered = filtered.filter((user) =>
    isWithinDateBounds(user.joinedDate, dateBounds),
  );

  // Calculate stats
  const stats = {
    total: mockUsers.length,
    verified: mockUsers.filter(
      (u) =>
        u.verificationStatus.phoneVerified &&
        u.verificationStatus.identityVerified &&
        u.verificationStatus.emailVerified,
    ).length,
    active: mockUsers.filter((u) => u.status === "active").length,
    suspended: mockUsers.filter((u) => u.status === "suspended").length,
    banned: mockUsers.filter((u) => u.status === "banned").length,
  };

  // Paginate
  const page = params.page || 1;
  const limit = params.limit || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedItems = filtered.slice(startIndex, endIndex);

  return {
    users: paginatedItems,
    pagination: {
      total: filtered.length,
      page,
      limit,
      totalPages: Math.ceil(filtered.length / limit),
    },
    stats,
  };
};

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// API Functions
export const adminUsersService = {
  // Get all users with filters and pagination
  getUsers: async (
    params?: UserFilterParams,
  ): Promise<PaginatedUsersResponse> => {
    await delay(500);
    return filterUsers(params);
  },

  // Get single user by ID
  getUserById: async (id: string): Promise<UserDetailInfo> => {
    await delay(300);
    const user = mockUsers.find((u) => u.id === id);
    if (!user) {
      throw new Error("User not found");
    }

    const mockListings = generateMockUserListings(id);
    const listingsByStatus = {
      active: mockListings.filter((l) => l.status === "active").length,
      pending: mockListings.filter((l) => l.status === "pending").length,
      rejected: mockListings.filter((l) => l.status === "rejected").length,
      sold: mockListings.filter((l) => l.status === "sold").length,
      archived: mockListings.filter((l) => l.status === "archived").length,
      reported: mockListings.filter((l) => l.status === "reported").length,
    };

    return {
      ...user,
      location: "Palestine",
      avgResponseTime: "Avg response within 10 hours",
      memberSince: new Date(user.joinedDate).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      }),
      chatAccess: user.status !== "banned" && user.status !== "suspended",
      listingsCount: mockListings.length,
      activeListingsCount: listingsByStatus.active,
      pendingListingsCount: listingsByStatus.pending,
      rejectedListingsCount: listingsByStatus.rejected,
      soldListingsCount: listingsByStatus.sold,
      archivedListingsCount: listingsByStatus.archived,
      reportedListingsCount: listingsByStatus.reported,
    };
  },

  // Warn user
  warnUser: async (id: string, payload: WarnUserPayload): Promise<void> => {
    await delay(500);
    const user = mockUsers.find((u) => u.id === id);
    if (!user) {
      throw new Error("User not found");
    }
    console.log(`User ${id} warned:`, payload.reason);
  },

  // Suspend user
  suspendUser: async (
    id: string,
    payload: SuspendUserPayload,
  ): Promise<void> => {
    await delay(500);
    const user = mockUsers.find((u) => u.id === id);
    if (!user) {
      throw new Error("User not found");
    }
    user.status = "suspended";
    console.log(`User ${id} suspended:`, payload.reason, payload.duration);
  },

  // Ban user
  banUser: async (id: string, payload: BanUserPayload): Promise<void> => {
    await delay(500);
    const user = mockUsers.find((u) => u.id === id);
    if (!user) {
      throw new Error("User not found");
    }
    user.status = "banned";
    console.log(`User ${id} banned:`, payload.reason);
  },

  // Unban user
  unbanUser: async (id: string): Promise<void> => {
    await delay(500);
    const user = mockUsers.find((u) => u.id === id);
    if (!user) {
      throw new Error("User not found");
    }
    user.status = "active";
    console.log(`User ${id} unbanned`);
  },

  // Update chat access
  updateChatAccess: async (
    id: string,
    payload: UpdateChatAccessPayload,
  ): Promise<void> => {
    await delay(300);
    const user = mockUsers.find((u) => u.id === id);
    if (!user) {
      throw new Error("User not found");
    }
    console.log(`User ${id} chat access updated:`, payload.chatAccess);
  },

  // Get user listings
  getUserListings: async (
    id: string,
    params?: {
      status?: string;
      search?: string;
      datePreset?: UserFilterParams["datePreset"];
      startDate?: string;
      endDate?: string;
      dateRange?: UserFilterParams["dateRange"];
      page?: number;
      limit?: number;
    },
  ): Promise<PaginatedUserListingsResponse> => {
    await delay(500);
    let listings = generateMockUserListings(id);

    // Filter by status
    if (params?.status && params.status !== "all") {
      listings = listings.filter((l) => l.status === params.status);
    }

    // Filter by search
    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      listings = listings.filter((l) =>
        l.title.toLowerCase().includes(searchLower),
      );
    }

    const dateBounds = resolveDateBounds({
      datePreset: params?.datePreset,
      startDate: params?.startDate,
      endDate: params?.endDate,
      dateRange: params?.dateRange,
    });
    listings = listings.filter((listing) =>
      isWithinDateBounds(listing.submissionDate, dateBounds),
    );

    // Paginate
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedItems = listings.slice(startIndex, endIndex);

    return {
      listings: paginatedItems,
      pagination: {
        total: listings.length,
        page,
        limit,
        totalPages: Math.ceil(listings.length / limit),
      },
    };
  },
};

// ============================================================================
// Section 3: Query Keys
// ============================================================================

export const ADMIN_USERS_KEYS = {
  all: ["admin", "users"] as const,
  lists: () => [...ADMIN_USERS_KEYS.all, "list"] as const,
  list: (params?: UserFilterParams) =>
    [...ADMIN_USERS_KEYS.lists(), params] as const,
  details: () => [...ADMIN_USERS_KEYS.all, "detail"] as const,
  detail: (id: string) => [...ADMIN_USERS_KEYS.details(), id] as const,
  userListings: (id: string) =>
    [...ADMIN_USERS_KEYS.all, "listings", id] as const,
};

// ============================================================================
// Section 4: React Query Hooks
// ============================================================================

// Query: Get users with filters
export const useAdminUsers = (params?: UserFilterParams) => {
  return useQuery({
    queryKey: ADMIN_USERS_KEYS.list(params),
    queryFn: () => adminUsersService.getUsers(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Query: Get single user details
export const useAdminUserDetail = (id: string) => {
  return useQuery({
    queryKey: ADMIN_USERS_KEYS.detail(id),
    queryFn: () => adminUsersService.getUserById(id),
    staleTime: 30 * 1000, // 30 seconds
    enabled: !!id,
  });
};

// Query: Get user listings
export const useUserListings = (
  id: string,
  params?: {
    status?: string;
    search?: string;
    datePreset?: UserFilterParams["datePreset"];
    startDate?: string;
    endDate?: string;
    dateRange?: UserFilterParams["dateRange"];
    page?: number;
    limit?: number;
  },
) => {
  return useQuery({
    queryKey: [...ADMIN_USERS_KEYS.userListings(id), params],
    queryFn: () => adminUsersService.getUserListings(id, params),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!id,
  });
};

// Mutation: Warn user
export const useWarnUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: WarnUserPayload }) =>
      adminUsersService.warnUser(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_USERS_KEYS.all });
    },
  });
};

// Mutation: Suspend user
export const useSuspendUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: SuspendUserPayload;
    }) => adminUsersService.suspendUser(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_USERS_KEYS.all });
    },
  });
};

// Mutation: Ban user
export const useBanUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: BanUserPayload }) =>
      adminUsersService.banUser(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_USERS_KEYS.all });
    },
  });
};

// Mutation: Unban user
export const useUnbanUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminUsersService.unbanUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_USERS_KEYS.all });
    },
  });
};

// Mutation: Update chat access
export const useUpdateChatAccess = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateChatAccessPayload;
    }) => adminUsersService.updateChatAccess(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ADMIN_USERS_KEYS.detail(variables.id),
      });
    },
  });
};
