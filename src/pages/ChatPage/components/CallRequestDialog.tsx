// components/CallRequestDialog.tsx
import { useTranslation } from "react-i18next";

interface CallRequestDialogProps {
  isOpen: boolean;
  sellerName: string;
  onConfirm: () => void;
  onCancel: () => void;
  text?: string;
}

export default function CallRequestDialog({
  isOpen,
  sellerName,
  onConfirm,
  onCancel,
  text,
}: CallRequestDialogProps) {
  const { t } = useTranslation("chat");

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-200"
      onClick={onCancel}
    >
      <div
        className={`border-border mx-4 w-full max-w-sm overflow-hidden rounded-xl border bg-white shadow-lg transition-all duration-200`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-border flex items-center justify-center border-b px-6 pb-4 pt-6">
          <p className="text-foreground text-base font-normal">
            {t("callRequest.title", "Call request")}
          </p>
        </div>

        {/* Body */}
        <div className="space-y-4 px-6 py-6">
          <p className="text-foreground text-center text-body leading-relaxed">
            {text ??
              t("callRequest.message", {
                defaultValue:
                  "Do you want to request a voice call with {{name}}?",
                name: sellerName,
              })}
          </p>
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-4 px-6 py-5">
          <button
            onClick={onConfirm}
            className={`focus:ring-offset-background flex-1 rounded-lg bg-primary px-5 py-3.5 font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
          >
            {t("callRequest.confirm", "Request Call")}
          </button>

          <button
            onClick={onCancel}
            className={`bg-background text-foreground border-border focus:ring-offset-background flex-1 rounded-lg border px-5 py-3.5 font-medium transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-muted-foreground/50 focus:ring-offset-2`}
          >
            {t("common.cancel", "Cancel")}
          </button>
        </div>
      </div>
    </div>
  );
}
