import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { OTPInput } from "@/components/forms";
import { useVerifyEmailOTP, useSendEmailOTP } from "@/services";
import { useAuthStore } from "@/stores";
import { ROUTES } from "@/constants/routes";
import { MESSAGES } from "@/constants/messages";
import { Dialog } from "@/components/ui/dialog";
import { CheckCircle } from "lucide-react";

export const EmailVerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const email = user?.email;

  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const [showSuccess, setShowSuccess] = useState(false);

  const verifyMutation = useVerifyEmailOTP();
  const resendMutation = useSendEmailOTP();
  const setVerification = useAuthStore((state) => state.setVerification);

  useEffect(() => {
    if (!email) {
      navigate(ROUTES.SIGN_IN);
      return;
    }

    // Send OTP on mount
    resendMutation.mutate({ email });

    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, navigate]);

  const handleComplete = async (code: string) => {
    if (!email) return;

    try {
      await verifyMutation.mutateAsync({ code, email });
      setVerification({
        email: {
          email,
          status: "verified",
          verifiedAt: new Date().toISOString(),
        },
      });
      setShowSuccess(true);
      setTimeout(() => {
        navigate(ROUTES.VERIFY);
      }, 2000);
    } catch (error) {
      console.error("Verification failed:", error);
    }
  };

  const handleResend = async () => {
    if (timer > 0 || !email) return;

    try {
      await resendMutation.mutateAsync({ email });
      setTimer(60);
      setOtp("");
    } catch (error) {
      console.error("Failed to resend OTP:", error);
    }
  };

  if (!email) return null;

  return (
    <>
      <PageLayout title={MESSAGES.VERIFICATION.EMAIL.TITLE}>
        <div className="mx-auto max-w-md">
          <div className="rounded-lg bg-white p-8 shadow-sm">
            <div className="space-y-6">
              <div className="space-y-2 text-center">
                <h2 className="text-xl font-medium text-[#101010]">
                  {MESSAGES.VERIFICATION.EMAIL.OTP_SENT}
                </h2>
                <p className="text-sm text-[#828282]">
                  {MESSAGES.VERIFICATION.EMAIL.DESCRIPTION}
                  <br />
                  <span className="font-medium text-[#3d3d3d]">{email}</span>
                </p>
              </div>

              <OTPInput
                length={6}
                value={otp}
                onChange={setOtp}
                onComplete={handleComplete}
                error={verifyMutation.isError}
                disabled={verifyMutation.isPending}
              />

              {verifyMutation.isError && (
                <p className="text-center text-sm text-red-500">
                  {MESSAGES.ERROR.INVALID_OTP}
                </p>
              )}

              <div className="space-y-4">
                <Button
                  onClick={() => handleComplete(otp)}
                  disabled={otp.length !== 6 || verifyMutation.isPending}
                  size="lg"
                  className="w-full"
                >
                  {verifyMutation.isPending ? "Verifying..." : "Verify Email"}
                </Button>

                <div className="text-center">
                  {timer > 0 ? (
                    <p className="text-sm text-[#828282]">
                      Resend code in {timer}s
                    </p>
                  ) : (
                    <button
                      onClick={handleResend}
                      disabled={resendMutation.isPending}
                      className="text-sm font-medium text-[#2563eb] hover:underline disabled:opacity-50"
                    >
                      {resendMutation.isPending ? "Sending..." : "Resend Code"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageLayout>

      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <div className="space-y-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-medium text-[#101010]">
              {MESSAGES.SUCCESS.EMAIL_VERIFIED}
            </h3>
            <p className="text-sm text-[#828282]">
              Your email has been successfully verified
            </p>
          </div>
        </div>
      </Dialog>
    </>
  );
};
