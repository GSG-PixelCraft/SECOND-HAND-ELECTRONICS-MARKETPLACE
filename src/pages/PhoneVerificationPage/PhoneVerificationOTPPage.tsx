import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { OTPInput } from "@/components/forms";
import { Text } from "@/components/ui/text";
import { Span } from "@/components/ui/span";
import { useVerifyPhoneOTP, useSendPhoneOTP } from "@/services";
import { useAuthStore } from "@/stores";
import { ROUTES } from "@/constants/routes";
import { MESSAGES } from "@/constants/messages";
import { Dialog } from "@/components/ui/dialog";
import { CheckCircle } from "lucide-react";

export const PhoneVerificationOTPPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const phoneNumber = location.state?.phoneNumber;

  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const [showSuccess, setShowSuccess] = useState(false);

  const verifyMutation = useVerifyPhoneOTP();
  const resendMutation = useSendPhoneOTP();
  const setVerification = useAuthStore((state) => state.setVerification);

  useEffect(() => {
    if (!phoneNumber) {
      navigate(ROUTES.VERIFY_PHONE);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [phoneNumber, navigate]);

  const handleComplete = async (code: string) => {
    try {
      await verifyMutation.mutateAsync({ code, phoneNumber });
      setVerification({
        phone: {
          phoneNumber,
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
    if (timer > 0) return;

    try {
      await resendMutation.mutateAsync({ phoneNumber });
      setTimer(60);
      setOtp("");
    } catch (error) {
      console.error("Failed to resend OTP:", error);
    }
  };

  return (
    <>
      <PageLayout title="Enter Verification Code">
        <div className="mx-auto max-w-md">
          <div className="rounded-lg bg-white p-8 shadow-sm">
            <div className="space-y-6">
              <div className="space-y-2 text-center">
                <h2 className="text-xl font-medium text-[#101010]">
                  {MESSAGES.VERIFICATION.PHONE.ENTER_CODE}
                </h2>
                <Text className="text-sm text-[#828282]">
                  We've sent a 6-digit code to{" "}
                  <Span className="font-medium text-[#3d3d3d]">
                    {phoneNumber}
                  </Span>
                </Text>
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
                <Text className="text-center text-sm text-red-500">
                  {MESSAGES.ERROR.INVALID_OTP}
                </Text>
              )}

              <div className="space-y-4">
                <Button
                  onClick={() => handleComplete(otp)}
                  disabled={otp.length !== 6 || verifyMutation.isPending}
                  size="lg"
                  className="w-full"
                >
                  {verifyMutation.isPending ? "Verifying..." : "Verify"}
                </Button>

                <div className="text-center">
                  {timer > 0 ? (
                    <Text className="text-sm text-[#828282]">
                      Resend code in {timer}s
                    </Text>
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
              {MESSAGES.SUCCESS.PHONE_VERIFIED}
            </h3>
            <Text className="text-sm text-[#828282]">
              Your phone number has been successfully verified
            </Text>
          </div>
        </div>
      </Dialog>
    </>
  );
};
