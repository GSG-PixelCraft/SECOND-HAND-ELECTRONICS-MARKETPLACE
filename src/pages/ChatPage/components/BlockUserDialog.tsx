import { useTranslation } from "react-i18next";
import { UserX } from "lucide-react";

interface BlockUserDialogProps {
  isOpen: boolean;
  userName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function BlockUserDialog({
  isOpen,
  userName,
  onConfirm,
  onCancel,
}: BlockUserDialogProps) {
  const { t } = useTranslation("chat");
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="border-border mx-4 w-full max-w-sm overflow-hidden rounded-2xl border bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center px-6 pb-4 pt-8 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-error/10">
            <UserX className="h-10 w-10 text-error" strokeWidth={2} />
          </div>

          <h3 className="text-foreground text-xl font-semibold">
            {t("block.title", "Are you sure you want to block")}
          </h3>

          <p className="text-foreground mt-1 text-lg font-medium">
            {userName}?
          </p>
        </div>

        <div className="px-6 pb-6 text-center">
          <p className="leading-relaxed text-muted-foreground">
            {t("block.warning", {
              defaultValue:
                "Once blocked, neither of you will be able to send messages or see each other's listings.",
            })}
          </p>
        </div>

        <div className="flex flex-col gap-3 px-6 pb-6">
          <button
            type="button"
            onClick={onConfirm}
            className="focus:ring-offset-background rounded-xl bg-error py-3.5 font-medium text-error-foreground transition-colors hover:bg-error/90 focus:outline-none focus:ring-2 focus:ring-error/50 focus:ring-offset-2"
          >
            {t("block.confirm", "Yes, Block")}
          </button>

          <button
            type="button"
            onClick={onCancel}
            role="dialog"
            aria-modal="true"
            className="text-foreground border-border focus:ring-offset-background rounded-xl border bg-transparent py-3.5 font-medium transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-muted-foreground/50 focus:ring-offset-2"
          >
            {t("common.cancel", "Cancel")}
          </button>
        </div>
      </div>
    </div>
  );
}
