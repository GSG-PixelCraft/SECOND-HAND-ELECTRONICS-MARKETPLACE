import React from "react";
import { Loader, ShieldCheck, ShieldAlert } from "lucide-react";

type PageStatus = "submitting" | "success" | "failed";

interface StatusModalProps {
  status: PageStatus;
  onTryAgain: () => void;
}

const StatusModal: React.FC<StatusModalProps> = ({ status, onTryAgain }) => {
  const handleGoToProfile = () => {
    window.location.href = "http://localhost:5173/profile";
  };

  const renderContent = () => {
    switch (status) {
      case "submitting":
        return (
          <div className="flex flex-col items-center justify-center text-center">
            <Loader className="animate-spin text-blue-600" size={64} />
            <h2 className="mt-6 text-2xl font-bold text-gray-900">
              Submitting...
            </h2>
            <p className="mt-2 text-gray-600">
              Please wait while we verify your documents. This may take a
              moment.
            </p>
          </div>
        );
      case "success":
        return (
          <div className="flex flex-col items-center justify-center text-center">
            <ShieldCheck className="text-green-500" size={64} />
            <h2 className="mt-6 text-2xl font-bold text-gray-900">
              Verification Successful
            </h2>
            <p className="mt-2 max-w-md text-gray-600">
              Your identity has been verified successfully. You can now proceed.
            </p>
            <button
              type="button"
              onClick={handleGoToProfile}
              className="mt-8 w-full rounded-md bg-blue-600 px-12 py-3 text-sm font-semibold text-white hover:bg-blue-700 sm:w-auto"
            >
              Go to Profile
            </button>
          </div>
        );
      case "failed":
        return (
          <div className="flex flex-col items-center justify-center text-center">
            <ShieldAlert className="text-red-500" size={64} />
            <h2 className="mt-6 text-2xl font-bold text-gray-900">
              Verification Failed
            </h2>
            <p className="mt-2 max-w-md text-gray-600">
              We couldn't verify your identity. Please ensure your documents are
              clear and not expired.
            </p>
            <button
              type="button"
              onClick={onTryAgain}
              className="mt-8 w-full rounded-md bg-blue-600 px-12 py-3 text-sm font-semibold text-white hover:bg-blue-700 sm:w-auto"
            >
              Try Again
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-2xl">
        {renderContent()}
      </div>
    </div>
  );
};

export default StatusModal;
