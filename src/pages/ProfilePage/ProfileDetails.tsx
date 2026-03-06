import * as React from "react";
import { useNavigate } from "react-router-dom";
import { IdCard, Mail, Smartphone } from "lucide-react";
import { EditProfileForm } from "./EditProfileForm";
import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/stores/useAuthStore";
import { useProfile, useUpdateProfile } from "@/services/profile.service";
import { useCountries } from "@/services/location.service";
import { useProducts } from "@/services/product.service";
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
import type { UpdateProfilePayload } from "@/dto/profile";

const formatMemberSince = (value?: string | null) => {
  if (!value) return "Member since -";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Member since -";
  return `Member since ${date.toLocaleDateString("en-US", { month: "long", year: "numeric" })}`;
};

export default function ProfileDetails() {
  const navigate = useNavigate();

  // ── Auth store: holds user-level fields (fullName, email, phoneNumber, avatar)
  const user = useAuthStore((state) => state.user);
  const verificationStore = useAuthStore((state) => state.verification);
  const setVerification = useAuthStore((state) => state.setVerification);

  const [isEditing, setIsEditing] = React.useState(false);
  const [showIdentityModal, setShowIdentityModal] = React.useState(false);

  // ── Server state
  const { data: profileData, isLoading: isProfileLoading } = useProfile();
  const { data: countriesData } = useCountries();
  const {
    data: verificationStatus,
    isLoading: isVerificationLoading,
    refetch: refetchVerificationStatus,
  } = useVerificationStatus();
  const updateProfileMutation = useUpdateProfile();

  // Fetch the seller's active listings count (limit=1 minimises payload)
  const userId = user?.id ? Number(user.id) : undefined;
  const { data: listingsData, isLoading: isListingsLoading } = useProducts(
    userId !== undefined ? { sellerIds: [userId], limit: 1 } : undefined,
  );

  React.useEffect(() => {
    if (verificationStatus) {
      setVerification(verificationStatus);
    }
  }, [setVerification, verificationStatus]);

  const verification = React.useMemo(() => {
    if (!verificationStatus) return verificationStore;
    return {
      identity: {
        ...verificationStatus.identity,
        ...verificationStore.identity,
      },
      phone: {
        ...verificationStatus.phone,
        ...verificationStore.phone,
      },
      email: {
        ...verificationStatus.email,
        ...verificationStore.email,
      },
    };
  }, [verificationStatus, verificationStore]);

  // ── Derived display values
  // Name / email / phone come from the auth store (User entity), not /profile
  const displayName = user?.fullName ?? user?.name ?? "-";

  // Country name: look up profileData.countryId in the countries list
  const displayCountry = React.useMemo(() => {
    if (profileData?.countryId && countriesData?.length) {
      const match = countriesData.find(
        (c) => c.id === String(profileData.countryId),
      );
      if (match) return match.nameEn;
    }
    // Fallback: free-text location stored on the profile
    return profileData?.location ?? "-";
  }, [profileData?.countryId, profileData?.location, countriesData]);

  // Avatar: stored on the User object at login time
  const displayAvatar = user?.avatar;

  const memberSince = formatMemberSince(profileData?.createdAt);

  // ── Verification flows
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
    initialValue: user?.phoneNumber ?? "",
    onVerified: handlePhoneVerified,
  });

  const emailVerification = useEmailVerificationFlow({
    initialValue: user?.email ?? "",
    onVerified: handleEmailVerified,
  });

  // ── Profile update
  const handleProfileSubmit = async (payload: UpdateProfilePayload) => {
    await updateProfileMutation.mutateAsync(payload);
    setIsEditing(false);
  };

  // ── Profile completion %
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
          bio: profileData?.bio ?? "",
          location: profileData?.location ?? "",
          countryId:
            profileData?.countryId != null ? String(profileData.countryId) : "",
          avatarUrl: displayAvatar,
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
        bio={profileData?.bio ?? undefined}
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
            phoneVerification.open(user?.phoneNumber ?? "");
          } else if (key === "identity") {
            setShowIdentityModal(true);
          } else {
            emailVerification.open(user?.email ?? "");
          }
        }}
      />

      <ActivitySummary
        listingsCount={listingsData?.total}
        isLoading={isListingsLoading}
      />

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
