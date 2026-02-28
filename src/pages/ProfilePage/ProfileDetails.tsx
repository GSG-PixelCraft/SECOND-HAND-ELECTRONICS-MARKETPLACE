import * as React from "react";
import { useNavigate } from "react-router-dom";
import { IdCard, Mail, Smartphone } from "lucide-react";
import { EditProfileForm } from "./EditProfileForm";
import type { EditProfileSubmitPayload } from "./EditProfileForm";
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

  const displayName = profileData?.fullName || profileData?.name || user?.name || "-";
  const displayCountry = profileData?.country || profileData?.location || "-";
  const displayAvatar = profileData?.profileImageUrl || profileData?.avatarUrl || user?.avatar;
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

  const handleProfileSubmit = async (
    payload: EditProfileSubmitPayload,
  ) => {
    await updateProfileMutation.mutateAsync({
      location: payload.country ?? "",
      avatarFile: payload.avatar ?? null,
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
          fullName: profileData?.fullName || profileData?.name || user?.name || "",
          email: profileData?.email || user?.email || "",
          phoneNumber: profileData?.phoneNumber || user?.phoneNumber || "",
          country: (profileData?.country || profileData?.location || "") as string,
          avatarUrl: (profileData?.profileImageUrl || profileData?.avatarUrl || user?.avatar) as string | undefined,
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
        name={displayName}
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
            key: "phone" as const,
            label: "Verified Phone",
            icon: Smartphone,
            verified: verification.phone.status === "verified",
          },
          {
            key: "identity" as const,
            label: "Verified Identity",
            icon: IdCard,
            verified: verification.identity.status === "approved",
          },
          {
            key: "email" as const,
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

