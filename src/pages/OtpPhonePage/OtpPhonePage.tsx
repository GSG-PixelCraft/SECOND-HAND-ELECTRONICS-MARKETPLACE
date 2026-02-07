import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import PageLayout from "@/components/layout/PageLayout";
import { Phone } from "lucide-react";

export default function OtpPhonePage() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

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
    if (value && index < 5) {
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
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    const newOtp = pastedData.split("").concat(Array(6).fill("")).slice(0, 6);
    setOtp(newOtp);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: Implement OTP verification API call
      console.log("OTP verification:", otpCode);
      // Navigate to change password screen
      navigate(ROUTES.CHANGE_PASSWORD);
    } catch (error) {
      console.error("OTP verification error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = () => {
    // TODO: Implement resend OTP API call
    setResendTimer(60);
    setOtp(["", "", "", "", "", ""]);
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

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || otp.join("").length !== 6}
            intent="primary"
            size="lg"
          >
            {isSubmitting ? "Verifying..." : "Verify Code"}
          </Button>
        </form>

        <div className="space-y-2 text-center">
          {resendTimer > 0 ? (
            <p className="text-bodySmall text-muted-foreground">
              Resend code in {resendTimer}s
            </p>
          ) : (
            <button
              onClick={handleResend}
              className="text-bodySmall text-primary hover:underline"
            >
              Resend Verification Code
            </button>
          )}
          <div>
            <button
              onClick={() => navigate(ROUTES.FORGOT_PASSWORD_PHONE)}
              className="text-bodySmall text-primary hover:underline"
            >
              Change Phone Number
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
