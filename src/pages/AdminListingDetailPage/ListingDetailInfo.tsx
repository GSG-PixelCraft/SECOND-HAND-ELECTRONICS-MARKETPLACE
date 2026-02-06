import * as React from "react";
import { Text } from "@/components/ui/text";
import { Span } from "@/components/ui/span";
import { Image } from "@/components/ui/image";
import { SoldListingBanner, RemovedListingBanner } from "@/components/admin/ui";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  MoreVertical,
  CheckCircle2,
} from "lucide-react";
import type { AdminListing } from "@/types/admin";

export interface ListingDetailInfoProps {
  listing: AdminListing;
}

export const ListingDetailInfo = React.forwardRef<
  HTMLDivElement,
  ListingDetailInfoProps
>(({ listing }, ref) => {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  const getRelativeTime = (dateString: string) => {
    const created = new Date(dateString).getTime();
    const now = Date.now();
    const diffDays = Math.max(1, Math.round((now - created) / 86400000));
    return `${diffDays} days ago`;
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? listing.images.length - 1 : prev - 1,
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === listing.images.length - 1 ? 0 : prev + 1,
    );
  };

  const formatReason = (reason?: string) => {
    if (!reason) return "Not provided";
    return reason
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

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
        {/* Image Carousel */}
        <div className="bg-neutral-100 relative h-[645px] overflow-hidden rounded-xl">
          {/* Main Image */}
          <Image
            src={listing.images[currentImageIndex]}
            alt={`${listing.name} - Image ${currentImageIndex + 1}`}
            variant="cover"
            className="h-full w-full"
          />

          {/* Navigation Buttons */}
          <button
            onClick={handlePrevImage}
            className="hover:bg-neutral-50 absolute left-6 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft className="text-neutral-90 size-6" />
          </button>

          <button
            onClick={handleNextImage}
            className="hover:bg-neutral-50 absolute right-6 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg transition-colors"
            aria-label="Next image"
          >
            <ChevronRight className="text-neutral-90 size-6" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
            {listing.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`size-2.5 rounded-full transition-all ${
                  index === currentImageIndex
                    ? "w-8 bg-white"
                    : "bg-white/50 hover:bg-white/75"
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Key Features */}
        <div className="rounded-xl border border-neutral-20 bg-white p-4">
          <h2 className="text-neutral-90 mb-4 text-lg font-medium">
            Key features
          </h2>

          <div className="space-y-6">
            {/* Row 1 */}
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center justify-between rounded-lg bg-secondary/5 p-4">
                <Span className="text-neutral-50">Category</Span>
                <Span className="text-neutral-90 font-normal">
                  {listing.category}
                </Span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-secondary/5 p-4">
                <Span className="text-neutral-50">Brand</Span>
                <Span className="text-neutral-90 font-normal">
                  {listing.seller || "N/A"}
                </Span>
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center justify-between rounded-lg bg-white p-4">
                <Span className="text-neutral-50">Model</Span>
                <Span className="text-neutral-90 font-normal">
                  {listing.name}
                </Span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white p-4">
                <Span className="text-neutral-50">Storage</Span>
                <Span className="text-neutral-90 font-normal">256 GB</Span>
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center justify-between rounded-lg bg-secondary/5 p-4">
                <Span className="text-neutral-50">Battery Health</Span>
                <Span className="text-neutral-90 font-normal">85%</Span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-secondary/5 p-4">
                <Span className="text-neutral-50">Condition</Span>
                <Span className="text-neutral-60 font-normal capitalize">
                  {listing.condition}
                </Span>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="rounded-xl border border-neutral-20 bg-white p-4">
          <h2 className="text-neutral-90 mb-4 text-lg font-medium">
            Description
          </h2>
          <div className="space-y-3">
            <Text variant="body" className="text-neutral-60 leading-relaxed">
              {listing.description}
            </Text>
            <button className="text-neutral-50 hover:text-neutral-70 text-sm font-medium transition-colors">
              Show More
            </button>
          </div>
        </div>

        {/* Location */}
        <div className="rounded-xl border border-neutral-20 bg-white p-4">
          <h2 className="text-neutral-90 mb-4 text-lg font-medium">Location</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="size-5 text-primary" />
              <Span className="text-neutral-90">Gaza, Palestine</Span>
            </div>
            <div className="bg-neutral-100 h-64 overflow-hidden rounded-lg">
              <div className="text-neutral-40 flex h-full w-full items-center justify-center">
                {/* Map placeholder */}
                <MapPin className="size-12" />
              </div>
            </div>
          </div>
        </div>

        {/* Status-specific Information */}
        {listing.status === "rejected" && listing.rejectionReason && (
          <div className="bg-error-5 rounded-lg border border-error-20 p-6">
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
          <div className="bg-warning-5 rounded-lg border border-warning-20 p-6">
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
        <div className="rounded-xl border border-neutral-20 bg-white p-4">
          <div className="space-y-6">
            {/* Time Posted */}
            <div className="flex items-center gap-2">
              <Clock className="text-neutral-50 size-5" />
              <Span className="text-neutral-60 text-sm">
                {getRelativeTime(listing.createdAt)}
              </Span>
            </div>

            {/* Product Title, Price & Badge */}
            <div className="space-y-3">
              <h3 className="text-neutral-90 text-xl font-normal">
                {listing.name}
              </h3>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-baseline gap-2">
                    <Text className="text-2xl font-medium text-primary">
                      {listing.price} ILS
                    </Text>
                  </div>
                  <Text className="text-neutral-50 text-xs">
                    Price is negotiable
                  </Text>
                </div>
                <div className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white">
                  {listing.condition === "new" ? "New" : "Used"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seller Information */}
        <div className="rounded-xl border border-neutral-20 bg-white p-4">
          <div className="space-y-4">
            {/* Seller Profile */}
            <div className="flex items-center gap-4">
              <div className="relative">
                {listing.sellerAvatar ? (
                  <Image
                    src={listing.sellerAvatar}
                    alt={listing.sellerName}
                    variant="avatar"
                    className="size-20 rounded-full"
                  />
                ) : (
                  <div className="bg-neutral-100 flex size-20 items-center justify-center rounded-full">
                    <Span className="text-neutral-50 text-2xl font-semibold">
                      {listing.sellerName.charAt(0).toUpperCase()}
                    </Span>
                  </div>
                )}
                <CheckCircle2 className="absolute -bottom-1 -right-1 size-6 fill-white text-primary" />
              </div>

              <div className="min-w-0 flex-1">
                <Text className="text-neutral-90 truncate text-lg font-normal">
                  {listing.sellerName}
                </Text>
                <div className="text-neutral-50 flex flex-wrap items-center gap-2 text-sm">
                  <Span>
                    <span className="font-medium text-primary">2</span> Active
                    listing
                  </Span>
                  <Span>-</Span>
                  <Span>
                    <span className="font-medium text-secondary">10</span> Sold
                    listing
                  </Span>
                </div>
              </div>

              <button className="shrink-0 rounded-lg p-2 transition-colors hover:bg-neutral-5">
                <MoreVertical className="text-neutral-60 size-5" />
              </button>
            </div>

            {/* Seller Stats */}
            <div className="text-neutral-50 space-y-3 text-sm">
              <Text>Last online 1 week ago</Text>
              <Text>Avg. response time: within 1 hour</Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ListingDetailInfo.displayName = "ListingDetailInfo";
