import { forwardRef } from "react";
import { AlertTriangle } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

export interface UnhideListingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listingName: string;
  onConfirm: () => void;
}

export const UnhideListingModal = forwardRef<
  HTMLDialogElement,
  UnhideListingModalProps
>(({ open, onOpenChange, listingName, onConfirm }, ref) => {
  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog ref={ref} open={open} onOpenChange={onOpenChange} size="sm">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-neutral-foreground">
              Confirm Unhide
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-neutral hover:text-neutral-foreground"
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
        <div className="flex justify-center py-2">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-warning/10">
            <AlertTriangle className="size-8 text-warning" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-2 text-center">
          <Text className="text-neutral-60">
            This listing will become active again on the marketplace and visible
            to all users. Make sure the listing is up-to-date and meets
            marketplace guidelines before restoring.
          </Text>
          <Text className="text-neutral-50 text-sm">{listingName}</Text>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-2">
          <Button
            onClick={onConfirm}
            className="h-12 w-full border-none bg-error text-white hover:bg-error/90"
          >
            Unhide
          </Button>
          <Button
            intent="outline"
            onClick={handleClose}
            className="h-12 w-full"
          >
            Cancel
          </Button>
        </div>
      </div>
    </Dialog>
  );
});

UnhideListingModal.displayName = "UnhideListingModal";
