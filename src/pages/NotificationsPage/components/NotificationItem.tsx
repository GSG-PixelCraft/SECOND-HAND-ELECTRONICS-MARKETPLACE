import {
  Bell,
  Clock,
  FileText,
  MessageCircle,
  Package,
  SquareX,
  Trash,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { NotificationType } from "./notificationTypes";
import { Text } from "@/components/ui/text";
import { Span } from "@/components/ui/span";
import { Button } from "@/components/ui/button";

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
    itemBg: "bg-[rgba(37,99,235,0.05)]",
  },
  listing_update: {
    icon: FileText,
    iconBg: "bg-[rgba(37,99,235,0.1)]",
    iconColor: "text-[#2563eb]",
    itemBg: "bg-white",
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
  pending: {
    icon: Clock,
    iconBg: "bg-[rgba(250,204,21,0.1)]",
    iconColor: "text-[#facc15]",
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
    itemBg: "bg-[rgba(37,99,235,0.05)]",
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
      className={cn("flex w-full items-center gap-4 p-4", config.itemBg)}
      data-read={read}
    >
      <div
        className={cn(
          "flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full p-2",
          config.iconBg,
        )}
      >
        <Icon className={cn("h-6 w-6", config.iconColor)} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-2 flex items-center justify-between gap-10">
          <h3 className="font-['Poppins'] text-[16px] font-medium leading-normal text-[#3d3d3d]">
            {title}
          </h3>
          <Span className="flex-shrink-0 whitespace-nowrap font-['Poppins'] text-[14px] font-normal leading-normal text-[#828282]">
            {timestamp}
          </Span>
        </div>

        <Text className="font-['Poppins'] text-[14px] font-normal leading-normal text-[#828282]">
          {message}
          {actionLabel && (
            <>
              {" "}
              <Button
                onClick={onAction}
                className="font-['Poppins'] font-medium text-[#212121] hover:underline"
                type="button"
              >
                {actionLabel}
              </Button>
            </>
          )}
        </Text>
      </div>
    </div>
  );
}
