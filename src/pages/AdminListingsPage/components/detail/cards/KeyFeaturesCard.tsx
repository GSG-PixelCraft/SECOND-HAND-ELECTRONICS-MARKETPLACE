import { forwardRef } from "react";
import { Span } from "@/components/ui/Span/span";
import { getProductSpecifications } from "@/lib/listing-utils";
import type { AdminListing } from "@/types/admin";

export interface KeyFeaturesCardProps {
  listing: AdminListing;
}

export const KeyFeaturesCard = forwardRef<HTMLDivElement, KeyFeaturesCardProps>(
  ({ listing }, ref) => {
    const features = getProductSpecifications(listing);

    return (
      <div
        ref={ref}
        className="rounded-xl border border-neutral-20 bg-white p-4"
      >
        <h2 className="text-neutral-90 mb-4 text-lg font-medium">
          Key features
        </h2>

        <div className="grid gap-3 sm:grid-cols-2">
          {features.map((feature, index) => (
            <div
              key={feature.label}
              className={`flex items-center justify-between rounded-lg p-4 ${
                index % 2 === 0
                  ? "bg-neutral-5"
                  : "border border-neutral-10 bg-white"
              }`}
            >
              <Span className="text-neutral-60 text-sm">{feature.label}</Span>
              <Span className="text-neutral-90 text-sm font-medium">
                {feature.value}
              </Span>
            </div>
          ))}
        </div>
      </div>
    );
  },
);

KeyFeaturesCard.displayName = "KeyFeaturesCard";
