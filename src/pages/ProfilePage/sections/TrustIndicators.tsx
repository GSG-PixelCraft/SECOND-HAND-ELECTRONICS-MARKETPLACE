import type { LucideIcon } from "lucide-react";
import { CheckCircle } from "lucide-react";

interface Indicator {
  key: "phone" | "identity" | "email";
  label: string;
  icon: LucideIcon;
  verified: boolean;
}

interface TrustIndicatorsProps {
  items: Indicator[];
  isLoading?: boolean;
  onSelect: (key: Indicator["key"]) => void;
}

export const TrustIndicators = ({
  items,
  isLoading = false,
  onSelect,
}: TrustIndicatorsProps) => (
  <section className="rounded-lg border border-neutral-20 bg-white p-5">
    <p className="mb-1 font-semibold text-neutral-foreground">
      Trust indicators
    </p>
    <p className="mb-4 text-caption text-muted-foreground">
      Verify your identity, mobile and email to get a verified badge.
    </p>
    {isLoading && (
      <p className="mb-2 text-xs text-muted-foreground">
        Checking verification status...
      </p>
    )}

    <div className="grid grid-cols-3 gap-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <button
            type="button"
            key={item.key}
            onClick={() => onSelect(item.key)}
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
);

