import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { X, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";

interface ReportChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string, details?: string) => Promise<void>;
}

export default function ReportChatModal({
  isOpen,
  onClose,
  onSubmit,
}: ReportChatModalProps) {
  const { t } = useTranslation();
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [otherDetails, setOtherDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  useEffect(() => {
    if (isOpen) {
      setSelectedReason("");
      setOtherDetails("");
      setShowSuccess(false);
      setShowError(false);
    }
  }, [isOpen]);
  const REPORT_REASONS = [
    "spam-irrelevant",
    "harassment-abusive",
    "scam-suspicious",
    "offensive-inappropriate",
    "prohibited-items",
    "other",
  ] as const;

  const handleSubmit = async () => {
    if (!selectedReason) return;

    setIsSubmitting(true);
    try {
      const details =
        selectedReason === "other" ? otherDetails.trim() : undefined;
      await onSubmit(selectedReason, details);
      setShowSuccess(true);
    } catch {
      setShowError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedReason("");
    setOtherDetails("");
    setShowSuccess(false);
    setShowError(false);
    onClose();
  };

  if (!isOpen) return null;

  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="border-border mx-4 w-full max-w-sm rounded-2xl border bg-white p-6 text-center shadow-2xl">
          <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-success" />
          <h3 className="text-foreground mb-2 text-xl font-semibold">
            {t("chat.report.success.title")}
          </h3>
          <p className="mb-6 text-muted-foreground">
            {t("chat.report.success.message")}
          </p>
          <button
            onClick={handleClose}
            className="w-full rounded-xl bg-primary py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {t("chat.common.close")}
          </button>
        </div>
      </div>
    );
  }

  if (showError) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="border-border mx-4 w-full max-w-sm overflow-hidden rounded-2xl border bg-white p-6 text-center shadow-2xl">
          <AlertTriangle className="mx-auto mb-4 h-16 w-16 text-error" />
          <h3 className="text-foreground mb-2 text-xl font-semibold">
            {t("chat.report.error.title")}
          </h3>
          <p className="mb-6 text-muted-foreground">
            {t("chat.report.error.message")}
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowError(false)}
              className="text-foreground flex-1 rounded-xl bg-muted py-3 font-medium transition-colors hover:bg-muted/80"
            >
              {t("chat.common.cancel")}
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-error py-3 font-medium text-error-foreground transition-colors hover:bg-error/90 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  {t("chat.common.trying")}
                </>
              ) : (
                t("chat.report.tryAgain")
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="border-border mx-4 w-full max-w-md overflow-hidden rounded-2xl border bg-white shadow-2xl">
        <div className="border-border relative border-b px-6 pb-4 pt-6">
          <h3 className="text-foreground text-center text-xl font-semibold">
            {t("chat.report.title")}
          </h3>
          <button
            onClick={handleClose}
            className="absolute right-5 top-5 rounded-full p-1 transition-colors hover:bg-muted"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <div className="space-y-6 p-6">
          <p className="text-center leading-relaxed text-neutral">
            {t("chat.report.description")}
          </p>

          <div className="space-y-3">
            {REPORT_REASONS.map((reason) => (
              <label
                key={reason}
                className="group flex cursor-pointer items-center gap-3"
              >
                <input
                  type="radio"
                  name="report-reason"
                  value={reason}
                  checked={selectedReason === reason}
                  onChange={() => setSelectedReason(reason)}
                  className="h-5 w-5 accent-primary"
                />
                <span className="text-foreground transition-colors group-hover:text-primary">
                  {t(`chat.report.reasons.${reason}`)}
                </span>
              </label>
            ))}
          </div>

          {selectedReason === "other" && (
            <textarea
              value={otherDetails}
              onChange={(e) => setOtherDetails(e.target.value)}
              placeholder={t("chat.report.other.placeholder")}
              className="border-border h-24 w-full resize-none rounded-xl border bg-muted/50 p-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              maxLength={500}
            />
          )}

          <div className="pt-2 text-center text-sm text-muted-foreground">
            {t("chat.report.anonymous")}
          </div>
        </div>

        <div className="px-6 pb-6">
          <button
            onClick={handleSubmit}
            disabled={
              !selectedReason ||
              isSubmitting ||
              (selectedReason === "other" && !otherDetails.trim())
            }
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                {t("chat.common.submitting")}
              </>
            ) : (
              t("chat.report.submit")
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
