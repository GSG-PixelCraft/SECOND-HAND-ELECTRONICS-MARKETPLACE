import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Text } from "@/components/ui/text";
import { Span } from "@/components/ui/span";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

export interface PendingListingHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  count?: number;
  onFilterClick?: () => void;
  actions?: ReactNode;
}

export const PendingListingHeader = forwardRef<
  HTMLDivElement,
  PendingListingHeaderProps
>(
  (
    {
      title = "Pending Listings",
      count,
      onFilterClick,
      actions,
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-between gap-4 rounded-lg border border-neutral-20 bg-white p-4",
          className,
        )}
        {...props}
      >
        <div className="flex items-center gap-3">
          <Text variant="bodyLg" className="text-neutral-90 font-semibold">
            {title}
          </Text>
          {count !== undefined && (
            <Span
              variant="body"
              className="inline-flex items-center justify-center rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary"
            >
              {count}
            </Span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {onFilterClick && (
            <Button
              intent="outline"
              size="sm"
              onClick={onFilterClick}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          )}
          {actions}
        </div>
      </div>
    );
  },
);

PendingListingHeader.displayName = "PendingListingHeader";
