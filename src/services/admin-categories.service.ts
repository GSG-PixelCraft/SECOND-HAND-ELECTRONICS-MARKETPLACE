import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  AdminCategory,
  CategoryFilterParams,
  PaginatedCategoriesResponse,
} from "@/types/admin";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const initialCategories: AdminCategory[] = [
  {
    id: "CAT-1001",
    name: "Phone",
    iconKey: "phone",
    attributesCount: 3,
    isActive: true,
  },
  {
    id: "CAT-1002",
    name: "Tablets",
    iconKey: "tablet",
    attributesCount: 2,
    isActive: true,
  },
  {
    id: "CAT-1003",
    name: "Laptops",
    iconKey: "laptop",
    attributesCount: 5,
    isActive: true,
  },
  {
    id: "CAT-1004",
    name: "PC Parts",
    iconKey: "pc-parts",
    attributesCount: 12,
    isActive: true,
  },
  {
    id: "CAT-1005",
    name: "Gaming",
    iconKey: "gaming",
    attributesCount: 1,
    isActive: true,
  },
  {
    id: "CAT-1006",
    name: "Audio",
    iconKey: "audio",
    attributesCount: 6,
    isActive: true,
  },
  {
    id: "CAT-1007",
    name: "Smartwatches",
    iconKey: "smartwatch",
    attributesCount: 3,
    isActive: true,
  },
  {
    id: "CAT-1008",
    name: "Cameras",
    iconKey: "camera",
    attributesCount: 4,
    isActive: true,
  },
  {
    id: "CAT-1009",
    name: "Smart Home",
    iconKey: "smart-home",
    attributesCount: 3,
    isActive: true,
  },
  {
    id: "CAT-1010",
    name: "TV & Monitors",
    iconKey: "tv-monitor",
    attributesCount: 3,
    isActive: true,
  },
];

let mockCategoriesStore: AdminCategory[] = [...initialCategories];

const getFilteredCategories = (
  filters: CategoryFilterParams = {},
): PaginatedCategoriesResponse => {
  const page = filters.page || 1;
  const limit = filters.limit || 10;
  const search = filters.search?.trim().toLowerCase() || "";

  let filtered = [...mockCategoriesStore];

  if (search) {
    filtered = filtered.filter((category) =>
      category.name.toLowerCase().includes(search),
    );
  }

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const normalizedPage = Math.min(Math.max(page, 1), totalPages);
  const start = (normalizedPage - 1) * limit;
  const items = filtered.slice(start, start + limit);

  return {
    items,
    total,
    page: normalizedPage,
    totalPages,
    limit,
  };
};

export const adminCategoriesService = {
  getCategories: async (
    filters?: CategoryFilterParams,
  ): Promise<PaginatedCategoriesResponse> => {
    await delay(180);
    return getFilteredCategories(filters);
  },

  toggleCategoryStatus: async (
    id: string,
    isActive: boolean,
  ): Promise<AdminCategory> => {
    const category = mockCategoriesStore.find((item) => item.id === id);
    if (!category) {
      throw new Error("Category not found");
    }
    category.isActive = isActive;
    return category;
  },

  deleteCategory: async (id: string): Promise<{ id: string }> => {
    const exists = mockCategoriesStore.some((item) => item.id === id);
    if (!exists) {
      throw new Error("Category not found");
    }
    mockCategoriesStore = mockCategoriesStore.filter((item) => item.id !== id);
    return { id };
  },
};

export const ADMIN_CATEGORIES_KEYS = {
  all: ["admin-categories"] as const,
  list: (filters: CategoryFilterParams) =>
    [...ADMIN_CATEGORIES_KEYS.all, "list", filters] as const,
};

export const useAdminCategories = (filters: CategoryFilterParams) =>
  useQuery({
    queryKey: ADMIN_CATEGORIES_KEYS.list(filters),
    queryFn: () => adminCategoriesService.getCategories(filters),
    placeholderData: (previousData) => previousData,
  });

export const useToggleAdminCategoryStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      adminCategoriesService.toggleCategoryStatus(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_CATEGORIES_KEYS.all });
    },
  });
};

export const useDeleteAdminCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminCategoriesService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_CATEGORIES_KEYS.all });
    },
  });
};
