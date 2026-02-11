import { forwardRef } from "react";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface VerificationCheckProps extends HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
}

export const VerificationCheck = forwardRef<
  HTMLDivElement,
  VerificationCheckProps
>(({ size = "md", className, ...props }, ref) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  };

  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-success text-white",
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      <Check size={iconSizes[size]} strokeWidth={3} />
    </div>
  );
});

VerificationCheck.displayName = "VerificationCheck";
