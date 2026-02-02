import { EmptyState } from "./EmptyState.tsx";

interface NotificationsEmptyStateProps {
  title: string;
  description: string;
  size?: "sm" | "md";
}

export function NotificationsEmptyState({
  title,
  description,
  size = "md",
}: NotificationsEmptyStateProps) {
  const illustrationSize = size === "sm" ? "h-20 w-20" : "h-28 w-28";

  return (
    <EmptyState
      title={title}
      description={description}
      size={size}
      illustration={
        <div className={"flex items-center justify-center " + illustrationSize}>
          <svg viewBox="0 0 200 200" className="h-full w-full">
            <rect
              x="48"
              y="28"
              width="104"
              height="144"
              rx="16"
              fill="#E8F0FF"
            />
            <rect
              x="68"
              y="48"
              width="64"
              height="104"
              rx="12"
              fill="#FFFFFF"
            />
            <path
              d="M86 92h28"
              stroke="#3B82F6"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path
              d="M86 110h38"
              stroke="#9CA3AF"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <circle cx="64" cy="64" r="10" fill="#34D399" />
            <path
              d="M58 64h12"
              stroke="#FFFFFF"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <circle cx="148" cy="88" r="18" fill="#FBBF24" />
            <path
              d="M148 76v16"
              stroke="#FFFFFF"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path
              d="M140 96h16"
              stroke="#FFFFFF"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <circle cx="148" cy="128" r="10" fill="#F87171" />
            <path
              d="M143 123l10 10"
              stroke="#FFFFFF"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M153 123l-10 10"
              stroke="#FFFFFF"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
        </div>
      }
    />
  );
}
