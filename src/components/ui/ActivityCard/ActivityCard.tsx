import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Text } from "@/components/ui/Text/text";
import { Span } from "@/components/ui/Span/span";

interface ActivityCardProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  timestamp: string;
  className?: string;
}

export function ActivityCard({
  icon,
  title,
  subtitle,
  timestamp,
  className,
}: ActivityCardProps) {
  return (
    <div className={cn("flex items-start gap-3", className)}>
      {/* Icon */}
      <div className="mt-1 flex-shrink-0">{icon}</div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <Text className="text-sm font-normal leading-[27px] text-[#3D3D3D]">
            {title}
          </Text>
          <Span className="mt-1 flex-shrink-0 text-xs leading-[18px] text-[#828282]">
            {timestamp}
          </Span>
        </div>
        <Text className="mt-2 text-xs leading-[21px] text-[#828282]">
          {subtitle}
        </Text>
      </div>
    </div>
  );
}

interface ActivityIconProps {
  variant?: "primary" | "secondary" | "neutral";
  children: ReactNode;
}

export function ActivityIcon({
  variant = "primary",
  children,
}: ActivityIconProps) {
  const bgColor =
    variant === "primary"
      ? "bg-[rgba(37,99,235,0.1)]"
      : variant === "secondary"
        ? "bg-[rgba(20,184,166,0.1)]"
        : "bg-muted";

  return (
    <div
      className={cn(
        "flex size-12 items-center justify-center rounded-full",
        bgColor,
      )}
    >
      {children}
    </div>
  );
}
