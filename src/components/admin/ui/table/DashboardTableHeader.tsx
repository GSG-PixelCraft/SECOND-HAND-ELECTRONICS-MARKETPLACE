import { forwardRef } from "react";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Text } from "@/components/ui/Text/text";

export interface DashboardTableHeaderProps extends HTMLAttributes<HTMLTableRowElement> {
  columns: Array<{
    key: string;
    label: string;
    align?: "left" | "center" | "right";
    width?: string;
  }>;
}

export const DashboardTableHeader = forwardRef<
  HTMLTableRowElement,
  DashboardTableHeaderProps
>(({ columns, className, ...props }, ref) => {
  return (
    <tr
      ref={ref}
      className={cn(
        "border-b border-primary/20 bg-[rgba(37,99,235,0.1)]",
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
          <Text
            variant="body"
            className="text-sm font-semibold uppercase tracking-wide text-primary"
          >
            {column.label}
          </Text>
        </th>
      ))}
    </tr>
  );
});

DashboardTableHeader.displayName = "DashboardTableHeader";
