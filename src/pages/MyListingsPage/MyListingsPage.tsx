import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout/PageLayout";
import { Button } from "@/components/ui/Button/button";
import { Plus, X, MapPin } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import SearchSort from "@/components/ui/SearchSort/SearchSort";
import { Pagination } from "@/components/ui/Pagination/Pagination";
import { MyListingCard } from "./components/MyListingCard";
import type { MyListing, MyListingStatus } from "./components/MyListingCard";
import { Dialog } from "@/components/ui/Dialog/dialog";
import { StatusBadge } from "@/components/ui/StatusBadge/StatusBadge";
import { useAuthStore } from "@/stores/useAuthStore";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { productService } from "@/services/product.service";
import type { Product } from "@/types";

// ─── Types ───────────────────────────────────────────────────────────────────

type StatusTab = "all" | MyListingStatus;

const STATUS_TABS: { label: string; value: StatusTab }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Active", value: "active" },
  { label: "Rejected", value: "rejected" },
  { label: "Sold", value: "sold" },
  { label: "Archived", value: "archived" },
  { label: "Drafts", value: "draft" },
];

const BACKEND_STATUS_MAP: Partial<Record<string, MyListingStatus>> = {
  pending: "pending",
  "pending-review": "pending",
  "in-review": "pending",
  active: "active",
  rejected: "rejected",
  sold: "sold",
  archived: "archived",
  inactive: "archived",
  draft: "draft",
};

const HIDDEN_BACKEND_STATUSES = new Set(["removed", "deleted"]);

// ─── Mock Data ────────────────────────────────────────────────────────────────

const PRODUCT_IMAGES = [
  "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop",
];

const RAW_PRODUCTS: { title: string; price?: number; imgIdx?: number }[] = [
  { title: "Nintendo Switch", price: 250, imgIdx: 0 },
  { title: "Xiaomi Redmi Note 12", price: 2100, imgIdx: 1 },
  { title: "Sony WH-1000XM5", price: 290, imgIdx: 2 },
  { title: "Lenovo ThinkPad X1", price: 1350, imgIdx: 3 },
  { title: "iPhone 13 Pro", price: 3500, imgIdx: 4 },
  { title: "AirPods Pro", price: 290, imgIdx: 2 },
  { title: "Sony Alpha a6400", price: 840, imgIdx: 6 },
  { title: "Apple Watch Series 8", price: 290, imgIdx: 7 },
  { title: "iPhone 14 Pro Max", price: 3900, imgIdx: 4 },
  { title: "iPad Pro 11", price: 900, imgIdx: 8 },
  { title: "Headphones", price: 290, imgIdx: 9 },
  { title: "Samsung Galaxy S21", price: 1250, imgIdx: 10 },
  { title: "Lenovo ThinkPad X1", price: 1350, imgIdx: 3 },
  { title: "Sony Alpha a6400", price: 840, imgIdx: 6 },
  { title: "Untitled draft...", price: 900, imgIdx: 3 },
  { title: "iPhone 13 Pro", price: 3500, imgIdx: 4 },
  { title: "Samsung Galaxy S21", price: 1250, imgIdx: 10 },
  { title: "Xiaomi Redmi Note 12", price: 290, imgIdx: 1 },
  { title: "Nintendo Switch", price: 250, imgIdx: 0 },
  { title: "Headphones", price: 290, imgIdx: 9 },
  { title: "Untitled draft..." },
];

const LOCATIONS = [
  "Gaza North",
  "Gaza City",
  "Rafah",
  "Gaza City",
  "Gaza",
  "Rafah",
  "Gaza North",
  "Nablus",
  "Nablus",
  "Gaza",
  "Gaza North",
  "Gaza",
  "Gaza",
  "Rafah",
  "Gaza",
  "Nablus",
  "Gaza",
  "Nablus",
  "Gaza North",
  "Gaza",
  "Gaza",
];

const STATUSES: MyListingStatus[] = [
  "active",
  "sold",
  "pending",
  "rejected",
  "rejected",
  "draft",
  "active",
  "archived",
  "active",
  "sold",
  "pending",
  "archived",
  "rejected",
  "active",
  "draft",
  "rejected",
  "archived",
  "active",
  "active",
  "pending",
  "draft",
];

const REJECTION_REASONS: Partial<
  Record<number, { primaryIssue: string; details: string[] }>
> = {
  3: {
    primaryIssue: "Missing Essential Listing Data",
    details: [
      "Processor: The processor type was not accurately entered.",
      "Photos: Photos of the laptop were good, but please add a clear, close-up photo showing the damaged port (USB port) you mentioned in the description.",
      "Location: Please specify your location in the 'More Details' screen, as the field is empty.",
    ],
  },
  4: {
    primaryIssue: "Inaccurate Product Description",
    details: [
      "The listed price does not match the market value for this condition.",
      "Please add at least 3 clear photos showing all sides of the device.",
    ],
  },
  12: {
    primaryIssue: "Missing Essential Listing Data",
    details: [
      "Processor: The processor type was not accurately entered.",
      "Photos: Please add more photos showing the current condition of the device.",
    ],
  },
  15: {
    primaryIssue: "Prohibited Item",
    details: [
      "This item does not meet our marketplace guidelines.",
      "Please review our listing terms and resubmit with updated information.",
    ],
  },
};

const MOCK_LISTINGS: MyListing[] = RAW_PRODUCTS.map((p, i) => ({
  id: String(i + 1),
  image: p.imgIdx !== undefined ? PRODUCT_IMAGES[p.imgIdx] : undefined,
  title: p.title,
  price: p.price,
  location: LOCATIONS[i],
  status: STATUSES[i],
  rejectionReason:
    STATUSES[i] === "rejected" ? REJECTION_REASONS[i] : undefined,
}));

// Disable demo data usage (kept to avoid large refactor):
void PRODUCT_IMAGES; // mark as used for TS
void RAW_PRODUCTS;
void LOCATIONS;
void STATUSES;
void MOCK_LISTINGS;

// ─── Constants ────────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 20;

const STATUS_EMPTY_LABEL: Record<StatusTab, string> = {
  all: "listings",
  pending: "Pending",
  active: "Active",
  rejected: "Rejected",
  sold: "Sold",
  archived: "Archived",
  draft: "Draft",
};

// ─── Empty state illustration ─────────────────────────────────────────────────

function EmptyIllustration() {
  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Document body */}
      <rect x="28" y="18" width="64" height="80" rx="6" fill="#E8EAF6" />
      <rect
        x="28"
        y="18"
        width="64"
        height="80"
        rx="6"
        stroke="#C5CAE9"
        strokeWidth="2"
      />
      {/* Folded corner */}
      <path d="M76 18 L92 34 L76 34 Z" fill="#C5CAE9" />
      {/* Lines */}
      <rect x="38" y="44" width="44" height="5" rx="2.5" fill="#C5CAE9" />
      <rect x="38" y="54" width="30" height="5" rx="2.5" fill="#C5CAE9" />
      {/* Sad face circle */}
      <circle
        cx="60"
        cy="74"
        r="14"
        fill="white"
        stroke="#9FA8DA"
        strokeWidth="2"
      />
      {/* Eyes */}
      <circle cx="55" cy="71" r="2" fill="#5C6BC0" />
      <circle cx="65" cy="71" r="2" fill="#5C6BC0" />
      {/* Sad mouth */}
      <path
        d="M55 79 Q60 75 65 79"
        stroke="#5C6BC0"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
      {/* Decorative shapes */}
      <rect
        x="14"
        y="28"
        width="10"
        height="10"
        rx="2"
        fill="#FACC15"
        transform="rotate(-15 14 28)"
      />
      بدي <circle cx="100" cy="36" r="6" fill="#F472B6" />
      <path d="M20 70 L26 60 L32 70 Z" fill="#60A5FA" />
      <circle cx="96" cy="80" r="4" fill="#60A5FA" />
      <rect
        x="104"
        y="56"
        width="8"
        height="8"
        rx="2"
        fill="#FACC15"
        transform="rotate(20 104 56)"
      />
    </svg>
  );
}

// ─── Mark as Sold Confirmation Dialog ───────────────────────────────────────

interface MarkAsSoldDialogProps {
  open: boolean;
  isMarking: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

function MarkAsSoldDialog({
  open,
  isMarking,
  onConfirm,
  onCancel,
}: MarkAsSoldDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onCancel()} size="sm">
      <div className="flex flex-col items-center gap-4 text-center">
        {/* Text */}
        <div className="space-y-2">
          <h2 className="text-foreground text-lg font-bold">Mark as Sold?</h2>
          <p className="text-sm text-muted-foreground">
            This listing will be marked as sold and won&apos;t appear in search
          </p>
        </div>

        {/* Actions */}
        <div className="flex w-full flex-col gap-3 pt-1">
          <button
            type="button"
            onClick={onConfirm}
            disabled={isMarking}
            className="flex w-full items-center justify-center rounded-xl bg-primary py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90 disabled:opacity-60"
          >
            {isMarking ? (
              <span className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="white"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="white"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                Marking…
              </span>
            ) : (
              "Mark as Sold"
            )}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isMarking}
            className="text-foreground w-full rounded-xl border border-neutral-20 py-3 text-sm font-semibold transition-colors hover:bg-neutral-5 disabled:opacity-60"
          >
            Cancel
          </button>
        </div>
      </div>
    </Dialog>
  );
}

// ─── Success Toast Notification ───────────────────────────────────────────────

interface SuccessToastProps {
  title: string;
  subtitle: string;
  visible: boolean;
  variant?: "success" | "error";
}

function SuccessToast({
  title,
  subtitle,
  visible,
  variant = "success",
}: SuccessToastProps) {
  const accentColor = variant === "error" ? "#EF4444" : "#22C55E";
  return (
    <div
      className={`fixed bottom-6 left-6 z-50 flex min-w-[280px] max-w-[360px] items-start gap-3 overflow-hidden rounded-2xl border border-[#DDE2E8] bg-white py-4 pl-5 pr-4 shadow-[0_4px_12px_rgba(16,24,40,0.12)] transition-all duration-300 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
      style={{ borderLeft: `5px solid ${accentColor}` }}
      role="status"
      aria-live="polite"
    >
      <div className="min-w-0 flex-1">
        <p className="text-foreground text-sm font-bold leading-snug">
          {title}
        </p>
        <p className="mt-0.5 text-sm leading-snug text-muted-foreground">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

// ─── Rejection Reason Dialog ─────────────────────────────────────────────────

interface RejectionReasonDialogProps {
  open: boolean;
  listing: MyListing | null;
  onClose: () => void;
  onEditNow: (id: string) => void;
}

function RejectionReasonDialog({
  open,
  listing,
  onClose,
  onEditNow,
}: RejectionReasonDialogProps) {
  if (!listing) return null;
  const reason = listing.rejectionReason;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()} size="md">
      {/* Header */}
      <div className="relative flex items-center justify-center border-b border-neutral-20 pb-4">
        <h2 className="text-foreground text-base font-semibold">
          Rejection Reason
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="absolute right-0 flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-20 text-muted-foreground transition-colors hover:bg-neutral-5"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Body */}
      <div className="mt-5 space-y-4">
        <h3 className="text-foreground text-sm font-bold">
          Why Was Your Listing Rejected?
        </h3>

        {/* Product summary card */}
        <div className="flex gap-3 rounded-xl border border-neutral-20 p-3">
          <img
            src={listing.image}
            alt={listing.title}
            className="h-[90px] w-[90px] shrink-0 rounded-lg object-cover"
            onError={(e) => {
              const t = e.currentTarget as HTMLImageElement;
              t.src = "https://placehold.co/90x90/e8e8e8/6b7280?text=No+Image";
            }}
          />
          <div className="flex flex-col justify-center gap-1">
            <p className="text-foreground text-sm font-semibold">
              {listing.title}
            </p>
            <p className="text-base font-bold text-primary">
              {listing.price !== undefined
                ? `${listing.price.toLocaleString()} ILS`
                : "Price not set"}
            </p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 shrink-0" />
              <span>{listing.location}</span>
            </div>
            <StatusBadge variant="rejected">Rejected</StatusBadge>
          </div>
        </div>

        {reason && (
          <>
            {/* Primary Issue */}
            <div>
              <p className="text-foreground text-sm font-bold">
                Primary Issue:
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {reason.primaryIssue}
              </p>
            </div>

            {/* Detail bullets */}
            <div>
              <p className="text-foreground text-sm font-bold">
                Please update the information below to resubmit your listing:
              </p>
              <ul className="mt-3 space-y-2">
                {reason.details.map((detail, idx) => (
                  <li
                    key={idx}
                    className="flex gap-2 text-sm text-muted-foreground"
                  >
                    <span className="bg-foreground mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {/* CTA */}
        <button
          type="button"
          onClick={() => onEditNow(listing.id)}
          className="w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
        >
          Edit Listing Now
        </button>
        <p className="text-center text-xs text-muted-foreground">
          After editing, your listing will be reviewed again
        </p>
      </div>
    </Dialog>
  );
}

// ─── Delete Confirmation Dialog ───────────────────────────────────────────────

interface DeleteDialogProps {
  open: boolean;
  listingTitle: string;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

function DeleteConfirmDialog({
  open,
  listingTitle,
  isDeleting,
  onConfirm,
  onCancel,
}: DeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onCancel()} size="sm">
      <div className="flex flex-col items-center gap-4 text-center">
        {/* Warning icon */}
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-50">
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M20 4L36.5 33H3.5L20 4Z"
              fill="#FACC15"
              stroke="#EAB308"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M20 16V23"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx="20" cy="28" r="1.5" fill="white" />
          </svg>
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h2 className="text-foreground text-lg font-bold">Delete Listing?</h2>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete{" "}
            <span className="text-foreground font-medium">{listingTitle}</span>.
            Once deleted, this listing will be permanently removed.
          </p>
        </div>

        {/* Actions */}
        <div className="flex w-full flex-col gap-3 pt-1">
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex w-full items-center justify-center rounded-xl bg-error py-3 text-sm font-semibold text-white transition-colors hover:bg-red-600 disabled:opacity-60"
          >
            {isDeleting ? (
              <span className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="white"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="white"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                Deleting…
              </span>
            ) : (
              "Yes, Delete"
            )}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="text-foreground w-full rounded-xl border border-neutral-20 py-3 text-sm font-semibold transition-colors hover:bg-neutral-5 disabled:opacity-60"
          >
            Cancel
          </button>
        </div>
      </div>
    </Dialog>
  );
}

// ─── Archive Confirmation Dialog ─────────────────────────────────────────────

interface ArchiveDialogProps {
  open: boolean;
  isArchiving: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

function ArchiveConfirmDialog({
  open,
  isArchiving,
  onConfirm,
  onCancel,
}: ArchiveDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onCancel()} size="sm">
      <div className="flex flex-col items-center gap-4 text-center">
        {/* Warning icon */}
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-50">
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M20 4L36.5 33H3.5L20 4Z"
              fill="#FACC15"
              stroke="#EAB308"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M20 16V23"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx="20" cy="28" r="1.5" fill="white" />
          </svg>
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h2 className="text-foreground text-lg font-bold">
            Archive Listing?
          </h2>
          <p className="text-sm text-muted-foreground">
            This listing will be hidden from search and buyers. You can
            republish it later without losing any details.
          </p>
        </div>

        {/* Actions */}
        <div className="flex w-full flex-col gap-3 pt-1">
          <button
            type="button"
            onClick={onConfirm}
            disabled={isArchiving}
            className="flex w-full items-center justify-center rounded-xl bg-primary py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90 disabled:opacity-60"
          >
            {isArchiving ? (
              <span className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="white"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="white"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                Archiving…
              </span>
            ) : (
              "Yes, Archive"
            )}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isArchiving}
            className="text-foreground w-full rounded-xl border border-neutral-20 py-3 text-sm font-semibold transition-colors hover:bg-neutral-5 disabled:opacity-60"
          >
            Cancel
          </button>
        </div>
      </div>
    </Dialog>
  );
}

// ─── Republish Confirmation Dialog ──────────────────────────────────────────────

interface RepublishDialogProps {
  open: boolean;
  isRepublishing: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

function RepublishConfirmDialog({
  open,
  isRepublishing,
  onConfirm,
  onCancel,
}: RepublishDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onCancel()} size="sm">
      <div className="flex flex-col items-center gap-4 text-center">
        {/* Warning icon */}
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-50">
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M20 4L36.5 33H3.5L20 4Z"
              fill="#FACC15"
              stroke="#EAB308"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M20 16V23"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx="20" cy="28" r="1.5" fill="white" />
          </svg>
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h2 className="text-foreground text-lg font-bold">
            Republish Listing
          </h2>
          <p className="text-sm text-muted-foreground">
            Make this listing active again so buyers can find it, contact you
            and appear in search results.
          </p>
        </div>

        {/* Actions */}
        <div className="flex w-full flex-col gap-3 pt-1">
          <button
            type="button"
            onClick={onConfirm}
            disabled={isRepublishing}
            className="flex w-full items-center justify-center rounded-xl bg-primary py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90 disabled:opacity-60"
          >
            {isRepublishing ? (
              <span className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="white"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="white"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                Republishing…
              </span>
            ) : (
              "Yes, Republish"
            )}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isRepublishing}
            className="text-foreground w-full rounded-xl border border-neutral-20 py-3 text-sm font-semibold transition-colors hover:bg-neutral-5 disabled:opacity-60"
          >
            Cancel
          </button>
        </div>
      </div>
    </Dialog>
  );
}
// ─── Continue Editing Confirmation Dialog ─────────────────────────────────────

interface ContinueEditingDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

function ContinueEditingDialog({
  open,
  onConfirm,
  onCancel,
}: ContinueEditingDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onCancel()} size="sm">
      <div className="flex flex-col items-center gap-4 text-center">
        {/* Text */}
        <div className="space-y-2">
          <h2 className="text-foreground text-lg font-bold">
            Continue Editing
          </h2>
          <p className="text-sm text-muted-foreground">
            Continue editing your listing before submitting it for review. Make
            sure all details are accurate.
          </p>
        </div>

        {/* Actions */}
        <div className="flex w-full flex-col gap-3 pt-1">
          <button
            type="button"
            onClick={onConfirm}
            className="flex w-full items-center justify-center rounded-xl bg-primary py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
          >
            Continue Editing
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="text-foreground w-full rounded-xl border border-neutral-20 py-3 text-sm font-semibold transition-colors hover:bg-neutral-5"
          >
            Cancel
          </button>
        </div>
      </div>
    </Dialog>
  );
}
// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MyListingsPage() {
  const navigate = useNavigate();
  const userId = useAuthStore((s) => s.user?.id ?? null);
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<StatusTab>("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Delete dialog state
  const [deleteTarget, setDeleteTarget] = useState<MyListing | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Rejection reason dialog state
  const [viewReasonTarget, setViewReasonTarget] = useState<MyListing | null>(
    null,
  );

  // Mark as Sold dialog state
  const [markAsSoldTarget, setMarkAsSoldTarget] = useState<MyListing | null>(
    null,
  );
  const [isMarkingAsSold, setIsMarkingAsSold] = useState(false);

  // Archive dialog state
  const [archiveTarget, setArchiveTarget] = useState<MyListing | null>(null);
  const [isArchiving, setIsArchiving] = useState(false);

  // Republish dialog state
  const [republishTarget, setRepublishTarget] = useState<MyListing | null>(
    null,
  );
  const [isRepublishing, setIsRepublishing] = useState(false);

  // Continue Editing dialog state
  const [continueEditingTarget, setContinueEditingTarget] =
    useState<MyListing | null>(null);

  // Success toast state
  const [successToast, setSuccessToast] = useState<{
    title: string;
    subtitle: string;
    variant?: "success" | "error";
  } | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  // Fetch user's real listings from backend
  const { data: productsData } = useQuery({
    queryKey: [
      "my-listings",
      userId,
      activeTab,
    ],
    queryFn: () =>
      productService.getMine({
        // Query backend by the currently selected tab (skip for "All")
        status: activeTab !== "all" ? [activeTab] : undefined,
        limit: 200,
        sortBy: "createdAt",
        sortOrder: "desc",
      }),
    enabled: Boolean(userId),
    staleTime: 60 * 1000,
  });

  const backendListings: MyListing[] = useMemo(() => {
    const items = productsData?.products ?? [];
    return items
      .map((p: Product) => {
        const normalizedStatus = (p.status || "active")
          .toLowerCase()
          .replace(/_/g, "-");
        if (HIDDEN_BACKEND_STATUSES.has(normalizedStatus)) {
          return null;
        }

        const mappedStatus =
          BACKEND_STATUS_MAP[normalizedStatus] ?? "active";
        const locationLabel =
          (typeof p.location === "string" && p.location.trim()) ||
          "Location not specified";
        const rejectionReason =
          mappedStatus === "rejected" && p.rejectionReason
            ? {
                primaryIssue: "Review feedback",
                details: [p.rejectionReason],
              }
            : undefined;

        return {
          id: p.id,
          image: p.images?.[0],
          title: p.title,
          price: p.price,
          location: locationLabel,
          status: mappedStatus,
          rejectionReason,
        };
      })
      .filter((listing): listing is MyListing => listing !== null);
  }, [productsData]);

  const filteredListings = useMemo(() => {
    const base = backendListings;
    if (activeTab === "all") return base;
    return base.filter((l) => l.status === activeTab);
  }, [activeTab, backendListings]);

  // Apply sorting similar to SearchPage/SearchSort options
  const [sortBy, setSortBy] = useState("Newest");
  const sortedListings = useMemo(() => {
    const list = [...filteredListings];
    const key = (sortBy || "Newest").toLowerCase();
    // Treat undefined price as 0 for consistent ordering
    const priceOf = (p?: number) => (typeof p === "number" ? p : 0);
    if (key.includes("low to high")) {
      list.sort((a, b) => priceOf(a.price) - priceOf(b.price));
    } else if (key.includes("high to low")) {
      list.sort((a, b) => priceOf(b.price) - priceOf(a.price));
    } else if (key.includes("most viewed")) {
      // No viewCount available on MyListing; fallback to newest
      list.sort((a, b) => Number(b.id) - Number(a.id));
    } else {
      // Newest (default) - IDs are sequential based on insertion
      list.sort((a, b) => Number(b.id) - Number(a.id));
    }
    return list;
  }, [filteredListings, sortBy]);

  const totalItems = sortedListings.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const paginatedListings = sortedListings.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleTabChange = (tab: StatusTab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const showSuccessToast = (
    title: string,
    subtitle: string,
    variant: "success" | "error" = "success",
  ) => {
    setSuccessToast({ title, subtitle, variant });
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
      setTimeout(() => setSuccessToast(null), 300);
    }, 4000);
  };

  const refreshListingData = async () => {
    await queryClient.invalidateQueries({ queryKey: ["my-listings"] });
    await queryClient.invalidateQueries({ queryKey: ["products"] });
  };

  const handleAction = (id: string, action: string) => {
    if (action === "Delete") {
      const listing = backendListings.find((l) => l.id === id) ?? null;
      setDeleteTarget(listing);
    } else if (action === "Mark as Sold") {
      const listing = backendListings.find((l) => l.id === id) ?? null;
      setMarkAsSoldTarget(listing);
    } else if (action === "Archive") {
      const listing = backendListings.find((l) => l.id === id) ?? null;
      setArchiveTarget(listing);
    } else if (action === "Republish") {
      const listing = backendListings.find((l) => l.id === id) ?? null;
      setRepublishTarget(listing);
    } else if (action === "View Reason") {
      const listing = backendListings.find((l) => l.id === id) ?? null;
      setViewReasonTarget(listing);
    } else if (action === "Edit") {
      navigate(`${ROUTES.ADD_LISTING}?edit=${id}`);
    } else if (action === "Continue editing") {
      const listing = backendListings.find((l) => l.id === id) ?? null;
      setContinueEditingTarget(listing);
    }
    // TODO: handle other actions (Share, etc.)
  };

  const handleArchiveConfirm = async () => {
    if (!archiveTarget) return;
    setIsArchiving(true);
    try {
      await productService.archive(archiveTarget.id);
      await refreshListingData();
      showSuccessToast(
        "Listing archived successfully",
        "This listing is now hidden from search and buyers.",
      );
    } catch (error) {
      console.error("Failed to archive listing", error);
      showSuccessToast(
        "Failed to archive listing",
        "Something went wrong. Please try again.",
        "error",
      );
    } finally {
      setIsArchiving(false);
      setArchiveTarget(null);
    }
  };

  const handleArchiveCancel = () => {
    if (!isArchiving) setArchiveTarget(null);
  };

  const handleMarkAsSoldConfirm = async () => {
    if (!markAsSoldTarget) return;
    setIsMarkingAsSold(true);
    try {
      await productService.markSold(markAsSoldTarget.id);
      await refreshListingData();
      setMarkAsSoldTarget(null);
      showSuccessToast(
        "Listing marked as sold",
        "This listing is no longer visible to buyers.",
      );
    } catch (error) {
      console.error("Failed to mark listing as sold", error);
      showSuccessToast(
        "Failed to mark as sold",
        "Something went wrong. Please try again.",
        "error",
      );
    } finally {
      setIsMarkingAsSold(false);
    }
  };

  const handleMarkAsSoldCancel = () => {
    if (!isMarkingAsSold) setMarkAsSoldTarget(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await productService.delete(deleteTarget.id);
      await refreshListingData();
      setDeleteTarget(null);
      showSuccessToast(
        "Listing deleted successfully",
        "This listing is no longer visible to buyers.",
      );
    } catch (error) {
      console.error("Failed to delete listing", error);
      showSuccessToast(
        "Failed to delete listing",
        "Please try again in a moment.",
        "error",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    if (!isDeleting) setDeleteTarget(null);
  };

  const handleRepublishConfirm = async () => {
    if (!republishTarget) return;
    setIsRepublishing(true);
    try {
      await productService.republish(republishTarget.id);
      await refreshListingData();
      showSuccessToast(
        "Listing republished successfully",
        "Your listing is now active and visible to buyers.",
      );
    } catch (error) {
      console.error("Failed to republish listing", error);
      showSuccessToast(
        "Failed to republish listing",
        "Please try again in a moment.",
        "error",
      );
    } finally {
      setIsRepublishing(false);
      setRepublishTarget(null);
    }
  };

  const handleRepublishCancel = () => {
    if (!isRepublishing) setRepublishTarget(null);
  };

  const handleContinueEditingConfirm = () => {
    if (!continueEditingTarget) return;
    navigate(`${ROUTES.ADD_LISTING}?edit=${continueEditingTarget.id}`);
    setContinueEditingTarget(null);
  };

  return (
    <PageLayout maxWidth="6xl">
      {/* Success toast */}
      {successToast && (
        <SuccessToast
          title={successToast.title}
          subtitle={successToast.subtitle}
          visible={toastVisible}
          variant={successToast.variant}
        />
      )}

      {/* Loading overlay while deleting / archiving / marking as sold / republishing */}
      {(isDeleting || isMarkingAsSold || isArchiving || isRepublishing) && (
        <div className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-black/40">
          <svg
            className="h-12 w-12 animate-spin text-white"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="white"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="white"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
          <p className="mt-3 text-sm font-medium text-white">Waiting...</p>
        </div>
      )}

      {/* Mark as Sold confirmation modal */}
      <MarkAsSoldDialog
        open={markAsSoldTarget !== null}
        isMarking={isMarkingAsSold}
        onConfirm={handleMarkAsSoldConfirm}
        onCancel={handleMarkAsSoldCancel}
      />

      {/* Archive confirmation modal */}
      <ArchiveConfirmDialog
        open={archiveTarget !== null}
        isArchiving={isArchiving}
        onConfirm={handleArchiveConfirm}
        onCancel={handleArchiveCancel}
      />

      {/* Republish confirmation modal */}
      <RepublishConfirmDialog
        open={republishTarget !== null}
        isRepublishing={isRepublishing}
        onConfirm={handleRepublishConfirm}
        onCancel={handleRepublishCancel}
      />

      {/* Continue Editing confirmation modal */}
      <ContinueEditingDialog
        open={continueEditingTarget !== null}
        onConfirm={handleContinueEditingConfirm}
        onCancel={() => setContinueEditingTarget(null)}
      />

      {/* Rejection reason modal */}
      <RejectionReasonDialog
        open={viewReasonTarget !== null}
        listing={viewReasonTarget}
        onClose={() => setViewReasonTarget(null)}
        onEditNow={(id) => {
          setViewReasonTarget(null);
          navigate(`${ROUTES.ADD_LISTING}?edit=${id}`);
        }}
      />

      {/* Delete confirmation modal */}
      <DeleteConfirmDialog
        open={deleteTarget !== null}
        listingTitle={deleteTarget?.title ?? ""}
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />

      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-foreground text-3xl font-bold">My Listings</h1>
          <Button
            intent="primary"
            onClick={() => navigate(ROUTES.ADD_LISTING)}
            className="px-5 py-2.5"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Listing
          </Button>
        </div>

        {/* Status Tabs + Sort Row */}
        <div className="flex items-end justify-between border-b border-neutral-20">
          <div className="flex overflow-x-auto">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => handleTabChange(tab.value)}
                className={`relative whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors focus:outline-none ${
                  activeTab === tab.value
                    ? "text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:content-['']"
                    : "text-muted-foreground hover:text-neutral-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="shrink-0 pb-1 pl-4">
            <SearchSort onSortChange={setSortBy} />
          </div>
        </div>

        {/* Listings Grid or Empty State */}
        {paginatedListings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <EmptyIllustration />
            <h2 className="text-foreground mt-4 text-xl font-bold">
              No Listing yet
            </h2>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              You don't have any {STATUS_EMPTY_LABEL[activeTab]} listings
              <br />
              at the moment.
            </p>
            <Button
              intent="primary"
              onClick={() => navigate(ROUTES.ADD_LISTING)}
              className="mt-8 w-80 py-3"
            >
              Add Listing
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {paginatedListings.map((listing) => (
              <MyListingCard
                key={listing.id}
                listing={listing}
                onAction={handleAction}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center pt-2">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={(page) => {
                setCurrentPage(page);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </div>
        )}
      </div>
    </PageLayout>
  );
}
