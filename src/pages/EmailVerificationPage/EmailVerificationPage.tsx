import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import { ROUTES } from "@/constants/routes";
import { useSendEmailOTP, useVerifyEmailOTP } from "@/services";
import { useAuthStore } from "@/stores/useAuthStore";

const OTP_LENGTH = 4;

type ApiLikeError = {
  response?: { status?: number };
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
  const [error, setError] = useState<string | null>(null);

  const handleSendCode = async () => {
    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }
    setError(null);
    try {
      await sendEmailOtp.mutateAsync(undefined);
      setStep("otp");
      setOtp(Array.from({ length: OTP_LENGTH }, () => ""));
    } catch (error: unknown) {
      const typedError = error as ApiLikeError;
      console.error("Email OTP send error:", error);
      if (typedError.response?.status === 401) {
        setError("Please sign in first to send a verification code.");
      } else if (typedError.response?.status === 404) {
        setError(
          "Email verification service not available. Please contact the backend team to implement the verification endpoints.",
        );
      } else if (typedError.response?.status === 500) {
        setError("Backend server error. Please contact the backend team.");
      } else if (typedError.code === "ECONNABORTED") {
        setError(
          "Request timed out. Backend may be sleeping or slow. Please try again.",
        );
      } else if (
        typedError.code === "NETWORK_ERROR" ||
        typedError.message?.includes("ERR_NETWORK")
      ) {
        setError(
          "Cannot connect to backend server. Please ensure the backend is running and accessible.",
        );
      } else {
        setError(
          "Failed to send verification code. Backend verification endpoints may not be implemented yet.",
        );
      }
    }
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length !== OTP_LENGTH) return;
    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }
    setError(null);

    try {
      await verifyEmailOtp.mutateAsync({ email: email.trim(), code });
      setVerification({
        email: { email: email.trim(), status: "verified" },
      });
      navigate(ROUTES.PROFILE);
    } catch (error: unknown) {
      const typedError = error as ApiLikeError;
      console.error("Email OTP verify error:", error);
      if (typedError.response?.status === 400) {
        setError("Invalid or expired OTP code.");
      } else if (typedError.response?.status === 401) {
        setError("Please sign in first to verify your email.");
      } else if (typedError.response?.status === 404) {
        setError("Email service not available. Please contact support.");
      } else if (typedError.response?.status === 500) {
        setError("Server error. Please try again later.");
      } else if (typedError.code === "ECONNABORTED") {
        setError("Request timed out. Please try again.");
      } else if (typedError.code === "NETWORK_ERROR") {
        setError("Network error. Please check your connection.");
      } else {
        setError("Invalid OTP code.");
      }
    }
  };

  return (
    <PageLayout title="Verify Email" maxWidth="md">
      <div className="mx-auto w-full max-w-md rounded-lg bg-white p-6 shadow-sm">
        {step === "email" ? (
          <>
            <h1 className="text-xl font-semibold">Verify your email</h1>
            <p className="mt-2 text-sm text-gray-600">
              Enter your email. Verification will be validated by backend.
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
              onClick={handleVerify}
              disabled={
                otp.join("").length !== OTP_LENGTH || verifyEmailOtp.isPending
              }
              className="mt-4 w-full rounded-md bg-blue-600 px-4 py-2 text-white disabled:bg-gray-300"
            >
              {verifyEmailOtp.isPending ? "Verifying..." : "Verify"}
            </button>
            <button
              type="button"
              onClick={handleSendCode}
              className="mt-3 w-full text-sm text-blue-600"
            >
              Resend code
            </button>
          </>
        )}
      </div>
    </PageLayout>
  );
}

export default EmailVerificationPage;
