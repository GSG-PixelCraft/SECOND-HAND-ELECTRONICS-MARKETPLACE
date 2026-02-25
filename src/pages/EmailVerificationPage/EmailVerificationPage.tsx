import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import { ROUTES } from "@/constants/routes";
import { useSendEmailOTP, useVerifyEmailOTP } from "@/services";
import { useAuthStore } from "@/stores/useAuthStore";

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
  const [otp, setOtp] = useState<string[]>(
    Array.from({ length: OTP_LENGTH }, () => ""),
  );
  const [step, setStep] = useState<"email" | "otp">("email");
  const [timer, setTimer] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleSendCode = async () => {
    if (!email.trim()) {
      setError("Please enter your email.");
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
      setError(
        typedError.response?.data?.message ||
          typedError.message ||
          "Failed to send verification code.",
      );
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
    if (!email) return;

    try {
      await verifyEmailOtp.mutateAsync({
        code,
        email,
        type: "email_verification",
      });
      setVerification({
        email: {
          email,
          status: "verified",
          verifiedAt: new Date().toISOString(),
        },
      });
      navigate(ROUTES.VERIFY);
    } catch (err: unknown) {
      const typedError = err as ApiLikeError;
      setError(
        typedError.response?.data?.message ||
          typedError.message ||
          "Verification failed.",
      );
    }
  };

  const handleResend = async () => {
    if (timer > 0 || !email) return;

    try {
      await sendEmailOtp.mutateAsync({ otpType: "email_verification" });
      setTimer(60);
      setOtp(Array.from({ length: OTP_LENGTH }, () => ""));
    } catch (err: unknown) {
      const typedError = err as ApiLikeError;
      setError(
        typedError.response?.data?.message ||
          typedError.message ||
          "Failed to resend code.",
      );
    }
  };

  const otpCode = otp.join("");

  return (
    <PageLayout title="Verify Email" maxWidth="md">
      <div className="mx-auto w-full max-w-md rounded-lg bg-white p-6 shadow-sm">
        {step === "email" ? (
          <>
            <h1 className="text-xl font-semibold">Verify your email</h1>
            <p className="mt-2 text-sm text-gray-600">
              Enter your email address to receive a verification code.
            </p>
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
            <p className="mt-2 text-sm text-gray-600">
              We sent a code to {email}.
            </p>
            <div className="mt-4 flex justify-center gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(event) => {
                    const value = event.target.value.replace(/\D/g, "");
                    setOtp((current) => {
                      const next = [...current];
                      next[index] = value;
                      return next;
                    });
                  }}
                  className="h-11 w-11 rounded-md border text-center"
                />
              ))}
            </div>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            <button
              type="button"
              onClick={() => handleComplete(otpCode)}
              disabled={
                otpCode.length !== OTP_LENGTH || verifyEmailOtp.isPending
              }
              className="mt-4 w-full rounded-md bg-blue-600 px-4 py-2 text-white disabled:bg-gray-300"
            >
              {verifyEmailOtp.isPending ? "Verifying..." : "Verify Email"}
            </button>
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
