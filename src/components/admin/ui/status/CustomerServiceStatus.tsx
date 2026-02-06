import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const customerServiceStatusVariants = cva(
    [
        "inline-flex",
        "items-center",
        "gap-1.5",
        "px-3",
        "py-1.5",
        "rounded-full",
        "text-xs",
        "font-semibold",
    ],
    {
        variants: {
            status: {
                open: ["bg-primary/10", "text-primary"],
                "in-progress": ["bg-warning/10", "text-warning"],
                resolved: ["bg-success/10", "text-success"],
                closed: ["bg-neutral-10", "text-neutral-60"],
            },
        },
        defaultVariants: {
            status: "open",
        },
    },
);

type CustomerServiceStatusVariantProps = VariantProps<typeof customerServiceStatusVariants>;

export interface CustomerServiceStatusProps extends React.HTMLAttributes<HTMLSpanElement> {
    status: CustomerServiceStatusVariantProps["status"];
    label?: string;
    showDot?: boolean;
}

export const CustomerServiceStatus = React.forwardRef<HTMLSpanElement, CustomerServiceStatusProps>(
    (
        {
            status,
            label,
            showDot = true,
            className,
            ...props
        },
        ref,
    ) => {
        const getLabel = () => {
            if (label) return label;
            switch (status) {
                case "open":
                    return "Open";
                case "in-progress":
                    return "In Progress";
                case "resolved":
                    return "Resolved";
                case "closed":
                    return "Closed";
                default:
                    return "Unknown";
            }
        };

        return (
            <span
                ref={ref}
                className={cn(customerServiceStatusVariants({ status }), className)}
                {...props}
            >
                {showDot && (
                    <span className="h-1.5 w-1.5 rounded-full bg-current"></span>
                )}
                {getLabel()}
            </span>
        );
    },
);

CustomerServiceStatus.displayName = "CustomerServiceStatus";
