import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  CheckCircle,
  IdCard,
  Mail,
  MapPin,
  Pencil,
  Smartphone,
} from "lucide-react";
import { EditProfileForm } from "./EditProfileForm";
import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/stores/useAuthStore";
import {
  useSendEmailOTP,
  useSendPhoneOTP,
  useVerifyEmailOTP,
  useVerifyPhoneOTP,
} from "@/services";

type VerificationStep = "input" | "otp" | "success";

const OTP_LENGTH = 4;
const createEmptyOtp = () => Array.from({ length: OTP_LENGTH }, () => "");

type ApiLikeError = {
  response?: {
    data?: {
      message?: unknown;
      error?: unknown;
    };
  };
  message?: unknown;
};

const getBackendErrorMessage = (error: unknown): string | null => {
  if (!error || typeof error !== "object") return null;

  const typedError = error as ApiLikeError;
  const backendMessage =
    typedError.response?.data?.message ??
    typedError.response?.data?.error ??
    typedError.message;

  if (typeof backendMessage !== "string") return null;
  const trimmedMessage = backendMessage.trim();
  return trimmedMessage ? trimmedMessage : null;
};

function OtpInputs({
  value,
  onChange,
  idPrefix,
}: {
  value: string[];
  onChange: (index: number, char: string) => void;
  idPrefix: string;
}) {
  return (
    <div className="mb-6 flex justify-center space-x-2">
      {value.map((digit, index) => (
        <input
          key={`${idPrefix}-${index}`}
          id={`${idPrefix}-${index}`}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(event) => {
            const input = event.target.value.replace(/\D/g, "");
            onChange(index, input);
            if (input && index < value.length - 1) {
              const next = document.getElementById(
                `${idPrefix}-${index + 1}`,
              ) as HTMLInputElement | null;
              next?.focus();
            }
          }}
          onKeyDown={(event) => {
            if (event.key === "Backspace" && !value[index] && index > 0) {
              const prev = document.getElementById(
                `${idPrefix}-${index - 1}`,
              ) as HTMLInputElement | null;
              prev?.focus();
            }
          }}
          className="h-12 w-12 rounded-md border text-center text-lg outline-none focus:border-blue-500"
        />
      ))}
    </div>
  );
}

export default function ProfileDetails() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const verification = useAuthStore((state) => state.verification);
  const setVerification = useAuthStore((state) => state.setVerification);

  const [isEditing, setIsEditing] = React.useState(false);

  const [showPhoneVerification, setShowPhoneVerification] =
    React.useState(false);
  const [phoneStep, setPhoneStep] = React.useState<VerificationStep>("input");
  const [phoneNumber, setPhoneNumber] = React.useState(user?.phoneNumber ?? "");
  const [phoneOtp, setPhoneOtp] = React.useState<string[]>(createEmptyOtp());
  const [phoneError, setPhoneError] = React.useState<string | null>(null);

  const [showEmailVerification, setShowEmailVerification] =
    React.useState(false);
  const [emailStep, setEmailStep] = React.useState<VerificationStep>("input");
  const [email, setEmail] = React.useState(user?.email ?? "");
  const [emailOtp, setEmailOtp] = React.useState<string[]>(createEmptyOtp());
  const [emailError, setEmailError] = React.useState<string | null>(null);

  const sendPhoneMutation = useSendPhoneOTP();
  const verifyPhoneMutation = useVerifyPhoneOTP();
  const sendEmailMutation = useSendEmailOTP();
  const verifyEmailMutation = useVerifyEmailOTP();

  const closePhoneOverlay = () => {
    setShowPhoneVerification(false);
    setPhoneStep("input");
    setPhoneOtp(createEmptyOtp());
    setPhoneError(null);
  };

  const closeEmailOverlay = () => {
    setShowEmailVerification(false);
    setEmailStep("input");
    setEmailOtp(createEmptyOtp());
    setEmailError(null);
  };

  const sendPhoneCode = async () => {
    const enteredPhone = phoneNumber.trim();
    if (!enteredPhone) {
      setPhoneError("Please enter your phone number.");
      return;
    }
    setPhoneError(null);

    try {
      await sendPhoneMutation.mutateAsync(undefined);
      setPhoneStep("otp");
      setPhoneOtp(createEmptyOtp());
    } catch (error: unknown) {
      setPhoneError(
        getBackendErrorMessage(error) ?? "Failed to send verification code.",
      );
    }
  };

  const verifyPhoneCode = async () => {
    const code = phoneOtp.join("");
    const enteredPhone = phoneNumber.trim();
    if (code.length !== OTP_LENGTH) return;
    if (!enteredPhone) {
      setPhoneError("Please enter your phone number.");
      return;
    }
    setPhoneError(null);

    try {
      await verifyPhoneMutation.mutateAsync({
        phoneNumber: enteredPhone,
        code,
      });
      setVerification({
        phone: {
          phoneNumber: enteredPhone,
          status: "verified",
        },
      });
      setPhoneStep("success");
    } catch (error: unknown) {
      setPhoneError(
        getBackendErrorMessage(error) ?? "Invalid verification code.",
      );
    }
  };

  const sendEmailCode = async () => {
    const enteredEmail = email.trim();
    if (!enteredEmail) {
      setEmailError("Please enter your email.");
      return;
    }
    setEmailError(null);

    try {
      await sendEmailMutation.mutateAsync(undefined);
      setEmailStep("otp");
      setEmailOtp(createEmptyOtp());
    } catch (error: unknown) {
      setEmailError(
        getBackendErrorMessage(error) ?? "Failed to send verification code.",
      );
    }
  };

  const verifyEmailCode = async () => {
    const code = emailOtp.join("");
    const enteredEmail = email.trim();
    if (code.length !== OTP_LENGTH) return;
    if (!enteredEmail) {
      setEmailError("Please enter your email.");
      return;
    }
    setEmailError(null);

    try {
      await verifyEmailMutation.mutateAsync({
        email: enteredEmail,
        code,
      });
      setVerification({
        email: {
          email: enteredEmail,
          status: "verified",
        },
      });
      setEmailStep("success");
    } catch (error: unknown) {
      setEmailError(
        getBackendErrorMessage(error) ?? "Invalid verification code.",
      );
    }
  };

  const verifiedItems = [
    verification.phone.status === "verified",
    verification.identity.status === "approved",
    verification.email.status === "verified",
  ];
  const profileCompletion = Math.round(
    (verifiedItems.filter(Boolean).length / verifiedItems.length) * 100,
  );

  if (isEditing) {
    return (
      <EditProfileForm
        onCancel={() => setIsEditing(false)}
        onSubmit={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-lg border border-neutral-20 bg-white p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-muted-10" />

            <div className="space-y-1">
              <p className="text-bodyLg font-semibold text-neutral-foreground">
                {user?.name || "User"}
              </p>

              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-muted-foreground" />
                <Span variant="caption">Palestine</Span>
              </div>

              <div className="flex items-center gap-2 text-caption text-muted-foreground">
                <Calendar size={14} />
                <span>Member</span>
              </div>
            </div>
          </div>

          <Button
            type="button"
            onClick={() => setIsEditing(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-10 text-primary transition hover:bg-primary-20"
          >
            <Pencil size={18} />
          </Button>
        </div>
      </section>

      <section className="rounded-lg border border-neutral-20 bg-white p-5">
        <div className="mb-3 flex items-center justify-between">
          <Text variant="body" className="font-semibold">
            Profile Completion
          </Text>
          <p className="text-body font-semibold text-primary">
            {profileCompletion}%
          </p>
        </div>

        <div className="h-2 w-full rounded-full bg-neutral-10">
          <div
            className="h-2 rounded-full bg-primary transition-all"
            style={{ width: `${profileCompletion}%` }}
          />
        </div>
      </section>

      <section className="rounded-lg border border-neutral-20 bg-white p-5">
        <Text variant="body" className="mb-1 font-semibold">
          Trust indicators
        </Text>
        <p className="mb-4 text-caption text-muted-foreground">
          Verify your identity, mobile and email to get a verified badge.
        </p>

        <div className="grid grid-cols-3 gap-4">
          {[
            {
              key: "phone",
              label: "Verified Phone",
              icon: Smartphone,
              verified: verification.phone.status === "verified",
            },
            {
              key: "identity",
              label: "Verified Identity",
              icon: IdCard,
              verified: verification.identity.status === "approved",
            },
            {
              key: "email",
              label: "Verified Email",
              icon: Mail,
              verified: verification.email.status === "verified",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Button
                type="button"
                key={item.key}
                onClick={() => {
                  if (item.verified) return;
                  if (item.key === "phone") {
                    setPhoneNumber(user?.phoneNumber ?? "");
                    setShowPhoneVerification(true);
                    setPhoneStep("input");
                  } else if (item.key === "identity") {
                    navigate(ROUTES.VERIFY_IDENTITY);
                  } else {
                    setEmail(user?.email ?? "");
                    setShowEmailVerification(true);
                    setEmailStep("input");
                  }
                }}
                disabled={item.verified}
                className={`relative flex flex-col items-center gap-2 rounded-lg border border-neutral-20 p-4 ${
                  item.verified ? "" : "cursor-pointer hover:border-primary"
                }`}
              >
                <Icon className="text-primary" />
                <span className="text-caption text-neutral-foreground">
                  {item.label}
                </span>
                {item.verified && (
                  <CheckCircle
                    size={16}
                    className="absolute -right-2 -top-2 text-success"
                  />
                )}
              </Button>
            );
          })}
        </div>
      </section>

      <section className="rounded-lg border border-neutral-20 bg-white p-5">
        <Text variant="body" className="mb-4 font-semibold">
          Activity Summary
        </Text>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border border-neutral-20 p-4">
            <Text variant="bodyLg" className="font-semibold">
              10 hours
            </Text>
            <Text variant="muted">Avg. response</Text>
          </div>

          <div className="rounded-lg border border-neutral-20 p-4">
            <Text variant="bodyLg" className="font-semibold">
              12
            </Text>
            <Text variant="muted">Active listing</Text>
          </div>
        </div>
      </section>

      {showPhoneVerification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded-lg bg-white p-8 text-center">
            {phoneStep === "input" && (
              <>
                <h2 className="mb-2 text-xl font-bold">Verify phone number</h2>
                <p className="mb-6 text-gray-600">Enter your phone number.</p>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(event) => setPhoneNumber(event.target.value)}
                  placeholder="+970*********"
                  className="mb-4 w-full rounded-md border px-3 py-2"
                />
                {phoneError && (
                  <p className="mb-3 text-sm text-red-600">{phoneError}</p>
                )}
                <button
                  type="button"
                  onClick={sendPhoneCode}
                  disabled={!phoneNumber.trim() || sendPhoneMutation.isPending}
                  className="w-full rounded-md bg-blue-600 py-2 text-white disabled:bg-gray-300"
                >
                  {sendPhoneMutation.isPending ? "Sending..." : "Send code"}
                </button>
                <button
                  type="button"
                  onClick={closePhoneOverlay}
                  className="mt-2 w-full py-2 text-gray-600"
                >
                  Cancel
                </button>
              </>
            )}

            {phoneStep === "otp" && (
              <>
                <h2 className="mb-2 text-xl font-bold">Verify phone number</h2>
                <p className="mb-6 text-gray-600">
                  Enter the {OTP_LENGTH}-digit verification code.
                </p>

                <OtpInputs
                  idPrefix="phone-otp"
                  value={phoneOtp}
                  onChange={(index, value) => {
                    setPhoneOtp((current) => {
                      const next = [...current];
                      next[index] = value;
                      return next;
                    });
                  }}
                />

                {phoneError && (
                  <p className="mb-3 text-sm text-red-600">{phoneError}</p>
                )}

                <button
                  type="button"
                  onClick={verifyPhoneCode}
                  disabled={
                    phoneOtp.join("").length !== OTP_LENGTH ||
                    verifyPhoneMutation.isPending
                  }
                  className="mb-2 w-full rounded-md bg-blue-600 py-2 text-white disabled:bg-gray-300"
                >
                  {verifyPhoneMutation.isPending ? "Verifying..." : "Verify"}
                </button>
                <button
                  type="button"
                  onClick={sendPhoneCode}
                  className="text-sm text-blue-600"
                >
                  Resend code
                </button>
                <button
                  type="button"
                  onClick={closePhoneOverlay}
                  className="ml-3 text-sm text-gray-600"
                >
                  Close
                </button>
              </>
            )}

            {phoneStep === "success" && (
              <>
                <h2 className="mb-2 text-xl font-bold">Phone verified</h2>
                <p className="mb-6 text-gray-600">
                  Your phone number has been verified successfully.
                </p>
                <button
                  type="button"
                  onClick={closePhoneOverlay}
                  className="w-full rounded-md bg-blue-600 py-2 text-white"
                >
                  Done
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {showEmailVerification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded-lg bg-white p-8">
            {emailStep === "input" && (
              <>
                <h2 className="mb-2 text-xl font-bold">Verify email address</h2>
                <p className="mb-6 text-gray-600">Enter your email.</p>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@example.com"
                  className="mb-4 w-full rounded-lg border px-4 py-3 text-sm outline-none"
                />
                {emailError && (
                  <p className="mb-3 text-sm text-red-600">{emailError}</p>
                )}
                <button
                  type="button"
                  onClick={sendEmailCode}
                  disabled={!email.trim() || sendEmailMutation.isPending}
                  className="mb-2 w-full rounded-md bg-blue-600 py-2 text-white disabled:bg-gray-300"
                >
                  {sendEmailMutation.isPending ? "Sending..." : "Send code"}
                </button>
                <button
                  type="button"
                  onClick={closeEmailOverlay}
                  className="w-full py-2 text-gray-600"
                >
                  Cancel
                </button>
              </>
            )}

            {emailStep === "otp" && (
              <>
                <h2 className="mb-2 text-xl font-bold">Verify email address</h2>
                <p className="mb-6 text-gray-600">
                  Enter the {OTP_LENGTH}-digit verification code.
                </p>

                <OtpInputs
                  idPrefix="email-otp"
                  value={emailOtp}
                  onChange={(index, value) => {
                    setEmailOtp((current) => {
                      const next = [...current];
                      next[index] = value;
                      return next;
                    });
                  }}
                />

                {emailError && (
                  <p className="mb-3 text-sm text-red-600">{emailError}</p>
                )}

                <button
                  type="button"
                  onClick={verifyEmailCode}
                  disabled={
                    emailOtp.join("").length !== OTP_LENGTH ||
                    verifyEmailMutation.isPending
                  }
                  className="mb-4 w-full rounded-md bg-blue-600 py-2 text-white disabled:bg-gray-300"
                >
                  {verifyEmailMutation.isPending ? "Verifying..." : "Verify"}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={sendEmailCode}
                    className="text-sm text-blue-600"
                  >
                    Resend code
                  </button>
                  <button
                    type="button"
                    onClick={closeEmailOverlay}
                    className="ml-3 text-sm text-gray-600"
                  >
                    Close
                  </button>
                </div>
              </>
            )}

            {emailStep === "success" && (
              <>
                <h2 className="mb-2 text-xl font-bold">Email verified</h2>
                <p className="mb-6 text-gray-600">
                  Your email address has been verified successfully.
                </p>
                <button
                  type="button"
                  onClick={closeEmailOverlay}
                  className="w-full rounded-md bg-blue-600 py-2 text-white"
                >
                  Done
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
