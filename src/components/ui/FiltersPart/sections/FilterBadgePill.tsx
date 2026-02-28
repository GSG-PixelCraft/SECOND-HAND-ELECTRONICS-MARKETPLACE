import type { FilterBadge } from "@/types/filters";

export const FilterBadgePill = ({
  label,
  onRemove,
}: Pick<FilterBadge, "label" | "onRemove">) => (
  <button
    type="button"
    onClick={onRemove}
    className="inline-flex cursor-pointer items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 hover:bg-blue-200"
    aria-label={`Remove ${label} filter`}
  >
    <span>{label}</span>
    <span className="text-blue-600" aria-hidden="true">
      {"\u00D7"}
    </span>
  </button>
);
