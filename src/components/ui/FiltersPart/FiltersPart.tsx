import { useState } from "react";
import { LocationPermissionModal } from "../LocationPermissionModal/LocationPermissionModal";
import {
  BRAND_OPTIONS,
  CATEGORY_OPTIONS,
  CONDITION_OPTIONS,
  SELLER_TYPES,
  STORAGE_OPTIONS,
} from "@/constants/filter-options";
import { useListingFilters } from "@/hooks/useListingFilters";
import type { FiltersPartProps, FiltersState } from "@/types/filters";

import { CheckboxSection } from "./sections/CheckboxSection";
import { SearchSection } from "./sections/SearchSection";
import { PriceRangeSection } from "./sections/PriceRangeSection";
import { LocationSection } from "./sections/LocationSection";
import { FilterBadgePill } from "./sections/FilterBadgePill";

type SearchKey = "brand" | "model";

export const FiltersPart = ({
  className = "",
  onSearch,
  onFilterChange,
}: FiltersPartProps) => {
  const {
    filters,
    update,
    toggle,
    reset,
    countries,
    cities,
    badgeItems,
    modelOptions,
    showStorage,
  } = useListingFilters(onFilterChange);

  const [searchTerms, setSearchTerms] = useState<Record<SearchKey, string>>({
    brand: "",
    model: "",
  });

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  const handleSearchChange = (key: SearchKey, value: string) => {
    setSearchTerms((prev) => ({ ...prev, [key]: value }));
    onSearch?.(value);
  };

  const handlePriceChange = (
    field: keyof FiltersState["priceRange"],
    value: string,
  ) => {
    update("priceRange", { ...filters.priceRange, [field]: value });
  };

  const handleLocationChange = (
    value: Partial<FiltersState["location"]>,
  ) => {
    update("location", { ...filters.location, ...value });
  };

  const hasFilters = badgeItems.length > 0;

  return (
    <div className={`w-full ${className}`}>
      <div className="w-full max-w-sm rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            <button
              type="button"
              onClick={reset}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Clear all
            </button>
          </div>

          {hasFilters && (
            <div className="mt-3 flex flex-wrap gap-2">
              {badgeItems.map((badge) => (
                <FilterBadgePill key={badge.id} {...badge} />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6 p-6">
          <CheckboxSection
            title="Categories"
            options={CATEGORY_OPTIONS}
            selected={filters.categories}
            onToggle={(value) => toggle("categories", value)}
          />

          <CheckboxSection
            title="Condition"
            options={CONDITION_OPTIONS}
            selected={filters.condition}
            onToggle={(value) => toggle("condition", value)}
          />

          <PriceRangeSection
            priceRange={filters.priceRange}
            onChange={handlePriceChange}
          />

          {filters.categories.length > 0 && (
            <SearchSection
              title="Brand"
              placeholder="Search about Brand"
              options={BRAND_OPTIONS}
              selected={filters.brand}
              searchValue={searchTerms.brand}
              onSearchChange={(value) =>
                handleSearchChange("brand", value)
              }
              onToggle={(value) => toggle("brand", value)}
            />
          )}

          {modelOptions.length > 0 && (
            <SearchSection
              title="Model"
              placeholder="Search about Model"
              options={modelOptions}
              selected={filters.model}
              searchValue={searchTerms.model}
              onSearchChange={(value) =>
                handleSearchChange("model", value)
              }
              onToggle={(value) => toggle("model", value)}
            />
          )}

          {showStorage && (
            <CheckboxSection
              title="Storage"
              options={STORAGE_OPTIONS}
              selected={filters.storage}
              onToggle={(value) => toggle("storage", value)}
            />
          )}

          <CheckboxSection
            title="Seller type"
            options={SELLER_TYPES}
            selected={filters.sellerType}
            onToggle={(value) => toggle("sellerType", value)}
          />

          <LocationSection
            countries={countries}
            cities={cities}
            location={filters.location}
            onLocationChange={handleLocationChange}
            onOpenPermissionModal={() =>
              setIsLocationModalOpen(true)
            }
          />
        </div>
      </div>

      <LocationPermissionModal
        isOpen={isLocationModalOpen}
        onAllow={() => {
          handleLocationChange({ useCurrentLocation: true });
          setIsLocationModalOpen(false);
        }}
        onDeny={() => setIsLocationModalOpen(false)}
      />
    </div>
  );
};

export type { FiltersPartProps, FiltersState };
