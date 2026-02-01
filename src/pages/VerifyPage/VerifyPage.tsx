import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import {
  Shield,
  CheckCircle2,
  Mail,
  Phone,
  Clock,
  XCircle,
} from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/stores/useAuthStore";

export default function VerifyPage() {
  const navigate = useNavigate();
  const { user, verification } = useAuthStore();

  return (
    <PageLayout title="Verify Account" maxWidth="4xl">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="space-y-2 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-h2 font-semibold">Verify Your Account</h1>
          <p className="text-body text-muted-foreground">
            Verify your account to unlock all features and build trust with
            other users
          </p>
        </div>

        {/* Verification Options */}
        <div className="space-y-4">
          {/* Email Verification */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-h4 font-semibold">
                      Email Verification
                    </h3>
                    <p className="text-bodySmall mt-1 text-muted-foreground">
                      Verify your email address to secure your account
                    </p>
                  </div>
                  {user?.emailVerified ? (
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-success" />
                      <span className="text-bodySmall font-medium text-success">
                        Verified
                      </span>
                    </div>
                  ) : (
                    <Button
                      intent="primary"
                      size="sm"
                      onClick={() => navigate(ROUTES.VERIFY_EMAIL)}
                    >
                      Verify
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Phone Verification */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-h4 font-semibold">
                      Phone Number Verification
                    </h3>
                    <p className="text-bodySmall mt-1 text-muted-foreground">
                      Add a phone number to increase your credibility
                    </p>
                  </div>
                  {renderVerificationStatus(verification.phoneStatus, () =>
                    navigate(ROUTES.VERIFY_PHONE),
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Identity Verification */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-h4 font-semibold">
                      Identity Verification
                    </h3>
                    <p className="text-bodySmall mt-1 text-muted-foreground">
                      Submit a government-issued ID to become a verified seller
                    </p>
                  </div>
                  {renderIdentityStatus(verification.identityStatus, () =>
                    navigate(ROUTES.VERIFY_IDENTITY),
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="rounded-lg bg-neutral-5 p-6">
          <h3 className="mb-3 text-h4 font-semibold">
            Benefits of Verification
          </h3>
          <ul className="text-bodySmall space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-success" />
              <span>Increase trust and credibility with buyers</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-success" />
              <span>Get a verified badge on your profile</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-success" />
              <span>Higher visibility in search results</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-success" />
              <span>Access to advanced selling features</span>
            </li>
          </ul>
        </div>
      </div>
    </PageLayout>
  );
}

// Helper function to render verification status for phone and email
function renderVerificationStatus(
  status: "not_verified" | "verified",
  onVerifyClick: () => void,
) {
  if (status === "verified") {
    return (
      <div className="flex items-center gap-2">
        <CheckCircle2 className="h-5 w-5 text-success" />
        <span className="text-bodySmall font-medium text-success">
          Verified
        </span>
      </div>
    );
  }

  return (
    <Button intent="primary" size="sm" onClick={onVerifyClick}>
      Verify
    </Button>
  );
}

// Helper function to render identity verification status
function renderIdentityStatus(
  status:
    | "not_started"
    | "uploading"
    | "waiting_approval"
    | "approved"
    | "rejected",
  onStartClick: () => void,
) {
  switch (status) {
    case "approved":
      return (
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-success" />
          <span className="text-bodySmall font-medium text-success">
            Verified
          </span>
        </div>
      );

    case "waiting_approval":
      return (
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-warning" />
          <span className="text-bodySmall font-medium text-warning">
            Under Review
          </span>
        </div>
      );

    case "uploading":
      return (
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          <span className="text-bodySmall font-medium text-primary">
            Uploading...
          </span>
        </div>
      );

    case "rejected":
      return (
        <div className="flex items-center gap-2">
          <XCircle className="h-5 w-5 text-error" />
          <span className="text-bodySmall font-medium text-error">
            Rejected
          </span>
        </div>
      );

    default:
      return (
        <Button intent="primary" size="sm" onClick={onStartClick}>
          Start
        </Button>
      );
  }
}
