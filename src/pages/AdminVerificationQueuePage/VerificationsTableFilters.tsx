import * as React from "react";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import type { VerificationFilterParams } from "@/types/admin";

export interface VerificationsTableFiltersProps {
  filters: VerificationFilterParams;
  onFiltersChange: (filters: VerificationFilterParams) => void;
  onClearFilters: () => void;
  className?: string;
}

export const VerificationsTableFilters = React.forwardRef<
  HTMLDivElement,
  VerificationsTableFiltersProps
>(({ filters, onFiltersChange, className }, ref) => {
  const [searchValue, setSearchValue] = React.useState(filters.search || "");
  const searchTimeoutRef = React.useRef<NodeJS.Timeout | undefined>(undefined);

  // Debounced search
  React.useEffect(() => {
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

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, startDate: e.target.value, page: 1 });
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, endDate: e.target.value, page: 1 });
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
            placeholder="Search verifications by user or ID"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="h-12 w-full rounded-xl border-[#e4e4e4] bg-white pl-12 pr-4 text-[#3d3d3d] placeholder:text-[#c7c7c7]"
          />
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="flex items-center gap-2">
        <Text variant="bodySmall" className="text-neutral">
          From
        </Text>
        <Input
          type="date"
          value={filters.startDate || ""}
          onChange={handleStartDateChange}
          className="h-12 w-auto rounded-xl border-[#e4e4e4]"
        />
        <Text variant="bodySmall" className="text-neutral">
          to
        </Text>
        <Input
          type="date"
          value={filters.endDate || ""}
          onChange={handleEndDateChange}
          className="h-12 w-auto rounded-xl border-[#e4e4e4]"
        />
      </div>
    </div>
  );
});

VerificationsTableFilters.displayName = "VerificationsTableFilters";
