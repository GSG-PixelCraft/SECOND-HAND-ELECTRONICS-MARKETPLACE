import { forwardRef, Fragment } from "react";
import type { MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";
import { Span } from "@/components/ui/span";
import { Image } from "@/components/ui/image";
import { ListingStatusBadge } from "@/components/admin";
import { cn } from "@/lib/utils";
import type { AdminListing, ListingStatus } from "@/types/admin";

export interface ListingsTableProps {
  listings: AdminListing[];
  onRowClick?: (listing: AdminListing) => void;
  className?: string;
}

export const ListingsTable = forwardRef<HTMLDivElement, ListingsTableProps>(
  ({ listings, onRowClick, className }, ref) => {
    const navigate = useNavigate();

    const handleRowClick = (listing: AdminListing) => {
      if (onRowClick) {
        onRowClick(listing);
      } else {
        navigate(`/admin/listings/${listing.id}`);
      }
    };

    const handleViewClick = (e: MouseEvent, listingId: string) => {
      e.stopPropagation();
      navigate(`/admin/listings/${listingId}`);
    };

    return (
      <div ref={ref} className={cn("flex flex-col gap-2", className)}>
        {/* Table Header */}
        <div className="flex h-12 items-center overflow-hidden rounded-xl bg-primary/10">
          <div className="flex w-[242px] items-center gap-1 px-4">
            <Span className="text-neutral-90 text-sm font-medium">
              Listing Title
            </Span>
            <div className="flex h-4 w-4 items-center justify-center">
              <svg
                width="12"
                height="7"
                viewBox="0 0 12 7"
                fill="none"
                className="text-primary"
              >
                <path
                  d="M1 1L6 6L11 1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
          <div className="flex flex-1 items-center gap-1 px-4">
            <Span className="text-neutral-90 text-sm font-medium">Seller</Span>
            <div className="flex h-4 w-4 items-center justify-center">
              <svg
                width="12"
                height="7"
                viewBox="0 0 12 7"
                fill="none"
                className="text-primary"
              >
                <path
                  d="M1 1L6 6L11 1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
          <div className="flex flex-1 items-center gap-1 px-4">
            <Span className="text-neutral-90 text-sm font-medium">
              Category
            </Span>
            <div className="flex h-4 w-4 items-center justify-center">
              <svg
                width="12"
                height="7"
                viewBox="0 0 12 7"
                fill="none"
                className="text-primary"
              >
                <path
                  d="M1 1L6 6L11 1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
          <div className="flex flex-1 items-center gap-1 px-4">
            <Span className="text-neutral-90 text-sm font-medium">
              Submission date
            </Span>
            <div className="flex h-4 w-4 items-center justify-center">
              <svg
                width="12"
                height="7"
                viewBox="0 0 12 7"
                fill="none"
                className="text-primary"
              >
                <path
                  d="M1 1L6 6L11 1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
          <div className="flex flex-1 items-center gap-1 px-4">
            <Span className="text-neutral-90 text-sm font-medium">Status</Span>
            <div className="flex h-4 w-4 items-center justify-center">
              <svg
                width="12"
                height="7"
                viewBox="0 0 12 7"
                fill="none"
                className="text-primary"
              >
                <path
                  d="M1 1L6 6L11 1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
          <div className="flex w-[112px] items-center gap-1 px-4">
            <Span className="text-neutral-90 text-sm font-medium">Actions</Span>
            <div className="flex h-4 w-4 items-center justify-center">
              <svg
                width="12"
                height="7"
                viewBox="0 0 12 7"
                fill="none"
                className="text-primary"
              >
                <path
                  d="M1 1L6 6L11 1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Table Rows */}
        <div className="flex flex-col gap-3">
          {listings.map((listing, index) => (
            <Fragment key={listing.id}>
              <div
                className="flex h-12 cursor-pointer items-center overflow-hidden bg-white transition-colors hover:bg-neutral-5/30"
                onClick={() => handleRowClick(listing)}
              >
                {/* Listing Title */}
                <div className="flex w-[242px] items-center gap-2 px-4">
                  <Image
                    src={listing.image || listing.images[0]}
                    alt={listing.name}
                    variant="thumbnail"
                    className="h-8 w-8 rounded object-cover"
                  />
                  <Span className="text-neutral-60 flex-1 truncate text-sm">
                    {listing.name}
                  </Span>
                </div>

                {/* Seller */}
                <div className="flex flex-1 items-center px-4">
                  <div className="flex items-center gap-2">
                    <Span className="text-neutral-60 max-w-[101px] truncate text-sm">
                      {listing.seller || listing.sellerName}
                    </Span>
                    {/* Green dot indicator for online status */}
                    <div
                      className="h-[13.5px] w-[13.5px] flex-shrink-0 rounded-full bg-success"
                      title="Online"
                    />
                  </div>
                </div>

                {/* Category */}
                <div className="flex flex-1 items-center px-4">
                  <div className="inline-flex items-center rounded-lg bg-neutral-10 px-3 py-1">
                    <Span className="text-neutral-50 text-xs">
                      {listing.category}
                    </Span>
                  </div>
                </div>

                {/* Submission Date */}
                <div className="flex flex-1 items-center px-4">
                  <Span className="text-neutral-60 text-sm">
                    {new Date(listing.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </Span>
                </div>

                {/* Status */}
                <div className="flex flex-1 items-center px-4">
                  <ListingStatusBadge
                    status={listing.status as ListingStatus}
                  />
                </div>

                {/* Actions */}
                <div className="flex w-[112px] items-center justify-center">
                  <button
                    onClick={(e) => handleViewClick(e, listing.id)}
                    className="text-neutral-50 flex h-6 w-6 items-center justify-center transition-colors hover:text-primary"
                    aria-label="View details"
                  >
                    <Eye className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Divider Line */}
              {index < listings.length - 1 && (
                <div className="h-px bg-neutral-20" />
              )}
            </Fragment>
          ))}
        </div>
      </div>
    );
  },
);

ListingsTable.displayName = "ListingsTable";
