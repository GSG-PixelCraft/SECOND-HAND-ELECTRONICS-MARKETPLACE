import { forwardRef } from "react";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Text } from "@/components/ui/Text/text";
import { Span } from "@/components/ui/Span/span";
import { Image } from "@/components/ui/Image/image";

export interface ReportRowProps extends HTMLAttributes<HTMLTableRowElement> {
  reportId: string;
  reporterName: string;
  reporterAvatar?: string;
  reason: string;
  targetType: string;
  targetTitle: string;
  date: string;
  status: "pending" | "reviewed" | "resolved" | "dismissed";
  onViewDetails?: () => void;
  isClickable?: boolean;
}

export const ReportRow = forwardRef<HTMLTableRowElement, ReportRowProps>(
  (
    {
      reportId,
      reporterName,
      reporterAvatar,
      reason,
      targetType,
      targetTitle,
      date,
      status,
      onViewDetails,
      isClickable = true,
      className,
      ...props
    },
    ref,
  ) => {
    const statusStyles = {
      pending: "bg-warning/10 text-warning",
      reviewed: "bg-primary/10 text-primary",
      resolved: "bg-success/10 text-success",
      dismissed: "bg-neutral-10 text-neutral-60",
    };

    const statusLabels = {
      pending: "Pending",
      reviewed: "Reviewed",
      resolved: "Resolved",
      dismissed: "Dismissed",
    };

    return (
      <tr
        ref={ref}
        onClick={isClickable ? onViewDetails : undefined}
        className={cn(
          "border-b border-neutral-10 transition-colors",
          isClickable && "cursor-pointer hover:bg-neutral-5",
          className,
        )}
        {...props}
      >
        {/* Reporter */}
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-neutral-10">
              {reporterAvatar ? (
                <Image
                  src={reporterAvatar}
                  alt={reporterName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-primary/10 text-sm font-semibold text-primary">
                  {reporterName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <Text variant="body" className="text-neutral-90 font-medium">
                {reporterName}
              </Text>
              <Span variant="caption" className="text-neutral-50">
                ID: {reportId}
              </Span>
            </div>
          </div>
        </td>

        {/* Target */}
        <td className="px-6 py-4">
          <div>
            <Text variant="body" className="text-neutral-90 font-medium">
              {targetTitle}
            </Text>
            <Span variant="caption" className="text-neutral-50">
              {targetType}
            </Span>
          </div>
        </td>

        {/* Reason */}
        <td className="px-6 py-4">
          <Text variant="body" className="text-neutral-70">
            {reason}
          </Text>
        </td>

        {/* Date */}
        <td className="px-6 py-4">
          <Span variant="body" className="text-neutral-60">
            {date}
          </Span>
        </td>

        {/* Status */}
        <td className="px-6 py-4 text-center">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold",
              statusStyles[status],
            )}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {statusLabels[status]}
          </span>
        </td>

        {/* Actions */}
        <td className="px-6 py-4 text-right">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails?.();
            }}
            className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            View Details
          </button>
        </td>
      </tr>
    );
  },
);

ReportRow.displayName = "ReportRow";
