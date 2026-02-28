import { forwardRef } from "react";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Text } from "@/components/ui/Text/text";
import { Checkbox } from "@/components/ui/Checkbox/checkbox";

export interface StatusOption {
  value: string;
  label: string;
  count?: number;
}

export interface StatusFilterOptionsProps extends HTMLAttributes<HTMLDivElement> {
  options: StatusOption[];
  selectedValues?: string[];
  onSelectionChange?: (values: string[]) => void;
  multiSelect?: boolean;
}

export const StatusFilterOptions = forwardRef<
  HTMLDivElement,
  StatusFilterOptionsProps
>(
  (
    {
      options,
      selectedValues = [],
      onSelectionChange,
      multiSelect = true,
      className,
      ...props
    },
    ref,
  ) => {
    const handleToggle = (value: string) => {
      if (!onSelectionChange) return;

      if (multiSelect) {
        const newValues = selectedValues.includes(value)
          ? selectedValues.filter((v) => v !== value)
          : [...selectedValues, value];
        onSelectionChange(newValues);
      } else {
        onSelectionChange([value]);
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          "w-64 rounded-lg border border-neutral-20 bg-white p-3 shadow-lg",
          className,
        )}
        {...props}
      >
        <Text
          variant="body"
          className="text-neutral-90 mb-3 px-1 font-semibold"
        >
          Filter by Status
        </Text>

        <div className="space-y-1">
          {options.map((option) => {
            const isSelected = selectedValues.includes(option.value);

            return (
              <label
                key={option.value}
                className={cn(
                  "flex cursor-pointer items-center justify-between gap-3 rounded-md px-3 py-2 transition-colors",
                  isSelected ? "bg-primary/10" : "hover:bg-neutral-5",
                )}
              >
                <div className="flex flex-1 items-center gap-3">
                  <Checkbox
                    checked={isSelected}
                    onChange={() => handleToggle(option.value)}
                  />
                  <Text variant="body" className="text-neutral-90 font-medium">
                    {option.label}
                  </Text>
                </div>
                {option.count !== undefined && (
                  <span className="text-neutral-50 rounded-full bg-neutral-10 px-2 py-0.5 text-xs font-semibold">
                    {option.count}
                  </span>
                )}
              </label>
            );
          })}
        </div>
      </div>
    );
  },
);

StatusFilterOptions.displayName = "StatusFilterOptions";
