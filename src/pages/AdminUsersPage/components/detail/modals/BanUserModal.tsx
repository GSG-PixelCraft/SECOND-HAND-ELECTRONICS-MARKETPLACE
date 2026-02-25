import { useState, forwardRef, useEffect } from "react";
import { ShieldOff } from "lucide-react";
import { Button } from "@/components/ui/Button/button";
import { Span } from "@/components/ui/Span/span";
import { Portal } from "@/components/ui/Portal/portal";

export interface BanUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export const BanUserModal = forwardRef<HTMLDivElement, BanUserModalProps>(
  ({ isOpen, onClose, onConfirm }, ref) => {
    const [reason, setReason] = useState("");

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
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-error/10">
                <ShieldOff className="h-8 w-8 text-error" />
              </div>
            </div>

            {/* Title */}
            <h2 className="mb-2 text-center text-2xl font-bold text-error">
              Permanent Ban
            </h2>

            {/* Description */}
            <Span className="text-neutral-60 mb-6 block text-center">
              <strong className="text-error">Warning:</strong> This action will
              permanently ban the user from the platform. This action cannot be
              easily reversed. Please provide a detailed reason.
            </Span>

            {/* Reason Input */}
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter detailed ban reason..."
              className="text-neutral-90 placeholder:text-neutral-40 mb-6 h-32 w-full resize-none rounded-xl border border-neutral-20 p-4 text-sm focus:border-error focus:outline-none focus:ring-2 focus:ring-error/20"
            />

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                intent="outline"
                className="h-11 flex-1 rounded-xl"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                intent="danger"
                className="h-11 flex-1 rounded-xl border-none bg-error text-white hover:bg-error/90"
                onClick={handleConfirm}
                disabled={!reason.trim()}
              >
                Ban User
              </Button>
            </div>
          </div>
        </div>
      </Portal>
    );
  },
);

BanUserModal.displayName = "BanUserModal";
