import * as React from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, IdCard, Mail, Pencil, Smartphone } from "lucide-react";
import { countries } from "countries-list";
import { EditProfileForm } from "./EditProfileForm";
import type { EditProfileSubmitPayload } from "./EditProfileForm";
import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/stores/useAuthStore";
import {
  useSendEmailOTP,
  useSendPhoneOTP,
  useVerifyEmailOTP,
  useVerifyPhoneOTP,
} from "@/services/verification.service";
import { useUpdateProfile } from "@/services/profile.service";
import { Text } from "@/components/ui/Text/text";
import { Span } from "@/components/ui/Span/span";

const OTP_LENGTH = 4;
const createEmptyOtp = () => Array.from({ length: OTP_LENGTH }, () => "");

const getBackendErrorMessage = (error: unknown): string | null => {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null &&
    "data" in error.response &&
    typeof error.response.data === "object" &&
    error.response.data !== null &&
    "message" in error.response.data &&
    typeof error.response.data.message === "string"
  ) {
    return error.response.data.message;
  }
  return null;
};

interface OtpInputsProps {
  idPrefix: string;
  value: string[];
  onChange: (index: number, value: string) => void;
}

const OtpInputs = ({ idPrefix, value, onChange }: OtpInputsProps) => (
  <div className="mb-4 flex items-center justify-center gap-2">
    {value.map((digit, index) => (
      <input
        key={`${idPrefix}-${index}`}
        id={`${idPrefix}-${index}`}
        type="text"
        inputMode="numeric"
        maxLength={1}
        value={digit}
        onChange={(event) => {
          const nextValue = event.target.value.replace(/\D/g, "");
          onChange(index, nextValue);
        }}
        className="h-11 w-11 rounded-md border border-neutral-20 text-center text-lg outline-none focus:border-primary"
      />
    ))}
  </div>
);

const COUNTRY_DIAL_OPTIONS = Object.values(countries)
  .map((country) => {
    const firstDial = country.phone?.[0];
    return {
      name: country.name,
      dialCode: firstDial ? `+${firstDial}` : "",
    };
  })
  .filter((item) => Boolean(item.dialCode))
  .sort((a, b) => a.name.localeCompare(b.name));

export default function ProfileDetails() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const verification = useAuthStore((state) => state.verification);
  const setVerification = useAuthStore((state) => state.setVerification);
  const updateProfileMutation = useUpdateProfile();

  const [isEditing, setIsEditing] = React.useState(false);

  const [showPhoneVerification, setShowPhoneVerification] =
    React.useState(false);
  const [phoneStep, setPhoneStep] = React.useState<
    "input" | "otp" | "change" | "success"
  >("input");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [phoneOtp, setPhoneOtp] = React.useState<string[]>(createEmptyOtp());
  const [phoneError, setPhoneError] = React.useState<string | null>(null);
  const [countryDialCode, setCountryDialCode] = React.useState("+970");
  const [showEmailVerification, setShowEmailVerification] =
    React.useState(false);
  const [emailStep, setEmailStep] = React.useState<"input" | "otp" | "success">(
    "input",
  );
  const [email, setEmail] = React.useState("");
  const [emailOtp, setEmailOtp] = React.useState<string[]>(createEmptyOtp());
  const [emailError, setEmailError] = React.useState<string | null>(null);

  const sendPhoneMutation = useSendPhoneOTP();
  const verifyPhoneMutation = useVerifyPhoneOTP();
  const sendEmailMutation = useSendEmailOTP();
  const verifyEmailMutation = useVerifyEmailOTP();

  if (!user) {
    return <div className="p-6">Loading profile...</div>;
  }

  const displayName = user?.fullName || user?.name || "User";

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleProfileSubmit = async (payload: EditProfileSubmitPayload) => {
    setIsEditing(false);
  };

  const closePhoneOverlay = () => {
    setShowPhoneVerification(false);
    setPhoneStep("input");
    setPhoneError(null);
    setPhoneOtp(createEmptyOtp());
  };

  const closeEmailOverlay = () => {
    setShowEmailVerification(false);
    setEmailStep("input");
    setEmailError(null);
    setEmailOtp(createEmptyOtp());
  };

  const handleChangePhoneNumber = (
    event: React.MouseEvent<HTMLAnchorElement>,
  ) => {
    event.preventDefault();
    setPhoneStep("change");
  };

  const sendPhoneCode = async () => {
    const enteredPhone =
      phoneStep === "change" && !phoneNumber.trim().startsWith("+")
        ? `${countryDialCode}${phoneNumber.trim()}`
        : phoneNumber.trim();
    if (!enteredPhone) {
      setPhoneError("Please enter your phone number.");
      return;
    }
    setPhoneError(null);

    try {
      await sendPhoneMutation.mutateAsync({ otpType: "phone_verification" });
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
    const enteredPhone =
      phoneStep === "change" && !phoneNumber.trim().startsWith("+")
        ? `${countryDialCode}${phoneNumber.trim()}`
        : phoneNumber.trim();
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
        type: "phone_verification",
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
      await sendEmailMutation.mutateAsync({ otpType: "email_verification" });
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
        type: "email_verification",
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
        initialValues={{
          fullName: user?.fullName || user?.name || "",
          email: user?.email || "",
          phoneNumber: user?.phoneNumber || "",
          country: "",
          avatarUrl: user?.avatar,
        }}
        isSubmitting={updateProfileMutation.isPending}
        onCancel={() => setIsEditing(false)}
        onSubmit={handleProfileSubmit}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-lg border border-neutral-20 bg-white p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt="Profile"
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-muted-10" />
            )}

            <div className="space-y-1">
              <Text variant="bodyLg" className="font-semibold">
                {displayName}
              </Text>

              {user.email && (
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-muted-foreground" />
                  <Span variant="caption">{user.email}</Span>
                </div>
              )}

              {user.phoneNumber && (
                <div className="flex items-center gap-2">
                  <Smartphone size={14} className="text-muted-foreground" />
                  <Span variant="caption">{user.phoneNumber}</Span>
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-10 text-primary transition hover:bg-primary-20"
          >
            <Pencil size={18} />
          </button>
        </div>
      </section>

      <section className="rounded-lg border border-neutral-20 bg-white p-5">
        <div className="mb-3 flex items-center justify-between">
          <p className="font-semibold text-neutral-foreground">
            Profile Completion
          </p>
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
        <p className="mb-1 font-semibold text-neutral-foreground">
          Trust indicators
        </p>
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
              <button
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
                  } else if (item.key === "email") {
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
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-lg border border-neutral-20 bg-white p-5">
        <p className="mb-4 font-semibold text-neutral-foreground">
          Activity Summary
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border border-neutral-20 p-4">
            <p className="text-bodyLg font-semibold text-neutral-foreground">
              10 hours
            </p>
            <p className="text-caption text-muted-foreground">Avg. response</p>
          </div>

          <div className="rounded-lg border border-neutral-20 p-4">
            <p className="text-bodyLg font-semibold text-neutral-foreground">
              12
            </p>
            <p className="text-caption text-muted-foreground">Active listing</p>
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
                <p className="text-sm text-gray-600">
                  Didn't receive the code?{" "}
                  <a
                    href="#"
                    className="text-blue-600"
                    onClick={(event) => {
                      event.preventDefault();
                      void sendPhoneCode();
                    }}
                  >
                    Resend
                  </a>
                </p>
                <a
                  href="#"
                  onClick={handleChangePhoneNumber}
                  className="mt-2 inline-block text-sm text-gray-600"
                >
                  Change phone number
                </a>
              </>
            )}

            {phoneStep === "change" && (
              <>
                <h2 className="mb-2 text-xl font-bold">Change phone number</h2>
                <p className="mb-6 text-gray-600">
                  We will send a verification code to your new account phone
                  number
                </p>

                <div className="mb-4">
                  <div className="flex items-center rounded-lg border px-4 py-3">
                    <div className="relative flex-1">
                      <select
                        value={countryDialCode}
                        onChange={(e) => setCountryDialCode(e.target.value)}
                        className="w-full appearance-none bg-transparent pr-8 text-sm outline-none"
                      >
                        {COUNTRY_DIAL_OPTIONS.map((item) => (
                          <option
                            key={`${item.name}-${item.dialCode}`}
                            value={item.dialCode}
                          >
                            {item.dialCode} {item.name}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <svg
                          className="h-4 w-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          ></path>
                        </svg>
                      </div>
                    </div>
                    <div className="mx-3 h-6 border-l border-gray-300"></div>
                    <input
                      type="text"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="interior number"
                      className="flex-1 text-sm outline-none"
                    />
                  </div>
                </div>

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
