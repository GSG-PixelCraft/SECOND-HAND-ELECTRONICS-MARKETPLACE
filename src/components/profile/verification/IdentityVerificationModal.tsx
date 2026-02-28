import type { VerificationStatus } from "@/types/verification";
import { VerificationOverlay } from "./VerificationOverlay";

interface IdentityVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: () => void;
  status?: VerificationStatus;
}

export const IdentityVerificationModal = ({
  isOpen,
  onClose,
  onStart,
  status = "not_started",
}: IdentityVerificationModalProps) => {
  if (!isOpen) return null;

  const isPending = status === "pending";

  return (
    <VerificationOverlay isOpen={isOpen} onClose={onClose}>
      <h2 className="mb-2 text-xl font-bold">Verify your identity</h2>
      <p className="mb-6 text-gray-600">
        Upload a valid government issued ID to unlock additional account
        features.
      </p>
      <ul className="mb-6 list-disc space-y-1 pl-4 text-sm text-gray-600">
        <li>Have your passport or national ID ready.</li>
        <li>We will guide you through secure photo uploads.</li>
        <li>Review usually takes only a few minutes.</li>
      </ul>
      <button
        type="button"
        onClick={onStart}
        className="mb-2 w-full rounded-md bg-blue-600 py-2 text-white"
      >
        {isPending ? "Continue submission" : "Start verification"}
      </button>
      <button
        type="button"
        onClick={onClose}
        className="w-full py-2 text-gray-600"
      >
        Maybe later
      </button>
    </VerificationOverlay>
  );
};
