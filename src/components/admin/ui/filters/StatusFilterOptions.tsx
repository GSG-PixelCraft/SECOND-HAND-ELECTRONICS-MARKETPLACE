import * as React from "react";
import { cn } from "@/lib/utils";
import { Text } from "@/components/ui/text";
import { Checkbox } from "@/components/ui/checkbox";

export interface StatusOption {
    value: string;
    label: string;
    count?: number;
}

export interface StatusFilterOptionsProps extends React.HTMLAttributes<HTMLDivElement> {
    options: StatusOption[];
    selectedValues?: string[];
    onSelectionChange?: (values: string[]) => void;
    multiSelect?: boolean;
}

export const StatusFilterOptions = React.forwardRef<HTMLDivElement, StatusFilterOptionsProps>(
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
                <Text variant="body" className="font-semibold text-neutral-90 mb-3 px-1">
                    Filter by Status
                </Text>

                <div className="space-y-1">
                    {options.map((option) => {
                        const isSelected = selectedValues.includes(option.value);

                        return (
                            <label
                                key={option.value}
                                className={cn(
                                    "flex items-center justify-between gap-3 rounded-md px-3 py-2 cursor-pointer transition-colors",
                                    isSelected
                                        ? "bg-primary/10"
                                        : "hover:bg-neutral-5",
                                )}
                            >
                                <div className="flex items-center gap-3 flex-1">
                                    <Checkbox
                                        checked={isSelected}
                                        onCheckedChange={() => handleToggle(option.value)}
                                    />
                                    <Text variant="body" className="font-medium text-neutral-90">
                                        {option.label}
                                    </Text>
                                </div>
                                {option.count !== undefined && (
                                    <span className="text-xs font-semibold text-neutral-50 bg-neutral-10 px-2 py-0.5 rounded-full">
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
