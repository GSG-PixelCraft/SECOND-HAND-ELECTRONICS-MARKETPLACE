import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const statusBadgeVariants = cva(
  "inline-flex items-center justify-center rounded-lg px-3 py-1 text-xs font-normal",
  {
    variants: {
      variant: {
        pending: "bg-[rgba(250,204,21,0.1)] text-[#FACC15]",
        active: "bg-[rgba(34,197,94,0.1)] text-[#22C55E]",
        completed: "bg-[rgba(34,197,94,0.1)] text-[#22C55E]",
        neutral: "bg-[#E8E8EA] text-[#6B7280]",
        rejected: "bg-[rgba(239,68,68,0.1)] text-[#EF4444]",
        processing: "bg-[rgba(37,99,235,0.1)] text-[#2563EB]",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  },
);

export interface StatusBadgeProps
  extends
    React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusBadgeVariants> {
  children: React.ReactNode;
}

export function StatusBadge({
  className,
  variant,
  children,
  ...props
}: StatusBadgeProps) {
  return (
    <span
      className={cn(statusBadgeVariants({ variant }), className)}
      {...props}
    >
      {children}
    </span>
  );
}
