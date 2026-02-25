import { useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import { Dialog } from "@/components/ui/Dialog/dialog";
import { Button } from "@/components/ui/Button/button";
import { Text } from "@/components/ui/Text/text";
import { Span } from "@/components/ui/Span/span";

const REPORT_REASONS = [
  "Scam or misleading information",
  "Prohibited or illegal item",
  "Inappropriate content",
  "Spam listing",
  "Suspicious seller behavior",
  "Other reason",
];

interface ReportListingDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: { reason: string; details?: string }) => void;
}

export const ReportListingDialog = ({
  open,
  onClose,
  onSubmit,
}: ReportListingDialogProps) => {
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [details, setDetails] = useState("");
  const closeReasonRef = useRef<"submit" | "user" | null>(null);

  const isOtherReason = selectedReason === "Other reason";
  const isSubmitDisabled = useMemo(() => {
    if (!selectedReason) return true;
    if (!isOtherReason) return false;
    return details.trim().length === 0;
  }, [selectedReason, isOtherReason, details]);

  const handleSubmit = () => {
    closeReasonRef.current = "submit";
    onSubmit({ reason: selectedReason, details: details.trim() || undefined });
  };

  const handleClose = () => {
    closeReasonRef.current = "user";
    setSelectedReason("");
    setDetails("");
    onClose();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          if (closeReasonRef.current === "submit") {
            closeReasonRef.current = null;
            return;
          }
          handleClose();
        }
      }}
      className="w-full max-w-2xl rounded-2xl border border-neutral-10 bg-white p-8 backdrop:bg-black/50"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-neutral-foreground">
            Report Listing
          </h2>
          <Text variant="muted" className="text-sm">
            Help us keep the marketplace safe. Please select the reason that
            best describes the issue with this listing.
          </Text>
        </div>
        <Button
          type="button"
          onClick={handleClose}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-10 text-neutral-foreground"
          aria-label="Close report dialog"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="mt-6 space-y-4">
        {REPORT_REASONS.map((reason) => (
          <label
            key={reason}
            className="flex cursor-pointer items-center gap-3 text-sm text-neutral-foreground"
          >
            <Span
              className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                selectedReason === reason
                  ? "border-primary"
                  : "border-neutral-20"
              }`}
            >
              {selectedReason === reason && (
                <Span className="h-2 w-2 rounded-full bg-primary" />
              )}
            </Span>
            <input
              type="radio"
              name="report-reason"
              value={reason}
              checked={selectedReason === reason}
              onChange={() => setSelectedReason(reason)}
              className="sr-only"
            />
            {reason}
          </label>
        ))}

        {isOtherReason && (
          <div className="space-y-2">
            <textarea
              value={details}
              onChange={(event) => setDetails(event.target.value)}
              placeholder="My reason..."
              maxLength={500}
              className="min-h-[120px] w-full resize-none rounded-xl border border-neutral-10 bg-white px-4 py-3 text-sm text-neutral-foreground shadow-sm focus:border-primary focus:outline-none"
            />
            <Text variant="muted" className="text-right text-xs">
              ({details.length}/500)
            </Text>
          </div>
        )}
      </div>

      <div className="mt-6 space-y-3">
        <Button fullWidth onClick={handleSubmit} disabled={isSubmitDisabled}>
          Submit
        </Button>
        <Text variant="muted" className="text-center text-xs">
          The other user will not be notified about this report.
        </Text>
      </div>
    </Dialog>
  );
};
