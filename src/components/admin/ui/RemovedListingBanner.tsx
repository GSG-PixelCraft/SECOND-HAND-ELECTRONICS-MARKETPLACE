import * as React from "react";
import { Trash2, Calendar, AlertCircle } from "lucide-react";
import { Text } from "@/components/ui/text";
import { Span } from "@/components/ui/span";

export interface RemovedListingBannerProps {
  removedAt?: string;
  removedBy?: string;
  reason?: string;
  comment?: string;
}

export const RemovedListingBanner = React.forwardRef<
  HTMLDivElement,
  RemovedListingBannerProps
>(({ removedAt, removedBy, reason, comment }, ref) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Recently";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatReason = (reason?: string) => {
    if (!reason) return "Removed by admin";
    return reason
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <div ref={ref} className="bg-error-5 rounded-xl border border-error-20 p-6">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-error/10">
          <Trash2 className="size-6 text-error" />
        </div>

        {/* Content */}
        <div className="flex-1 space-y-3">
          <div>
            <h3 className="text-xl font-semibold text-error">
              This listing has been removed
            </h3>
            <Text variant="bodySmall" className="text-neutral-60 mt-1">
              This listing is no longer active and has been permanently removed
              from the marketplace.
            </Text>
          </div>

          {/* Removal Details */}
          <div className="space-y-2">
            {reason && (
              <div className="flex items-start gap-2">
                <AlertCircle className="mt-0.5 size-4 shrink-0 text-error" />
                <div>
                  <Span className="text-neutral-90 text-sm font-medium">
                    Reason:
                  </Span>{" "}
                  <Span className="text-neutral-60 text-sm">
                    {formatReason(reason)}
                  </Span>
                </div>
              </div>
            )}

            {comment && (
              <div className="rounded-lg border border-error-20 bg-white p-3">
                <Text variant="caption" className="text-neutral-90 font-medium">
                  Additional Details
                </Text>
                <Text variant="bodySmall" className="text-neutral-60 mt-1">
                  {comment}
                </Text>
              </div>
            )}
          </div>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-error-20 pt-3">
            {removedAt && (
              <div className="flex items-center gap-2">
                <Calendar className="text-neutral-50 size-4" />
                <Span className="text-neutral-60 text-sm">
                  Removed on {formatDate(removedAt)}
                </Span>
              </div>
            )}
            {removedBy && (
              <div className="flex items-center gap-2">
                <Span className="text-neutral-50 text-sm">By:</Span>
                <Span className="text-neutral-90 text-sm font-medium">
                  {removedBy}
                </Span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

RemovedListingBanner.displayName = "RemovedListingBanner";
