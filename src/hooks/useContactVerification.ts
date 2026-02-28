import { useCallback, useEffect, useMemo, useState } from "react";
import {
  useSendEmailOTP,
  useSendPhoneOTP,
  useVerifyEmailOTP,
  useVerifyPhoneOTP,
  useSendChangePhoneOTP,
  useVerifyChangePhoneOTP,
} from "@/services/verification.service";
import { getBackendErrorMessage } from "@/lib/api-error";
import { getToken } from "@/lib/storage";
import { COUNTRY_DIAL_OPTIONS, OTP_LENGTH, createEmptyOtp } from "@/constants/verification";

type PhoneStep = "input" | "otp" | "change" | "success";
type EmailStep = "input" | "otp" | "success";

interface FlowBase {
  isOpen: boolean;
  open: (value?: string) => void;
  close: () => void;
  value: string;
  setValue: (value: string) => void;
  otp: string[];
  onOtpChange: (index: number, digit: string) => void;
  error: string | null;
  requestCode: () => Promise<void>;
  verifyCode: () => Promise<void>;
  resendCode: () => Promise<void>;
  isSending: boolean;
  isVerifying: boolean;
}

export interface PhoneVerificationFlow extends FlowBase {
  type: "phone";
  step: PhoneStep;
  countryDialCode: string;
  setCountryDialCode: (code: string) => void;
  startChange: () => void;
  hasDialOptions: true;
}

export interface EmailVerificationFlow extends FlowBase {
  type: "email";
  step: EmailStep;
  hasDialOptions: false;
}

interface FlowOptions {
  initialValue?: string;
  onVerified?: (value: string) => void;
}

export const usePhoneVerificationFlow = ({
  initialValue = "",
  onVerified,
}: FlowOptions = {}): PhoneVerificationFlow => {
  const sendMutation = useSendPhoneOTP();
  const sendChangeMutation = useSendChangePhoneOTP();
  const verifyMutation = useVerifyPhoneOTP();
  const verifyChangeMutation = useVerifyChangePhoneOTP();

  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<PhoneStep>("input");
  const [value, setValue] = useState(initialValue);
  const [otp, setOtp] = useState(createEmptyOtp());
  const [error, setError] = useState<string | null>(null);
  const [countryDialCode, setCountryDialCode] = useState(
    COUNTRY_DIAL_OPTIONS[0]?.dialCode ?? "+970",
  );

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const open = useCallback(
    (nextValue?: string) => {
      setValue(nextValue ?? initialValue ?? "");
      setOtp(createEmptyOtp());
      setStep("input");
      setError(null);
      setIsOpen(true);
    },
    [initialValue],
  );

  const close = useCallback(() => {
    setIsOpen(false);
    setStep("input");
    setError(null);
    setOtp(createEmptyOtp());
  }, []);

  const formattedPhone = useMemo(() => {
    const trimmed = value.trim();
    if (!trimmed) return "";
    if (trimmed.startsWith("+")) return trimmed;
    return `${countryDialCode}${trimmed}`;
  }, [countryDialCode, value]);

  const ensurePhonePresent = useCallback(() => {
    if (!formattedPhone) {
      setError("Please enter your phone number.");
      return false;
    }
    setError(null);
    return true;
  }, [formattedPhone]);

  const requestCode = useCallback(async () => {
    if (!ensurePhonePresent()) return;
    if (!getToken()) {
      setError("Please sign in first to send a verification code.");
      return;
    }
    try {
      if (step === "change") {
        await sendChangeMutation.mutateAsync({ phoneNumber: formattedPhone });
      } else {
        await sendMutation.mutateAsync({ otpType: "phone_verification" });
      }
      setStep("otp");
      setOtp(createEmptyOtp());
    } catch (error) {
      setError(
        getBackendErrorMessage(error) ?? "Failed to send verification code.",
      );
    }
  }, [ensurePhonePresent, formattedPhone, sendChangeMutation, sendMutation, step]);

  const verifyCode = useCallback(async () => {
    const code = otp.join("");
    if (code.length !== OTP_LENGTH) return;
    if (!ensurePhonePresent()) return;

    try {
      if (step === "change") {
        await verifyChangeMutation.mutateAsync({ code, phoneNumber: formattedPhone });
      } else {
        await verifyMutation.mutateAsync({ code, phoneNumber: formattedPhone, type: "phone_verification" });
      }
      onVerified?.(formattedPhone);
      setStep("success");
      setError(null);
    } catch (error) {
      setError(
        getBackendErrorMessage(error) ?? "Verification failed. Try again.",
      );
    }
  }, [ensurePhonePresent, formattedPhone, onVerified, otp, step, verifyChangeMutation, verifyMutation]);

  const resendCode = useCallback(async () => {
    await requestCode();
  }, [requestCode]);

  const onOtpChange = useCallback((index: number, digit: string) => {
    setOtp((current) => {
      const next = [...current];
      next[index] = digit.replace(/\D/g, "").slice(0, 1);
      return next;
    });
  }, []);

  const startChange = useCallback(() => {
    setStep("change");
    setError(null);
  }, []);

  return {
    type: "phone",
    hasDialOptions: true,
    isOpen,
    open,
    close,
    step,
    value,
    setValue,
    otp,
    onOtpChange,
    error,
    requestCode,
    verifyCode,
    resendCode,
    isSending: sendMutation.isPending,
    isVerifying: verifyMutation.isPending,
    countryDialCode,
    setCountryDialCode,
    startChange,
  };
};

export const useEmailVerificationFlow = ({
  initialValue = "",
  onVerified,
}: FlowOptions = {}): EmailVerificationFlow => {
  const sendMutation = useSendEmailOTP();
  const verifyMutation = useVerifyEmailOTP();

  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<EmailStep>("input");
  const [value, setValue] = useState(initialValue);
  const [otp, setOtp] = useState(createEmptyOtp());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const open = useCallback(
    (nextValue?: string) => {
      setValue(nextValue ?? initialValue ?? "");
      setOtp(createEmptyOtp());
      setStep("input");
      setError(null);
      setIsOpen(true);
    },
    [initialValue],
  );

  const close = useCallback(() => {
    setIsOpen(false);
    setStep("input");
    setError(null);
    setOtp(createEmptyOtp());
  }, []);

  const formattedEmail = useMemo(() => value.trim(), [value]);

  const ensureEmailPresent = useCallback(() => {
    if (!formattedEmail) {
      setError("Please enter your email.");
      return false;
    }
    setError(null);
    return true;
  }, [formattedEmail]);

  const requestCode = useCallback(async () => {
    if (!ensureEmailPresent()) return;
    if (!getToken()) {
      setError("Please sign in first to send a verification code.");
      return;
    }
    try {
      await sendMutation.mutateAsync({ otpType: "email_verification" });
      setStep("otp");
      setOtp(createEmptyOtp());
    } catch (error) {
      setError(
        getBackendErrorMessage(error) ?? "Failed to send verification code.",
      );
    }
  }, [ensureEmailPresent, sendMutation]);

  const verifyCode = useCallback(async () => {
    const code = otp.join("");
    if (code.length !== OTP_LENGTH) return;
    if (!ensureEmailPresent()) return;

    try {
      await verifyMutation.mutateAsync({
        code,
        email: formattedEmail,
        type: "email_verification",
      });
      onVerified?.(formattedEmail);
      setStep("success");
      setError(null);
    } catch (error) {
      setError(
        getBackendErrorMessage(error) ?? "Verification failed. Try again.",
      );
    }
  }, [ensureEmailPresent, formattedEmail, onVerified, otp, verifyMutation]);

  const resendCode = useCallback(async () => {
    await requestCode();
  }, [requestCode]);

  const onOtpChange = useCallback((index: number, digit: string) => {
    setOtp((current) => {
      const next = [...current];
      next[index] = digit.replace(/\D/g, "").slice(0, 1);
      return next;
    });
  }, []);

  return {
    type: "email",
    hasDialOptions: false,
    isOpen,
    open,
    close,
    step,
    value,
    setValue,
    otp,
    onOtpChange,
    error,
    requestCode,
    verifyCode,
    resendCode,
    isSending: sendMutation.isPending,
    isVerifying: verifyMutation.isPending,
  };
};
