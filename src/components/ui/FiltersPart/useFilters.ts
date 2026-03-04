import { useEffect, useMemo, useRef, useState } from "react";
import type { FiltersState } from "./FiltersPart";
import {
  fetchCountries,
  fetchCitiesByCountry,
  type LocationCountry,
} from "@/services/location.service";

export interface UseFiltersControllerParams {
  onFilterChange?: (filters: FiltersState) => void;
  onSearch?: (keyword: string) => void;
}

export const DEFAULT_FILTERS: FiltersState = {
  categories: [],
  condition: [],
  priceRange: { min: "", max: "" },
  brand: [],
  model: [],
  storage: [],
  sellerType: [],
  location: { country: "", city: "", useCurrentLocation: false },
};

export function useFiltersController({
  onFilterChange,
  onSearch,
}: UseFiltersControllerParams) {
  const [filters, setFilters] = useState<FiltersState>(DEFAULT_FILTERS);
  const [countries, setCountries] = useState<LocationCountry[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [brandSearch, setBrandSearch] = useState("");
  const [modelSearch, setModelSearch] = useState("");
  const [keyword, setKeyword] = useState("");
  const [showLocationModal, setShowLocationModal] = useState(false);

  // Stable callback ref to avoid effect-churn
  const onFiltersChangeRef = useRef(onFilterChange);
  useEffect(() => {
    onFiltersChangeRef.current = onFilterChange;
  }, [onFilterChange]);

  // hydrate countries and dependent cities
  useEffect(() => {
    fetchCountries().then(setCountries);
  }, []);
  useEffect(() => {
    if (!filters.location.country) return setCities([]);
    fetchCitiesByCountry(filters.location.country).then(setCities);
  }, [filters.location.country]);

  // notify parent on filters change
  useEffect(() => {
    onFiltersChangeRef.current?.(filters);
  }, [filters]);

  // debounce keyword search
  useEffect(() => {
    const t = setTimeout(() => onSearch?.(keyword), 250);
    return () => clearTimeout(t);
  }, [keyword, onSearch]);

  // derived model options
  const phoneModels = ["iPhone 15", "iPhone 14", "Samsung S24", "Pixel 8"];
  const laptopModels = ["MacBook Pro", "MacBook Air", "Dell XPS", "HP Spectre"];
  const tabletModels = ["iPad Pro", "iPad Air", "Samsung Tab"];
  const modelOptions = useMemo(() => {
    const m: string[] = [];
    if (filters.categories.includes("Phones")) m.push(...phoneModels);
    if (filters.categories.includes("Laptops")) m.push(...laptopModels);
    if (filters.categories.includes("Tablets")) m.push(...tabletModels);
    return m;
  }, [filters.categories]);

  const update = <K extends keyof FiltersState>(key: K, value: FiltersState[K]) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const toggle = (key: keyof FiltersState, val: string) => {
    const arr = filters[key] as string[];
    update(
      key,
      arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val],
    );
  };

  const remove = (key: keyof FiltersState, val: string) =>
    update(
      key,
      (filters[key] as string[]).filter((v) => v !== val),
    );

  const reset = () => setFilters(DEFAULT_FILTERS);

  const hasFilters = useMemo(() => {
    return Object.values(filters).some((v) =>
      Array.isArray(v)
        ? v.length > 0
        : typeof v === "object"
          ? Object.values(v).some((x) => x)
          : v,
    );
  }, [filters]);

  const showBrand = filters.categories.length > 0;
  const showModel = modelOptions.length > 0;
  const selectedCountryName =
    countries.find((country) => country.code === filters.location.country)?.name ?? "";

  return {
    // state
    filters,
    countries,
    cities,
    brandSearch,
    modelSearch,
    keyword,
    showLocationModal,
    // setters
    setBrandSearch,
    setModelSearch,
    setKeyword,
    setShowLocationModal,
    // helpers
    modelOptions,
    showBrand,
    showModel,
    hasFilters,
    selectedCountryName,
    update,
    toggle,
    remove,
    reset,
  } as const;
}

