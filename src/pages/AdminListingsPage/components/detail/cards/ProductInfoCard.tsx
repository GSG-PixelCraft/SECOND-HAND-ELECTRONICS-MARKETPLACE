import { forwardRef } from "react";
import { Clock } from "lucide-react";
import { Text } from "@/components/ui/Text/text";
import { Span } from "@/components/ui/Span/span";
import { formatRelativeTime } from "@/lib/listing-utils";
import type { AdminListing } from "@/types/admin";

export interface ProductInfoCardProps {
  listing: AdminListing;
}

export const ProductInfoCard = forwardRef<HTMLDivElement, ProductInfoCardProps>(
  ({ listing }, ref) => {
    const getConditionBadgeColor = (condition: string) => {
      switch (condition.toLowerCase()) {
        case "new":
          return "bg-success text-white";
        case "used":
          return "bg-primary text-white";
        case "refurbished":
          return "bg-info text-white";
        default:
          return "bg-neutral-20 text-neutral-90";
      }
    };

    const getConditionLabel = (condition: string) => {
      return condition.charAt(0).toUpperCase() + condition.slice(1);
    };

    return (
      <div
        ref={ref}
        className="rounded-xl border border-neutral-20 bg-white p-4"
      >
        <div className="space-y-6">
          {/* Time Posted */}
          <div className="flex items-center gap-2">
            <Clock className="text-neutral-50 size-5" />
            <Span className="text-neutral-60 text-sm">
              {formatRelativeTime(listing.createdAt)}
            </Span>
          </div>

          {/* Product Title, Price & Badge */}
          <div className="space-y-3">
            <h3 className="text-neutral-90 text-xl font-semibold">
              {listing.name}
            </h3>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-baseline gap-2">
                  <Text className="text-2xl font-bold text-blue-600">
                    {listing.price} ILS
                  </Text>
                </div>
                <Text className="text-neutral-50 text-xs">
                  Price is negotiable
                </Text>
              </div>
              <div
                className={`rounded-xl px-4 py-2 text-sm font-medium ${getConditionBadgeColor(listing.condition)}`}
              >
                {getConditionLabel(listing.condition)}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

ProductInfoCard.displayName = "ProductInfoCard";
