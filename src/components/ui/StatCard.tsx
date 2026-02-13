import { forwardRef } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Text } from "@/components/ui/text";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  iconColor?: "primary" | "secondary" | "warning" | "error";
  className?: string;
}

const StatCard = forwardRef<HTMLDivElement, StatCardProps>(
  ({ title, value, icon, iconColor = "primary", className }, ref) => {
    const iconColorStyles = {
      primary: "bg-[rgba(37,99,235,0.1)] text-primary",
      secondary: "bg-[rgba(20,184,166,0.1)] text-secondary",
      warning: "bg-[rgba(250,204,21,0.1)] text-warning",
      error: "bg-[rgba(239,68,68,0.1)] text-error",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex h-[149px] w-[270px] flex-col justify-between rounded-xl bg-white p-4 shadow-[0_1px_4px_0_rgba(0,0,0,0.1)]",
          className,
        )}
      >
        {/* Icon */}
        {icon && (
          <div
            className={cn(
              "flex size-12 items-center justify-center rounded-full",
              iconColorStyles[iconColor],
            )}
          >
            {icon}
          </div>
        )}

        {/* Text Content */}
        <div className="space-y-2">
          <Text className="text-sm font-normal text-[#828282]">{title}</Text>
          <Text className="text-foreground text-3xl font-semibold leading-none">
            {value}
          </Text>
        </div>
      </div>
    );
  },
);

StatCard.displayName = "StatCard";

export { StatCard };
export type { StatCardProps };
