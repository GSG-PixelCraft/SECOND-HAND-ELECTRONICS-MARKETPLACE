import * as React from "react";
import { useNavigate } from "react-router-dom";
import { IdCard, Mail, Smartphone } from "lucide-react";
import { EditProfileForm } from "./EditProfileForm";
import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/stores/useAuthStore";
import { useProfile, useUpdateProfile } from "@/services/profile.service";
import { useVerificationStatus } from "@/services/verification.service";
import {
  ContactVerificationModal,
  IdentityVerificationModal,
} from "@/components/profile/verification";
import {
  useEmailVerificationFlow,
  usePhoneVerificationFlow,
} from "@/hooks/useContactVerification";
import { ProfileHero } from "./sections/ProfileHero";
import { ProfileCompletionCard } from "./sections/ProfileCompletionCard";
import { TrustIndicators } from "./sections/TrustIndicators";
import { ActivitySummary } from "./sections/ActivitySummary";

const formatMemberSince = (value?: string) => {
  if (!value) return "Member since -";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Member since -";
  return `Member since ${date.toLocaleDateString("en-US", { month: "long", year: "numeric" })}`;
};

export default function ProfileDetails() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const verificationStore = useAuthStore((state) => state.verification);
  const setVerification = useAuthStore((state) => state.setVerification);
  const setUser = useAuthStore((state) => state.setUser);

  const [isEditing, setIsEditing] = React.useState(false);
  const [showIdentityModal, setShowIdentityModal] = React.useState(false);

  const { data: profileData, isLoading: isProfileLoading } = useProfile();
  const {
    data: verificationStatus,
    isLoading: isVerificationLoading,
    refetch: refetchVerificationStatus,
  } = useVerificationStatus();
  const updateProfileMutation = useUpdateProfile();

  React.useEffect(() => {
    if (verificationStatus) {
      setVerification(verificationStatus);
    }
  }, [setVerification, verificationStatus]);

  const verification = verificationStatus ?? verificationStore;

  const displayName = profileData?.fullName || profileData?.name || user?.name;
  const displayCountry = profileData?.country || profileData?.location || "-";
  const displayAvatar =
    profileData?.profileImageUrl || profileData?.avatarUrl || user?.avatar;
  const memberSince = formatMemberSince(profileData?.createdAt);

  const handlePhoneVerified = React.useCallback(
    (phoneNumber: string) => {
      setVerification({
        phone: {
          phoneNumber,
          status: "verified",
          verifiedAt: new Date().toISOString(),
        },
      });
      void refetchVerificationStatus();
    },
    [refetchVerificationStatus, setVerification],
  );

  const handleEmailVerified = React.useCallback(
    (emailAddress: string) => {
      setVerification({
        email: {
          email: emailAddress,
          status: "verified",
          verifiedAt: new Date().toISOString(),
        },
      });
      void refetchVerificationStatus();
    },
    [refetchVerificationStatus, setVerification],
  );

  const phoneVerification = usePhoneVerificationFlow({
    initialValue: profileData?.phoneNumber || user?.phoneNumber || "",
    onVerified: handlePhoneVerified,
  });

  const emailVerification = useEmailVerificationFlow({
    initialValue: profileData?.email || user?.email || "",
    onVerified: handleEmailVerified,
  });

  const handleProfileSubmit = async (payload: {
    fullName: string;
    email: string;
    phoneNumber: string;
    country: string;
    avatarFile?: File | null;
  }) => {
    const updatedProfile = await updateProfileMutation.mutateAsync({
      bio: payload.fullName,
      location: payload.country,
      avatarFile: payload.avatarFile,
    });
    const resolvedName = (updatedProfile.fullName ||
      updatedProfile.name ||
      user?.name ||
      "") as string;
    setUser({
      ...(user || { id: updatedProfile.id || "", role: "user" }),
      name: resolvedName,
      email: (updatedProfile.email || user?.email || "") as string,
      phoneNumber: (updatedProfile.phoneNumber || user?.phoneNumber) as
        | string
        | undefined,
      avatar: (updatedProfile.profileImageUrl ||
        updatedProfile.avatarUrl ||
        user?.avatar) as string | undefined,
    });
    setIsEditing(false);
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
          fullName:
            profileData?.fullName || profileData?.name || user?.name || "",
          email: profileData?.email || user?.email || "",
          phoneNumber: profileData?.phoneNumber || user?.phoneNumber || "",
          country: (profileData?.country ||
            profileData?.location ||
            "") as string,
          avatarUrl: (profileData?.profileImageUrl ||
            profileData?.avatarUrl ||
            user?.avatar) as string | undefined,
        }}
        isSubmitting={updateProfileMutation.isPending}
        onCancel={() => setIsEditing(false)}
        onSubmit={handleProfileSubmit}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <ProfileHero
        name={displayName || "-"}
        country={displayCountry}
        memberSince={memberSince}
        avatar={displayAvatar}
        isLoading={isProfileLoading}
        onEdit={() => setIsEditing(true)}
      />

      <ProfileCompletionCard completion={profileCompletion} />

      <TrustIndicators
        isLoading={isVerificationLoading}
        items={[
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
        ]}
        onSelect={(key) => {
          if (key === "phone") {
            phoneVerification.open(
              profileData?.phoneNumber || user?.phoneNumber || "",
            );
          } else if (key === "identity") {
            setShowIdentityModal(true);
          } else {
            emailVerification.open(
              profileData?.email || user?.email || "",
            );
          }
        }}
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

      <ActivitySummary />
      <ContactVerificationModal type="phone" flow={phoneVerification} />
      <ContactVerificationModal type="email" flow={emailVerification} />
      <IdentityVerificationModal
        isOpen={showIdentityModal}
        onClose={() => setShowIdentityModal(false)}
        onStart={() => {
          setShowIdentityModal(false);
          navigate(ROUTES.VERIFY_IDENTITY);
        }}
        status={verification.identity.status}
      />
    </div>
  );
}


