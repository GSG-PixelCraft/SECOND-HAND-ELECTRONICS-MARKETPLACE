import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { api } from "./client";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import { useAuthStore } from "@/stores/useAuthStore";
import { getBackendErrorMessage } from "@/lib/api-error";
import type { WishlistItem } from "@/dto/wishlist";

/** Returns true when the AxiosError has the given HTTP status code. */
const isHttpStatus = (err: unknown, status: number): boolean => {
  if (err && typeof err === "object" && "response" in err) {
    return (
      (err as { response?: { status?: number } }).response?.status === status
    );
  }
  return false;
};

// ============================================================================
// Query Keys
// ============================================================================

export const WISHLIST_KEYS = {
  all: ["wishlist"] as const,
};

// ============================================================================
// Raw API normalization helpers
// ============================================================================

/** Images can arrive as plain strings or as objects with a `url` field. */
const parseImages = (imgs: unknown): string[] => {
  if (!Array.isArray(imgs)) return [];
  return imgs
    .map((img) => {
      if (typeof img === "string") return img;
      if (img && typeof img === "object")
        return (
          ((img as Record<string, unknown>).url as string | undefined) ?? ""
        );
      return "";
    })
    .filter(Boolean);
};

const parseCategory = (cat: unknown): WishlistItem["category"] => {
  if (!cat || typeof cat !== "object") return null;
  const c = cat as Record<string, unknown>;
  return { id: String(c.id ?? ""), name: String(c.name ?? "") };
};

const parseSeller = (seller: unknown): WishlistItem["seller"] => {
  if (!seller || typeof seller !== "object") return undefined;
  const s = seller as Record<string, unknown>;
  const idSrc = s.id ?? s.email;
  if (idSrc === undefined || idSrc === null) return undefined;
  return {
    id: String(idSrc),
    name: String(s.fullName ?? s.name ?? ""),
    avatar: (s.avatar as string | undefined) ?? undefined,
  };
};

/**
 * Normalise a single raw entry into a `WishlistItem`.
 * Handles two API shapes:
 *   A) Flat product object — `{ id, title, price, images, ... }`
 *   B) Wishlist-entry object — `{ id, productId, product: { id, title, ... } }`
 * In both cases `WishlistItem.id` is set to the **product ID** (string) so
 * that it can be matched against product IDs elsewhere and passed directly to
 * the DELETE /wishlist/{productId} endpoint.
 */
const normalizeItem = (raw: unknown): WishlistItem | null => {
  if (!raw || typeof raw !== "object") return null;
  const item = raw as Record<string, unknown>;

  // Shape B: wishlist entry with nested product relation
  if (item.product && typeof item.product === "object") {
    const product = item.product as Record<string, unknown>;
    const productId = item.productId ?? product.id ?? item.id;
    return {
      id: String(productId ?? ""),
      title: String(product.title ?? product.name ?? ""),
      price: Number(product.price ?? 0),
      images: parseImages(product.images),
      location: (product.location as string | null) ?? null,
      category: parseCategory(product.category),
      condition: String(product.condition ?? "good"),
      status: product.status ? String(product.status) : undefined,
      isNegotiable: Boolean(product.isNegotiable),
      createdAt: String(product.createdAt ?? new Date().toISOString()),
      seller: parseSeller(product.seller),
    };
  }

  // Shape A: flat product object
  return {
    id: String(item.id ?? ""),
    title: String(item.title ?? item.name ?? ""),
    price: Number(item.price ?? 0),
    images: parseImages(item.images),
    location: (item.location as string | null) ?? null,
    category: parseCategory(item.category),
    condition: String(item.condition ?? "good"),
    status: item.status ? String(item.status) : undefined,
    isNegotiable: Boolean(item.isNegotiable),
    createdAt: String(item.createdAt ?? new Date().toISOString()),
    seller: parseSeller(item.seller),
  };
};

/** Pull the raw item array out of whatever envelope the server sends. */
const extractRawArray = (raw: unknown): unknown[] => {
  if (Array.isArray(raw)) return raw;
  if (raw && typeof raw === "object") {
    const obj = raw as Record<string, unknown>;
    if (Array.isArray(obj.data)) return obj.data;
    if (obj.data && typeof obj.data === "object") {
      const inner = obj.data as Record<string, unknown>;
      if (Array.isArray(inner.data)) return inner.data;
      if (Array.isArray(inner.items)) return inner.items;
    }
  }
  return [];
};

const wishlistService = {
  getWishlist: async (): Promise<WishlistItem[]> => {
    const raw = await api.get<unknown>(API_ENDPOINTS.WISHLIST.GET);
    return extractRawArray(raw)
      .map(normalizeItem)
      .filter((item): item is WishlistItem => item !== null);
  },

  addToWishlist: (productId: string) =>
    api.post<unknown>(API_ENDPOINTS.WISHLIST.ADD, { productId }),

  removeFromWishlist: (productId: string) =>
    api.delete<unknown>(API_ENDPOINTS.WISHLIST.REMOVE(productId)),
};

// ============================================================================
// Hooks
// ============================================================================

export const useWishlist = () => {
  const { user, token } = useAuthStore();
  const isAuthenticated = Boolean(user && token);

  return useQuery({
    queryKey: WISHLIST_KEYS.all,
    queryFn: wishlistService.getWishlist,
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000,
  });
};

export const useAddToWishlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId: string) => wishlistService.addToWishlist(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WISHLIST_KEYS.all });
      toast.success("Added to wishlist");
    },
    onError: (err) => {
      // 409 Conflict = already in wishlist — the desired state is achieved
      if (isHttpStatus(err, 409)) {
        queryClient.invalidateQueries({ queryKey: WISHLIST_KEYS.all });
        return;
      }
      const msg = getBackendErrorMessage(err);
      toast.error(msg ?? "Failed to add to wishlist");
    },
  });
};

export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId: string) =>
      wishlistService.removeFromWishlist(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WISHLIST_KEYS.all });
      toast.error("Removed from wishlist");
    },
    onError: (err) => {
      // 404 = item was not in wishlist — removal is effectively already done
      if (isHttpStatus(err, 404)) {
        queryClient.invalidateQueries({ queryKey: WISHLIST_KEYS.all });
        return;
      }
      const msg = getBackendErrorMessage(err);
      toast.error(msg ?? "Failed to remove from wishlist");
    },
  });
};

/**
 * Convenience hook — returns the current favourite state and a toggle handler
 * for a single product. Safe to call even when unauthenticated (isFavorite
 * will always be false and toggle will be a no-op).
 */
export const useToggleWishlist = (productId: string) => {
  const { user, token } = useAuthStore();
  const isAuthenticated = Boolean(user && token);
  const { data: wishlist } = useWishlist();
  const add = useAddToWishlist();
  const remove = useRemoveFromWishlist();

  const isFavorite =
    wishlist?.some((item) => String(item.id) === String(productId)) ?? false;
  const isPending = add.isPending || remove.isPending;

  const toggle = () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to save items to your wishlist");
      return;
    }
    if (isPending) return;
    if (isFavorite) {
      remove.mutate(productId);
    } else {
      add.mutate(productId);
    }
  };

  return { isFavorite, toggle, isPending };
};
