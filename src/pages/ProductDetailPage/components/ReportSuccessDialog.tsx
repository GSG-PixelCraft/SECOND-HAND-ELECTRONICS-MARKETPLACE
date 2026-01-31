import { CheckCircle2, X } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ReportSuccessDialogProps {
  open: boolean;
  onClose: () => void;
}

export const ReportSuccessDialog = ({
  open,
  onClose,
}: ReportSuccessDialogProps) => {
  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
      className="w-full max-w-md rounded-2xl border border-neutral-10 bg-white p-8 text-center backdrop:bg-black/50"
    >
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-10 text-neutral-foreground"
          aria-label="Close report success dialog"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/15">
          <CheckCircle2 className="h-8 w-8 text-success" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-neutral-foreground">
            Report submitted
          </h3>
          <p className="text-sm text-muted-foreground">
            Thanks for helping keep our community safe. We&apos;ll review this
            report shortly.
          </p>
        </div>
        <Button fullWidth onClick={onClose}>
          Done
        </Button>
      </div>
    </Dialog>
  );
};
