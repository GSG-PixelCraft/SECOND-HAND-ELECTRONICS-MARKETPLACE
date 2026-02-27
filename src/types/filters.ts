export interface FiltersState {
  categories: string[];
  condition: string[];
  priceRange: { min: string; max: string };
  brand: string[];
  model: string[];
  storage: string[];
  sellerType: string[];
  location: { country: string; city: string; useCurrentLocation: boolean };
}

export interface FiltersPartProps {
  className?: string;
  onSearch?: (query: string) => void;
  onFilterChange?: (filters: FiltersState) => void;
}

type ExtractArrayKeys<T> = {
  [K in keyof T]: T[K] extends string[] ? K : never;
}[keyof T];

export type ArrayFilterKey = ExtractArrayKeys<FiltersState>;

export interface FilterBadge {
  id: string;
  label: string;
  onRemove: () => void;
}

export interface FilterOptions {
  categories: string[];
  conditions: string[];
  brands: string[];
  storageOptions: string[];
  sellerTypes: string[];
  modelsByCategory: Record<string, string[]>;
  storageCategories: string[];
}
