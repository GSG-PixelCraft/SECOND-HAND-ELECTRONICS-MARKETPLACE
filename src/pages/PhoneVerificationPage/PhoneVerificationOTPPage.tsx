import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import { ROUTES } from "@/constants/routes";
import { useVerifyPhoneOTP, useSendPhoneOTP } from "@/services";
import { useAuthStore } from "@/stores/useAuthStore";

const OTP_LENGTH = 4;

type ApiLikeError = {
  response?: { status?: number };
  code?: string;
};

export function PhoneVerificationOTPPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const phoneNumber = searchParams.get("phone") ?? "";
  const setVerification = useAuthStore((state) => state.setVerification);

  const verifyPhoneOtp = useVerifyPhoneOTP();
  const resendPhoneOtp = useSendPhoneOTP();

  const [otp, setOtp] = useState<string[]>(
    Array.from({ length: OTP_LENGTH }, () => ""),
  );
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async () => {
    const code = otp.join("");
    if (!phoneNumber || code.length !== OTP_LENGTH) return;
    setError(null);

    try {
      await verifyPhoneOtp.mutateAsync({ phoneNumber, code });
      setVerification({
        phone: { phoneNumber, status: "verified" },
      });
      navigate(ROUTES.PROFILE);
    } catch (error: unknown) {
      const typedError = error as ApiLikeError;
      console.error("Phone OTP verify error:", error);
      if (typedError.response?.status === 400) {
        setError("Invalid or expired OTP code.");
      } else if (typedError.response?.status === 401) {
        setError("Please sign in first to verify your phone number.");
      } else if (typedError.response?.status === 404) {
        setError("Phone service not available. Please contact support.");
      } else if (typedError.response?.status === 500) {
        setError("Server error. Please try again later.");
      } else if (typedError.code === "NETWORK_ERROR") {
        setError("Network error. Please check your connection.");
      } else {
        setError("Invalid OTP code.");
      }
    }
  };

  const handleResend = async () => {
    if (!phoneNumber) return;
    setError(null);
    try {
      await resendPhoneOtp.mutateAsync(undefined);
      setOtp(Array.from({ length: OTP_LENGTH }, () => ""));
    } catch (error: unknown) {
      const typedError = error as ApiLikeError;
      console.error("Phone OTP resend error:", error);
      if (typedError.response?.status === 401) {
        setError("Please sign in first to resend the code.");
      } else if (typedError.response?.status === 404) {
        setError("Phone service not available. Please contact support.");
      } else if (typedError.response?.status === 500) {
        setError("Server error. Please try again later.");
      } else if (typedError.code === "NETWORK_ERROR") {
        setError("Network error. Please check your connection.");
      } else {
        setError("Failed to resend OTP code. Please try again.");
      }
    }
  };

  return (
    <PageLayout title="Phone OTP" maxWidth="md">
      <div className="mx-auto w-full max-w-md rounded-lg bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold">Enter verification code</h1>
        <p className="mt-2 text-sm text-gray-600">
          We sent a code to {phoneNumber || "your phone"}.
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
            otp.join("").length !== OTP_LENGTH || verifyPhoneOtp.isPending
          }
          className="mt-4 w-full rounded-md bg-blue-600 px-4 py-2 text-white disabled:bg-gray-300"
        >
          {verifyPhoneOtp.isPending ? "Verifying..." : "Verify"}
        </button>

        <button
          type="button"
          onClick={handleResend}
          disabled={!phoneNumber}
          className="mt-3 w-full text-sm text-blue-600"
        >
          Resend code
        </button>
      </div>
    </PageLayout>
  );
}
