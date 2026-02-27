import type { FiltersState } from "@/types/filters";

export const CATEGORY_OPTIONS = [
  "Phones",
  "Smartphones",
  "Laptops",
  "Tablets",
  "Gaming Consoles",
  "Cameras",
  "Audio Devices",
];

export const CATEGORY_NAME_TO_ID: Record<string, number> = {
  Phones: 1,
  Smartphones: 2,
  Laptops: 3,
  Tablets: 4,
  "Gaming Consoles": 5,
  Cameras: 6,
  "Audio Devices": 7,
};

export const CONDITION_OPTIONS = ["New", "Like New", "Good", "Fair", "Poor"];

export const CONDITION_LABEL_TO_VALUE: Record<string, string> = {
  New: "new",
  "Like New": "like_new",
  Good: "good",
  Fair: "fair",
  Poor: "poor",
};

export const BRAND_OPTIONS = [
  "Apple",
  "Samsung",
  "Google",
  "Dell",
  "HP",
  "Lenovo",
];
export const STORAGE_OPTIONS = [
  "64GB",
  "128GB",
  "256GB",
  "512GB",
  "1TB",
  "2TB",
];
export const SELLER_TYPES = ["Spoke with before", "Verified sellers"];

const PHONE_MODELS = ["iPhone 15", "iPhone 14", "Samsung S24", "Pixel 8"];
const LAPTOP_MODELS = ["MacBook Pro", "MacBook Air", "Dell XPS", "HP Spectre"];
const TABLET_MODELS = ["iPad Pro", "iPad Air", "Samsung Tab"];

export const MODEL_OPTIONS_BY_CATEGORY: Record<string, string[]> = {
  Phones: PHONE_MODELS,
  Smartphones: PHONE_MODELS,
  Laptops: LAPTOP_MODELS,
  Tablets: TABLET_MODELS,
};

export const STORAGE_CATEGORIES = ["Phones", "Smartphones", "Tablets", "Laptops"];

export const createInitialFilters = (): FiltersState => ({
  categories: [],
  condition: [],
  priceRange: { min: "", max: "" },
  brand: [],
  model: [],
  storage: [],
  sellerType: [],
  location: { country: "", city: "", useCurrentLocation: false },
});
