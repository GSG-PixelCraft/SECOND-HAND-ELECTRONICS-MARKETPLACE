import { forwardRef } from "react";
import { Text } from "@/components/ui/text";
import { Span } from "@/components/ui/span";
import { SoldListingBanner, RemovedListingBanner } from "@/components/admin/ui";
import { formatReason, parseLocationToCoordinates } from "@/lib/listing-utils";
import {
  AdminProductGallery,
  ProductInfoCard,
  KeyFeaturesCard,
  DescriptionCard,
  SellerInfoCard,
} from "./cards";
import { LocationCard } from "@/pages/ProductDetailPage/components/LocationCard";
import type { AdminListing } from "@/types/admin";

export interface ListingDetailInfoProps {
  listing: AdminListing;
}

export const ListingDetailInfo = forwardRef<
  HTMLDivElement,
  ListingDetailInfoProps
>(({ listing }, ref) => {
  return (
    <div ref={ref} className="flex gap-6">
      {/* Main Content - Left Side */}
      <div className="flex-1 space-y-6">
        {/* Sold Listing Banner */}
        {listing.status === "sold" && (
          <SoldListingBanner
            soldAt={listing.soldAt}
            soldTo={listing.soldTo}
            price={listing.price}
          />
        )}

        {/* Removed Listing Banner */}
        {listing.status === "removed" && (
          <RemovedListingBanner
            removedAt={listing.removedAt}
            removedBy={listing.removedBy}
            reason={listing.removalReason}
            comment={listing.removalComment}
          />
        )}

        {/* Hidden Banner */}
        {listing.status === "hidden" && (
          <div className="rounded-xl border border-neutral-20 bg-neutral-10 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-neutral-60 text-sm">Hide Reason</span>
            </div>
            <div className="text-neutral-90 mt-2 text-sm">
              <span className="font-medium">Primary Issue:</span>{" "}
              {formatReason(listing.hideReason)}
            </div>
          </div>
        )}

        {/* Image Gallery */}
        <AdminProductGallery images={listing.images} title={listing.name} />

        {/* Key Features */}
        <KeyFeaturesCard listing={listing} />

        {/* Description */}
        <DescriptionCard description={listing.description} />

        {/* Location */}
        <LocationCard
          location={listing.seller || "Gaza, Palestine"}
          coordinates={parseLocationToCoordinates(listing.seller)}
        />

        {/* Status-specific Information */}
        {listing.status === "rejected" && listing.rejectionReason && (
          <div className="rounded-lg border border-error-20 bg-error-5 p-6">
            <h2 className="mb-2 text-lg font-semibold text-error">
              Rejection Details
            </h2>
            <div className="space-y-2">
              <div>
                <Span variant="label" className="font-medium">
                  Reason:
                </Span>{" "}
                <Span variant="bodySmall">
                  {listing.rejectionReason.replace(/_/g, " ")}
                </Span>
              </div>
              {listing.rejectionComment && (
                <div>
                  <Span variant="label" className="font-medium">
                    Comment:
                  </Span>
                  <Text variant="bodySmall" className="mt-1">
                    {listing.rejectionComment}
                  </Text>
                </div>
              )}
              {listing.rejectedAt && (
                <div>
                  <Span variant="label" className="font-medium">
                    Rejected on:
                  </Span>{" "}
                  <Span variant="bodySmall">
                    {new Date(listing.rejectedAt).toLocaleString()}
                  </Span>
                </div>
              )}
            </div>
          </div>
        )}

        {listing.status === "hidden" && listing.hideReason && (
          <div className="rounded-lg border border-warning-20 bg-warning-5 p-6">
            <h2 className="mb-2 text-lg font-semibold text-warning">
              Hidden Listing Details
            </h2>
            <div className="space-y-2">
              <div>
                <Span variant="label" className="font-medium">
                  Reason:
                </Span>{" "}
                <Span variant="bodySmall">
                  {listing.hideReason.replace(/_/g, " ")}
                </Span>
              </div>
              {listing.hideComment && (
                <div>
                  <Span variant="label" className="font-medium">
                    Comment:
                  </Span>
                  <Text variant="bodySmall" className="mt-1">
                    {listing.hideComment}
                  </Text>
                </div>
              )}
              {listing.hiddenAt && (
                <div>
                  <Span variant="label" className="font-medium">
                    Hidden on:
                  </Span>{" "}
                  <Span variant="bodySmall">
                    {new Date(listing.hiddenAt).toLocaleString()}
                  </Span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar - Product Info & Seller */}
      <div className="w-[400px] shrink-0 space-y-6">
        {/* Main Product Info */}
        <ProductInfoCard listing={listing} />

        {/* Seller Information */}
        <SellerInfoCard
          seller={{
            name: listing.sellerName,
            email: listing.sellerEmail,
            avatar: listing.sellerAvatar,
            id: listing.sellerId,
          }}
        />
      </div>
    </div>
  );
});

ListingDetailInfo.displayName = "ListingDetailInfo";
