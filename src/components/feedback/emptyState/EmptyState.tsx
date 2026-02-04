import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Text } from "@/components/ui/text";

interface EmptyStateProps {
  title: string;
  description?: string;
  illustration?: ReactNode;
  action?: ReactNode;
  size?: "sm" | "md";
  className?: string;
}

const sizeStyles: Record<NonNullable<EmptyStateProps["size"]>, string> = {
  sm: "gap-3 py-6",
  md: "gap-4 py-10",
};

const titleStyles: Record<NonNullable<EmptyStateProps["size"]>, string> = {
  sm: "text-sm font-semibold",
  md: "text-base font-semibold",
};

const descriptionStyles: Record<
  NonNullable<EmptyStateProps["size"]>,
  string
> = {
  sm: "text-xs",
  md: "text-sm",
};

export function EmptyState({
  title,
  description,
  illustration,
  action,
  size = "md",
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        sizeStyles[size],
        className,
      )}
    >
      {illustration ? (
        <div className="flex items-center justify-center">{illustration}</div>
      ) : null}
      <div className="space-y-1">
        <h3 className={cn("text-gray-900", titleStyles[size])}>{title}</h3>
        {description ? (
          <Text className={cn("text-gray-500", descriptionStyles[size])}>
            {description}
          </Text>
        ) : null}
      </div>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
