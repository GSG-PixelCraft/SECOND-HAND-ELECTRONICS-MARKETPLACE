import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout/PageLayout";
import { ROUTES } from "@/constants/routes";
import { useSendEmailOTP, useVerifyEmailOTP } from "@/services";
import { useAuthStore } from "@/stores/useAuthStore";
import { getToken } from "@/lib/storage";
import { OTPInput } from "@/components/forms/OTPInput";

const OTP_LENGTH = 4;

type ApiLikeError = {
  response?: { status?: number; data?: { message?: string } };
  code?: string;
  message?: string;
};

export function EmailVerificationPage() {
  const navigate = useNavigate();
  const setVerification = useAuthStore((state) => state.setVerification);

  const sendEmailOtp = useSendEmailOTP();
  const verifyEmailOtp = useVerifyEmailOTP();

  const [email, setEmail] = useState("");
  // OTP handled by component; we use onComplete
  const [step, setStep] = useState<"email" | "otp">("email");
  const [timer, setTimer] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleSendCode = async () => {
    const trimmed = email.trim();
    if (!trimmed) {
      setError("Please enter your email.");
      return;
    }
    if (!getToken()) {
      setError("Please sign in first to send a verification code.");
      return;
    }
    setError(null);
    try {
      await sendEmailOtp.mutateAsync({ otpType: "email_verification" });
      setStep("otp");
      setTimer(60);
      setOtp(Array.from({ length: OTP_LENGTH }, () => ""));
    } catch (err: unknown) {
      const typedError = err as ApiLikeError;
      setError(typedError.response?.data?.message || typedError.message || "Failed to send verification code.");
    }
  };

  useEffect(() => {
    if (step !== "otp" || timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleComplete = async (code: string) => {
    const trimmed = email.trim();
    if (!trimmed || code.length !== OTP_LENGTH) return;
    setError(null);
    try {
      await verifyEmailOtp.mutateAsync({ code, email: trimmed, type: "email_verification" });
      setVerification({
        email: { email: trimmed, status: "verified", verifiedAt: new Date().toISOString() },
      });
      navigate(ROUTES.VERIFY);
    } catch (err: unknown) {
      const typedError = err as ApiLikeError;
      setError(typedError.response?.data?.message || typedError.message || "Verification failed.");
    }
  };

  const handleResend = async () => {
    const trimmed = email.trim();
    if (timer > 0 || !trimmed) return;
    if (!getToken()) {
      setError("Please sign in first to resend a verification code.");
      return;
    }
    try {
      await sendEmailOtp.mutateAsync({ otpType: "email_verification" });
      setTimer(60);
      setOtp(Array.from({ length: OTP_LENGTH }, () => ""));
      setError(null);
    } catch (err: unknown) {
      const typedError = err as ApiLikeError;
      setError(typedError.response?.data?.message || typedError.message || "Failed to resend code.");
    }
  };

  return (
    <PageLayout title="Verify Email" maxWidth="md">
      <div className="mx-auto w-full max-w-md rounded-lg bg-white p-6 shadow-sm">
        {step === "email" ? (
          <>
            <h1 className="text-xl font-semibold">Verify your email</h1>
            <p className="mt-2 text-sm text-gray-600">Enter your email address to receive a verification code.</p>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@example.com"
              className="mt-4 w-full rounded-md border px-3 py-2"
            />
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            <button
              type="button"
              onClick={handleSendCode}
              disabled={!email.trim() || sendEmailOtp.isPending}
              className="mt-4 w-full rounded-md bg-blue-600 px-4 py-2 text-white disabled:bg-gray-300"
            >
              {sendEmailOtp.isPending ? "Sending..." : "Send code"}
            </button>
          </>
        ) : (
          <>
            <h1 className="text-xl font-semibold">Enter verification code</h1>
            <p className="mt-2 text-sm text-gray-600">We sent a code to {email}.</p>
            <div className="mt-4">
              <OTPInput length={OTP_LENGTH} onComplete={handleComplete} />
            </div>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            <div className="mt-3 text-center text-sm text-gray-600">
              Enter the {OTP_LENGTH}-digit code above.
            </div>
            <div className="mt-3 text-center text-sm">
              {timer > 0 ? (
                <span className="text-gray-600">Resend code in {timer}s</span>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={sendEmailOtp.isPending}
                  className="text-blue-600 disabled:opacity-50"
                >
                  {sendEmailOtp.isPending ? "Sending..." : "Resend code"}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </PageLayout>
  );
}
