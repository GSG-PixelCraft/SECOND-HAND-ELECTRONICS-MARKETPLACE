import * as React from "react";
import { cn } from "@/lib/utils";
import { Text } from "@/components/ui/text";

export interface DashboardTableHeaderProps extends React.HTMLAttributes<HTMLTableRowElement> {
    columns: Array<{
        key: string;
        label: string;
        align?: "left" | "center" | "right";
        width?: string;
    }>;
}

export const DashboardTableHeader = React.forwardRef<HTMLTableRowElement, DashboardTableHeaderProps>(
    ({ columns, className, ...props }, ref) => {
        return (
            <tr
                ref={ref}
                className={cn(
                    "bg-[rgba(37,99,235,0.1)] border-b border-primary/20",
                    className,
                )}
                {...props}
            >
                {columns.map((column) => (
                    <th
                        key={column.key}
                        className={cn(
                            "px-6 py-4 text-left",
                            column.align === "center" && "text-center",
                            column.align === "right" && "text-right",
                        )}
                        style={{ width: column.width }}
                    >
                        <Text variant="body" className="font-semibold text-primary uppercase tracking-wide text-sm">
                            {column.label}
                        </Text>
                    </th>
                ))}
            </tr>
        );
    },
);

DashboardTableHeader.displayName = "DashboardTableHeader";
