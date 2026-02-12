import { forwardRef, useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { ReportFilterParams } from "@/types/admin";

export interface ReportsTableFiltersProps {
  filters: ReportFilterParams;
  onFiltersChange: (filters: ReportFilterParams) => void;
  searchPlaceholder?: string;
  className?: string;
}

export const ReportsTableFilters = forwardRef<
  HTMLDivElement,
  ReportsTableFiltersProps
>(({ filters, onFiltersChange, searchPlaceholder, className }, ref) => {
  const [searchValue, setSearchValue] = useState(filters.search || "");
  const searchTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      if (searchValue !== (filters.search || "")) {
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

  const handleDateRangeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({
      ...filters,
      dateRange: e.target.value as ReportFilterParams["dateRange"],
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
            placeholder={
              searchPlaceholder || "Search listings by title or user"
            }
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="h-12 w-full rounded-xl border-[#e4e4e4] bg-white pl-12 pr-4 text-[#3d3d3d] placeholder:text-[#c7c7c7]"
          />
        </div>
      </div>

      <div className="relative flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-neutral-50"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
        <select
          value={filters.dateRange || "7"}
          onChange={handleDateRangeChange}
          className="hover:border-neutral-30 h-12 min-w-[140px] cursor-pointer appearance-none rounded-xl border border-[#e4e4e4] bg-white px-4 pr-10 text-sm text-[#3d3d3d] outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          <option value="7">Last 7 Days</option>
          <option value="30">Last 30 Days</option>
          <option value="90">Last 90 Days</option>
          <option value="all">All Time</option>
        </select>
        <div className="pointer-events-none absolute right-4 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-neutral-50"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      </div>
    </div>
  );
});

ReportsTableFilters.displayName = "ReportsTableFilters";
