import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button/button";
import { FullScreenLoading } from "@/components/feedback/loading/full-screen-loading";
import { UserDetailHeader } from "./UserDetailHeader";
import { UserProfileCard } from "./UserProfileCard";
import { VerificationBadges } from "./VerificationBadges";
import { ModerationActionsPanel } from "./ModerationActionsPanel";
import { PermissionsPanel } from "./PermissionsPanel";
import { UserListingsSection } from "./UserListingsSection";
import { useAdminUserDetail } from "@/services/admin-users.service";

export default function AdminUserDetailPage() {
  const { id: encodedId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Decode the user ID from URL (handles special characters like #)
  const id = encodedId ? decodeURIComponent(encodedId) : undefined;

  // Fetch user details
  const { data: user, isLoading, error } = useAdminUserDetail(id!);

  // Loading State
  if (isLoading) {
    return <FullScreenLoading message="Loading user details..." />;
  }

  // Error State
  if (error || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-error/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-error"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="m15 9-6 6" />
              <path d="m9 9 6 6" />
            </svg>
          </div>
          <h2 className="text-neutral-90 mt-4 text-xl font-semibold">
            User Not Found
          </h2>
          <p className="text-neutral-60 mt-2">
            The user you're looking for doesn't exist or has been removed.
          </p>
          <Button
            intent="primary"
            className="mt-6"
            onClick={() => navigate("/admin/users")}
          >
            Back to Users
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-5 p-6">
      {/* Content Container */}
      <div className="mx-auto max-w-[1500px]">
        {/* Header */}
        <UserDetailHeader />

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column - 2/3 width */}
          <div className="space-y-6 lg:col-span-2">
            {/* User Profile Card */}
            <UserProfileCard user={user} />

            {/* Verification Badges */}
            <VerificationBadges verificationStatus={user.verificationStatus} />

            {/* User Listings Section */}
            <UserListingsSection userId={user.id} />
          </div>

          {/* Right Column - 1/3 width (Sidebar) */}
          <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
            {/* Moderation Actions */}
            <ModerationActionsPanel
              userId={user.id}
              currentStatus={user.status}
            />

            {/* Permissions */}
            <PermissionsPanel
              userId={user.id}
              chatAccess={user.chatAccess}
              userStatus={user.status}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
