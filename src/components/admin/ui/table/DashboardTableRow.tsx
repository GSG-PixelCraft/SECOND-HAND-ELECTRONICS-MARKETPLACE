import { forwardRef } from "react";
import type { FC, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Text } from "@/components/ui/text";
import { Span } from "@/components/ui/span";
import { Image } from "@/components/ui/image";

export interface DashboardTableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  cells?: Array<{
    key: string;
    content: ReactNode;
    align?: "left" | "center" | "right";
  }>;
  isClickable?: boolean;
  isSelected?: boolean;
  children?: ReactNode;
}

export const DashboardTableRow = forwardRef<
  HTMLTableRowElement,
  DashboardTableRowProps
>(
  (
    {
      cells,
      isClickable = false,
      isSelected = false,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <tr
        ref={ref}
        className={cn(
          "border-b border-neutral-10 transition-colors",
          (isClickable || props.onClick) && "cursor-pointer hover:bg-neutral-5",
          isSelected && "bg-primary/5",
          className,
        )}
        {...props}
      >
        {cells
          ? cells.map((cell) => (
              <td
                key={cell.key}
                className={cn(
                  "px-6 py-4",
                  cell.align === "center" && "text-center",
                  cell.align === "right" && "text-right",
                )}
              >
                {cell.content}
              </td>
            ))
          : children}
      </tr>
    );
  },
);

DashboardTableRow.displayName = "DashboardTableRow";

// Helper components for common cell types
export interface TableCellImageProps {
  src: string;
  alt: string;
  label?: string;
  subtitle?: string;
}

export const TableCellImage: FC<TableCellImageProps> = ({
  src,
  alt,
  label,
  subtitle,
}) => (
  <div className="flex items-center gap-3">
    <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-neutral-10 md:h-12 md:w-12">
      <Image src={src} alt={alt} className="h-full w-full object-cover" />
    </div>
    {(label || subtitle) && (
      <div className="flex min-w-0 flex-col">
        {label && (
          <Text variant="body" className="text-neutral-90 truncate font-medium">
            {label}
          </Text>
        )}
        {subtitle && (
          <Span variant="caption" className="text-neutral-50 truncate">
            {subtitle}
          </Span>
        )}
      </div>
    )}
  </div>
);

export interface TableCellTextProps {
  primary: string;
  secondary?: string;
  icon?: ReactNode;
}

export const TableCellText: FC<TableCellTextProps> = ({
  primary,
  secondary,
  icon,
}) => (
  <div className="flex flex-col gap-1">
    <div className="flex items-center gap-2">
      <Text variant="body" className="text-neutral-90 truncate font-medium">
        {primary}
      </Text>
      {icon}
    </div>
    {secondary && (
      <Span variant="caption" className="text-neutral-50 truncate">
        {secondary}
      </Span>
    )}
  </div>
);
