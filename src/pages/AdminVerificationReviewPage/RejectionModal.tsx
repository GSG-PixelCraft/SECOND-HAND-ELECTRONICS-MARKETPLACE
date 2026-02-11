import * as React from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useRejectVerification } from "@/services/admin-verification.service";
import { ROUTES } from "@/constants/routes";

export interface RejectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  verificationId: string;
}

const REJECTION_REASONS = [
  "Name does not match the profile",
  "ID document is expired",
  "Expiry date is unclear or unreadable",
  "Front and back images belong to different IDs",
  "ID number is blurred or unreadable",
  "Selfie does not match ID photo",
  "Face is unclear or covered",
  "User is not holding the ID",
  "ID is not clearly visible in the selfie",
] as const;

export function RejectionModal({
  isOpen,
  onClose,
  verificationId,
}: RejectionModalProps) {
  const navigate = useNavigate();
  const [selectedReasons, setSelectedReasons] = React.useState<string[]>([]);
  const [additionalNotes, setAdditionalNotes] = React.useState("");
  const [showAdditionalNotes, setShowAdditionalNotes] = React.useState(false);

  const rejectMutation = useRejectVerification();

  // Reset form when modal closes
  React.useEffect(() => {
    if (!isOpen) {
      setSelectedReasons([]);
      setAdditionalNotes("");
      setShowAdditionalNotes(false);
    }
  }, [isOpen]);

  const handleReasonToggle = (reason: string) => {
    setSelectedReasons((prev) => {
      if (prev.includes(reason)) {
        return prev.filter((r) => r !== reason);
      } else {
        return [...prev, reason];
      }
    });
  };

  const handleAdditionalNotesToggle = () => {
    setShowAdditionalNotes((prev) => !prev);
    if (showAdditionalNotes) {
      setAdditionalNotes("");
    }
  };

  const handleConfirmReject = async () => {
    if (selectedReasons.length === 0) {
      return;
    }

    const reasons = [...selectedReasons];
    if (showAdditionalNotes && additionalNotes.trim()) {
      // Additional notes will be sent separately
    }

    try {
      await rejectMutation.mutateAsync({
        verificationId,
        reasons,
        additionalNotes: showAdditionalNotes ? additionalNotes : undefined,
      });
      onClose();
      navigate(ROUTES.ADMIN_VERIFICATIONS);
    } catch (error) {
      console.error("Failed to reject verification:", error);
    }
  };

  const characterCount = additionalNotes.length;
  const maxCharacters = 500;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()} size="md">
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Text
            variant="bodyLg"
            className="text-neutral-90 text-xl font-semibold"
          >
            Rejected Verification
          </Text>
          <button
            onClick={onClose}
            className="text-neutral-50 hover:text-neutral-90 flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-neutral-10"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-4">
          {/* Title */}
          <div className="flex flex-col gap-1">
            <Text variant="bodyLg" className="text-neutral-90 font-medium">
              Reason for Rejection <span className="text-error">*</span>
            </Text>
          </div>

          {/* Rejection Reasons Checkboxes */}
          <div className="flex max-h-[300px] flex-col gap-3 overflow-y-auto pr-2">
            {REJECTION_REASONS.map((reason) => (
              <label
                key={reason}
                className="group flex cursor-pointer items-start gap-3"
              >
                <Checkbox
                  checked={selectedReasons.includes(reason)}
                  onChange={() => handleReasonToggle(reason)}
                  className="mt-0.5"
                />
                <Text
                  variant="body"
                  className="text-neutral-70 group-hover:text-neutral-90 flex-1 transition-colors"
                >
                  {reason}
                </Text>
              </label>
            ))}

            {/* Additional Notes Checkbox */}
            <label className="group flex cursor-pointer items-start gap-3">
              <Checkbox
                checked={showAdditionalNotes}
                onChange={handleAdditionalNotesToggle}
                className="mt-0.5"
              />
              <Text
                variant="body"
                className="text-neutral-70 group-hover:text-neutral-90 flex-1 transition-colors"
              >
                Additional notes
              </Text>
            </label>
          </div>

          {/* Additional Notes Textarea */}
          {showAdditionalNotes && (
            <div className="flex flex-col gap-2">
              <Textarea
                value={additionalNotes}
                onChange={(e) => {
                  if (e.target.value.length <= maxCharacters) {
                    setAdditionalNotes(e.target.value);
                  }
                }}
                placeholder="Please retake the selfie with your full face clearly visible."
                rows={4}
                className="resize-none"
              />
              <div className="flex justify-end">
                <Text variant="caption" className="text-neutral-50">
                  ({characterCount}/{maxCharacters})
                </Text>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-3">
          <Button
            intent="danger"
            size="lg"
            onClick={handleConfirmReject}
            disabled={selectedReasons.length === 0 || rejectMutation.isPending}
            className="w-full"
          >
            {rejectMutation.isPending ? "Rejecting..." : "Confirm Reject"}
          </Button>
          <Text variant="caption" className="text-neutral-50 text-center">
            The user will be notified with the reason and your comments.
          </Text>
        </div>
      </div>
    </Dialog>
  );
}
