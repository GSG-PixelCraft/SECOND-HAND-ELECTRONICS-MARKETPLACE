import { forwardRef } from "react";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import type { ReportReason } from "@/types/admin";

const dangerReasons = new Set([
  "scam",
  "prohibited item",
  "selling prohibited items",
  "harassment",
  "impersonation",
]);

const warningReasons = new Set([
  "inappropriate content",
  "suspicious activity",
  "fake account",
]);

const neutralReasons = new Set(["suspicious behavior"]);

const toneStyles = {
  danger: "bg-error/10 text-error",
  warning: "bg-warning/10 text-warning",
  neutral: "bg-neutral-10 text-neutral-60",
};

export interface ReportReasonBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  reason: ReportReason;
}

export const ReportReasonBadge = forwardRef<
  HTMLSpanElement,
  ReportReasonBadgeProps
>(({ reason, className, ...props }, ref) => {
  const normalized = reason.toLowerCase().trim();

  const tone = dangerReasons.has(normalized)
    ? "danger"
    : warningReasons.has(normalized)
      ? "warning"
      : neutralReasons.has(normalized)
        ? "neutral"
        : "neutral";

  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        toneStyles[tone],
        className,
      )}
      {...props}
    >
      {reason}
    </span>
  );
});

ReportReasonBadge.displayName = "ReportReasonBadge";
