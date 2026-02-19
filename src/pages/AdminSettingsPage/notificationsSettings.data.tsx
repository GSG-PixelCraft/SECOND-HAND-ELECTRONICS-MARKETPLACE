import type { ReactNode } from "react";
import {
  CheckSquare,
  Clock3,
  FileText,
  Mail,
  MessageCircle,
  Smile,
  Smartphone,
  Trash2,
  User,
  XSquare,
} from "lucide-react";

export type NotificationIcon = {
  id: string;
  icon: ReactNode;
  tone: "mint" | "blue" | "yellow" | "red";
};

export const notificationIcons: NotificationIcon[] = [
  { id: "user", icon: <User className="h-[22px] w-[22px]" />, tone: "mint" },
  {
    id: "mobile",
    icon: <Smartphone className="h-[22px] w-[22px]" />,
    tone: "mint",
  },
  { id: "mail", icon: <Mail className="h-[22px] w-[22px]" />, tone: "mint" },
  {
    id: "check",
    icon: <CheckSquare className="h-[22px] w-[22px]" />,
    tone: "mint",
  },
  { id: "smile", icon: <Smile className="h-[22px] w-[22px]" />, tone: "blue" },
  {
    id: "file",
    icon: <FileText className="h-[22px] w-[22px]" />,
    tone: "blue",
  },
  {
    id: "message",
    icon: <MessageCircle className="h-[22px] w-[22px]" />,
    tone: "blue",
  },
  {
    id: "clock",
    icon: <Clock3 className="h-[22px] w-[22px]" />,
    tone: "yellow",
  },
  { id: "x", icon: <XSquare className="h-[22px] w-[22px]" />, tone: "red" },
  { id: "trash", icon: <Trash2 className="h-[22px] w-[22px]" />, tone: "red" },
];

export const iconRows = [
  notificationIcons.slice(0, 4),
  notificationIcons.slice(4, 8),
  notificationIcons.slice(8, 10),
];

export const iconToneClass: Record<NotificationIcon["tone"], string> = {
  mint: "bg-[#DFF5F2] text-[#0EA5A2]",
  blue: "bg-[#E5EEFF] text-[#2563EB]",
  yellow: "bg-[#FFF5D9] text-[#EAB308]",
  red: "bg-[#FDE3E3] text-[#EF4444]",
};

export const MAX_MESSAGE_LENGTH = 500;
export const statusBadgeBase =
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium";
export const calendarWeekDays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

export const monthOptions = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const yearOptions = Array.from({ length: 21 }, (_, i) => 2020 + i);

export const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();
