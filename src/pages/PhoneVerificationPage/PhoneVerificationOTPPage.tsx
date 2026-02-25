import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import { ROUTES } from "@/constants/routes";
import { useVerifyPhoneOTP, useSendPhoneOTP } from "@/services";
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
  const user = useAuthStore((state) => state.user);
  const phoneNumber = searchParams.get("phone") || user?.phoneNumber || "";

  const [otp, setOtp] = useState<string[]>(
    Array.from({ length: OTP_LENGTH }, () => ""),
  );
  const [timer, setTimer] = useState(60);
  const [error, setError] = useState<string | null>(null);

export function PhoneVerificationOTPPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const phoneNumber = searchParams.get("phone") ?? "";
  const setVerification = useAuthStore((state) => state.setVerification);

  useEffect(() => {
    if (!phoneNumber) {
      navigate(ROUTES.PROFILE);
      return;
    }

    resendMutation.mutateAsync({ otpType: "phone_verification" }).catch(() => {
      setError("Failed to send verification code.");
    });

    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phoneNumber, navigate]);

  const handleComplete = async (code: string) => {
    if (!phoneNumber) return;
    setError(null);

    try {
      await verifyMutation.mutateAsync({
        code,
        phoneNumber,
        type: "phone_verification",
      });
      setVerification({
        phone: { phoneNumber, status: "verified" },
      });
      navigate(ROUTES.PROFILE);
    } catch (err: unknown) {
      const typedError = err as ApiLikeError;
      setError(
        typedError.response?.data?.message ||
          typedError.message ||
          "Invalid OTP code.",
      );
    }
  };

  const handleResend = async () => {
    if (timer > 0 || !phoneNumber) return;

    try {
      await resendMutation.mutateAsync({ otpType: "phone_verification" });
      setTimer(60);
      setOtp(Array.from({ length: OTP_LENGTH }, () => ""));
      setError(null);
    } catch (err: unknown) {
      const typedError = err as ApiLikeError;
      setError(
        typedError.response?.data?.message ||
          typedError.message ||
          "Failed to resend OTP.",
      );
    }
  };

  const otpCode = otp.join("");

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
          onClick={() => handleComplete(otpCode)}
          disabled={otpCode.length !== OTP_LENGTH || verifyMutation.isPending}
          className="mt-4 w-full rounded-md bg-blue-600 px-4 py-2 text-white disabled:bg-gray-300"
        >
          {verifyMutation.isPending ? "Verifying..." : "Verify"}
        </button>

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
