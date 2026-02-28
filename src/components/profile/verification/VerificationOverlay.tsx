import type { ReactNode } from "react";

interface VerificationOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const VerificationOverlay = ({
  isOpen,
  onClose,
  children,
}: VerificationOverlayProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="relative w-full max-w-sm rounded-lg bg-white p-6 shadow-2xl">
        <button
          type="button"
          aria-label="Close verification dialog"
          onClick={onClose}
          className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

