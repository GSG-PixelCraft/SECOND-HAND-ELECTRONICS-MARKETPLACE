// Admin Listings Management Service

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  AdminListing,
  BulkActionPayload,
  HideListingData,
  ListingFilterParams,
  PaginatedListingsResponse,
  RejectListingData,
} from "@/types/admin";
import apiClient from "./client";

// ============================================================================
// Section 1: Types (Re-exported from types/admin.ts)
// ============================================================================

export type {
  AdminListing,
  BulkActionPayload,
  HideListingData,
  ListingFilterParams,
  ListingStatus,
  PaginatedListingsResponse,
  RejectListingData,
} from "@/types/admin";

// ============================================================================
// Section 2: Mock Data & API Functions
// ============================================================================

// Mock data generator
const generateMockListings = (): AdminListing[] => {
  const categories = [
    "Smartphones",
    "Laptops",
    "Tablets",
    "Cameras",
    "Headphones",
    "Smartwatches",
    "Gaming Consoles",
    "TVs",
  ];
  const conditions = ["new", "like-new", "good", "fair"];
  const statuses: AdminListing["status"][] = [
    "pending",
    "active",
    "rejected",
    "sold",
    "hidden",
    "removed",
  ];

  const sellers = [
    {
      id: "seller1",
      name: "John Smith",
      email: "john.smith@example.com",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    {
      id: "seller2",
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      avatar: "https://i.pravatar.cc/150?img=2",
    },
    {
      id: "seller3",
      name: "Mike Davis",
      email: "mike.davis@example.com",
      avatar: "https://i.pravatar.cc/150?img=3",
    },
    {
      id: "seller4",
      name: "Emily Wilson",
      email: "emily.w@example.com",
      avatar: "https://i.pravatar.cc/150?img=4",
    },
    {
      id: "seller5",
      name: "David Brown",
      email: "david.brown@example.com",
      avatar: "https://i.pravatar.cc/150?img=5",
    },
  ];

  const listings: AdminListing[] = [];

  for (let i = 1; i <= 60; i++) {
    const seller = sellers[i % sellers.length];
    const category = categories[i % categories.length];
    const condition = conditions[i % conditions.length];
    const status = statuses[i % statuses.length];
    const daysAgo = Math.floor(Math.random() * 30);
    const createdAt = new Date(
      Date.now() - daysAgo * 24 * 60 * 60 * 1000,
    ).toISOString();

    const listing: AdminListing = {
      id: `listing-${i}`,
      name: `${category} - ${condition === "new" ? "Brand New" : "Used"} ${i}`,
      description: `High-quality ${category.toLowerCase()} in ${condition} condition. This is a detailed description of the product with all its features and specifications. Perfect for anyone looking for a reliable ${category.toLowerCase()}.`,
      price: Math.floor(Math.random() * 1500) + 50,
      category,
      condition,
      seller: seller.name,
      sellerId: seller.id,
      sellerName: seller.name,
      sellerEmail: seller.email,
      sellerAvatar: seller.avatar,
      status,
      createdAt,
      updatedAt: createdAt,
      image: `https://picsum.photos/seed/${i}/400/300`,
      images: [
        `https://picsum.photos/seed/${i}/400/300`,
        `https://picsum.photos/seed/${i + 100}/400/300`,
        `https://picsum.photos/seed/${i + 200}/400/300`,
      ],
      views: Math.floor(Math.random() * 500),
      favorites: Math.floor(Math.random() * 50),
    };

    // Add rejection data for rejected listings
    if (status === "rejected") {
      listing.rejectionReason = "incomplete_information";
      listing.rejectionComment =
        "Please provide more detailed product description and specifications.";
      listing.rejectedAt = new Date(
        Date.now() - Math.floor(Math.random() * 5) * 24 * 60 * 60 * 1000,
      ).toISOString();
      listing.rejectedBy = "admin-1";
    }

    // Add hide data for hidden listings
    if (status === "hidden") {
      listing.hideReason = "policy_violation";
      listing.hideComment = "This listing violates our community guidelines.";
      listing.hiddenAt = new Date(
        Date.now() - Math.floor(Math.random() * 5) * 24 * 60 * 60 * 1000,
      ).toISOString();
      listing.hiddenBy = "admin-1";
    }

    // Add approval data for active listings
    if (status === "active") {
      listing.approvedAt = new Date(
        Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000,
      ).toISOString();
      listing.approvedBy = "admin-1";
    }

    listings.push(listing);
  }

  return listings;
};

// In-memory mock data store
let mockListings = generateMockListings();

// Helper function to filter and paginate listings
const filterListings = (
  params: ListingFilterParams = {},
): PaginatedListingsResponse => {
  let filtered = [...mockListings];

  // Filter by status
  if (params.status && params.status !== "all") {
    filtered = filtered.filter((listing) => listing.status === params.status);
  }

  // Filter by search (name, description, seller)
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filtered = filtered.filter(
      (listing) =>
        listing.name.toLowerCase().includes(searchLower) ||
        listing.description.toLowerCase().includes(searchLower) ||
        listing.seller.toLowerCase().includes(searchLower),
    );
  }

  // Filter by category
  if (params.category) {
    filtered = filtered.filter(
      (listing) => listing.category === params.category,
    );
  }

  // Filter by price range
  if (params.minPrice !== undefined) {
    filtered = filtered.filter((listing) => listing.price >= params.minPrice!);
  }
  if (params.maxPrice !== undefined) {
    filtered = filtered.filter((listing) => listing.price <= params.maxPrice!);
  }

  // Filter by date range
  if (params.startDate) {
    filtered = filtered.filter(
      (listing) => new Date(listing.createdAt) >= new Date(params.startDate!),
    );
  }
  if (params.endDate) {
    filtered = filtered.filter(
      (listing) => new Date(listing.createdAt) <= new Date(params.endDate!),
    );
  }

  // Sort
  const sortBy = params.sortBy || "createdAt";
  const sortOrder = params.sortOrder || "desc";
  filtered.sort((a, b) => {
    let aVal: string | number = a[sortBy];
    let bVal: string | number = b[sortBy];

    if (sortBy === "createdAt" || sortBy === "updatedAt") {
      aVal = new Date(aVal as string).getTime();
      bVal = new Date(bVal as string).getTime();
    }

    if (sortOrder === "asc") {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  // Paginate
  const page = params.page || 1;
  const limit = params.limit || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedItems = filtered.slice(startIndex, endIndex);

  return {
    items: paginatedItems,
    total: filtered.length,
    page,
    totalPages: Math.ceil(filtered.length / limit),
    limit,
  };
};

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// API Functions
export const adminListingsService = {
  // Get all listings with filters and pagination
  getListings: async (
    params?: ListingFilterParams,
  ): Promise<PaginatedListingsResponse> => {
    const response = await apiClient.get("/admin/products", {
      params: {
        page: params?.page,
        limit: params?.limit,
        status: params?.status !== "all" ? params?.status : undefined,
        search: params?.search,
        startDate: params?.startDate,
        endDate: params?.endDate,
        sortBy: params?.sortBy,
        sortOrder: params?.sortOrder,
      },
    });

    const backend = response.data.data;

    return {
      items: backend.data.map((product: any) => ({
        id: product.id,

        // RecentProduct fields
        name: product.title,
        price: product.price,
        category: product.category?.name || "",
        condition: product.condition,
        seller: product.sellerId,
        status: product.status,
        createdAt: product.createdAt,
        image: product.images?.[0],

        // AdminListing fields
        description: "",
        images: product.images?.map((img: any) => img.url) || [],
        sellerId: product.sellerId,
        sellerName: "",
        sellerEmail: "",
        sellerAvatar: undefined,
        views: product.viewCount ?? 0,
        favorites: 0,
        updatedAt: product.updatedAt,
      })),

      total: backend.total,
      page: backend.page,
      totalPages: backend.totalPages,
      limit: backend.limit,
    };
  },
  // Get single listing by ID
  getListingById: async (id: string): Promise<AdminListing> => {
    await delay(300);
    const listing = mockListings.find((l) => l.id === id);
    if (!listing) {
      throw new Error("Listing not found");
    }
    return listing;
  },

  // Approve listing
  approveListing: async (id: string): Promise<AdminListing> => {
    await delay(500);
    const listing = mockListings.find((l) => l.id === id);
    if (!listing) {
      throw new Error("Listing not found");
    }
    listing.status = "active";
    listing.approvedAt = new Date().toISOString();
    listing.approvedBy = "admin-1";
    listing.updatedAt = new Date().toISOString();
    return listing;
  },

  // Reject listing
  rejectListing: async (data: RejectListingData): Promise<AdminListing> => {
    await delay(500);
    const listing = mockListings.find((l) => l.id === data.listingId);
    if (!listing) {
      throw new Error("Listing not found");
    }
    listing.status = "rejected";
    listing.rejectionReason = data.reason;
    listing.rejectionComment = data.comment;
    listing.rejectedAt = new Date().toISOString();
    listing.rejectedBy = "admin-1";
    listing.updatedAt = new Date().toISOString();
    return listing;
  },

  // Hide listing
  hideListing: async (data: HideListingData): Promise<AdminListing> => {
    await delay(500);
    const listing = mockListings.find((l) => l.id === data.listingId);
    if (!listing) {
      throw new Error("Listing not found");
    }
    listing.status = "hidden";
    listing.hideReason = data.reason;
    listing.hideComment = data.comment;
    listing.hiddenAt = new Date().toISOString();
    listing.hiddenBy = "admin-1";
    listing.updatedAt = new Date().toISOString();
    return listing;
  },

  // Unhide listing
  unhideListing: async (id: string): Promise<AdminListing> => {
    await delay(500);
    const listing = mockListings.find((l) => l.id === id);
    if (!listing) {
      throw new Error("Listing not found");
    }
    listing.status = "active";
    listing.hideReason = undefined;
    listing.hideComment = undefined;
    listing.hiddenAt = undefined;
    listing.hiddenBy = undefined;
    listing.updatedAt = new Date().toISOString();
    return listing;
  },

  // Bulk actions
  bulkAction: async (payload: BulkActionPayload): Promise<void> => {
    await delay(800);
    payload.listingIds.forEach((id) => {
      const listing = mockListings.find((l) => l.id === id);
      if (listing) {
        if (payload.action === "approve") {
          listing.status = "active";
          listing.approvedAt = new Date().toISOString();
          listing.approvedBy = "admin-1";
        } else if (payload.action === "reject") {
          listing.status = "rejected";
          listing.rejectionReason = payload.reason!;
          listing.rejectionComment = payload.comment;
          listing.rejectedAt = new Date().toISOString();
          listing.rejectedBy = "admin-1";
        } else if (payload.action === "delete") {
          mockListings = mockListings.filter((l) => l.id !== id);
        }
        listing.updatedAt = new Date().toISOString();
      }
    });
  },
};

// ============================================================================
// Section 3: Query Keys
// ============================================================================

export const ADMIN_LISTINGS_KEYS = {
  all: ["admin", "listings"] as const,
  lists: () => [...ADMIN_LISTINGS_KEYS.all, "list"] as const,
  list: (params?: ListingFilterParams) =>
    [...ADMIN_LISTINGS_KEYS.lists(), params] as const,
  details: () => [...ADMIN_LISTINGS_KEYS.all, "detail"] as const,
  detail: (id: string) => [...ADMIN_LISTINGS_KEYS.details(), id] as const,
};

// ============================================================================
// Section 4: React Query Hooks
// ============================================================================

// Query: Get listings with filters
export const useAdminListings = (params?: ListingFilterParams) => {
  return useQuery({
    queryKey: ADMIN_LISTINGS_KEYS.list(params),
    queryFn: () => adminListingsService.getListings(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Query: Get single listing details
export const useAdminListingDetail = (id: string) => {
  return useQuery({
    queryKey: ADMIN_LISTINGS_KEYS.detail(id),
    queryFn: () => adminListingsService.getListingById(id),
    staleTime: 30 * 1000, // 30 seconds
    enabled: !!id,
  });
};

// Mutation: Approve listing
export const useApproveListingMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminListingsService.approveListing(id),
    onSuccess: () => {
      // Invalidate all listing queries
      queryClient.invalidateQueries({ queryKey: ADMIN_LISTINGS_KEYS.all });
    },
  });
};

// Mutation: Reject listing
export const useRejectListingMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RejectListingData) =>
      adminListingsService.rejectListing(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_LISTINGS_KEYS.all });
    },
  });
};

// Mutation: Hide listing
export const useHideListingMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: HideListingData) =>
      adminListingsService.hideListing(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_LISTINGS_KEYS.all });
    },
  });
};

// Mutation: Unhide listing
export const useUnhideListingMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminListingsService.unhideListing(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_LISTINGS_KEYS.all });
    },
  });
};

// Mutation: Bulk actions
export const useBulkActionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: BulkActionPayload) =>
      adminListingsService.bulkAction(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_LISTINGS_KEYS.all });
    },
  });
};
