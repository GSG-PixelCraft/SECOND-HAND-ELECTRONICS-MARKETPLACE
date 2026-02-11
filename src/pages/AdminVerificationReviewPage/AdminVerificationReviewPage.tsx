import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ZoomIn,
  ZoomOut,
  RotateCw,
  RotateCcw,
  Download,
  Maximize2,
} from "lucide-react";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  useAdminVerificationDetail,
  useApproveVerification,
} from "@/services/admin-verification.service";
import { ROUTES } from "@/constants/routes";
import { RejectionModal } from ".";

type ImageTab = "front" | "back" | "selfie";

export default function AdminVerificationReviewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeImageTab, setActiveImageTab] = useState<ImageTab>("front");
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
  const [imageScale, setImageScale] = useState(1);
  const [imageRotation, setImageRotation] = useState(0);

  const {
    data: verification,
    isLoading,
    error,
  } = useAdminVerificationDetail(id || "");
  const approveMutation = useApproveVerification();

  const handleBack = () => {
    navigate(ROUTES.ADMIN_VERIFICATIONS);
  };

  const handleApprove = async () => {
    if (!id) return;

    try {
      await approveMutation.mutateAsync(id);
      navigate(ROUTES.ADMIN_VERIFICATIONS);
    } catch (error) {
      console.error("Failed to approve verification:", error);
    }
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
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
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

  const isAnyMutationLoading = approveMutation.isPending;

  return (
    <>
      <div className="min-h-screen bg-neutral-5">
        {/* Content Container */}
        <div className="mx-auto max-w-[1400px] space-y-8 p-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="text-neutral-60 hover:text-neutral-90 flex size-10 items-center justify-center rounded-full border border-neutral-20 bg-white transition-colors hover:bg-neutral-5"
                aria-label="Go back"
              >
                <ArrowLeft className="size-5" />
              </button>
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
                    disabled={isAnyMutationLoading}
                    className="h-11 rounded-xl border border-error bg-white px-8 text-sm font-semibold text-error hover:border-error hover:bg-error/5"
                  >
                    Reject
                  </Button>
                  <Button
                    intent="primary"
                    onClick={handleApprove}
                    disabled={isAnyMutationLoading}
                    className="h-11 rounded-xl border-none bg-primary px-8 text-sm font-semibold text-white hover:bg-primary/90"
                  >
                    {approveMutation.isPending ? "Approving..." : "Approve"}
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Content Card */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Image Preview Section */}
              <div className="lg:col-span-2">
                <div className="flex flex-col gap-4">
                  {/* Image Tabs */}
                  <div className="flex gap-3 border-b border-[#e4e4e4]">
                    <button
                      onClick={() => handleImageTabChange("front")}
                      className={`border-b-2 px-4 pb-2 text-base transition-colors ${
                        activeImageTab === "front"
                          ? "border-[#2563eb] font-medium text-[#2563eb]"
                          : "border-transparent text-[#828282] hover:text-[#3d3d3d]"
                      }`}
                    >
                      Front
                    </button>
                    {verification.backImage && (
                      <button
                        onClick={() => handleImageTabChange("back")}
                        className={`border-b-2 px-4 pb-2 text-base transition-colors ${
                          activeImageTab === "back"
                            ? "border-[#2563eb] font-medium text-[#2563eb]"
                            : "border-transparent text-[#828282] hover:text-[#3d3d3d]"
                        }`}
                      >
                        Back
                      </button>
                    )}
                    {verification.selfieImage && (
                      <button
                        onClick={() => handleImageTabChange("selfie")}
                        className={`border-b-2 px-4 pb-2 text-base transition-colors ${
                          activeImageTab === "selfie"
                            ? "border-[#2563eb] font-medium text-[#2563eb]"
                            : "border-transparent text-[#828282] hover:text-[#3d3d3d]"
                        }`}
                      >
                        Selfie
                      </button>
                    )}
                  </div>

                  {/* Image Viewer */}
                  <div className="relative flex min-h-[500px] items-center justify-center overflow-hidden rounded-xl bg-[#f5f5f5] p-6">
                    {currentImage ? (
                      <img
                        src={currentImage}
                        alt={`${activeImageTab} view`}
                        className="max-h-[500px] max-w-full object-contain transition-transform duration-200"
                        style={{
                          transform: `scale(${imageScale}) rotate(${imageRotation}deg)`,
                        }}
                      />
                    ) : (
                      <Text variant="body" className="text-neutral-50">
                        No image available
                      </Text>
                    )}

                    {/* Image Controls */}
                    {currentImage && (
                      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-lg bg-white/90 p-2 shadow-lg backdrop-blur-sm">
                        <button
                          onClick={handleZoomOut}
                          className="text-neutral-70 flex h-8 w-8 items-center justify-center rounded transition-colors hover:bg-neutral-10 hover:text-primary"
                          aria-label="Zoom out"
                        >
                          <ZoomOut className="h-4 w-4" />
                        </button>
                        <button
                          onClick={handleZoomIn}
                          className="text-neutral-70 flex h-8 w-8 items-center justify-center rounded transition-colors hover:bg-neutral-10 hover:text-primary"
                          aria-label="Zoom in"
                        >
                          <ZoomIn className="h-4 w-4" />
                        </button>
                        <div className="h-6 w-px bg-neutral-20" />
                        <button
                          onClick={handleRotateLeft}
                          className="text-neutral-70 flex h-8 w-8 items-center justify-center rounded transition-colors hover:bg-neutral-10 hover:text-primary"
                          aria-label="Rotate left"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </button>
                        <button
                          onClick={handleRotateRight}
                          className="text-neutral-70 flex h-8 w-8 items-center justify-center rounded transition-colors hover:bg-neutral-10 hover:text-primary"
                          aria-label="Rotate right"
                        >
                          <RotateCw className="h-4 w-4" />
                        </button>
                        <div className="h-6 w-px bg-neutral-20" />
                        <button
                          onClick={handleDownload}
                          className="text-neutral-70 flex h-8 w-8 items-center justify-center rounded transition-colors hover:bg-neutral-10 hover:text-primary"
                          aria-label="Download"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button
                          onClick={handleFullscreen}
                          className="text-neutral-70 flex h-8 w-8 items-center justify-center rounded transition-colors hover:bg-neutral-10 hover:text-primary"
                          aria-label="Fullscreen"
                        >
                          <Maximize2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* User Info Section */}
              <div className="lg:col-span-1">
                <div className="flex flex-col gap-4 rounded-xl border border-neutral-20 bg-white p-6">
                  {/* User Avatar and Name */}
                  <div className="flex items-center gap-4">
                    {verification.userAvatar ? (
                      <img
                        src={verification.userAvatar}
                        alt={verification.userName}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-medium text-primary">
                        {verification.userName.charAt(0)}
                      </div>
                    )}
                    <div className="flex flex-col gap-1">
                      <Text
                        variant="bodyLg"
                        className="text-neutral-90 font-semibold"
                      >
                        {verification.userName}
                      </Text>
                      <button
                        className="text-left text-sm text-primary hover:underline"
                        onClick={() => {
                          // TODO: Navigate to user profile
                          console.log("View profile:", verification.userId);
                        }}
                      >
                        View Profile
                      </button>
                    </div>
                  </div>

                  <div className="h-px bg-neutral-20" />

                  {/* Document Type */}
                  <div className="flex flex-col gap-2">
                    <Text variant="caption" className="text-neutral-50">
                      Document Type
                    </Text>
                    <Text
                      variant="body"
                      className="text-neutral-90 font-medium"
                    >
                      {verification.documentType}
                    </Text>
                  </div>

                  {/* Status */}
                  <div className="flex flex-col gap-2">
                    <Text variant="caption" className="text-neutral-50">
                      Status
                    </Text>
                    <StatusBadge
                      variant={getStatusVariant(verification.status)}
                    >
                      {getStatusLabel(verification.status)}
                    </StatusBadge>
                  </div>

                  {/* Submitted Date */}
                  <div className="flex flex-col gap-2">
                    <Text variant="caption" className="text-neutral-50">
                      Submitted Date
                    </Text>
                    <Text variant="body" className="text-neutral-70">
                      Submitted on {formatDate(verification.submittedDate)}
                    </Text>
                  </div>

                  {/* Rejection Reasons (if rejected) */}
                  {verification.status === "rejected" &&
                    verification.rejectionReasons && (
                      <>
                        <div className="h-px bg-neutral-20" />
                        <div className="flex flex-col gap-2">
                          <Text variant="caption" className="text-neutral-50">
                            Rejection Reasons
                          </Text>
                          <ul className="flex flex-col gap-1">
                            {verification.rejectionReasons.map(
                              (reason, index) => (
                                <li key={index} className="text-sm text-error">
                                  • {reason}
                                </li>
                              ),
                            )}
                          </ul>
                        </div>
                      </>
                    )}

                  {/* Additional Notes (if any) */}
                  {verification.additionalNotes && (
                    <>
                      <div className="h-px bg-neutral-20" />
                      <div className="flex flex-col gap-2">
                        <Text variant="caption" className="text-neutral-50">
                          Additional Notes
                        </Text>
                        <Text variant="body" className="text-neutral-70">
                          {verification.additionalNotes}
                        </Text>
                      </div>
                    </>
                  )}
                </div>
              </div>
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
    </>
  );
}
