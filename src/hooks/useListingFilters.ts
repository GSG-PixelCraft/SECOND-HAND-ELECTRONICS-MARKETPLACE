import { useCallback, useEffect, useMemo, useState } from "react";
import {
  fetchCountries,
  fetchCitiesByCountry,
  type LocationCountry,
} from "@/services/location.service";
import {
  createInitialFilters,
  MODEL_OPTIONS_BY_CATEGORY,
  STORAGE_CATEGORIES,
} from "@/constants/filter-options";
import type {
  ArrayFilterKey,
  FilterBadge,
  FiltersPartProps,
  FiltersState,
} from "@/types/filters";

const buildBadgeItems = (
  filters: FiltersState,
  remove: (key: ArrayFilterKey, value: string) => void,
  update: <K extends keyof FiltersState>(key: K, value: FiltersState[K]) => void,
  selectedCountryName: string,
): FilterBadge[] => {
  const badges: FilterBadge[] = [];
  const collect = (key: ArrayFilterKey) => {
    filters[key].forEach((value) =>
      badges.push({
        id: `${key}-${value}`,
        label: value,
        onRemove: () => remove(key, value),
      }),
    );
  };

  (["categories", "condition", "brand", "model", "storage", "sellerType"] as ArrayFilterKey[]).forEach(
    collect,
  );

  if (filters.priceRange.min || filters.priceRange.max) {
    badges.push({
      id: "price",
      label: `${filters.priceRange.min || "0"}-${filters.priceRange.max || "\u221e"} ILS`,
      onRemove: () => update("priceRange", { min: "", max: "" }),
    });
  }

  if (
    filters.location.country ||
    filters.location.city ||
    filters.location.useCurrentLocation
  ) {
    badges.push({
      id: "location",
      label: filters.location.useCurrentLocation
        ? "Current Location"
        : `${selectedCountryName || filters.location.country}${filters.location.city ? `, ${filters.location.city}` : ""}`,
      onRemove: () =>
        update("location", {
          country: "",
          city: "",
          useCurrentLocation: false,
        }),
    });
  }

  return badges;
};

export const useListingFilters = (
  onFilterChange?: FiltersPartProps["onFilterChange"],
) => {
  const [filters, setFilters] = useState<FiltersState>(() =>
    createInitialFilters(),
  );
  const [countries, setCountries] = useState<LocationCountry[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  useEffect(() => {
    fetchCountries().then(setCountries);
  }, []);

  useEffect(() => {
    if (!filters.location.country) {
      setCities([]);
      return;
    }
    fetchCitiesByCountry(filters.location.country).then(setCities);
  }, [filters.location.country]);

  useEffect(() => {
    onFilterChange?.(filters);
  }, [filters, onFilterChange]);

  const update = useCallback(
    <K extends keyof FiltersState>(key: K, value: FiltersState[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const toggle = useCallback((key: ArrayFilterKey, value: string) => {
    setFilters((prev) => {
      const list = prev[key] as string[];
      const next = list.includes(value)
        ? list.filter((item) => item !== value)
        : [...list, value];
      return { ...prev, [key]: next };
    });
  }, []);

  const remove = useCallback((key: ArrayFilterKey, value: string) => {
    setFilters((prev) => {
      const list = prev[key] as string[];
      return { ...prev, [key]: list.filter((item) => item !== value) };
    });
  }, []);

  const reset = useCallback(() => setFilters(createInitialFilters()), []);

  const selectedCountryName = useMemo(
    () =>
      countries.find((country) => country.code === filters.location.country)
        ?.name ?? "",
    [countries, filters.location.country],
  );

  const badgeItems = useMemo(
    () => buildBadgeItems(filters, remove, update, selectedCountryName),
    [filters, remove, update, selectedCountryName],
  );

  const modelOptions = useMemo(
    () =>
      Array.from(
        new Set(
          filters.categories.flatMap(
            (category) => MODEL_OPTIONS_BY_CATEGORY[category] ?? [],
          ),
        ),
      ),
    [filters.categories],
  );

  const showStorage = useMemo(
    () =>
      filters.categories.some((category) =>
        STORAGE_CATEGORIES.includes(category),
      ),
    [filters.categories],
  );

  return {
    filters,
    update,
    toggle,
    remove,
    reset,
    countries,
    cities,
    selectedCountryName,
    badgeItems,
    modelOptions,
    showStorage,
  };
};
