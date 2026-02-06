import * as React from "react";
import { cn } from "@/lib/utils";
import { Text } from "@/components/ui/text";
import { Calendar } from "lucide-react";

export interface DateFilterProps extends React.HTMLAttributes<HTMLButtonElement> {
    startDate?: Date | null;
    endDate?: Date | null;
    onOpenPicker?: () => void;
    placeholder?: string;
}

export const DateFilter = React.forwardRef<HTMLButtonElement, DateFilterProps>(
    (
        {
            startDate,
            endDate,
            onOpenPicker,
            placeholder = "Select date range",
            className,
            ...props
        },
        ref,
    ) => {
        const formatDate = (date: Date) => {
            return date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            });
        };

        const getDisplayText = () => {
            if (startDate && endDate) {
                return `${formatDate(startDate)} - ${formatDate(endDate)}`;
            }
            if (startDate) {
                return formatDate(startDate);
            }
            return placeholder;
        };

        return (
            <button
                ref={ref}
                onClick={onOpenPicker}
                className={cn(
                    "inline-flex items-center gap-2 rounded-md border border-neutral-20 bg-white px-4 py-2 text-sm font-medium text-neutral-90 transition-colors hover:border-neutral-30 hover:bg-neutral-5 focus:outline-none focus:ring-2 focus:ring-primary/20",
                    className,
                )}
                {...props}
            >
                <Calendar className="h-4 w-4 text-neutral-50" />
                <Text variant="body" className={cn(startDate || endDate ? "text-neutral-90" : "text-neutral-50")}>
                    {getDisplayText()}
                </Text>
            </button>
        );
    },
);

DateFilter.displayName = "DateFilter";
