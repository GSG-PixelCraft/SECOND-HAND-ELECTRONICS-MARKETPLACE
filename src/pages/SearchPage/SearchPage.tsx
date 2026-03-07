import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/Button/button";
import { FiltersPart } from "@/components/ui/FiltersPart/FiltersPart";
import { SearchSort } from "@/components/ui/SearchSort/SearchSort";
import { Text } from "@/components/ui/Text/text";
import { HomeProductCard } from "@/components/homePage/HomeProductCard";
import type { Product } from "@/types";
import type { FiltersState } from "@/components/ui/FiltersPart/FiltersPart";
import { useProducts, useCategories } from "@/services/product.service";
import {
  useAddToWishlist,
  useRemoveFromWishlist,
  useWishlist,
} from "@/services/wishlist.service";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [categoryFilter, setCategoryFilter] = useState(
    searchParams.get("category") || "",
  );
  const [showFilters, setShowFilters] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [sortBy, setSortBy] = useState<string>("Newest");
  const [filtersState, setFiltersState] = useState<FiltersState>({
    categories: [],
    condition: [],
    priceRange: { min: "", max: "" },
    brand: [],
    model: [],
    storage: [],
    sellerType: [],
    location: { country: "", city: "", useCurrentLocation: false },
  });

  const searchTimeoutRef = useRef<number | undefined>(undefined);
  const isUrlSyncRef = useRef(false);
  useCleanupTimers(searchTimeoutRef);
  // Backend data source
  const { data: apiData } = useProducts(
    searchQuery.trim()
      ? {
          search: searchQuery.trim(),
          limit: 100,
          sortBy: "createdAt",
          sortOrder: "desc",
        }
      : { limit: 100, sortBy: "createdAt", sortOrder: "desc" },
  );
  const { data: categoriesData } = useCategories();
  const { data: wishlist = [] } = useWishlist();
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  const effectiveCategories = Array.isArray(categoriesData)
    ? categoriesData
    : [];
  const wishlistedIds = useMemo(
    () => new Set(wishlist.map((item) => String(item.id))),
    [wishlist],
  );

  const handleToggleFavorite = useCallback(
    (productId: string) => {
      if (wishlistedIds.has(productId)) {
        removeFromWishlist.mutate(productId);
      } else {
        addToWishlist.mutate(productId);
      }
    },
    [addToWishlist, removeFromWishlist, wishlistedIds],
  );

  const performSearch = useCallback(
    (query: string, filters: FiltersState) => {
      if (searchTimeoutRef.current) {
        window.clearTimeout(searchTimeoutRef.current);
      }
      setIsSearching(true);
      searchTimeoutRef.current = window.setTimeout(() => {
        const base = apiData?.products ?? [];
        let results = base;

        const effectiveCategories = filters.categories.map((c) =>
          c.toLowerCase(),
        );

        if (effectiveCategories.length > 0) {
          const selected = new Set(effectiveCategories);
          results = results.filter((p) =>
            selected.has(p.category.name.toLowerCase()),
          );
        }

        if (filters.condition.length > 0) {
          const mapCond = (c: string) => c.toLowerCase().replace(/\s+/g, "-"); // Like New -> like-new
          const selectedConds = new Set(filters.condition.map(mapCond));
          results = results.filter((p) => selectedConds.has(p.condition));
        }

        const hasAttributeValue = (p: Product, needle: string): boolean => {
          const n = needle.trim().toLowerCase();
          if (!n) return false;
          return (
            p.attributes?.some((attr) => {
              const value = String(attr.value ?? "").toLowerCase();
              const name = String(attr.attributeName ?? "").toLowerCase();
              return value.includes(n) || name.includes(n);
            }) ?? false
          );
        };

        if (filters.brand.length > 0) {
          const selectedBrands = new Set(
            filters.brand.map((b) => b.toLowerCase()),
          );
          results = results.filter((p) => {
            const title = p.title.toLowerCase();
            const description = (p.description ?? "").toLowerCase();
            return [...selectedBrands].some(
              (brand) =>
                title.includes(brand) ||
                description.includes(brand) ||
                hasAttributeValue(p, brand),
            );
          });
        }

        if (filters.model.length > 0) {
          const selectedModels = new Set(
            filters.model.map((m) => m.toLowerCase()),
          );
          results = results.filter((p) => {
            const title = p.title.toLowerCase();
            const description = (p.description ?? "").toLowerCase();
            return [...selectedModels].some(
              (model) =>
                title.includes(model) ||
                description.includes(model) ||
                hasAttributeValue(p, model),
            );
          });
        }

        if (filters.storage.length > 0) {
          const selectedStorage = new Set(
            filters.storage.map((s) => s.toLowerCase()),
          );
          results = results.filter((p) => {
            const title = p.title.toLowerCase();
            const description = (p.description ?? "").toLowerCase();
            return [...selectedStorage].some(
              (storage) =>
                title.includes(storage) ||
                description.includes(storage) ||
                hasAttributeValue(p, storage),
            );
          });
        }

        if (filters.sellerType.includes("Verified sellers")) {
          results = results.filter((p) => Boolean(p.seller));
        }

        if (filters.location.city) {
          const city = filters.location.city.toLowerCase();
          results = results.filter((p) =>
            (p.location ?? "").toLowerCase().includes(city),
          );
        }

        const min = filters.priceRange.min
          ? Number(filters.priceRange.min)
          : undefined;
        const max = filters.priceRange.max
          ? Number(filters.priceRange.max)
          : undefined;
        if (min !== undefined) results = results.filter((p) => p.price >= min);
        if (max !== undefined) results = results.filter((p) => p.price <= max);

        if (query.trim()) {
          const q = query.toLowerCase();
          results = results.filter(
            (p) =>
              p.title.toLowerCase().includes(q) ||
              p.category.name.toLowerCase().includes(q),
          );
        }
        const sorted = [...results];
        const sort = (sortBy || "Newest").toLowerCase();
        const byDateDesc = (a: Product, b: Product) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (sort.includes("best match")) {
          const q = query.trim().toLowerCase();
          if (q) {
            const score = (p: Product) => {
              const title = p.title.toLowerCase();
              const ci = title.indexOf(q);
              const catHit = p.category.name.toLowerCase().includes(q)
                ? -50
                : 0;
              return (ci === -1 ? 10000 : ci) + catHit;
            };
            sorted.sort((a, b) => score(a) - score(b) || byDateDesc(a, b));
          } else {
            sorted.sort(byDateDesc);
          }
        } else if (sort.includes("most viewed")) {
          sorted.sort((a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0));
        } else if (sort.includes("low to high")) {
          sorted.sort((a, b) => a.price - b.price);
        } else if (sort.includes("high to low")) {
          sorted.sort((a, b) => b.price - a.price);
        } else {
          sorted.sort(byDateDesc);
        }

        setFilteredProducts(sorted);
        setIsSearching(false);
      }, 250);
    },
    [apiData, categoryFilter, sortBy],
  );

  useEffect(() => {
    const query = searchParams.get("q");
    const category = searchParams.get("category");

    const nextCategory = category ?? "";
    const nextQuery = query ?? "";

    if (nextCategory !== categoryFilter) {
      setCategoryFilter(nextCategory);
    }

    if (nextQuery !== searchQuery) {
      setSearchQuery(nextQuery);
    }
  }, [searchParams]);

  useEffect(() => {
    const normalizedCategories = categoryFilter
      .split(",")
      .map((c) => c.trim().toLowerCase())
      .filter(Boolean);

    const currentCategories = filtersState.categories
      .map((c) => c.trim().toLowerCase())
      .filter(Boolean);

    const isSameCategories =
      normalizedCategories.length === currentCategories.length &&
      normalizedCategories.every(
        (value, index) => value === currentCategories[index],
      );

    if (isSameCategories) return;

    isUrlSyncRef.current = true;

    const displayCategories = normalizedCategories.map((normalized) => {
      const match = effectiveCategories.find(
        (c) => c.name.toLowerCase() === normalized,
      );
      return match
        ? match.name
        : (normalized[0]?.toUpperCase() || "") + normalized.slice(1);
    });

    setFiltersState((prev) => ({ ...prev, categories: displayCategories }));
    setTimeout(() => {
      isUrlSyncRef.current = false;
    }, 0);
  }, [categoryFilter, filtersState.categories, effectiveCategories]);

  useEffect(() => {
    performSearch(searchQuery, filtersState);
  }, [searchQuery, categoryFilter, filtersState, performSearch]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const trimmed = query.trim();
    const selectedCategories = filtersState.categories
      .map((c) => c.toLowerCase())
      .filter(Boolean);

    if (trimmed) {
      const next: Record<string, string> = { q: trimmed };
      if (selectedCategories.length > 0) {
        next.category = selectedCategories.join(",");
      }
      setSearchParams(next);
    } else {
      const next: Record<string, string> = {};
      if (selectedCategories.length > 0) {
        next.category = selectedCategories.join(",");
      }
      setSearchParams(next);
    }
  };

  const handleFiltersChange = useCallback(
    (next: FiltersState) => {
      setFiltersState(next);
      if (isUrlSyncRef.current) return;

      const nextParams: Record<string, string> = {};
      if (next.categories.length > 0) {
        nextParams.category = next.categories
          .map((category) => category.toLowerCase())
          .join(",");
      }

      const q = searchQuery.trim();
      if (q) {
        nextParams.q = q;
      }

      const currentQuery = searchParams.toString();
      const nextQuery = new URLSearchParams(nextParams).toString();
      if (nextQuery !== currentQuery) {
        setSearchParams(nextParams);
      }
    },
    [searchParams, searchQuery, setSearchParams],
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col lg:flex-row">
        <div className="min-h-screen flex-shrink-0 border-r border-gray-200 bg-white lg:w-80">
          <div className="p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
              <Button
                type="button"
                intent="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </div>
            <div className={`${showFilters ? "block" : "hidden"} lg:block`}>
              <FiltersPart
                onSearch={handleSearch}
                onFilterChange={handleFiltersChange}
                categoriesList={effectiveCategories.map((c) => c.name)}
              />
            </div>
          </div>
        </div>

        <div className="flex-1 p-6">
          <div className="mb-6 flex items-center justify-between">
            <div></div>
            <SearchSort onSortChange={setSortBy} />
          </div>

          {isSearching && (
            <div className="py-8 text-center">
              <div className="inline-flex items-center gap-2 text-sm text-blue-600">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                Searching...
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {!isSearching && filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <HomeProductCard
                  key={product.id}
                  image={product.images[0] ?? ""}
                  title={product.title}
                  price={`${product.price} ILS`}
                  location={
                    (typeof product.location === "string" &&
                      product.location.trim()) ||
                    "Location not specified"
                  }
                  category={product.category.name}
                  isFavorite={wishlistedIds.has(String(product.id))}
                  onToggleFavorite={() =>
                    handleToggleFavorite(String(product.id))
                  }
                />
              ))
            ) : !isSearching ? (
              <div className="col-span-full py-12 text-center">
                <Text variant="muted">
                  {searchQuery || categoryFilter
                    ? "No products found."
                    : "Search results will appear here."}
                </Text>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function useCleanupTimers(ref: React.MutableRefObject<number | undefined>) {
  useEffect(() => {
    return () => {
      if (ref.current) window.clearTimeout(ref.current);
    };
  }, [ref]);
}
