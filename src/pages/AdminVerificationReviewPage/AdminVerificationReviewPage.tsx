import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Clock,
  ZoomIn,
  ZoomOut,
  RotateCw,
  RotateCcw,
  Download,
  Maximize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { AdminBackButton } from "@/components/admin";
import { useAdminVerificationDetail } from "@/services/admin-verification.service";
import { ROUTES } from "@/constants/routes";
import { ApproveVerificationModal, RejectionModal } from ".";

type ImageTab = "front" | "back" | "selfie";

export default function AdminVerificationReviewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeImageTab, setActiveImageTab] = useState<ImageTab>("front");
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [imageScale, setImageScale] = useState(1);
  const [imageRotation, setImageRotation] = useState(0);

  const {
    data: verification,
    isLoading,
    error,
  } = useAdminVerificationDetail(id || "");
  const handleBack = () => {
    navigate(ROUTES.ADMIN_VERIFICATIONS);
  };

  const handleApprove = async () => {
    setIsApproveModalOpen(true);
  };

  const handleReject = () => {
    setIsRejectionModalOpen(true);
  };

  const handleZoomIn = () => {
    setImageScale((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setImageScale((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleRotateLeft = () => {
    setImageRotation((prev) => prev - 90);
  };

  const handleRotateRight = () => {
    setImageRotation((prev) => prev + 90);
  };

  const handleDownload = () => {
    const currentImage = getCurrentImage();
    if (currentImage) {
      window.open(currentImage, "_blank");
    }
  };

  const handleFullscreen = () => {
    const currentImage = getCurrentImage();
    if (currentImage) {
      window.open(currentImage, "_blank");
    }
  };

  const getCurrentImage = (): string | undefined => {
    if (!verification) return undefined;

    switch (activeImageTab) {
      case "front":
        return verification.frontImage;
      case "back":
        return verification.backImage;
      case "selfie":
        return verification.selfieImage;
      default:
        return verification.frontImage;
    }
  };

  const handleImageTabChange = (imageType: ImageTab) => {
    setActiveImageTab(imageType);
    setImageScale(1);
    setImageRotation(0);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (Number.isNaN(date.getTime())) return dateString;
      return date
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
        .replaceAll("/", "-");
    } catch {
      return dateString;
    }
  };

  const getStatusVariant = (
    status: string,
  ): "pending" | "active" | "rejected" => {
    switch (status) {
      case "approved":
        return "active";
      case "rejected":
        return "rejected";
      case "pending":
      default:
        return "pending";
    }
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
      case "pending":
      default:
        return "Pending";
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-neutral">Loading verification details...</p>
        </div>
      </div>
    );
  }

  if (error || !verification) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-error-5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-error"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="m15 9-6 6" />
              <path d="m9 9 6 6" />
            </svg>
          </div>
          <h2 className="mt-4 text-xl font-semibold text-neutral-foreground">
            Verification Not Found
          </h2>
          <p className="mt-2 text-neutral">
            {error?.message ||
              "The verification you're looking for doesn't exist or has been removed."}
          </p>
          <button
            onClick={handleBack}
            className="mt-6 rounded-md bg-primary px-6 py-2 text-white hover:bg-primary/90"
          >
            Back to Verifications
          </button>
        </div>
      </div>
    );
  }

  const currentImage = getCurrentImage();

  return (
    <>
      <div className="p-6">
        {/* Content Container */}
        <div className="mx-auto max-w-[1500px] space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <AdminBackButton onClick={handleBack} aria-label="Go back" />
              <h1 className="text-2xl font-semibold text-neutral-foreground">
                Verification Review
              </h1>
            </div>

            <div className="flex items-center gap-3">
              {verification.status === "pending" && (
                <>
                  <Button
                    intent="outline"
                    onClick={handleReject}
                    className="h-11 rounded-xl border border-error bg-white px-8 text-sm font-semibold text-error hover:border-error hover:bg-error/5"
                  >
                    Reject
                  </Button>
                  <Button
                    intent="primary"
                    onClick={handleApprove}
                    className="h-11 rounded-xl border-none bg-primary px-8 text-sm font-semibold text-white hover:bg-primary/90"
                  >
                    Approve
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            {/* Image Preview Section */}
            <div className="rounded-2xl border border-[#EAECF0] bg-white shadow-[0px_3px_10px_rgba(16,24,40,0.08)]">
              {/* Image Tabs */}
              <div className="rounded-t-2xl bg-[#F7F9FC] px-6 pt-4">
                <div className="flex items-center gap-10 border-b border-[#E4E7EC] text-sm font-medium">
                  <button
                    onClick={() => handleImageTabChange("front")}
                    className={`border-b-2 pb-3 transition-colors ${
                      activeImageTab === "front"
                        ? "border-[#2563EB] text-[#2563EB]"
                        : "border-transparent text-[#98A2B3] hover:text-[#475467]"
                    }`}
                  >
                    Front
                  </button>
                  {verification.backImage && (
                    <button
                      onClick={() => handleImageTabChange("back")}
                      className={`border-b-2 pb-3 transition-colors ${
                        activeImageTab === "back"
                          ? "border-[#2563EB] text-[#2563EB]"
                          : "border-transparent text-[#98A2B3] hover:text-[#475467]"
                      }`}
                    >
                      Back
                    </button>
                  )}
                  {verification.selfieImage && (
                    <button
                      onClick={() => handleImageTabChange("selfie")}
                      className={`border-b-2 pb-3 transition-colors ${
                        activeImageTab === "selfie"
                          ? "border-[#2563EB] text-[#2563EB]"
                          : "border-transparent text-[#98A2B3] hover:text-[#475467]"
                      }`}
                    >
                      Selfie
                    </button>
                  )}
                </div>
              </div>

              {/* Image Viewer */}
              <div className="space-y-4 p-6">
                <div className="rounded-2xl bg-[#F4F6FA] p-5">
                  <div className="flex min-h-[360px] items-center justify-center overflow-hidden rounded-2xl bg-white p-4 shadow-[0px_10px_22px_rgba(15,23,42,0.12)]">
                    {currentImage ? (
                      <img
                        src={currentImage}
                        alt={`${activeImageTab} view`}
                        className="max-h-[320px] max-w-full object-contain transition-transform duration-200"
                        style={{
                          transform: `scale(${imageScale}) rotate(${imageRotation}deg)`,
                        }}
                      />
                    ) : (
                      <p className="text-sm text-[#98A2B3]">
                        No image available
                      </p>
                    )}
                  </div>
                </div>

                {/* Image Controls */}
                {currentImage && (
                  <div className="flex items-center justify-center">
                    <div className="flex items-center gap-3 rounded-xl border border-[#E4E7EC] bg-white px-3 py-2 shadow-[0px_2px_6px_rgba(16,24,40,0.08)]">
                      <button
                        onClick={handleZoomOut}
                        className="flex size-9 items-center justify-center rounded-lg text-[#667085] transition-colors hover:bg-[#F2F4F7] hover:text-primary"
                        aria-label="Zoom out"
                      >
                        <ZoomOut className="h-4 w-4" />
                      </button>
                      <button
                        onClick={handleZoomIn}
                        className="flex size-9 items-center justify-center rounded-lg text-[#667085] transition-colors hover:bg-[#F2F4F7] hover:text-primary"
                        aria-label="Zoom in"
                      >
                        <ZoomIn className="h-4 w-4" />
                      </button>
                      <div className="h-6 w-px bg-[#EAECF0]" />
                      <button
                        onClick={handleRotateLeft}
                        className="flex size-9 items-center justify-center rounded-lg text-[#667085] transition-colors hover:bg-[#F2F4F7] hover:text-primary"
                        aria-label="Rotate left"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </button>
                      <button
                        onClick={handleRotateRight}
                        className="flex size-9 items-center justify-center rounded-lg text-[#667085] transition-colors hover:bg-[#F2F4F7] hover:text-primary"
                        aria-label="Rotate right"
                      >
                        <RotateCw className="h-4 w-4" />
                      </button>
                      <div className="h-6 w-px bg-[#EAECF0]" />
                      <button
                        onClick={handleDownload}
                        className="flex size-9 items-center justify-center rounded-lg text-[#667085] transition-colors hover:bg-[#F2F4F7] hover:text-primary"
                        aria-label="Download"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        onClick={handleFullscreen}
                        className="flex size-9 items-center justify-center rounded-lg text-[#667085] transition-colors hover:bg-[#F2F4F7] hover:text-primary"
                        aria-label="Fullscreen"
                      >
                        <Maximize2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* User Info Section */}
            <div className="flex flex-col gap-4">
              <div className="rounded-2xl border border-[#EAECF0] bg-white p-4 shadow-[0px_3px_10px_rgba(16,24,40,0.06)]">
                <div className="flex items-center gap-3">
                  {verification.userAvatar ? (
                    <img
                      src={verification.userAvatar}
                      alt={verification.userName}
                      className="h-11 w-11 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-base font-semibold text-primary">
                      {verification.userName.charAt(0)}
                    </div>
                  )}
                  <div className="flex flex-1 items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-[#111827]">
                      {verification.userName}
                    </p>
                    <button
                      className="text-sm font-medium text-primary hover:underline"
                      onClick={() => {
                        // TODO: Navigate to user profile
                        console.log("View profile:", verification.userId);
                      }}
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#EAECF0] bg-white p-4 shadow-[0px_3px_10px_rgba(16,24,40,0.06)]">
                <div className="flex flex-col gap-3">
                  <p className="text-sm font-semibold text-[#111827]">
                    {verification.documentType}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#667085]">Status</span>
                    <StatusBadge
                      variant={getStatusVariant(verification.status)}
                      className="rounded-full px-3 py-1 text-[11px] font-semibold"
                    >
                      {getStatusLabel(verification.status)}
                    </StatusBadge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#667085]">
                    <Clock className="h-4 w-4" />
                    <span>
                      Submitted on {formatDate(verification.submittedDate)}
                    </span>
                  </div>
                </div>
              </div>

              {verification.status === "rejected" && (
                <div className="rounded-2xl border border-[#F9C5C5] bg-[#FDECEC] p-4 shadow-[0px_3px_10px_rgba(16,24,40,0.04)]">
                  <p className="text-sm font-semibold text-[#F04438]">
                    Rejection Reasons:
                  </p>
                  {verification.rejectionReasons?.length ? (
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[#344054]">
                      {verification.rejectionReasons.map((reason, index) => (
                        <li key={index}>{reason}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-sm text-[#667085]">
                      No rejection reasons provided.
                    </p>
                  )}
                  {verification.additionalNotes && (
                    <div className="mt-4 space-y-1">
                      <p className="text-sm font-semibold text-[#111827]">
                        Additional Notes:
                      </p>
                      <p className="text-sm text-[#667085]">
                        {verification.additionalNotes}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {verification.reviewedAt && (
                <p className="text-right text-xs text-[#98A2B3]">
                  Manual review was performed on{" "}
                  {formatDate(verification.reviewedAt)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Rejection Modal */}
      <RejectionModal
        isOpen={isRejectionModalOpen}
        onClose={() => setIsRejectionModalOpen(false)}
        verificationId={id || ""}
      />

      <ApproveVerificationModal
        isOpen={isApproveModalOpen}
        onClose={() => setIsApproveModalOpen(false)}
        verificationId={id || ""}
      />
    </>
  );
}
