import * as React from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

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
    <Dialog ref={ref} open={open} onOpenChange={onOpenChange} size="sm">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-neutral-foreground">
              Approve Listing
            </h2>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="text-neutral hover:text-neutral-foreground disabled:opacity-50"
            aria-label="Close"
          >
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
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        {/* Icon */}
        <div className="flex justify-center py-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
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
        <div className="space-y-2 text-center">
          <Text className="text-neutral-60">
            Are you sure you want to approve{" "}
            <span className="text-neutral-90 font-semibold">
              "{listingName}"
            </span>
            ?
          </Text>
          <Text className="text-neutral-60">
            This listing will become active and visible to all users.
          </Text>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            intent="outline"
            onClick={handleClose}
            disabled={isLoading}
            className="px-6"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className="border-none bg-success px-6 text-white hover:bg-success/90"
          >
            {isLoading ? "Approving..." : "Approve Listing"}
          </Button>
        </div>
      </div>
    </Dialog>
  );
});

ApproveListingModal.displayName = "ApproveListingModal";
