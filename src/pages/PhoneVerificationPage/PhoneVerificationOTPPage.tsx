import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout/PageLayout";
import { ROUTES } from "@/constants/routes";
import { useVerifyPhoneOTP, useSendPhoneOTP } from "@/services";
import { OTPInput } from "@/components/forms/OTPInput";
import { useAuthStore } from "@/stores/useAuthStore";

const OTP_LENGTH = 4;

type ApiLikeError = {
  response?: { status?: number; data?: { message?: string } };
  code?: string;
  message?: string;
};

export function PhoneVerificationOTPPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setVerification = useAuthStore((state) => state.setVerification);

  const verifyMutation = useVerifyPhoneOTP();
  const resendMutation = useSendPhoneOTP();

  const phoneNumber = searchParams.get("phone") ?? "";
  // OTP handled by component; we use onComplete and remount key on resend
  const [otpKey, setOtpKey] = useState(0);
  const [timer, setTimer] = useState(60);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!phoneNumber) {
      navigate(ROUTES.PROFILE);
      return;
    }
    resendMutation
      .mutateAsync({ otpType: "phone_verification", phoneNumber })
      .catch(() => setError("Failed to send verification code."));

    const interval = setInterval(() => setTimer((prev) => (prev > 0 ? prev - 1 : 0)), 1000);
    return () => clearInterval(interval);
  }, [phoneNumber, navigate, resendMutation]);

  const handleComplete = async (code: string) => {
    if (!phoneNumber || code.length !== OTP_LENGTH) return;
    setError(null);
    try {
      await verifyMutation.mutateAsync({ code, phoneNumber, type: "phone_verification" });
      setVerification({ phone: { phoneNumber, status: "verified" } });
      navigate(ROUTES.PROFILE);
    } catch (err: unknown) {
      const typedError = err as ApiLikeError;
      setError(typedError.response?.data?.message || typedError.message || "Invalid OTP code.");
    }
  };

  const handleResend = async () => {
    if (timer > 0 || !phoneNumber) return;
    try {
      await resendMutation.mutateAsync({ otpType: "phone_verification", phoneNumber });
      setTimer(60);
      setOtpKey((k) => k + 1);
      setError(null);
    } catch (err: unknown) {
      const typedError = err as ApiLikeError;
      setError(typedError.response?.data?.message || typedError.message || "Failed to resend OTP.");
    }
  };

  return (
    <PageLayout title="Phone OTP" maxWidth="md">
      <div className="mx-auto w-full max-w-md rounded-lg bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold">Enter verification code</h1>
        <p className="mt-2 text-sm text-gray-600">We sent a code to {phoneNumber || "your phone"}.</p>

        <div className="mt-4">
          <OTPInput key={otpKey} length={OTP_LENGTH} onComplete={handleComplete} />
        </div>

        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

        <div className="mt-3 text-center text-sm text-gray-600">
          Enter the {OTP_LENGTH}-digit code above.
        </div>

        <button
          type="button"
          onClick={handleResend}
          disabled={!phoneNumber || timer > 0 || resendMutation.isPending}
          className="mt-3 w-full text-sm text-blue-600"
        >
          {timer > 0 ? `Resend in ${timer}s` : "Resend code"}
        </button>
      </div>
    </PageLayout>
  );
}
