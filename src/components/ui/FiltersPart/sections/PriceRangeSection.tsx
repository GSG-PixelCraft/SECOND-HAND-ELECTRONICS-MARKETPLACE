import type { FiltersState } from "@/types/filters";

interface Props {
  priceRange: FiltersState["priceRange"];
  onChange: (field: keyof FiltersState["priceRange"], value: string) => void;
}

export const PriceRangeSection = ({ priceRange, onChange }: Props) => (
  <div className="space-y-2">
    <h3 className="text-sm font-semibold text-gray-900">Price Range</h3>

    <div className="flex gap-2">
      {(["min", "max"] as const).map((field) => (
        <div key={field} className="flex-1">
          <label className="mb-1 block text-xs text-gray-600">
            {field === "min" ? "From" : "To"}
          </label>

          <input
            type="number"
            value={priceRange[field]}
            onChange={(e) => onChange(field, e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
      ))}
    </div>
  </div>
);