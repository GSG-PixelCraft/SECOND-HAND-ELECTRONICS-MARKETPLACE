import { useEffect, useState } from "react";
import { Dialog } from "@/components/ui/Dialog/dialog";
import { Button } from "@/components/ui/Button/button";
import { FullScreenLoading } from "@/components/feedback/loading/full-screen-loading";
import { useApproveVerification } from "@/services/admin-verification.service";

export interface ApproveVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  verificationId: string;
}

type ModalState = "confirm" | "loading" | "success";

function WarningIcon() {
  return (
    <svg
      width="72"
      height="72"
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M31.2 13.5C33.1 10.2 38.9 10.2 40.8 13.5L62.4 50.7C64.3 54 61.9 58.2 58.1 58.2H13.9C10.1 58.2 7.7 54 9.6 50.7L31.2 13.5Z"
        fill="hsl(var(--warning))"
      />
      <rect x="34" y="26" width="4" height="20" rx="2" fill="white" />
      <circle cx="36" cy="51.5" r="2.5" fill="white" />
    </svg>
  );
}

function SuccessIcon() {
  return (
    <svg
      width="72"
      height="72"
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M36 8L43 12.5L51 12L55.5 19L63 23L61.5 31.5L66 38.5L61.5 45.5L63 54L55.5 58L51 65L43 64.5L36 69L29 64.5L21 65L16.5 58L9 54L10.5 45.5L6 38.5L10.5 31.5L9 23L16.5 19L21 12L29 12.5L36 8Z"
        fill="hsl(var(--success))"
      />
      <path
        d="M30.5 38.5L34.5 42.5L43.5 33.5"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ApproveVerificationModal({
  isOpen,
  onClose,
  verificationId,
}: ApproveVerificationModalProps) {
  const [modalState, setModalState] = useState<ModalState>("confirm");
  const approveMutation = useApproveVerification();

  useEffect(() => {
    if (!isOpen) {
      setModalState("confirm");
    }
  }, [isOpen]);

  const handleApprove = async () => {
    if (!verificationId) return;
    setModalState("loading");
    try {
      await approveMutation.mutateAsync(verificationId);
      setModalState("success");
    } catch (error) {
      console.error("Failed to approve verification:", error);
      setModalState("confirm");
    }
  };

  const showDialog = isOpen && modalState !== "loading";

  return (
    <>
      {modalState === "loading" && (
        <FullScreenLoading
          message="Waiting..."
          ariaLabel="Approving verification"
        />
      )}

      <Dialog
        open={showDialog}
        onOpenChange={(open) => {
          if (!open && modalState !== "loading") {
            onClose();
          }
        }}
        className="w-full max-w-[520px] rounded-[20px] border border-neutral-10 bg-white p-8 shadow-xl backdrop:bg-black/60"
      >
        {modalState === "confirm" && (
          <div className="flex flex-col items-center gap-5 text-center">
            <WarningIcon />
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-neutral-foreground">
                Approve Verification?
              </h2>
              <p className="text-sm text-[#667085]">
                Are you sure you want to approve this verification? Once
                approved, the user&apos;s identity will be verified
              </p>
            </div>
            <div className="mt-2 flex w-full flex-col gap-3">
              <Button
                onClick={handleApprove}
                className="h-12 w-full rounded-[12px] border-none bg-success text-sm font-semibold text-white hover:bg-success/90"
              >
                Yes, Approve Verification
              </Button>
              <Button
                intent="outline"
                onClick={onClose}
                className="h-12 w-full rounded-[12px] border-[#98A2B3] text-sm font-semibold text-[#667085] hover:bg-transparent"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {modalState === "success" && (
          <div className="flex flex-col items-center gap-5 text-center">
            <SuccessIcon />
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-neutral-foreground">
                Verification Approved Successfully
              </h2>
              <p className="text-sm text-[#667085]">
                This verification request has been approved and the user is now
                verified.
              </p>
            </div>
            <Button
              onClick={onClose}
              className="h-12 w-full rounded-[12px] border-none bg-primary text-sm font-semibold text-white hover:bg-primary/90"
            >
              Done
            </Button>
          </div>
        )}
      </Dialog>
    </>
  );
}
