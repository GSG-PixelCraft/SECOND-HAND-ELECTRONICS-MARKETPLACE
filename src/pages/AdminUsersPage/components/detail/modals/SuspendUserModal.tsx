import { forwardRef, useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Portal } from "@/components/ui/portal";

export interface SuspendUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string, duration?: number) => void;
}

export const SuspendUserModal = forwardRef<
  HTMLDivElement,
  SuspendUserModalProps
>(({ isOpen, onClose, onConfirm }, ref) => {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm("", 7); // Default 7 days suspension with empty reason
  };

  return (
    <Portal>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        onClick={onClose}
      >
        <div
          ref={ref}
          className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Icon */}
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FDB022]/10">
              <AlertTriangle className="h-8 w-8 text-[#FDB022]" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-neutral-90 mb-3 text-center text-xl font-semibold">
            Are you sure you want to suspend this user?
          </h2>

          {/* Description */}
          <p className="text-neutral-60 mb-8 text-center text-sm leading-relaxed">
            The user will be temporarily suspended and will not be able to log
            in or use their account during this period.
            <br />
            You can reactivate the account at any time.
          </p>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Button
              className="h-12 w-full rounded-xl border-none bg-[#EF4444] text-base font-medium text-white hover:bg-[#DC2626]"
              onClick={handleConfirm}
            >
              Suspend User
            </Button>
            <Button
              intent="outline"
              className="text-neutral-70 h-12 w-full rounded-xl border border-neutral-20 text-base font-medium hover:bg-neutral-10"
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </Portal>
  );
});

SuspendUserModal.displayName = "SuspendUserModal";
