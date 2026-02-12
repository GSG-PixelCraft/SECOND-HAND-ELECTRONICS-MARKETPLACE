import { forwardRef } from "react";
import { Mail, Phone, MapPin, Clock, Calendar } from "lucide-react";
import { Span } from "@/components/ui/span";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { UserDetailInfo, UserStatus } from "@/types/user";

export interface UserProfileCardProps {
  user: UserDetailInfo;
}

export const UserProfileCard = forwardRef<HTMLDivElement, UserProfileCardProps>(
  ({ user }, ref) => {
    const getStatusVariant = (status: UserStatus) => {
      switch (status) {
        case "active":
          return "completed";
        case "suspended":
          return "processing";
        case "banned":
          return "rejected";
        default:
          return "neutral";
      }
    };

    return (
      <div
        ref={ref}
        className="rounded-xl bg-white p-6 shadow-[0px_1px_4px_0px_rgba(0,0,0,0.1)]"
      >
        <div className="flex items-start gap-6">
          {/* Avatar with Verification Badge */}
          <div className="relative h-32 w-32 flex-shrink-0">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-full bg-primary/10 text-4xl font-semibold text-primary">
                {user.name.charAt(0)}
              </div>
            )}
            {/* Verification checkmark */}
            {user.verificationStatus.phoneVerified && (
              <div className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-success">
                <svg
                  width="16"
                  height="12"
                  viewBox="0 0 16 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 6L6 10L14 2"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1">
            <div className="mb-4 flex items-center gap-3">
              <h2 className="text-neutral-90 text-2xl font-bold">
                {user.name}
              </h2>
              <Span className="text-neutral-50 text-sm">{user.id}</Span>
              <StatusBadge variant={getStatusVariant(user.status)}>
                {user.status}
              </StatusBadge>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="text-neutral-60 flex items-center gap-3">
                <Mail className="h-5 w-5" />
                <Span className="text-sm">{user.email}</Span>
              </div>
              <div className="text-neutral-60 flex items-center gap-3">
                <Phone className="h-5 w-5" />
                <Span className="text-sm">{user.phoneNumber}</Span>
              </div>
              <div className="text-neutral-60 flex items-center gap-3">
                <MapPin className="h-5 w-5" />
                <Span className="text-sm">{user.location}</Span>
              </div>
              <div className="text-neutral-60 flex items-center gap-3">
                <Clock className="h-5 w-5" />
                <Span className="text-sm">{user.avgResponseTime}</Span>
              </div>
              <div className="text-neutral-60 flex items-center gap-3">
                <Calendar className="h-5 w-5" />
                <Span className="text-sm">Member since {user.memberSince}</Span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

UserProfileCard.displayName = "UserProfileCard";
