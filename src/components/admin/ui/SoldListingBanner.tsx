import * as React from "react";
import { CheckCircle2, Calendar } from "lucide-react";
import { Text } from "@/components/ui/text";
import { Span } from "@/components/ui/span";

export interface SoldListingBannerProps {
  soldAt?: string;
  soldTo?: string;
  price?: number;
}

export const SoldListingBanner = React.forwardRef<
  HTMLDivElement,
  SoldListingBannerProps
>(({ soldAt, soldTo, price }, ref) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Recently";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div
      ref={ref}
      className="bg-success-5 rounded-xl border border-success-20 p-6"
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-success/10">
          <CheckCircle2 className="size-6 text-success" />
        </div>

        {/* Content */}
        <div className="flex-1 space-y-3">
          <div>
            <h3 className="text-xl font-semibold text-success">
              This listing has been sold
            </h3>
            <Text variant="bodySmall" className="text-neutral-60 mt-1">
              This item is no longer available for purchase.
            </Text>
          </div>

          {/* Sale Details */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {soldAt && (
              <div className="flex items-center gap-2">
                <Calendar className="text-neutral-50 size-4" />
                <Span className="text-neutral-90 text-sm">
                  Sold on {formatDate(soldAt)}
                </Span>
              </div>
            )}
            {price && (
              <div className="flex items-center gap-2">
                <Span className="text-neutral-50 text-sm">Final Price:</Span>
                <Span className="text-sm font-semibold text-success">
                  {price} ILS
                </Span>
              </div>
            )}
          </div>

          {soldTo && (
            <div className="rounded-lg bg-white p-3">
              <Text variant="caption" className="text-neutral-50">
                Buyer
              </Text>
              <Text variant="bodySmall" className="text-neutral-90 font-medium">
                {soldTo}
              </Text>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

SoldListingBanner.displayName = "SoldListingBanner";
