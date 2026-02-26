import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Text } from "@/components/ui/Text/text";
import { Info } from "lucide-react";

export interface TipProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  children: ReactNode;
  icon?: ReactNode;
  variant?: "info" | "warning" | "success" | "error";
}

export const Tip = forwardRef<HTMLDivElement, TipProps>(
  ({ title, children, icon, variant = "info", className, ...props }, ref) => {
    const variantStyles = {
      info: "bg-primary/5 border-primary/20 text-primary",
      warning: "bg-warning/5 border-warning/20 text-warning",
      success: "bg-success/5 border-success/20 text-success",
      error: "bg-error/5 border-error/20 text-error",
    };

    const iconColor = {
      info: "text-primary",
      warning: "text-warning",
      success: "text-success",
      error: "text-error",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex gap-3 rounded-lg border p-4",
          variantStyles[variant],
          className,
        )}
        {...props}
      >
        <div className={cn("mt-0.5 flex-shrink-0", iconColor[variant])}>
          {icon || <Info className="h-5 w-5" />}
        </div>
        <div className="flex-1">
          {title && (
            <Text variant="body" className="text-neutral-90 mb-1 font-semibold">
              {title}
            </Text>
          )}
          <Text variant="body" className="text-neutral-70">
            {children}
          </Text>
        </div>
      </div>
    );
  },
);

Tip.displayName = "Tip";
