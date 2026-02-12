import { useState, forwardRef, useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Portal } from "@/components/ui/portal";

export interface WarnUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  isLoading?: boolean;
}

export const WarnUserModal = forwardRef<HTMLDivElement, WarnUserModalProps>(
  ({ isOpen, onClose, onConfirm, isLoading }, ref) => {
    const [reason, setReason] = useState("");
    const MAX_LENGTH = 500;

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
      if (reason.trim()) {
        onConfirm(reason);
        setReason("");
      }
    };

    const handleReasonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      if (value.length <= MAX_LENGTH) {
        setReason(value);
      }
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
              Send a Warning to This User?
            </h2>

            {/* Description */}
            <p className="text-neutral-60 mb-6 text-center text-sm leading-relaxed">
              The user will receive a warning message, but will maintain full
              access to their account.
            </p>

            {/* Reason Input */}
            <div className="mb-6">
              <textarea
                value={reason}
                onChange={handleReasonChange}
                placeholder="Enter the reason for this warning..."
                className="text-neutral-90 placeholder:text-neutral-40 h-32 w-full resize-none rounded-xl border border-neutral-20 p-4 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              {/* Character Counter */}
              <div className="mt-2 flex justify-end">
                <span className="text-neutral-40 text-xs">
                  {reason.length}/{MAX_LENGTH}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <Button
                className="h-12 w-full rounded-xl border-none bg-[#EF4444] text-base font-medium text-white hover:bg-[#DC2626]"
                onClick={handleConfirm}
                disabled={!reason.trim() || isLoading}
              >
                {isLoading ? "Sending..." : "Send Warning"}
              </Button>
              <Button
                intent="outline"
                className="text-neutral-70 h-12 w-full rounded-xl border border-neutral-20 text-base font-medium hover:bg-neutral-10"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </Portal>
    );
  },
);

WarnUserModal.displayName = "WarnUserModal";
