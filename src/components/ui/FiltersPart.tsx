import { useState, useEffect } from "react";
import {
  fetchCountries,
  fetchCitiesByCountry,
  type Country,
} from "./countriesData";

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

const categories = ["Phones", "Tablets", "Laptops", "PC Parts"];
const conditions = ["New", "Like New", "Good", "Fair", "Poor"];
const brands = ["Apple", "Samsung", "Google", "Dell", "HP", "Lenovo"];
const phoneModels = ["iPhone 15", "iPhone 14", "Samsung S24", "Pixel 8"];
const laptopModels = ["MacBook Pro", "MacBook Air", "Dell XPS", "HP Spectre"];
const tabletModels = ["iPad Pro", "iPad Air", "Samsung Tab"];
const storageOptions = ["64GB", "128GB", "256GB", "512GB", "1TB", "2TB"];
const sellerTypes = ["Spoke with before", "Verified sellers"];

const Badge = ({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) => (
  <button
    type="button"
    className="inline-flex cursor-pointer items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 hover:bg-blue-200"
    onClick={onRemove}
    aria-label={`Remove ${label} filter`}
  >
    {label}
    <span className="h-3 w-3 text-blue-600" aria-hidden="true">
      ×
    </span>
  </button>
);

const Checkbox = ({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) => (
  <label className="flex cursor-pointer items-center gap-2">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="h-4 w-4 rounded border-gray-300 text-blue-600"
    />
    <span className="text-sm text-gray-700">{label}</span>
  </label>
);

const SearchIcon = () => (
  <svg
    className="h-4 w-4 text-gray-500"
    aria-hidden="true"
    focusable="false"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

export const FiltersPart = ({
  className = "",
  onSearch,
  onFilterChange,
}: FiltersPartProps) => {
  const [filters, setFilters] = useState<FiltersState>({
    categories: [],
    condition: [],
    priceRange: { min: "", max: "" },
    brand: [],
    model: [],
    storage: [],
    sellerType: [],
    location: { country: "", city: "", useCurrentLocation: false },
  });
  const [countries, setCountries] = useState<Country[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [brandSearch, setBrandSearch] = useState("");
  const [modelSearch, setModelSearch] = useState("");

  useEffect(() => {
    fetchCountries().then(setCountries);
  }, []);

  useEffect(() => {
    // التعديل هنا: نجد اسم الدولة بناءً على الكود قبل استدعاء المدن
    const selectedCountry = countries.find(
      (c) => c.code === filters.location.country,
    );
    if (selectedCountry) {
      fetchCitiesByCountry(selectedCountry.name).then(setCities);
    } else {
      setCities([]);
    }
  }, [filters.location.country, countries]);

  useEffect(() => {
    onFilterChange?.(filters);
  }, [filters, onFilterChange]);

  const getModels = () => {
    const m: string[] = [];
    if (filters.categories.includes("Phones")) m.push(...phoneModels);
    if (filters.categories.includes("Laptops")) m.push(...laptopModels);
    if (filters.categories.includes("Tablets")) m.push(...tabletModels);
    return m;
  };

  const update = <K extends keyof FiltersState>(
    key: K,
    value: FiltersState[K],
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };
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
  const reset = () =>
    setFilters({
      categories: [],
      condition: [],
      priceRange: { min: "", max: "" },
      brand: [],
      model: [],
      storage: [],
      sellerType: [],
      location: { country: "", city: "", useCurrentLocation: false },
    });

  const hasFilters = Object.values(filters).some((v) =>
    Array.isArray(v)
      ? v.length > 0
      : typeof v === "object"
        ? Object.values(v).some((x) => x)
        : v,
  );
  const showBrand = filters.categories.length > 0;
  const showModel = getModels().length > 0;
  const showStorage = filters.categories.some((c) =>
    ["Phones", "Tablets", "Laptops"].includes(c),
  );

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
              {filters.categories.map((c) => (
                <Badge
                  key={c}
                  label={c}
                  onRemove={() => remove("categories", c)}
                />
              ))}
              {filters.condition.map((c) => (
                <Badge
                  key={c}
                  label={c}
                  onRemove={() => remove("condition", c)}
                />
              ))}
              {(filters.priceRange.min || filters.priceRange.max) && (
                <Badge
                  label={`${filters.priceRange.min || "0"}-${filters.priceRange.max || "∞"} ILS`}
                  onRemove={() => update("priceRange", { min: "", max: "" })}
                />
              )}
              {filters.brand.map((b) => (
                <Badge key={b} label={b} onRemove={() => remove("brand", b)} />
              ))}
              {filters.model.map((m) => (
                <Badge key={m} label={m} onRemove={() => remove("model", m)} />
              ))}
              {filters.storage.map((s) => (
                <Badge
                  key={s}
                  label={s}
                  onRemove={() => remove("storage", s)}
                />
              ))}
              {filters.sellerType.map((s) => (
                <Badge
                  key={s}
                  label={s}
                  onRemove={() => remove("sellerType", s)}
                />
              ))}
              {(filters.location.country ||
                filters.location.city ||
                filters.location.useCurrentLocation) && (
                <Badge
                  label={
                    filters.location.useCurrentLocation
                      ? "Current Location"
                      : `${filters.location.country}${filters.location.city ? `, ${filters.location.city}` : ""}`
                  }
                  onRemove={() =>
                    update("location", {
                      country: "",
                      city: "",
                      useCurrentLocation: false,
                    })
                  }
                />
              )}
            </div>
          )}
        </div>

        <div className="space-y-6 p-6">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-900">Categories</h3>
            {categories.map((c) => (
              <Checkbox
                key={c}
                label={c}
                checked={filters.categories.includes(c)}
                onChange={() => toggle("categories", c)}
              />
            ))}
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-900">Condition</h3>
            {conditions.map((c) => (
              <Checkbox
                key={c}
                label={c}
                checked={filters.condition.includes(c)}
                onChange={() => toggle("condition", c)}
              />
            ))}
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-900">Price Range</h3>
            <div className="flex gap-2">
              <div className="flex-1">
                <label
                  htmlFor="price-min"
                  className="mb-1 block text-xs text-gray-600"
                >
                  From
                </label>
                <input
                  id="price-min"
                  type="number"
                  placeholder="0 ILS"
                  value={filters.priceRange.min}
                  onChange={(e) =>
                    update("priceRange", {
                      ...filters.priceRange,
                      min: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="price-max"
                  className="mb-1 block text-xs text-gray-600"
                >
                  To
                </label>
                <input
                  id="price-max"
                  type="number"
                  placeholder="100 ILS"
                  value={filters.priceRange.max}
                  onChange={(e) =>
                    update("priceRange", {
                      ...filters.priceRange,
                      max: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>

          {showBrand && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-900">Brand</h3>
              <div className="relative mb-3">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <SearchIcon />
                </div>
                <input
                  type="text"
                  placeholder="Search about Brand"
                  value={brandSearch}
                  onChange={(e) => {
                    setBrandSearch(e.target.value);
                    onSearch?.(e.target.value);
                  }}
                  className="w-full rounded-lg border border-gray-300 py-2 pl-8 pr-3 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {brands
                .filter(
                  (b) =>
                    !brandSearch ||
                    b.toLowerCase().includes(brandSearch.toLowerCase()),
                )
                .map((b) => (
                  <Checkbox
                    key={b}
                    label={b}
                    checked={filters.brand.includes(b)}
                    onChange={() => toggle("brand", b)}
                  />
                ))}
            </div>
          )}

          {showModel && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-900">Model</h3>
              <div className="relative mb-3">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <SearchIcon />
                </div>
                <input
                  type="text"
                  placeholder="Search about Model"
                  value={modelSearch}
                  onChange={(e) => {
                    setModelSearch(e.target.value);
                    onSearch?.(e.target.value);
                  }}
                  className="w-full rounded-lg border border-gray-300 py-2 pl-8 pr-3 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {getModels()
                .filter(
                  (m) =>
                    !modelSearch ||
                    m.toLowerCase().includes(modelSearch.toLowerCase()),
                )
                .map((m) => (
                  <Checkbox
                    key={m}
                    label={m}
                    checked={filters.model.includes(m)}
                    onChange={() => toggle("model", m)}
                  />
                ))}
            </div>
          )}

          {showStorage && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-900">Storage</h3>
              {storageOptions.map((s) => (
                <Checkbox
                  key={s}
                  label={s}
                  checked={filters.storage.includes(s)}
                  onChange={() => toggle("storage", s)}
                />
              ))}
            </div>
          )}

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-900">Seller type</h3>
            {sellerTypes.map((s) => (
              <Checkbox
                key={s}
                label={s}
                checked={filters.sellerType.includes(s)}
                onChange={() => toggle("sellerType", s)}
              />
            ))}
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-900">Location</h3>
            <select
              value={filters.location.country}
              onChange={(e) =>
                update("location", {
                  ...filters.location,
                  country: e.target.value,
                  city: "",
                })
              }
              className="mb-2 w-full rounded-lg border border-gray-300 px-3 py-2"
            >
              <option value="">All countries</option>
              {countries.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
            {filters.location.country && cities.length > 0 && (
              <select
                value={filters.location.city}
                onChange={(e) =>
                  update("location", {
                    ...filters.location,
                    city: e.target.value,
                  })
                }
                className="mb-2 w-full rounded-lg border border-gray-300 px-3 py-2"
              >
                <option value="">Select city</option>
                {cities.slice(0, 100).map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            )}
            <button
              type="button"
              onClick={() =>
                update("location", {
                  ...filters.location,
                  useCurrentLocation: !filters.location.useCurrentLocation,
                })
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              Use my current location
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
