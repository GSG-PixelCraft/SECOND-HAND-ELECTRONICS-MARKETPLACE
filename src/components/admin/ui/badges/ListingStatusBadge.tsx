import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Span } from "@/components/ui/Span/span";
import { cn } from "@/lib/utils";
import type { ListingStatus } from "@/types/admin";

const statusBadgeVariants = cva(
  "inline-flex items-center justify-center px-3 py-1 text-xs font-medium rounded-lg",
  {
    variants: {
      status: {
        pending: "bg-[rgba(250,204,21,0.1)] text-[#facc15]",
        active: "bg-[rgba(34,197,94,0.1)] text-[#22c55e]",
        rejected: "bg-[rgba(239,68,68,0.1)] text-[#ef4444]",
        sold: "bg-[rgba(107,114,128,0.1)] text-[#6b7280]",
        hidden: "bg-[rgba(138,138,138,0.1)] text-[#8a8a8a]",
        removed: "bg-[rgba(107,114,128,0.1)] text-[#6b7280]",
      },
    },
    defaultVariants: {
      status: "pending",
    },
  },
);

const statusIcons: Record<ListingStatus, ReactNode> = {
  pending: (
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
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  active: (
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
      <path d="M20 6 9 17l-5-5" />
    </svg>
  ),
  rejected: (
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
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  ),
  sold: (
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
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  ),
  hidden: (
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
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
  ),
  removed: (
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
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  ),
};

const statusLabels: Record<ListingStatus, string> = {
  pending: "Pending",
  active: "Active",
  rejected: "Rejected",
  sold: "Sold",
  hidden: "Hidden",
  removed: "Removed",
};

export interface ListingStatusBadgeProps
  extends
    HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusBadgeVariants> {
  status: ListingStatus;
  showIcon?: boolean;
}

export const ListingStatusBadge = forwardRef<
  HTMLSpanElement,
  ListingStatusBadgeProps
>(({ status, showIcon = false, className, ...props }, ref) => {
  return (
    <Span
      ref={ref}
      className={cn(statusBadgeVariants({ status }), className)}
      {...props}
    >
      {showIcon && statusIcons[status]}
      {statusLabels[status]}
    </Span>
  );
});

ListingStatusBadge.displayName = "ListingStatusBadge";
