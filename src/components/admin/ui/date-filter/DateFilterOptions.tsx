import { forwardRef } from "react";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Text } from "@/components/ui/text";

export interface DateFilterOption {
  value: string;
  label: string;
}

export interface DateFilterOptionsProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "onSelect"
> {
  selectedValue?: string;
  onSelect?: (value: string) => void;
  options?: DateFilterOption[];
}

const defaultOptions: DateFilterOption[] = [
  { value: "today", label: "Today" },
  { value: "last7days", label: "Last 7 days" },
  { value: "last30days", label: "Last 30 days" },
  { value: "last90days", label: "Last 90 days" },
  { value: "custom", label: "Custom range" },
];

export const DateFilterOptions = forwardRef<
  HTMLDivElement,
  DateFilterOptionsProps
>(
  (
    { selectedValue, onSelect, options = defaultOptions, className, ...props },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "w-56 rounded-lg border border-neutral-20 bg-white p-2 shadow-lg",
          className,
        )}
        {...props}
      >
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onSelect?.(option.value)}
            className={cn(
              "flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-colors",
              selectedValue === option.value
                ? "bg-primary/10 text-primary"
                : "text-neutral-70 hover:bg-neutral-5",
            )}
          >
            <div
              className={cn(
                "flex h-4 w-4 items-center justify-center rounded-full border-2",
                selectedValue === option.value
                  ? "border-primary"
                  : "border-neutral-30",
              )}
            >
              {selectedValue === option.value && (
                <div className="h-2 w-2 rounded-full bg-primary" />
              )}
            </div>
            <Text variant="body" className="font-medium">
              {option.label}
            </Text>
          </button>
        ))}
      </div>
    );
  },
);

DateFilterOptions.displayName = "DateFilterOptions";
