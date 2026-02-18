import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Text } from "@/components/ui/text";
import { Span } from "@/components/ui/span";

const kpiCardVariants = cva(
  [
    "rounded-xl",
    "border",
    "p-6",
    "transition-all",
    "duration-200",
    "hover:shadow-md",
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-primary/5",
          "border-primary/20",
          "hover:border-primary/30",
        ],
        success: [
          "bg-success/5",
          "border-success/20",
          "hover:border-success/30",
        ],
        warning: [
          "bg-warning/5",
          "border-warning/20",
          "hover:border-warning/30",
        ],
        error: ["bg-error/5", "border-error/20", "hover:border-error/30"],
        neutral: [
          "bg-neutral-5",
          "border-neutral-20",
          "hover:border-neutral-30",
        ],
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  },
);

const kpiIconVariants = cva(
  ["flex", "items-center", "justify-center", "rounded-lg", "w-12", "h-12"],
  {
    variants: {
      variant: {
        primary: "bg-primary/10 text-primary",
        success: "bg-success/10 text-success",
        warning: "bg-warning/10 text-warning",
        error: "bg-error/10 text-error",
        neutral: "bg-neutral-10 text-neutral-60",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  },
);

const kpiTrendVariants = cva(
  [
    "inline-flex",
    "items-center",
    "gap-1",
    "px-2",
    "py-1",
    "rounded-md",
    "text-xs",
    "font-semibold",
  ],
  {
    variants: {
      trend: {
        up: "bg-success/10 text-success",
        down: "bg-error/10 text-error",
        neutral: "bg-neutral-10 text-neutral-60",
      },
    },
    defaultVariants: {
      trend: "neutral",
    },
  },
);

type KpiCardVariantProps = VariantProps<typeof kpiCardVariants>;
type KpiTrendVariantProps = VariantProps<typeof kpiTrendVariants>;

export interface KpiCardProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  icon?: ReactNode;
  variant?: KpiCardVariantProps["variant"];
  trend?: KpiTrendVariantProps["trend"];
  trendValue?: string;
  subtitle?: string;
  loading?: boolean;
}

export const KpiCard = forwardRef<HTMLDivElement, KpiCardProps>(
  (
    {
      title,
      value,
      icon,
      variant = "primary",
      trend,
      trendValue,
      subtitle,
      loading = false,
      className,
      ...props
    },
    ref,
  ) => {
    if (loading) {
      return (
        <div
          ref={ref}
          className={cn(
            kpiCardVariants({ variant }),
            "animate-pulse",
            className,
          )}
          {...props}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-3">
              <div className="h-4 w-24 rounded bg-neutral-20"></div>
              <div className="h-8 w-32 rounded bg-neutral-20"></div>
              <div className="h-3 w-20 rounded bg-neutral-20"></div>
            </div>
            {icon && (
              <div className={cn(kpiIconVariants({ variant }))}>
                <div className="h-6 w-6 rounded bg-neutral-20"></div>
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(kpiCardVariants({ variant }), className)}
        {...props}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            <Span
              variant="caption"
              className="text-neutral-60 font-medium uppercase tracking-wide"
            >
              {title}
            </Span>
            <Text variant="h3" className="text-neutral-90 font-bold">
              {value}
            </Text>
            {(trend || subtitle) && (
              <div className="flex items-center gap-2">
                {trend && trendValue && (
                  <span className={cn(kpiTrendVariants({ trend }))}>
                    {trend === "up" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m5 12 7-7 7 7" />
                        <path d="M12 19V5" />
                      </svg>
                    )}
                    {trend === "down" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 5v14" />
                        <path d="m19 12-7 7-7-7" />
                      </svg>
                    )}
                    {trendValue}
                  </span>
                )}
                {subtitle && (
                  <Span variant="caption" className="text-neutral-50">
                    {subtitle}
                  </Span>
                )}
              </div>
            )}
          </div>
          {icon && (
            <div className={cn(kpiIconVariants({ variant }))}>{icon}</div>
          )}
        </div>
      </div>
    );
  },
);

KpiCard.displayName = "KpiCard";
