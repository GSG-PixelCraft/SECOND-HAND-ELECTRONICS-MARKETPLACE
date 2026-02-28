import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, AlertTriangle, ShieldCheck } from "lucide-react";
import { Dialog } from "@/components/ui/Dialog/dialog";
import { Text } from "@/components/ui/Text/text";
import { Button } from "@/components/ui/Button/button";
import { Checkbox } from "@/components/ui/Checkbox/checkbox";
import { Textarea } from "@/components/ui/Textarea/textarea";
import { ROUTES } from "@/constants/routes";

export interface RejectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSubmitting: boolean;
  onSubmit: (payload: {
    reasons: string[];
    additionalNotes?: string;
  }) => Promise<void>;
}

type ModalState = "form" | "error" | "success";

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

/**
 * Error state modal content - displays when rejection fails
 */
interface ErrorModalContentProps {
  onRetry: () => void;
  onCancel: () => void;
}

function ErrorModalContent({ onRetry, onCancel }: ErrorModalContentProps) {
  return (
    <div className="animate-in fade-in zoom-in-95 flex flex-col items-center gap-6 py-6 duration-200">
      {/* Warning Icon */}
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-warning/10">
        <AlertTriangle className="h-8 w-8 text-warning" strokeWidth={2} />
      </div>

      {/* Title */}
      <div className="flex flex-col items-center gap-2 text-center">
        <Text variant="bodyLg" className="text-neutral-90 font-semibold">
          Something went wrong
        </Text>
        <Text variant="body" className="text-neutral-60 max-w-sm">
          We couldn't complete the verification Rejection due to a system issue.
          Please try again.
        </Text>
      </div>

      {/* Action Buttons */}
      <div className="flex w-full flex-col gap-3">
        <Button intent="primary" size="lg" onClick={onRetry} className="w-full">
          Try again
        </Button>
        <Button
          intent="outline"
          size="lg"
          onClick={onCancel}
          className="w-full"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}

/**
 * Success state modal content - displays when rejection is successful
 */
interface SuccessModalContentProps {
  onDone: () => void;
}

function SuccessModalContent({ onDone }: SuccessModalContentProps) {
  return (
    <div className="animate-in fade-in zoom-in-95 flex flex-col items-center gap-6 py-6 duration-200">
      {/* Success Icon */}
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
        <ShieldCheck className="h-8 w-8 text-success" strokeWidth={2} />
      </div>

      {/* Title */}
      <div className="flex flex-col items-center gap-2 text-center">
        <Text variant="bodyLg" className="text-neutral-90 font-semibold">
          Verification Request Rejected
        </Text>
        <Text variant="body" className="text-neutral-60 max-w-md">
          The verification request has been rejected based on the selected
          reasons. The user has been notified accordingly.
        </Text>
      </div>

      {/* Action Button */}
      <Button intent="primary" size="lg" onClick={onDone} className="w-full">
        Done
      </Button>
    </div>
  );
}

export function RejectionModal({
  isOpen,
  onClose,
  isSubmitting,
  onSubmit,
}: RejectionModalProps) {
  const navigate = useNavigate();
  const [modalState, setModalState] = useState<ModalState>("form");
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [showAdditionalNotes, setShowAdditionalNotes] = useState(false);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setModalState("form");
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
    if (selectedReasons.length === 0 || isSubmitting) {
      return;
    }

    try {
      await onSubmit({
        reasons: [...selectedReasons],
        additionalNotes: showAdditionalNotes ? additionalNotes : undefined,
      });
      setModalState("success");
    } catch {
      setModalState("error");
    }
  };

  const handleRetry = () => {
    handleConfirmReject();
  };

  const handleReturnToForm = () => {
    setModalState("form");
  };

  const handleSuccess = () => {
    onClose();
    navigate(ROUTES.ADMIN_VERIFICATIONS);
  };

  const characterCount = additionalNotes.length;
  const maxCharacters = 500;

  // Determine if dialog can be closed
  const canClose = modalState === "form" || modalState === "error";

  // Hide dialog while parent handles submission with full-screen loader
  const showDialog = isOpen && !isSubmitting;

  return (
    <>
      {/* Dialog for form, error, and success states */}
      <Dialog
        open={showDialog}
        onOpenChange={(open) => {
          if (!open && canClose) {
            onClose();
          }
        }}
        size={modalState === "form" ? "md" : "sm"}
      >
        {modalState === "form" && (
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
                disabled={selectedReasons.length === 0}
                className="w-full"
              >
                Confirm Reject
              </Button>
              <Text variant="caption" className="text-neutral-50 text-center">
                The user will be notified with the reason and your comments.
              </Text>
            </div>
          </div>
        )}

        {modalState === "error" && (
          <ErrorModalContent
            onRetry={handleRetry}
            onCancel={handleReturnToForm}
          />
        )}

        {modalState === "success" && (
          <SuccessModalContent onDone={handleSuccess} />
        )}
      </Dialog>
    </>
  );
}
