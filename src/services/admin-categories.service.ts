import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  AdminCategory,
  AdminCategoryDetail,
  CategoryAttribute,
  CategoryFilterParams,
  CreateCategoryPayload,
  PaginatedCategoriesResponse,
  UpdateCategoryPayload,
} from "@/types/admin";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const inferIconKeyFromName = (name: string): AdminCategoryDetail["iconKey"] => {
  const normalized = name.toLowerCase();
  if (normalized.includes("tablet")) return "tablet";
  if (normalized.includes("laptop")) return "laptop";
  if (normalized.includes("pc") || normalized.includes("part"))
    return "pc-parts";
  if (normalized.includes("gaming") || normalized.includes("console"))
    return "gaming";
  if (normalized.includes("audio") || normalized.includes("headphone"))
    return "audio";
  if (normalized.includes("watch")) return "smartwatch";
  if (normalized.includes("camera")) return "camera";
  if (normalized.includes("home")) return "smart-home";
  if (normalized.includes("tv") || normalized.includes("monitor"))
    return "tv-monitor";
  return "phone";
};

const buildSimpleAttribute = (
  id: string,
  name: string,
  type: CategoryAttribute["type"],
): CategoryAttribute => ({
  id,
  name,
  type,
  isActive: true,
});

type SeedCategory = Omit<AdminCategoryDetail, "attributesCount" | "isActive"> &
  Partial<Pick<AdminCategoryDetail, "attributesCount" | "isActive">>;

const initialCategories: SeedCategory[] = [
  {
    id: "CAT-1001",
    name: "Phones",
    iconKey: "phone",
    isActive: true,
    categoryStatus: true,
    iconUrl: "https://picsum.photos/seed/category-phones/480/280",
    attributes: [
      {
        id: "ATTR-1001",
        name: "Brand",
        type: "select_dropdown",
        isActive: true,
        options: ["Apple", "Samsung", "Xiaomi", "Nokia", "Huawei", "Redmi"],
      },
      {
        id: "ATTR-1002",
        name: "Model",
        type: "text_input",
        isActive: true,
      },
      {
        id: "ATTR-1003",
        name: "Waterproof",
        type: "toggle",
        isActive: true,
        toggleOption1: "Yes",
        toggleOption2: "No",
      },
    ],
  },
  {
    id: "CAT-1002",
    name: "Tablets",
    iconKey: "tablet",
    isActive: true,
    categoryStatus: true,
    attributes: [
      buildSimpleAttribute("ATTR-2001", "Brand", "select_dropdown"),
      buildSimpleAttribute("ATTR-2002", "Storage", "number_input"),
    ],
  },
  {
    id: "CAT-1003",
    name: "Laptops",
    iconKey: "laptop",
    isActive: true,
    categoryStatus: true,
    attributes: [
      buildSimpleAttribute("ATTR-3001", "Brand", "select_dropdown"),
      buildSimpleAttribute("ATTR-3002", "Processor", "text_input"),
      buildSimpleAttribute("ATTR-3003", "RAM", "number_input"),
      buildSimpleAttribute("ATTR-3004", "Storage", "number_input"),
      buildSimpleAttribute("ATTR-3005", "Condition", "checkboxes"),
    ],
  },
  {
    id: "CAT-1004",
    name: "PC Parts",
    iconKey: "pc-parts",
    isActive: true,
    categoryStatus: true,
    attributes: [
      buildSimpleAttribute("ATTR-4001", "Part Type", "select_dropdown"),
      buildSimpleAttribute("ATTR-4002", "Brand", "select_dropdown"),
      buildSimpleAttribute("ATTR-4003", "Model", "text_input"),
      buildSimpleAttribute("ATTR-4004", "Socket", "text_input"),
      buildSimpleAttribute("ATTR-4005", "Capacity", "number_input"),
      buildSimpleAttribute("ATTR-4006", "Speed", "number_input"),
      buildSimpleAttribute("ATTR-4007", "RGB", "toggle"),
      buildSimpleAttribute("ATTR-4008", "Power", "number_input"),
      buildSimpleAttribute("ATTR-4009", "Voltage", "number_input"),
      buildSimpleAttribute("ATTR-4010", "Series", "text_input"),
      buildSimpleAttribute("ATTR-4011", "Compatibility", "textarea"),
      buildSimpleAttribute("ATTR-4012", "Warranty", "date_picker"),
    ],
  },
  {
    id: "CAT-1005",
    name: "Gaming",
    iconKey: "gaming",
    isActive: true,
    categoryStatus: true,
    attributes: [
      buildSimpleAttribute("ATTR-5001", "Platform", "select_dropdown"),
    ],
  },
  {
    id: "CAT-1006",
    name: "Audio",
    iconKey: "audio",
    isActive: true,
    categoryStatus: true,
    attributes: [
      buildSimpleAttribute("ATTR-6001", "Type", "select_dropdown"),
      buildSimpleAttribute("ATTR-6002", "Brand", "select_dropdown"),
      buildSimpleAttribute("ATTR-6003", "Connectivity", "checkboxes"),
      buildSimpleAttribute("ATTR-6004", "Noise Cancelling", "toggle"),
      buildSimpleAttribute("ATTR-6005", "Battery Life", "number_input"),
      buildSimpleAttribute("ATTR-6006", "Color", "text_input"),
    ],
  },
  {
    id: "CAT-1007",
    name: "Smartwatches",
    iconKey: "smartwatch",
    isActive: true,
    categoryStatus: true,
    attributes: [
      buildSimpleAttribute("ATTR-7001", "Brand", "select_dropdown"),
      buildSimpleAttribute("ATTR-7002", "Case Size", "number_input"),
      buildSimpleAttribute("ATTR-7003", "GPS", "toggle"),
    ],
  },
  {
    id: "CAT-1008",
    name: "Cameras",
    iconKey: "camera",
    isActive: true,
    categoryStatus: true,
    attributes: [
      buildSimpleAttribute("ATTR-8001", "Brand", "select_dropdown"),
      buildSimpleAttribute("ATTR-8002", "Sensor Type", "text_input"),
      buildSimpleAttribute("ATTR-8003", "Megapixels", "number_input"),
      buildSimpleAttribute("ATTR-8004", "Lens Included", "toggle"),
    ],
  },
  {
    id: "CAT-1009",
    name: "Smart Home",
    iconKey: "smart-home",
    isActive: true,
    categoryStatus: true,
    attributes: [
      buildSimpleAttribute("ATTR-9001", "Device Type", "select_dropdown"),
      buildSimpleAttribute("ATTR-9002", "Voice Assistant", "checkboxes"),
      buildSimpleAttribute("ATTR-9003", "Wi-Fi", "toggle"),
    ],
  },
  {
    id: "CAT-1010",
    name: "TV & Monitors",
    iconKey: "tv-monitor",
    isActive: true,
    categoryStatus: true,
    attributes: [
      buildSimpleAttribute("ATTR-10001", "Screen Size", "number_input"),
      buildSimpleAttribute("ATTR-10002", "Resolution", "select_dropdown"),
      buildSimpleAttribute("ATTR-10003", "Panel Type", "select_dropdown"),
    ],
  },
];

let mockCategoriesStore: AdminCategoryDetail[] = clone(initialCategories).map(
  (category) => ({
    id: category.id,
    name: category.name,
    iconKey: category.iconKey,
    iconUrl: category.iconUrl,
    categoryStatus: category.categoryStatus,
    isActive: category.isActive ?? category.categoryStatus,
    attributes: category.attributes,
    attributesCount: category.attributesCount ?? category.attributes.length,
  }),
);

const getMaxCategorySequence = () => {
  const sequences = mockCategoriesStore
    .map((category) => Number(category.id.replace("CAT-", "")))
    .filter((value) => Number.isFinite(value));
  return sequences.length ? Math.max(...sequences) : 1000;
};

let categorySequence = getMaxCategorySequence();
let attributeSequence = 11000;

const nextCategoryId = () => {
  categorySequence += 1;
  return `CAT-${categorySequence}`;
};

const nextAttributeId = () => {
  attributeSequence += 1;
  return `ATTR-${attributeSequence}`;
};

const normalizeAttributes = (attributes: CategoryAttribute[]) => {
  return attributes
    .map((attribute) => {
      const name = attribute.name.trim();
      const base: CategoryAttribute = {
        id: attribute.id || nextAttributeId(),
        name,
        type: attribute.type,
        isActive: attribute.isActive,
      };

      if (
        attribute.type === "select_dropdown" ||
        attribute.type === "checkboxes"
      ) {
        const parsedOptions = (attribute.options || [])
          .map((option) => option.trim())
          .filter(Boolean);
        base.options = parsedOptions;
      }

      if (attribute.type === "toggle") {
        base.toggleOption1 = attribute.toggleOption1?.trim() || "";
        base.toggleOption2 = attribute.toggleOption2?.trim() || "";
      }

      return base;
    })
    .filter((attribute) => Boolean(attribute.name));
};

const toCategorySummary = (category: AdminCategoryDetail): AdminCategory => ({
  id: category.id,
  name: category.name,
  iconKey: category.iconKey,
  attributesCount: category.attributes.length,
  isActive: category.categoryStatus,
});

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

  const summary = filtered.map(toCategorySummary);
  const total = summary.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const normalizedPage = Math.min(Math.max(page, 1), totalPages);
  const start = (normalizedPage - 1) * limit;
  const items = summary.slice(start, start + limit);

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

  getCategoryById: async (id: string): Promise<AdminCategoryDetail> => {
    await delay(120);
    const category = mockCategoriesStore.find((item) => item.id === id);
    if (!category) {
      throw new Error("Category not found");
    }
    return clone(category);
  },

  createCategory: async (
    payload: CreateCategoryPayload,
  ): Promise<AdminCategoryDetail> => {
    await delay(180);
    const normalizedName = payload.name.trim();
    const category: AdminCategoryDetail = {
      id: nextCategoryId(),
      name: normalizedName,
      iconKey: inferIconKeyFromName(normalizedName),
      iconUrl: payload.iconUrl,
      categoryStatus: payload.categoryStatus,
      isActive: payload.categoryStatus,
      attributes: [],
      attributesCount: 0,
    };
    category.attributes = normalizeAttributes(payload.attributes);
    category.attributesCount = category.attributes.length;

    mockCategoriesStore = [category, ...mockCategoriesStore];
    return clone(category);
  },

  updateCategory: async (
    id: string,
    payload: UpdateCategoryPayload,
  ): Promise<AdminCategoryDetail> => {
    await delay(180);
    const index = mockCategoriesStore.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error("Category not found");
    }

    const normalizedName = payload.name.trim();
    const updated: AdminCategoryDetail = {
      ...mockCategoriesStore[index],
      name: normalizedName,
      iconUrl: payload.iconUrl,
      categoryStatus: payload.categoryStatus,
      isActive: payload.categoryStatus,
      iconKey: inferIconKeyFromName(normalizedName),
      attributes: normalizeAttributes(payload.attributes),
      attributesCount: 0,
    };
    updated.attributesCount = updated.attributes.length;

    mockCategoriesStore[index] = updated;
    return clone(updated);
  },

  deleteCategoryAttribute: async (
    categoryId: string,
    attributeId: string,
  ): Promise<AdminCategoryDetail> => {
    await delay(180);
    const index = mockCategoriesStore.findIndex(
      (item) => item.id === categoryId,
    );
    if (index === -1) {
      throw new Error("Category not found");
    }

    const current = mockCategoriesStore[index];
    const updated: AdminCategoryDetail = {
      ...current,
      attributes: current.attributes.filter(
        (attribute) => attribute.id !== attributeId,
      ),
      attributesCount: 0,
    };
    updated.attributesCount = updated.attributes.length;

    mockCategoriesStore[index] = updated;
    return clone(updated);
  },

  toggleCategoryStatus: async (
    id: string,
    isActive: boolean,
  ): Promise<AdminCategory> => {
    await delay(120);
    const category = mockCategoriesStore.find((item) => item.id === id);
    if (!category) {
      throw new Error("Category not found");
    }
    category.isActive = isActive;
    category.categoryStatus = isActive;
    return toCategorySummary(category);
  },

  deleteCategory: async (id: string): Promise<{ id: string }> => {
    await delay(150);
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
  detail: (id: string) => [...ADMIN_CATEGORIES_KEYS.all, "detail", id] as const,
};

export const useAdminCategories = (filters: CategoryFilterParams) =>
  useQuery({
    queryKey: ADMIN_CATEGORIES_KEYS.list(filters),
    queryFn: () => adminCategoriesService.getCategories(filters),
    placeholderData: (previousData) => previousData,
  });

export const useAdminCategoryDetail = (id?: string) =>
  useQuery({
    queryKey: ADMIN_CATEGORIES_KEYS.detail(id || ""),
    queryFn: () => adminCategoriesService.getCategoryById(id || ""),
    enabled: Boolean(id),
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

export const useCreateAdminCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCategoryPayload) =>
      adminCategoriesService.createCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_CATEGORIES_KEYS.all });
    },
  });
};

export const useUpdateAdminCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateCategoryPayload;
    }) => adminCategoriesService.updateCategory(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_CATEGORIES_KEYS.all });
      queryClient.invalidateQueries({
        queryKey: ADMIN_CATEGORIES_KEYS.detail(variables.id),
      });
    },
  });
};

export const useDeleteAdminCategoryAttribute = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      categoryId,
      attributeId,
    }: {
      categoryId: string;
      attributeId: string;
    }) =>
      adminCategoriesService.deleteCategoryAttribute(categoryId, attributeId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_CATEGORIES_KEYS.all });
      queryClient.invalidateQueries({
        queryKey: ADMIN_CATEGORIES_KEYS.detail(variables.categoryId),
      });
    },
  });
};
