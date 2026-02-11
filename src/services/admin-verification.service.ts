import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { api } from "./client";
// import { API_ENDPOINTS } from "@/constants/api-endpoints";
import type {
  VerificationSubmission,
  VerificationFilterParams,
  PaginatedVerificationsResponse,
  RejectVerificationData,
} from "@/types/admin";

// ============================================================================
// Mock Data for Development (Remove when backend is ready)
// ============================================================================

const mockVerifications: VerificationSubmission[] = [
  {
    id: "3305",
    userId: "user1",
    userName: "Ahmad Abu Odeh",
    userAvatar: "https://i.pravatar.cc/150?img=1",
    documentType: "National ID",
    submittedDate: "2026-01-12",
    status: "pending",
    frontImage: "https://picsum.photos/800/500?random=1",
    backImage: "https://picsum.photos/800/500?random=2",
    selfieImage: "https://picsum.photos/800/500?random=3",
  },
  {
    id: "3102",
    userId: "user2",
    userName: "Youssef Khaled",
    userAvatar: "https://i.pravatar.cc/150?img=2",
    documentType: "Passport",
    submittedDate: "2026-01-10",
    status: "rejected",
    frontImage: "https://picsum.photos/800/500?random=4",
    selfieImage: "https://picsum.photos/800/500?random=5",
    rejectionReasons: ["Name does not match the profile"],
  },
  {
    id: "3202",
    userId: "user3",
    userName: "Salma Shab",
    userAvatar: "https://i.pravatar.cc/150?img=3",
    documentType: "National ID",
    submittedDate: "2026-01-08",
    status: "approved",
    frontImage: "https://picsum.photos/800/500?random=6",
    backImage: "https://picsum.photos/800/500?random=7",
    selfieImage: "https://picsum.photos/800/500?random=8",
    reviewedAt: "2026-01-09",
  },
  {
    id: "1043",
    userId: "user4",
    userName: "Anas Al-Tamimi",
    userAvatar: "https://i.pravatar.cc/150?img=4",
    documentType: "National ID",
    submittedDate: "2026-01-07",
    status: "pending",
    frontImage: "https://picsum.photos/800/500?random=9",
    backImage: "https://picsum.photos/800/500?random=10",
    selfieImage: "https://picsum.photos/800/500?random=11",
  },
  {
    id: "3100",
    userId: "user5",
    userName: "Moath Yaseen",
    userAvatar: "https://i.pravatar.cc/150?img=5",
    documentType: "Driver License",
    submittedDate: "2026-01-05",
    status: "rejected",
    frontImage: "https://picsum.photos/800/500?random=12",
    backImage: "https://picsum.photos/800/500?random=13",
    selfieImage: "https://picsum.photos/800/500?random=14",
    rejectionReasons: ["ID document is expired"],
  },
  {
    id: "7902",
    userId: "user6",
    userName: "Zainab Osama",
    userAvatar: "https://i.pravatar.cc/150?img=6",
    documentType: "National ID",
    submittedDate: "2026-01-03",
    status: "pending",
    frontImage: "https://picsum.photos/800/500?random=15",
    backImage: "https://picsum.photos/800/500?random=16",
    selfieImage: "https://picsum.photos/800/500?random=17",
  },
  {
    id: "8702",
    userId: "user7",
    userName: "Sara Abu Mustafa",
    userAvatar: "https://i.pravatar.cc/150?img=7",
    documentType: "Passport",
    submittedDate: "2026-01-03",
    status: "pending",
    frontImage: "https://picsum.photos/800/500?random=18",
    selfieImage: "https://picsum.photos/800/500?random=19",
  },
  {
    id: "6636",
    userId: "user8",
    userName: "Noor Abu Warda",
    userAvatar: "https://i.pravatar.cc/150?img=8",
    documentType: "National ID",
    submittedDate: "2026-01-02",
    status: "approved",
    frontImage: "https://picsum.photos/800/500?random=20",
    backImage: "https://picsum.photos/800/500?random=21",
    selfieImage: "https://picsum.photos/800/500?random=22",
    reviewedAt: "2026-01-03",
  },
  {
    id: "3222",
    userId: "user9",
    userName: "Reem Al-Tamimi",
    userAvatar: "https://i.pravatar.cc/150?img=9",
    documentType: "National ID",
    submittedDate: "2026-01-01",
    status: "approved",
    frontImage: "https://picsum.photos/800/500?random=23",
    backImage: "https://picsum.photos/800/500?random=24",
    selfieImage: "https://picsum.photos/800/500?random=25",
    reviewedAt: "2026-01-02",
  },
  {
    id: "4022",
    userId: "user10",
    userName: "Ahmed Abu Odeh",
    userAvatar: "https://i.pravatar.cc/150?img=10",
    documentType: "Driver License",
    submittedDate: "2026-01-01",
    status: "rejected",
    frontImage: "https://picsum.photos/800/500?random=26",
    backImage: "https://picsum.photos/800/500?random=27",
    selfieImage: "https://picsum.photos/800/500?random=28",
    rejectionReasons: ["Front and back images belong to different IDs"],
  },
];

// ============================================================================
// API Functions
// ============================================================================

export const adminVerificationService = {
  // Get paginated verifications list
  getVerifications: (
    params: VerificationFilterParams,
  ): Promise<PaginatedVerificationsResponse> => {
    // TODO: Replace with real API call when backend is ready
    return new Promise((resolve) => {
      setTimeout(() => {
        const { status = "all", search = "", page = 1, limit = 10 } = params;

        // Filter by status
        let filtered = mockVerifications;
        if (status !== "all") {
          filtered = filtered.filter((v) => v.status === status);
        }

        // Filter by search (name or ID)
        if (search) {
          const searchLower = search.toLowerCase();
          filtered = filtered.filter(
            (v) =>
              v.userName.toLowerCase().includes(searchLower) ||
              v.id.includes(searchLower),
          );
        }

        // Calculate pagination
        const total = filtered.length;
        const totalPages = Math.ceil(total / limit);
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const items = filtered.slice(startIndex, endIndex);

        // Calculate status counts
        const statusCounts = {
          all: mockVerifications.length,
          pending: mockVerifications.filter((v) => v.status === "pending")
            .length,
          approved: mockVerifications.filter((v) => v.status === "approved")
            .length,
          rejected: mockVerifications.filter((v) => v.status === "rejected")
            .length,
        };

        resolve({
          items,
          total,
          page,
          totalPages,
          limit,
          statusCounts,
        });
      }, 500);
    });

    // Real API call:
    // return api.get<PaginatedVerificationsResponse>(
    //   API_ENDPOINTS.ADMIN.VERIFICATIONS.LIST,
    //   { params }
    // );
  },

  // Get single verification details
  getVerificationById: (id: string): Promise<VerificationSubmission> => {
    // TODO: Replace with real API call when backend is ready
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const verification = mockVerifications.find((v) => v.id === id);
        if (verification) {
          resolve(verification);
        } else {
          reject(new Error("Verification not found"));
        }
      }, 300);
    });

    // Real API call:
    // return api.get<VerificationSubmission>(
    //   API_ENDPOINTS.ADMIN.VERIFICATIONS.BY_ID(id)
    // );
  },

  // Approve verification
  approveVerification: (id: string): Promise<{ success: boolean }> => {
    // TODO: Replace with real API call when backend is ready
    return new Promise((resolve) => {
      setTimeout(() => {
        const verification = mockVerifications.find((v) => v.id === id);
        if (verification) {
          verification.status = "approved";
          verification.reviewedAt = new Date().toISOString();
        }
        resolve({ success: true });
      }, 500);
    });

    // Real API call:
    // return api.post<{ success: boolean }>(
    //   API_ENDPOINTS.ADMIN.VERIFICATIONS.APPROVE(id)
    // );
  },

  // Reject verification
  rejectVerification: (
    data: RejectVerificationData,
  ): Promise<{ success: boolean }> => {
    // TODO: Replace with real API call when backend is ready
    return new Promise((resolve) => {
      setTimeout(() => {
        const verification = mockVerifications.find(
          (v) => v.id === data.verificationId,
        );
        if (verification) {
          verification.status = "rejected";
          verification.rejectionReasons = data.reasons;
          verification.additionalNotes = data.additionalNotes;
          verification.reviewedAt = new Date().toISOString();
        }
        resolve({ success: true });
      }, 500);
    });

    // Real API call:
    // return api.post<{ success: boolean }>(
    //   API_ENDPOINTS.ADMIN.VERIFICATIONS.REJECT(data.verificationId),
    //   { reasons: data.reasons, additionalNotes: data.additionalNotes }
    // );
  },
};

// ============================================================================
// Query Keys
// ============================================================================

export const ADMIN_VERIFICATION_KEYS = {
  all: ["admin", "verifications"] as const,
  lists: () => [...ADMIN_VERIFICATION_KEYS.all, "list"] as const,
  list: (params: VerificationFilterParams) =>
    [...ADMIN_VERIFICATION_KEYS.lists(), params] as const,
  details: () => [...ADMIN_VERIFICATION_KEYS.all, "detail"] as const,
  detail: (id: string) => [...ADMIN_VERIFICATION_KEYS.details(), id] as const,
};

// ============================================================================
// React Query Hooks
// ============================================================================

export function useAdminVerifications(params: VerificationFilterParams) {
  return useQuery({
    queryKey: ADMIN_VERIFICATION_KEYS.list(params),
    queryFn: () => adminVerificationService.getVerifications(params),
  });
}

export function useAdminVerificationDetail(id: string) {
  return useQuery({
    queryKey: ADMIN_VERIFICATION_KEYS.detail(id),
    queryFn: () => adminVerificationService.getVerificationById(id),
    enabled: !!id,
  });
}

export function useApproveVerification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminVerificationService.approveVerification,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ADMIN_VERIFICATION_KEYS.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: ADMIN_VERIFICATION_KEYS.details(),
      });
    },
  });
}

export function useRejectVerification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminVerificationService.rejectVerification,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ADMIN_VERIFICATION_KEYS.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: ADMIN_VERIFICATION_KEYS.details(),
      });
    },
  });
}
