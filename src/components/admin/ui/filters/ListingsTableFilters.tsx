import { forwardRef, useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/Input/input";
import { AdminDateRangePicker } from "@/components/admin/ui/date-filter/AdminDateRangePicker";
import type { AdminDateRangeValue } from "@/components/admin/ui/date-filter/AdminDateRangePicker";
import { cn } from "@/lib/utils";
import type { ListingFilterParams } from "@/types/admin";

export interface ListingsTableFiltersProps {
  filters: ListingFilterParams;
  onFiltersChange: (filters: ListingFilterParams) => void;
  onClearFilters: () => void;
  className?: string;
}

export const ListingsTableFilters = forwardRef<
  HTMLDivElement,
  ListingsTableFiltersProps
>(({ filters, onFiltersChange, className }, ref) => {
  const [searchValue, setSearchValue] = useState(filters.search || "");
  const searchTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      if (searchValue !== filters.search) {
        onFiltersChange({ ...filters, search: searchValue, page: 1 });
      }
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  const currentDateValue: AdminDateRangeValue = {
    preset:
      filters.datePreset ||
      (filters.startDate || filters.endDate ? "custom" : "last7"),
    startDate: filters.startDate,
    endDate: filters.endDate,
  };

  const handleDateChange = (value: AdminDateRangeValue) => {
    onFiltersChange({
      ...filters,
      datePreset: value.preset,
      startDate: value.startDate,
      endDate: value.endDate,
      page: 1,
    });
  };

  return (
    <div
      ref={ref}
      className={cn(
        "flex w-full items-center justify-between gap-4",
        className,
      )}
    >
      {/* Search Input */}
      <div className="w-[358px] flex-none">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-neutral-50"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
          <Input
            type="text"
            placeholder="Search listings by title or seller"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="h-12 w-full rounded-xl border-[#e4e4e4] bg-white pl-12 pr-4 text-[#3d3d3d] placeholder:text-[#c7c7c7]"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <AdminDateRangePicker
          value={currentDateValue}
          onChange={handleDateChange}
          triggerClassName="justify-between"
        />
      </div>
    </div>
  );
});

ListingsTableFilters.displayName = "ListingsTableFilters";
