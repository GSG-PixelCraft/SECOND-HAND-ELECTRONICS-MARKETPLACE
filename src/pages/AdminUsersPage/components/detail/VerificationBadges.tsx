import { forwardRef } from "react";
import { Smartphone, CreditCard, Mail, Check } from "lucide-react";
import { Text } from "@/components/ui/Text/text";
import { cn } from "@/lib/utils";
import type { UserVerificationStatus } from "@/types/user";

export interface VerificationBadgesProps {
  verificationStatus: UserVerificationStatus;
}

export const VerificationBadges = forwardRef<
  HTMLDivElement,
  VerificationBadgesProps
>(({ verificationStatus }, ref) => {
  const badges = [
    {
      icon: Smartphone,
      label: "Verified Phone",
      verified: verificationStatus.phoneVerified,
    },
    {
      icon: CreditCard,
      label: "Verified Identity",
      verified: verificationStatus.identityVerified,
    },
    {
      icon: Mail,
      label: "Verified Email",
      verified: verificationStatus.emailVerified,
    },
  ];

  return (
    <div ref={ref} className="grid grid-cols-3 gap-4">
      {badges.map((badge) => {
        const Icon = badge.icon;
        return (
          <div
            key={badge.label}
            className={cn(
              "flex items-center gap-3 rounded-xl p-4",
              badge.verified ? "bg-primary/10" : "bg-neutral-10",
            )}
          >
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg",
                badge.verified
                  ? "bg-primary/20 text-primary"
                  : "text-neutral-50 bg-neutral-20",
              )}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <Text
                variant="caption"
                className={cn(
                  "font-medium",
                  badge.verified ? "text-neutral-90" : "text-neutral-50",
                )}
              >
                {badge.label}
              </Text>
            </div>
            {badge.verified && (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-success">
                <Check className="h-4 w-4 text-white" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
});

VerificationBadges.displayName = "VerificationBadges";
