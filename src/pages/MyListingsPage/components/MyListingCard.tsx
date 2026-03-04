import { useState, useRef, useEffect } from "react";
import { MapPin, MoreHorizontal, ImageOff } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge/StatusBadge";
import { ListingOptions } from "@/components/ui/ListingOptions/ListingOptions";
import type { ListingStatus } from "@/components/ui/ListingOptions/ListingOptions";

export type MyListingStatus =
  | "pending"
  | "active"
  | "rejected"
  | "sold"
  | "archived"
  | "draft";

export interface RejectionReason {
  primaryIssue: string;
  details: string[];
}

export interface MyListing {
  id: string;
  image?: string;
  title: string;
  price?: number;
  location: string;
  status: MyListingStatus;
  rejectionReason?: RejectionReason;
}

interface MyListingCardProps {
  listing: MyListing;
  onAction?: (id: string, action: string) => void;
}

const STATUS_BADGE_MAP: Record<
  MyListingStatus,
  React.ComponentProps<typeof StatusBadge>["variant"]
> = {
  active: "active",
  pending: "pending",
  rejected: "rejected",
  sold: "neutral",
  archived: "neutral",
  draft: "neutral",
};

const STATUS_LABEL: Record<MyListingStatus, string> = {
  active: "Active",
  pending: "Pending",
  rejected: "Rejected",
  sold: "Sold",
  archived: "Archived",
  draft: "Drafts",
};

// Map our local status to ListingOptions status
const STATUS_OPTIONS_MAP: Record<MyListingStatus, ListingStatus> = {
  active: "active",
  pending: "pending",
  rejected: "rejected",
  sold: "sold",
  archived: "archived",
  draft: "draft",
};

export function MyListingCard({ listing, onAction }: MyListingCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <div className="overflow-hidden rounded-lg border border-neutral-20 bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Image */}
      <div className="relative">
        {listing.image ? (
          <img
            src={listing.image}
            alt={listing.title}
            className="h-[200px] w-full object-cover"
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              target.src =
                "https://placehold.co/400x200/e8e8e8/6b7280?text=No+Image";
            }}
          />
        ) : (
          <div className="flex h-[200px] w-full items-center justify-center bg-neutral-5">
            <ImageOff className="text-neutral-30 h-10 w-10" />
          </div>
        )}
        {/* Three-dot menu button */}
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm transition-colors hover:bg-neutral-5"
          aria-label="Listing options"
        >
          <MoreHorizontal className="h-4 w-4 text-neutral-foreground" />
        </button>
        {/* Dropdown menu */}
        {menuOpen && (
          <div ref={menuRef} className="absolute right-2 top-11 z-50">
            <ListingOptions
              status={STATUS_OPTIONS_MAP[listing.status]}
              onAction={(action) => {
                setMenuOpen(false);
                onAction?.(listing.id, action);
              }}
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-2 p-3">
        <h3 className="text-foreground truncate text-base font-normal">
          {listing.title}
        </h3>
        {listing.price !== undefined && listing.price > 0 ? (
          <p className="text-lg font-semibold text-primary">
            {listing.price.toLocaleString()} ILS
          </p>
        ) : (
          <p className="text-lg font-semibold text-muted-foreground">
            Price not set
          </p>
        )}
        {listing.status !== "draft" && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{listing.location}</span>
          </div>
        )}
        <StatusBadge variant={STATUS_BADGE_MAP[listing.status]}>
          {STATUS_LABEL[listing.status]}
        </StatusBadge>
      </div>
    </div>
  );
}
