import { forwardRef } from "react";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Text } from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface DateFilterCustomRangeProps extends HTMLAttributes<HTMLDivElement> {
  startDate?: string;
  endDate?: string;
  onStartDateChange?: (date: string) => void;
  onEndDateChange?: (date: string) => void;
  onApply?: () => void;
  onCancel?: () => void;
}

export const DateFilterCustomRange = forwardRef<
  HTMLDivElement,
  DateFilterCustomRangeProps
>(
  (
    {
      startDate,
      endDate,
      onStartDateChange,
      onEndDateChange,
      onApply,
      onCancel,
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "w-80 rounded-lg border border-neutral-20 bg-white p-4 shadow-lg",
          className,
        )}
        {...props}
      >
        <Text variant="body" className="text-neutral-90 mb-4 font-semibold">
          Custom Date Range
        </Text>

        <div className="space-y-4">
          <div>
            <label className="text-neutral-70 mb-2 block text-sm font-medium">
              From
            </label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange?.(e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-neutral-70 mb-2 block text-sm font-medium">
              To
            </label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => onEndDateChange?.(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              intent="primary"
              size="sm"
              onClick={onApply}
              className="flex-1"
            >
              Apply
            </Button>
            <Button
              intent="outline"
              size="sm"
              onClick={onCancel}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  },
);

DateFilterCustomRange.displayName = "DateFilterCustomRange";
