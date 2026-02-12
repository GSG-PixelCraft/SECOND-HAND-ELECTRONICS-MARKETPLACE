import { forwardRef } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Span } from "@/components/ui/span";
import { CheckCircle2 } from "lucide-react";
import type { RejectionReason } from "@/types/admin";

export interface RejectListingSummaryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listingName: string;
  primaryReason: RejectionReason;
  selectedIssues: Array<{ group: string; issue: string }>;
  comments: Array<{ group: string; comment: string }>;
  onConfirm: () => void;
  onBack: () => void;
}

const reasonLabels: Record<RejectionReason, string> = {
  poor_quality_images: "Photos & Visual Accuracy",
  incomplete_information: "Listing Information Accuracy",
  pricing_issue: "Product Specifications Consistency",
  inappropriate_content: "Description & Disclosure Quality",
  prohibited_item: "Prohibited Item",
  other: "Other",
};

export const RejectListingSummaryModal = forwardRef<
  HTMLDialogElement,
  RejectListingSummaryModalProps
>(
  (
    {
      open,
      onOpenChange,
      listingName,
      primaryReason,
      selectedIssues,
      comments,
      onConfirm,
      onBack,
    },
    ref,
  ) => {
    const handleClose = () => {
      onOpenChange(false);
    };

    return (
      <Dialog
        ref={ref}
        open={open}
        onOpenChange={onOpenChange}
        size="lg"
        className="!left-auto !right-0 !top-0 !h-full !max-h-screen !w-[420px] !max-w-none !translate-x-0 !translate-y-0 !rounded-none !border-l !border-neutral-20 !p-8"
      >
        <div className="flex h-full flex-col gap-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold text-neutral-foreground">
                Rejection Summary
              </h2>
              <Text variant="bodySmall" className="mt-1 text-neutral">
                Review the rejection details before confirming.
              </Text>
              <Text variant="bodySmall" className="mt-2 text-neutral">
                Listing: <span className="text-neutral-90">{listingName}</span>
              </Text>
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

          {/* Content */}
          <div className="flex flex-1 flex-col gap-5 overflow-y-auto pr-1">
            {/* Primary Reason */}
            <div className="space-y-2">
              <Text variant="label" className="text-neutral-90">
                Primary Issue
              </Text>
              <div className="rounded-lg border border-neutral-20 bg-neutral-5 p-4">
                <Span className="text-neutral-90 font-medium">
                  {reasonLabels[primaryReason]}
                </Span>
              </div>
            </div>

            {/* Selected Issues */}
            <div className="space-y-2">
              <Text variant="label" className="text-neutral-90">
                Specific Issues ({selectedIssues.length})
              </Text>
              <div className="space-y-2">
                {selectedIssues.map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-2 rounded-lg border border-neutral-20 bg-white p-3"
                  >
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <div className="min-w-0 flex-1">
                      <Text variant="caption" className="text-neutral-50">
                        {item.group}
                      </Text>
                      <Text variant="bodySmall" className="text-neutral-90">
                        {item.issue}
                      </Text>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Comments */}
            {comments.length > 0 && (
              <div className="space-y-2">
                <Text variant="label" className="text-neutral-90">
                  Additional Comments
                </Text>
                <div className="space-y-3">
                  {comments.map((item, index) => (
                    <div
                      key={index}
                      className="rounded-lg border border-neutral-20 bg-neutral-5 p-4"
                    >
                      <Text
                        variant="caption"
                        className="text-neutral-90 mb-2 font-medium"
                      >
                        {item.group}
                      </Text>
                      <Text variant="bodySmall" className="text-neutral-60">
                        {item.comment}
                      </Text>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Info Box */}
            <div className="rounded-lg border border-primary-20 bg-primary-5 p-4">
              <Text variant="bodySmall" className="text-neutral-90">
                The seller will receive a detailed notification with all the
                issues listed above. They can update the listing and resubmit
                for review.
              </Text>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-2">
            <Button
              onClick={onConfirm}
              className="h-12 w-full border-none bg-error text-white hover:bg-error/90"
            >
              Confirm Rejection
            </Button>
            <Button onClick={onBack} intent="outline" className="h-12 w-full">
              Back to Edit
            </Button>
          </div>
        </div>
      </Dialog>
    );
  },
);

RejectListingSummaryModal.displayName = "RejectListingSummaryModal";
