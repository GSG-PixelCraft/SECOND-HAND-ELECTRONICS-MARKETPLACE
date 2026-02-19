import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { authService } from "@/services/auth.service";
import type { AxiosError } from "axios";
import { PageLayout } from "@/components/layout/PageLayout";
import PageLayout from "@/components/layout/PageLayout";
import { Phone } from "lucide-react";

export default function OtpPhonePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const phoneNumber = (location.state as { phoneNumber?: string } | null)
    ?.phoneNumber;

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 4);
    const newOtp = pastedData.split("").concat(Array(4).fill("")).slice(0, 4);
    setOtp(newOtp);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");

    if (otpCode.length !== 4) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      if (!phoneNumber) {
        setSubmitError("Please go back and enter your phone number again.");
        setIsSubmitting(false);
        return;
      }
      const response = await authService.verifyCode({
        type: "phone_verification",
        phoneNumber,
        code: otpCode,
      });
      const resetToken = response.data.token;
      if (resetToken) {
        sessionStorage.setItem("reset_token", resetToken);
      }
      // Navigate to change password screen
      navigate(ROUTES.CHANGE_PASSWORD, { state: { phoneNumber } });
    } catch (error) {
      const apiError = error as AxiosError<{ message?: string }>;
      setSubmitError(
        apiError.response?.data?.message ??
          "Verification failed. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = () => {
    // TODO: Implement resend OTP API call
    setResendTimer(60);
    setOtp(["", "", "", ""]);
    inputRefs.current[0]?.focus();
  };

  return (
    <PageLayout title="Verify Phone" maxWidth="md">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Phone className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-h2 font-semibold">Verify Your Phone</h1>
          <p className="text-body text-muted-foreground">
            We've sent a 6-digit verification code to your phone number. Please
            enter it below.
          </p>
        </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="h-12 w-12 rounded-md border border-neutral-20 text-center text-h3 font-semibold focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                />
              ))}
            </div>

          <button
            type="submit"
            disabled={isSubmitting || otp.join("").length !== 4}
            className={`w-full rounded-md px-4 py-3 text-sm font-medium transition ${
              otp.join("").length === 4 && !isSubmitting
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "cursor-not-allowed bg-gray-200 text-gray-400"
            }`}
          >
            {isSubmitting ? "Verifying..." : "Verify"}
          </button>
        </form>

        {submitError ? (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {submitError}
          </p>
        ) : null}

        <div className="space-y-2 text-center text-xs text-gray-500">
          <div className="mb-4 flex items-center justify-center gap-1">
            Didn't receive the code?{" "}
            <button
              type="button"
              onClick={handleResend}
              disabled={resendTimer > 0}
              className="font-bold hover:underline disabled:cursor-not-allowed"
            >
              Resend
            </button>
          </div>
          <Link
            to={ROUTES.FORGOT_PASSWORD_EMAIL}
            className="text-gray-600 hover:underline"
          >
            Send code via email
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}
