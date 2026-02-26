import { forwardRef, useState } from "react";
import { X } from "lucide-react";
import { Dialog } from "@/components/ui/Dialog/dialog";
import { Button } from "@/components/ui/Button/button";
import type { HideReason } from "@/types/admin";

export interface HideListingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listingName: string;
  onConfirm: (reason: HideReason, comment?: string) => void;
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

export const HideListingModal = forwardRef<
  HTMLDialogElement,
  HideListingModalProps
>(({ open, onOpenChange, listingName, onConfirm }, ref) => {
  const [selectedReason, setSelectedReason] = useState<HideReason | "">("");
  const [comment, setComment] = useState("");

  const showComment = selectedReason === "other";
  const isValid = selectedReason !== "";

  const handleConfirm = () => {
    if (!selectedReason) return;
    onConfirm(selectedReason, showComment ? comment.trim() : undefined);
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset form
    setTimeout(() => {
      setSelectedReason("");
      setComment("");
    }, 300);
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
            Hide Listing
          </h2>
          <button
            onClick={handleClose}
            className="absolute right-0 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md border border-neutral-20 text-neutral hover:text-neutral-foreground"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <span className="sr-only">Listing: {listingName}</span>

        {/* Reason Selection */}
        <div className="space-y-4">
          <p className="text-sm font-medium text-neutral-foreground">
            Reason for Hiding the list <span className="text-error">*</span>
          </p>
          <div className="space-y-3">
            {hideReasons.map((reason) => (
              <label
                key={reason.value}
                className="flex cursor-pointer items-center gap-3 text-sm text-neutral-foreground"
              >
                <span
                  className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                    selectedReason === reason.value
                      ? "border-primary"
                      : "border-neutral-20"
                  }`}
                >
                  {selectedReason === reason.value && (
                    <span className="h-2 w-2 rounded-full bg-primary" />
                  )}
                </span>
                <input
                  type="radio"
                  name="hideReason"
                  value={reason.value}
                  checked={selectedReason === reason.value}
                  onChange={(e) =>
                    setSelectedReason(e.target.value as HideReason)
                  }
                  className="sr-only"
                />
                <span>{reason.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Comment Textarea for Other */}
        {showComment && (
          <div className="space-y-2">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value.slice(0, 500))}
              placeholder="If there are any other reasons or notes, please add them here and clearly explain what the user should fix."
              rows={4}
              className="min-h-[96px] w-full resize-none rounded-lg border border-neutral-20 px-3 py-2 text-sm text-neutral-foreground placeholder:text-neutral focus:outline-none focus:ring-2 focus:ring-primary-20"
            />
            <p className="text-right text-xs text-neutral">
              ({comment.length}/500)
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={handleConfirm}
            disabled={!isValid}
            className="h-12 w-full rounded-lg border-none bg-error text-sm font-medium text-white hover:bg-error/90"
          >
            Confirm Hiding
          </Button>
          <p className="text-center text-xs text-neutral">
            The user will be notified with the reason and your comments.
          </p>
        </div>
      </div>
    </Dialog>
  );
});

HideListingModal.displayName = "HideListingModal";
