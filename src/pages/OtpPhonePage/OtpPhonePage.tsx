import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

export default function OtpPhonePage() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
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
    setOtp(["", "", "", ""]);
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="flex items-center justify-between px-6 py-5">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-sm text-gray-700 hover:text-gray-900"
        >
          Back
        </button>
        <Link
          to={ROUTES.HOME}
          className="text-base font-semibold text-blue-600"
        >
          Logo
        </Link>
        <span className="w-10" aria-hidden="true" />
      </div>

      <div className="flex items-start justify-center px-5 py-10">
        <div className="w-full max-w-md space-y-6 text-center">
          <h1 className="text-2xl font-semibold text-gray-900">Verify Code</h1>
          <p className="text-sm text-gray-400">
            Enter the 4-digit code we sent to your phone.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center gap-3">
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
                  className="h-10 w-10 rounded-md border border-gray-200 text-center text-base font-semibold text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
      </div>
    </div>
  );
}
