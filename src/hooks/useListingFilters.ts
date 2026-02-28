import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  ArrayFilterKey,
  FilterBadge,
  FiltersState,
} from "@/types/filters";
import {
  BRAND_OPTIONS,
  CATEGORY_OPTIONS,
  CONDITION_OPTIONS,
  MODEL_OPTIONS_BY_CATEGORY,
  STORAGE_CATEGORIES,
  STORAGE_OPTIONS,
  createInitialFilters,
} from "@/constants/filter-options";
import { fetchCountries, fetchCitiesByCountry } from "@/services/location.service";

type OnChange = (filters: FiltersState) => void;

export const useListingFilters = (onChange?: OnChange) => {
  const [filters, setFilters] = useState<FiltersState>(createInitialFilters());
  const [countries, setCountries] = useState<Array<{ code: string; name: string }>>([]);
  const [cities, setCities] = useState<string[]>([]);

  // Fetch countries once
  useEffect(() => {
    void (async () => {
      const result = await fetchCountries();
      setCountries(result);
    })();
  }, []);

  // Fetch cities when country changes
  useEffect(() => {
    const code = filters.location.country;
    if (!code) {
      setCities([]);
      return;
    }
    void (async () => {
      const result = await fetchCitiesByCountry(code);
      setCities(result);
    })();
  }, [filters.location.country]);

  const emitChange = useCallback(
    (next: FiltersState) => {
      setFilters(next);
      onChange?.(next);
    },
    [onChange],
  );

  const update = useCallback(
    <K extends keyof FiltersState>(key: K, value: FiltersState[K]) => {
      emitChange({ ...filters, [key]: value });
    },
    [emitChange, filters],
  );

  const toggle = useCallback(
    (key: ArrayFilterKey, value: string) => {
      const current = filters[key] as string[];
      const exists = current.includes(value);
      const next = exists ? current.filter((v) => v !== value) : [...current, value];
      emitChange({ ...filters, [key]: next } as FiltersState);
    },
    [emitChange, filters],
  );

  const reset = useCallback(() => {
    const initial = createInitialFilters();
    emitChange(initial);
  }, [emitChange]);

  // Derived options
  const modelOptions = useMemo(() => {
    if (!filters.categories.length) return [] as string[];
    const sets = filters.categories.map((c) => MODEL_OPTIONS_BY_CATEGORY[c] || []);
    const flat = ([] as string[]).concat(...sets);
    return Array.from(new Set(flat));
  }, [filters.categories]);

  const showStorage = useMemo(
    () => filters.categories.some((c) => STORAGE_CATEGORIES.includes(c)),
    [filters.categories],
  );

  // Badges
  const badgeItems = useMemo<FilterBadge[]>(() => {
    const items: FilterBadge[] = [];

    // Helper to push many
    const pushMany = (list: string[], remover: (value: string) => void) => {
      for (const v of list) {
        items.push({ id: `${items.length}-${v}`, label: v, onRemove: () => remover(v) });
      }
    };

    // categories, condition, brand, model, storage, sellerType
    pushMany(filters.categories, (v) => toggle("categories", v));
    pushMany(filters.condition, (v) => toggle("condition", v));
    pushMany(filters.brand, (v) => toggle("brand", v));
    pushMany(filters.model, (v) => toggle("model", v));
    pushMany(filters.storage, (v) => toggle("storage", v));
    pushMany(filters.sellerType, (v) => toggle("sellerType", v));

    // price range badge
    const { min, max } = filters.priceRange;
    if (min || max) {
      const label = `Price: ${min || "0"}${max ? ` - ${max}` : "+"}`;
      items.push({
        id: `price-range`,
        label,
        onRemove: () => update("priceRange", { min: "", max: "" }),
      });
    }

    // location badge
    if (filters.location.useCurrentLocation) {
      items.push({
        id: `loc-current`,
        label: "Current location",
        onRemove: () => update("location", { country: "", city: "", useCurrentLocation: false }),
      });
    } else if (filters.location.country || filters.location.city) {
      const country = filters.location.country || "";
      const city = filters.location.city || "";
      const label = city ? `${city}${country ? ", " + country : ""}` : country;
      items.push({
        id: `loc-${country}-${city}`,
        label,
        onRemove: () => update("location", { country: "", city: "", useCurrentLocation: false }),
      });
    }

    return items;
  }, [filters, toggle, update]);

  return {
    filters,
    update,
    toggle,
    reset,
    countries,
    cities,
    badgeItems,
    modelOptions,
    showStorage,
  } as const;
};

