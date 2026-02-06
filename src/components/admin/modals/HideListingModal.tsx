import * as React from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Span } from "@/components/ui/span";
import type { HideReason } from "@/types/admin";

export interface HideListingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listingName: string;
  onConfirm: (reason: HideReason, comment?: string) => void;
  isLoading?: boolean;
}

const hideReasons: { value: HideReason; label: string }[] = [
  { value: "inappropriate_content", label: "Listing appears inactive" },
  {
    value: "policy_violation",
    label: "Listing quality does not meet marketplace standards",
  },
  { value: "duplicate", label: "Temporarily hidden for maintenance" },
  { value: "other", label: "Other" },
];

export const HideListingModal = React.forwardRef<
  HTMLDialogElement,
  HideListingModalProps
>(({ open, onOpenChange, listingName, onConfirm, isLoading = false }, ref) => {
  const [selectedReason, setSelectedReason] = React.useState<HideReason | "">(
    "",
  );
  const [comment, setComment] = React.useState("");

  const showComment = selectedReason === "other";
  const isValid = selectedReason !== "";

  const handleConfirm = () => {
    if (!selectedReason) return;
    onConfirm(selectedReason, showComment ? comment.trim() : undefined);
  };

  const handleClose = () => {
    if (!isLoading) {
      onOpenChange(false);
      // Reset form
      setTimeout(() => {
        setSelectedReason("");
        setComment("");
      }, 300);
    }
  };

  return (
    <Dialog ref={ref} open={open} onOpenChange={onOpenChange} size="md">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-neutral-foreground">
              Hide Listing
            </h2>
            <Text variant="bodySmall" className="mt-1 text-neutral">
              Reason for hiding the list <span className="text-error">*</span>
            </Text>
            <Text variant="caption" className="mt-1 text-neutral">
              Listing: {listingName}
            </Text>
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

        {/* Reason Selection */}
        <div className="space-y-3">
          {hideReasons.map((reason) => (
            <label
              key={reason.value}
              className="text-neutral-90 flex cursor-pointer items-center gap-3 text-sm"
            >
              <input
                type="radio"
                name="hideReason"
                value={reason.value}
                checked={selectedReason === reason.value}
                onChange={(e) =>
                  setSelectedReason(e.target.value as HideReason)
                }
                className="size-4 cursor-pointer accent-primary"
                disabled={isLoading}
              />
              <Span>{reason.label}</Span>
            </label>
          ))}
        </div>

        {/* Comment Textarea for Other */}
        {showComment && (
          <div className="space-y-2">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value.slice(0, 500))}
              placeholder="If there are any other reasons or notes, please add them here and clearly explain what the user should fix."
              rows={4}
              disabled={isLoading}
              className="w-full rounded-lg border border-neutral-20 px-3 py-2 text-sm text-neutral-foreground placeholder:text-neutral focus:outline-none focus:ring-2 focus:ring-primary-20 disabled:opacity-50"
            />
            <Text variant="caption" className="text-right text-neutral">
              {comment.length}/500
            </Text>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={handleConfirm}
            disabled={!isValid || isLoading}
            className="h-12 w-full border-none bg-error text-white hover:bg-error/90"
          >
            {isLoading ? "Hiding..." : "Confirm Hiding"}
          </Button>
          <Text variant="caption" className="text-center text-neutral">
            The user will be notified with the reason and your comments.
          </Text>
        </div>
      </div>
    </Dialog>
  );
});

HideListingModal.displayName = "HideListingModal";
