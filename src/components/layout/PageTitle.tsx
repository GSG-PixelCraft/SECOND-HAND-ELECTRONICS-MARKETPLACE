import { type ReactNode } from "react";

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
      <h1 className="text-2xl font-semibold text-neutral-foreground">
        {children}
      </h1>
      {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
