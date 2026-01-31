import {
  Bell,
  FileText,
  MessageCircle,
  Package,
  SquareX,
  Trash,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { NotificationType } from "./notificationTypes";

export interface NotificationItemProps {
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionLabel?: string;
  actionUrl?: string;
  onAction?: () => void;
}

const notificationConfig: Record<
  NotificationType,
  {
    icon: typeof Bell;
    iconBg: string;
    iconColor: string;
    itemBg: string;
  }
> = {
  message: {
    icon: MessageCircle,
    iconBg: "bg-[rgba(37,99,235,0.1)]",
    iconColor: "text-[#2563eb]",
    itemBg: "bg-white",
  },
  listing_update: {
    icon: FileText,
    iconBg: "bg-[rgba(37,99,235,0.1)]",
    iconColor: "text-[#2563eb]",
    itemBg: "bg-[rgba(37,99,235,0.05)]",
  },
  identity: {
    icon: User,
    iconBg: "bg-[rgba(20,184,166,0.1)]",
    iconColor: "text-[#14b8a6]",
    itemBg: "bg-[rgba(37,99,235,0.05)]",
  },
  order: {
    icon: Package,
    iconBg: "bg-[rgba(37,99,235,0.1)]",
    iconColor: "text-[#2563eb]",
    itemBg: "bg-white",
  },
  system: {
    icon: Bell,
    iconBg: "bg-[rgba(37,99,235,0.1)]",
    iconColor: "text-[#2563eb]",
    itemBg: "bg-white",
  },
  warning: {
    icon: SquareX,
    iconBg: "bg-[rgba(239,68,68,0.2)]",
    iconColor: "text-[#ef4444]",
    itemBg: "bg-white",
  },
  deleted: {
    icon: Trash,
    iconBg: "bg-[rgba(239,68,68,0.2)]",
    iconColor: "text-[#ef4444]",
    itemBg: "bg-white",
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
      className={cn("flex w-full items-center gap-3 p-4", config.itemBg)}
      data-read={read}
    >
      <div
        className={cn(
          "flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full",
          config.iconBg,
        )}
      >
        <Icon className={cn("h-6 w-6", config.iconColor)} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-2 flex items-center justify-between gap-4">
          <h3 className="text-[14px] font-medium leading-[14px] text-[#3d3d3d]">
            {title}
          </h3>
          <span className="flex-shrink-0 whitespace-nowrap text-[12px] leading-[12px] text-[#828282]">
            {timestamp}
          </span>
        </div>

        <p className="text-[12px] leading-[14px] text-[#828282]">
          {message}
          {actionLabel && (
            <>
              {" "}
              <button
                onClick={onAction}
                className="font-medium text-[#212121] hover:underline"
                type="button"
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
