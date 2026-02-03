import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { useIdentityStatus } from "@/services";
import { useAuthStore } from "@/stores";
import { ROUTES } from "@/constants/routes";
import { MESSAGES } from "@/constants/messages";
import { CheckCircle, XCircle, Clock, Upload } from "lucide-react";

export const IdentityVerificationStatusPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: status, isLoading } = useIdentityStatus();
  const setVerification = useAuthStore((state) => state.setVerification);

  useEffect(() => {
    if (status) {
      setVerification({
        identity: {
          type: status.type,
          status: status.status,
          rejectionReason: status.rejectionReason,
        },
      });
    }
  }, [status, setVerification]);

  if (isLoading) {
    return (
      <PageLayout title="Verification Status">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />
        </div>
      </PageLayout>
    );
  }

  const getStatusContent = () => {
    switch (status?.status) {
      case "uploading":
        return {
          icon: <Upload className="h-16 w-16 text-[#2563eb]" />,
          title: MESSAGES.VERIFICATION.IDENTITY.UPLOADING,
          description: "Please wait while we process your document...",
          variant: "info" as const,
        };
      case "waiting":
      case "pending":
        return {
          icon: <Clock className="h-16 w-16 text-[#f59e0b]" />,
          title: MESSAGES.VERIFICATION.IDENTITY.WAITING,
          description:
            "Your document is being reviewed. This usually takes 1-2 business days.",
          variant: "warning" as const,
        };
      case "approved":
        return {
          icon: <CheckCircle className="h-16 w-16 text-[#10b981]" />,
          title: MESSAGES.VERIFICATION.IDENTITY.APPROVED,
          description:
            "Your identity has been successfully verified. You can now access all features.",
          variant: "success" as const,
          action: () => navigate(ROUTES.VERIFY),
        };
      case "rejected":
        return {
          icon: <XCircle className="h-16 w-16 text-[#ef4444]" />,
          title: MESSAGES.VERIFICATION.IDENTITY.REJECTED,
          description:
            status.rejectionReason ||
            "Your verification was rejected. Please try again with a clearer document.",
          variant: "error" as const,
          action: () => navigate(ROUTES.VERIFY_IDENTITY),
        };
      default:
        return null;
    }
  };

  const content = getStatusContent();

  if (!content) {
    navigate(ROUTES.VERIFY_IDENTITY);
    return null;
  }

  return (
    <PageLayout title="Identity Verification Status">
      <div className="mx-auto max-w-2xl">
        <div className="flex flex-col items-center space-y-6 text-center">
          <div className="rounded-full bg-gray-50 p-6">{content.icon}</div>

          <div className="space-y-2">
            <h2 className="text-2xl font-medium text-[#101010]">
              {content.title}
            </h2>
            <p className="text-base text-[#828282]">{content.description}</p>
          </div>

          <Alert variant={content.variant} className="w-full text-left">
            {status?.status === "waiting" && (
              <p>
                We're reviewing your document. You'll receive a notification
                once the review is complete.
              </p>
            )}
            {status?.status === "rejected" && (
              <p>
                Please ensure your document is:
                <ul className="ml-6 mt-2 list-disc">
                  <li>Clear and readable</li>
                  <li>Not expired</li>
                  <li>Shows all corners of the document</li>
                  <li>Matches your selfie</li>
                </ul>
              </p>
            )}
          </Alert>

          {content.action && (
            <Button onClick={content.action} size="lg">
              {status?.status === "approved" ? "Continue" : "Try Again"}
            </Button>
          )}
        </div>
      </div>
    </PageLayout>
  );
};
