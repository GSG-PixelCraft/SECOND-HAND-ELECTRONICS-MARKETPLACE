import * as React from "react";
import { X } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export interface ApproveListingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listingName: string;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const ApproveListingModal = React.forwardRef<
  HTMLDialogElement,
  ApproveListingModalProps
>(({ open, onOpenChange, listingName, onConfirm, isLoading = false }, ref) => {
  const handleClose = () => {
    if (!isLoading) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog
      ref={ref}
      open={open}
      onOpenChange={onOpenChange}
      className="w-full max-w-[520px] rounded-2xl border border-neutral-10 bg-white p-8 shadow-xl backdrop:bg-black/60"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="relative flex items-center justify-center">
          <h2 className="text-lg font-semibold text-neutral-foreground">
            Approve Listing
          </h2>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="absolute right-0 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md border border-neutral-20 text-neutral hover:text-neutral-foreground disabled:opacity-50"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Icon */}
        <div className="flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-success"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-2 text-center text-sm text-neutral-foreground">
          <p>
            Are you sure you want to approve{" "}
            <span className="font-semibold text-neutral-foreground">
              "{listingName}"
            </span>
            ?
          </p>
          <p className="text-neutral">
            This listing will become active and visible to all users.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3 pt-1">
          <Button
            intent="outline"
            onClick={handleClose}
            disabled={isLoading}
            className="h-10 min-w-[120px] rounded-lg text-sm font-medium"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className="h-10 min-w-[160px] rounded-lg border-none bg-success text-sm font-semibold text-white hover:bg-success/90"
          >
            {isLoading ? "Approving..." : "Approve Listing"}
          </Button>
        </div>
      </div>
    </Dialog>
  );
});

ApproveListingModal.displayName = "ApproveListingModal";
