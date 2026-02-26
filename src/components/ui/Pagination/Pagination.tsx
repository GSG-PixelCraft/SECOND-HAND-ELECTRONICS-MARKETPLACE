import { forwardRef } from "react";
import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Button } from "../Button/button";
import { Text } from "../Text/text";
import { Select } from "../Select/select";

const paginationVariants = cva("flex items-center justify-between gap-6", {
  variants: {
    size: {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export interface PaginationProps
  extends
    HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof paginationVariants> {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
}

export const Pagination = forwardRef<HTMLDivElement, PaginationProps>(
  (
    {
      currentPage,
      totalPages,
      totalItems,
      itemsPerPage,
      onPageChange,
      onItemsPerPageChange,
      size,
      className,
      ...props
    },
    ref,
  ) => {
    const getPageNumbers = () => {
      const pages: number[] = [];
      const maxVisible = 5;

      if (totalPages <= maxVisible) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Always show first page
        pages.push(1);

        if (currentPage > 3) {
          // Not near start
          pages.push(currentPage - 1);
          pages.push(currentPage);
          if (currentPage < totalPages - 1) {
            pages.push(currentPage + 1);
          }
        } else {
          // Near start
          pages.push(2);
          pages.push(3);
          if (totalPages > 3) {
            pages.push(4);
          }
        }

        // Always show last page if not already included
        if (!pages.includes(totalPages)) {
          pages.push(totalPages);
        }
      }

      return pages;
    };

    const handlePrevious = () => {
      if (currentPage > 1) {
        onPageChange(currentPage - 1);
      }
    };

    const handleNext = () => {
      if (currentPage < totalPages) {
        onPageChange(currentPage + 1);
      }
    };

    if (totalPages <= 1) {
      return null;
    }

    const startItem =
      totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endItem =
      totalItems === 0 ? 0 : Math.min(currentPage * itemsPerPage, totalItems);

    return (
      <div
        ref={ref}
        className={cn(paginationVariants({ size }), className)}
        {...props}
      >
        <span className="sr-only">
          Showing {startItem}-{endItem} of {totalItems} items
        </span>
        {/* Show items per page selector */}
        <div className="flex items-center gap-3">
          <Text variant="bodySmall" className="text-neutral">
            Show
          </Text>
          <Select
            value={itemsPerPage.toString()}
            onChange={(e) => {
              const newItemsPerPage = parseInt(e.target.value, 10);
              onItemsPerPageChange?.(newItemsPerPage);
            }}
            className="w-20"
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </Select>
        </div>

        {/* Pagination controls */}
        <div className="flex flex-1 items-center justify-end gap-4">
          {/* Previous button */}
          <Button
            intent="outline"
            size="sm"
            onClick={handlePrevious}
            disabled={currentPage === 1}
            aria-label="Previous page"
            className="h-10 w-10 rounded-full p-0"
          >
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
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </Button>

          {/* Page numbers */}
          <div className="flex items-center">
            {getPageNumbers().map((page) => (
              <Button
                key={page}
                intent="outline"
                size="sm"
                onClick={() => onPageChange(page)}
                className={cn(
                  "h-10 min-w-[40px] border-0 px-5 hover:bg-transparent",
                  currentPage === page &&
                    "border-b-2 border-primary text-primary",
                  currentPage !== page &&
                    "text-neutral hover:text-neutral-foreground",
                )}
                aria-label={`Page ${page}`}
                aria-current={currentPage === page ? "page" : undefined}
              >
                {page}
              </Button>
            ))}
          </div>

          {/* Next button */}
          <Button
            intent="outline"
            size="sm"
            onClick={handleNext}
            disabled={currentPage === totalPages}
            aria-label="Next page"
            className="h-10 w-10 rounded-full p-0"
          >
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
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </Button>
        </div>
      </div>
    );
  },
);

Pagination.displayName = "Pagination";
