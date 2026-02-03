import type { ReactNode } from "react";
import Container from "./Container";
import Card from "@/components/ui/Card";

interface PageLayoutProps {
  title?: string;
  subtitle?: string;
  children?: ReactNode;
  maxWidth?:
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "6xl"
    | "7xl";
  className?: string;
  showPlaceholder?: boolean;
}

const PageLayout = ({
  title,
  subtitle,
  children,
  maxWidth = "6xl",
  className = "",
  showPlaceholder = false,
}: PageLayoutProps) => {
  return (
    <Container
      maxWidth={maxWidth}
      className={`flex flex-col gap-4 ${className}`}
    >
      <Card>
        {title && (
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
            {subtitle && <p className="text-sm text-slate-600">{subtitle}</p>}
          </div>
        )}
        {showPlaceholder && !children ? (
          <p className="text-sm text-slate-600">Screen setup placeholder.</p>
        ) : (
          children
        )}
      </Card>
    </Container>
  );
};

export default PageLayout;
