import * as React from "react";
import { Card, CardContent } from "./Card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  change?: number;
  changeLabel?: string;
  variant?: "default" | "success" | "warning" | "error";
  className?: string;
}

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  (
    {
      title,
      value,
      icon,
      change,
      changeLabel,
      variant = "default",
      className,
    },
    ref
  ) => {
    const isPositive = change !== undefined && change >= 0;
    const hasChange = change !== undefined;

    const variantStyles = {
      default: "bg-background",
      success: "bg-success/5 border-success/20",
      warning: "bg-warning/5 border-warning/20",
      error: "bg-error/5 border-error/20",
    };

    return (
      <Card ref={ref} className={cn(variantStyles[variant], className)}>
        <CardContent className="pt-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">
                {title}
              </p>
              <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
              {hasChange && (
                <div className="mt-2 flex items-center gap-1 text-sm">
                  {isPositive ? (
                    <TrendingUp className="h-4 w-4 text-success" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-error" />
                  )}
                  <span
                    className={cn(
                      "font-medium",
                      isPositive ? "text-success" : "text-error"
                    )}
                  >
                    {isPositive ? "+" : ""}
                    {change}%
                  </span>
                  {changeLabel && (
                    <span className="text-muted-foreground">{changeLabel}</span>
                  )}
                </div>
              )}
            </div>
            {icon && (
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {icon}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
);

StatCard.displayName = "StatCard";

export { StatCard };
export type { StatCardProps };
