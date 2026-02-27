import { type FormEvent, useEffect, useMemo, useState } from "react";
import { isAxiosError } from "axios";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/Button/button";
import { FiltersPart } from "@/components/ui/FiltersPart/FiltersPart";
import { SearchSort } from "@/components/ui/SearchSort/SearchSort";
import { Text } from "@/components/ui/Text/text";
import { HomeProductCard } from "@/components/homePage/HomeProductCard";
import { useProducts } from "@/services/product.service";
import {
  CATEGORY_NAME_TO_ID,
  CONDITION_LABEL_TO_VALUE,
  createInitialFilters,
} from "@/constants/filter-options";
import type { FiltersState } from "@/types/filters";
import type { ProductsParams } from "@/types/product";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FiltersState>(() =>
    createInitialFilters(),
  );
  const [sortByLabel, setSortByLabel] = useState("Newest");

  useEffect(() => {
    const query = searchParams.get("q") ?? "";
    setSearchQuery(query);
  }, [searchParams]);

  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  const productParams = useMemo(
    () => buildProductsParams(filters, searchQuery, sortByLabel),
    [filters, searchQuery, sortByLabel],
  );

  const { data, isLoading, isFetching, isError, error } =
    useProducts(productParams);

  const handleFilterChange = (newFilters: FiltersState) => {
    setFilters(newFilters);
  };

  const handleSortChange = (sort: string) => {
    setSortByLabel(sort);
  };

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalized = searchInput.trim();
    const params = new URLSearchParams(searchParams);

    if (normalized) {
      params.set("q", normalized);
    } else {
      params.delete("q");
    }

    setSearchParams(params);
  };

  const products = data?.products ?? [];
  const totalResults = data?.total ?? 0;
  const isLoadingResults = isLoading || isFetching;

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
                onFilterChange={handleFilterChange}
              />
            </div>
          </div>
        </div>

        <div className="flex-1 p-6">
          <header className="mb-6 space-y-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-semibold text-gray-900">
                {searchQuery ? `Results for "${searchQuery}"` : "All Products"}
              </h2>
              {totalResults > 0 && (
                <p className="text-sm text-gray-600">{totalResults} results</p>
              )}
            </div>

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <form
                onSubmit={handleSearchSubmit}
                className="flex w-full max-w-md gap-2"
              >
                <input
                  type="search"
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Search products"
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <Button
                  type="submit"
                  intent="primary"
                  className="rounded-lg px-5 py-2.5 text-sm font-semibold"
                >
                  Search
                </Button>
              </form>

              <SearchSort onSortChange={handleSortChange} />
            </div>
          </header>

          {isError && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {getProductsErrorMessage(error)}
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {isLoadingResults &&
              Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={`skeleton-${index}`}
                  className="h-64 animate-pulse rounded-lg border border-gray-200 bg-white"
                />
              ))}

            {!isLoadingResults && products.length === 0 && (
              <div className="col-span-full py-12 text-center">
                <Text variant="muted">
                  No products match these filters yet.
                </Text>
              </div>
            )}

            {!isLoadingResults &&
              products.map((product) => (
                <HomeProductCard
                  key={product.id}
                  image={product.images?.[0] ?? ""}
                  title={product.name}
                  price={formatPrice(product.price)}
                  location={product.category || "Online"}
                  category={formatConditionLabel(product.condition)}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const SORT_QUERY_MAP: Record<
  string,
  { sortBy?: ProductsParams["sortBy"]; sortOrder?: ProductsParams["sortOrder"] }
> = {
  "Best Match": {},
  Newest: { sortBy: "createdAt", sortOrder: "desc" },
  "Most Viewed": { sortBy: "viewCount", sortOrder: "desc" },
  "Price - Low to High": { sortBy: "price", sortOrder: "asc" },
  "Price - High to Low": { sortBy: "price", sortOrder: "desc" },
  Nearest: {},
};

const DEFAULT_PAGE_SIZE = 12;

const parsePriceInput = (value: string): number | undefined => {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
};

const buildSearchKeywords = (filters: FiltersState, searchQuery: string) => {
  const keywords = [
    searchQuery,
    ...filters.brand,
    ...filters.model,
    ...filters.storage,
  ];

  if (filters.location.city) keywords.push(filters.location.city);
  if (filters.location.country) keywords.push(filters.location.country);

  return keywords
    .map((value) => value.trim())
    .filter(Boolean)
    .join(" ");
};

const buildProductsParams = (
  filters: FiltersState,
  searchQuery: string,
  sortLabel: string,
): ProductsParams => {
  const params: ProductsParams = {
    page: 1,
    limit: DEFAULT_PAGE_SIZE,
  };

  const categoryIds = filters.categories
    .map((category) => CATEGORY_NAME_TO_ID[category])
    .filter((value): value is number => typeof value === "number");
  if (categoryIds.length > 0) {
    params.categoryIds = categoryIds;
  }

  const condition = filters.condition
    .map(
      (label) => CONDITION_LABEL_TO_VALUE[label] ?? label.toLowerCase().trim(),
    )
    .filter(Boolean);
  if (condition.length > 0) {
    params.condition = condition;
  }

  const minPrice = parsePriceInput(filters.priceRange.min);
  if (minPrice !== undefined) params.minPrice = minPrice;

  const maxPrice = parsePriceInput(filters.priceRange.max);
  if (maxPrice !== undefined) params.maxPrice = maxPrice;

  const searchValue = buildSearchKeywords(filters, searchQuery);
  if (searchValue) params.search = searchValue;

  const sortConfig = SORT_QUERY_MAP[sortLabel] ?? SORT_QUERY_MAP.Newest;
  if (sortConfig.sortBy) params.sortBy = sortConfig.sortBy;
  if (sortConfig.sortOrder) params.sortOrder = sortConfig.sortOrder;

  return params;
};

const formatPrice = (price: number) =>
  Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "ILS",
    maximumFractionDigits: 0,
  }).format(price);

const formatConditionLabel = (value?: string) => {
  if (!value) return "General";
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const getProductsErrorMessage = (error: unknown): string => {
  if (isAxiosError(error)) {
    if (error.response?.status === 401) {
      return "Please sign in to view the latest products.";
    }
    const payload = error.response?.data as { message?: string } | undefined;
    if (payload?.message) return payload.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to load products. Please try again.";
};
