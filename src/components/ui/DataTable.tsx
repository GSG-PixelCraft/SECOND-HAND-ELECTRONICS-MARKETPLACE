import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
  className?: string;
  width?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  title?: string;
  className?: string;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  showSeeAll?: boolean;
  onSeeAll?: () => void;
}

type SortConfig = {
  key: string;
  direction: "asc" | "desc" | null;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function DataTable<T extends Record<string, any>>({
  data,
  columns,
  title,
  className,
  onRowClick,
  emptyMessage = "No data available",
  showSeeAll = false,
  onSeeAll,
}: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = React.useState<SortConfig>({
    key: "",
    direction: null,
  });

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" | null = "asc";

    if (sortConfig.key === key) {
      if (sortConfig.direction === "asc") {
        direction = "desc";
      } else if (sortConfig.direction === "desc") {
        direction = null;
      }
    }

    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    if (!sortConfig.direction || !sortConfig.key) {
      return data;
    }

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === bValue) return 0;

      const comparison = aValue < bValue ? -1 : 1;
      return sortConfig.direction === "asc" ? comparison : -comparison;
    });
  }, [data, sortConfig]);

  const getSortIcon = (columnKey: string) => {
    if (sortConfig.key !== columnKey) {
      return <ChevronsUpDown className="ml-2 h-4 w-4" />;
    }
    if (sortConfig.direction === "asc") {
      return <ChevronUp className="ml-2 h-4 w-4" />;
    }
    if (sortConfig.direction === "desc") {
      return <ChevronDown className="ml-2 h-4 w-4" />;
    }
    return <ChevronsUpDown className="ml-2 h-4 w-4" />;
  };

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl bg-white shadow-[0_1px_4px_0_rgba(0,0,0,0.1)]",
        className,
      )}
    >
      {/* Title Header */}
      {title && (
        <div className="flex items-center justify-between p-4">
          <Text className="text-foreground text-xl font-medium">{title}</Text>
          {showSeeAll && (
            <Button
              onClick={onSeeAll}
              className="text-sm text-primary hover:underline"
            >
              See all
            </Button>
          )}
        </div>
      )}

      {/* Table */}
      <div className="relative w-full overflow-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[rgba(37,99,235,0.1)]">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    "text-foreground h-12 px-4 text-left text-sm font-medium",
                    column.className,
                  )}
                  style={column.width ? { width: column.width } : undefined}
                >
                  {column.sortable ? (
                    <Button
                      onClick={() => handleSort(column.key)}
                      className="flex items-center gap-1 transition-colors hover:text-primary"
                    >
                      {column.header}
                      {getSortIcon(column.key)}
                    </Button>
                  ) : (
                    column.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="h-24 text-center text-[#828282]"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              sortedData.map((item, rowIndex) => (
                <React.Fragment key={rowIndex}>
                  <tr
                    className={cn(
                      "h-12 bg-white transition-colors hover:bg-muted/30",
                      onRowClick && "cursor-pointer",
                    )}
                    onClick={() => onRowClick?.(item)}
                  >
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={cn(
                          "px-4 py-3 text-sm text-[#3D3D3D]",
                          column.className,
                        )}
                      >
                        {column.render ? column.render(item) : item[column.key]}
                      </td>
                    ))}
                  </tr>
                  {rowIndex < sortedData.length - 1 && (
                    <tr>
                      <td colSpan={columns.length} className="p-0">
                        <div className="bg-border h-px" />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export { DataTable };
