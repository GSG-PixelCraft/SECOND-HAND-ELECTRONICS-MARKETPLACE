import * as React from "react";
import { useNavigate } from "react-router-dom";
import { EyeOff, Eye, ChevronLeft, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Span } from "@/components/ui/span";
import { ListingStatusBadge } from "@/components/admin";
import type { AdminListing, ListingStatus } from "@/types/admin";

export interface ListingDetailHeaderProps {
  listing: AdminListing;
  onApprove?: () => void;
  onReject?: () => void;
  onHide?: () => void;
  onUnhide?: () => void;
  isLoading?: boolean;
}

export const ListingDetailHeader = React.forwardRef<
  HTMLDivElement,
  ListingDetailHeaderProps
>(({ listing, onApprove, onReject, onHide, onUnhide, isLoading }, ref) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!menuOpen) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [menuOpen]);

  const getActionButtons = () => {
    const buttons = [];

    if (listing.status === "pending") {
      buttons.push(
        <Button
          key="reject"
          intent="outline"
          onClick={onReject}
          disabled={isLoading}
          className="border-error/40 px-8 text-error hover:border-error/60 hover:bg-error/5"
        >
          Reject
        </Button>,
        <Button
          key="approve"
          intent="primary"
          onClick={onApprove}
          disabled={isLoading}
          className="border-none bg-primary px-8 shadow-lg shadow-primary/20 hover:bg-primary/90"
        >
          Approve
        </Button>,
      );
    }

    if (listing.status === "active" || listing.status === "hidden") {
      buttons.push(
        <div key="menu" className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            disabled={isLoading}
            className="text-neutral-60 hover:text-neutral-90 flex size-10 items-center justify-center rounded-full border border-neutral-20 bg-white transition-colors hover:bg-neutral-5 disabled:opacity-50"
            aria-label="More options"
          >
            <MoreVertical className="size-5" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-40 rounded-lg border border-neutral-20 bg-white py-1 shadow-lg">
              {listing.status === "active" && (
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onHide?.();
                  }}
                  className="text-neutral-90 flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-neutral-5"
                >
                  <EyeOff className="text-neutral-50 size-4" />
                  Hide
                </button>
              )}
              {listing.status === "hidden" && (
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onUnhide?.();
                  }}
                  className="text-neutral-90 flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-neutral-5"
                >
                  <Eye className="text-neutral-50 size-4" />
                  Unhide list
                </button>
              )}
            </div>
          )}
        </div>,
      );
    }

    return buttons;
  };

  return (
    <div ref={ref} className="flex items-center justify-between gap-4">
      {/* Left: Back Arrow + Title + Status */}
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <button
          onClick={() => navigate("/admin/listings")}
          className="text-neutral-60 hover:text-neutral-90 shrink-0 transition-colors"
          aria-label="Back to listings"
        >
          <ChevronLeft className="size-6" />
        </button>

        <div className="flex min-w-0 items-center gap-3">
          <Span className="text-neutral-60 shrink-0 text-xl font-medium">
            Listing review:
          </Span>
          <h1 className="text-neutral-90 truncate text-2xl font-medium">
            {listing.name}
          </h1>
          <ListingStatusBadge status={listing.status as ListingStatus} />
        </div>
      </div>

      {/* Right: Action Buttons + More Menu */}
      <div className="flex shrink-0 items-center gap-3">
        {getActionButtons()}
      </div>
    </div>
  );
});

ListingDetailHeader.displayName = "ListingDetailHeader";
