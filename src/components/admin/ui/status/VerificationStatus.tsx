import { forwardRef } from "react";
import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const verificationStatusVariants = cva(
  [
    "inline-flex",
    "items-center",
    "gap-1.5",
    "px-3",
    "py-1.5",
    "rounded-full",
    "text-xs",
    "font-semibold",
  ],
  {
    variants: {
      status: {
        pending: ["bg-warning/10", "text-warning"],
        verified: ["bg-success/10", "text-success"],
        rejected: ["bg-error/10", "text-error"],
        "under-review": ["bg-primary/10", "text-primary"],
      },
    },
    defaultVariants: {
      status: "pending",
    },
  },
);

type VerificationStatusVariantProps = VariantProps<
  typeof verificationStatusVariants
>;

export interface VerificationStatusProps extends HTMLAttributes<HTMLSpanElement> {
  status: VerificationStatusVariantProps["status"];
  label?: string;
  showDot?: boolean;
}

export const VerificationStatus = forwardRef<
  HTMLSpanElement,
  VerificationStatusProps
>(({ status, label, showDot = true, className, ...props }, ref) => {
  const getLabel = () => {
    if (label) return label;
    switch (status) {
      case "pending":
        return "Pending";
      case "verified":
        return "Verified";
      case "rejected":
        return "Rejected";
      case "under-review":
        return "Under Review";
      default:
        return "Unknown";
    }
  };

  return (
    <span
      ref={ref}
      className={cn(verificationStatusVariants({ status }), className)}
      {...props}
    >
      {showDot && <span className="h-1.5 w-1.5 rounded-full bg-current"></span>}
      {getLabel()}
    </span>
  );
});

VerificationStatus.displayName = "VerificationStatus";
