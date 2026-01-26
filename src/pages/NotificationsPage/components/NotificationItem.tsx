import {
  Bell,
  MessageCircle,
  CheckCircle,
  AlertCircle,
  Package,
  Trash,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface NotificationItemProps {
  type:
    | "message"
    | "listing_update"
    | "identity"
    | "order"
    | "system"
    | "warning"
    | "deleted";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionLabel?: string;
  actionUrl?: string;
  onAction?: () => void;
}

const notificationConfig = {
  message: {
    icon: MessageCircle,
    bgColor: "bg-primary-10",
    iconColor: "text-primary",
  },
  listing_update: {
    icon: Bell,
    bgColor: "bg-primary-10",
    iconColor: "text-primary",
  },
  identity: {
    icon: CheckCircle,
    bgColor: "bg-teal-10",
    iconColor: "text-teal",
  },
  order: {
    icon: Package,
    bgColor: "bg-yellow-10",
    iconColor: "text-yellow",
  },
  system: {
    icon: AlertCircle,
    bgColor: "bg-primary-10",
    iconColor: "text-primary",
  },
  warning: {
    icon: AlertCircle,
    bgColor: "bg-danger-10",
    iconColor: "text-danger",
  },
  deleted: {
    icon: Trash,
    bgColor: "bg-danger-10",
    iconColor: "text-danger",
  },
};

export function NotificationItem({
  type,
  title,
  message,
  timestamp,
  read,
  actionLabel,
  onAction,
}: NotificationItemProps) {
  const config = notificationConfig[type];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "flex gap-3 rounded-lg p-4 transition-colors",
        !read && "bg-blue-50",
      )}
    >
      <div
        className={cn(
          "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full",
          config.bgColor,
        )}
      >
        <Icon className={cn("h-5 w-5", config.iconColor)} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          <span className="whitespace-nowrap text-xs text-gray-500">
            {timestamp}
          </span>
        </div>

        <p className="mb-1 text-sm text-gray-600">
          {message}
          {actionLabel && (
            <>
              {" "}
              <button
                onClick={onAction}
                className="font-semibold text-primary hover:underline"
              >
                {actionLabel}
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
