import React, { useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

interface OTPInputProps {
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  error?: boolean;
  disabled?: boolean;
  className?: string;
}

export const OTPInput: React.FC<OTPInputProps> = ({
  length = 6,
  value = "",
  onChange,
  onComplete,
  error = false,
  disabled = false,
  className,
}) => {
  const [otp, setOtp] = useState<string[]>(
    value.split("").concat(Array(length).fill("")).slice(0, length),
  );
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (value) {
      const newOtp = value
        .split("")
        .concat(Array(length).fill(""))
        .slice(0, length);
      setOtp(newOtp);
    }
  }, [value, length]);

  const handleChange = (index: number, val: string) => {
    // Only allow numeric input
    if (val && !/^\d$/.test(val)) return;

    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    const otpValue = newOtp.join("");
    onChange?.(otpValue);

    // Auto-focus next input
    if (val && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Call onComplete when all fields are filled
    if (otpValue.length === length && !otpValue.includes("")) {
      onComplete?.(otpValue);
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Move to previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain");
    const digits = pastedData.replace(/\D/g, "").slice(0, length);

    if (digits) {
      const newOtp = digits
        .split("")
        .concat(Array(length).fill(""))
        .slice(0, length);
      setOtp(newOtp);

      const otpValue = newOtp.join("");
      onChange?.(otpValue);

      // Focus the last filled input or the first empty one
      const nextIndex = Math.min(digits.length, length - 1);
      inputRefs.current[nextIndex]?.focus();

      // Call onComplete if all fields are filled
      if (digits.length === length) {
        onComplete?.(otpValue);
      }
    }
  };

  return (
    <div className={cn("flex justify-center gap-2", className)}>
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
          disabled={disabled}
          className={cn(
            "h-14 w-12 rounded-lg border-2 text-center text-2xl font-semibold",
            "focus:outline-none focus:ring-2 focus:ring-offset-2",
            "transition-all duration-200",
            error
              ? "border-red-500 text-red-600 focus:ring-red-500"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-500",
            disabled && "cursor-not-allowed bg-gray-100 opacity-60",
            digit && "border-blue-500",
          )}
          aria-label={`Digit ${index + 1}`}
        />
      ))}
    </div>
  );
};
