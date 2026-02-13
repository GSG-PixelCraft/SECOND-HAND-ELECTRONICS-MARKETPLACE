import type { ReactNode } from "react";
import { Text } from "@/components/ui/text";

interface PageTitleProps {
  children: ReactNode;
  subtitle?: string;
  className?: string;
}

export function PageTitle({
  children,
  subtitle,
  className = "",
}: PageTitleProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <Text className="text-2xl font-semibold text-neutral-foreground">
        {children}
      </Text>
      {subtitle && (
        <Text variant="muted" className="text-sm">
          {subtitle}
        </Text>
      )}
    </div>
  );
}
