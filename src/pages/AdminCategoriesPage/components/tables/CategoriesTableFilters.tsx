import { forwardRef, useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { CategoryFilterParams } from "@/types/admin";

export interface CategoriesTableFiltersProps {
  filters: CategoryFilterParams;
  onFiltersChange: (filters: CategoryFilterParams) => void;
  className?: string;
}

export const CategoriesTableFilters = forwardRef<
  HTMLDivElement,
  CategoriesTableFiltersProps
>(({ filters, onFiltersChange, className }, ref) => {
  const [searchValue, setSearchValue] = useState(filters.search || "");
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setSearchValue(filters.search || "");
  }, [filters.search]);

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

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  return (
    <div ref={ref} className={cn("w-full", className)}>
      <div className="relative w-full">
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
          value={searchValue}
          onChange={handleSearchChange}
          placeholder="Search by category name"
          className="h-12 w-full rounded-xl border-[#e4e4e4] bg-white pl-12 pr-4 text-[#3d3d3d] placeholder:text-[#c7c7c7]"
        />
      </div>
    </div>
  );
});

CategoriesTableFilters.displayName = "CategoriesTableFilters";
