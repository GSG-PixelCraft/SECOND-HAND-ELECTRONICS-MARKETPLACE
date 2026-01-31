import { useState, useRef, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Bell, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { NotificationItem } from "./NotificationItem";
import {
  NOTIFICATION_TABS,
  MOCK_NOTIFICATIONS,
  getNotificationTabCounts,
  filterNotifications,
  groupNotificationsByDate,
  type NotificationTabId,
} from "./notificationTypes";
import { NotificationsEmptyState } from "@/components/feedback/emptyState";
import { useTranslation } from "react-i18next";
import { ROUTES } from "@/constants/routes";

export interface NotificationMenuProps {
  className?: string;
}

export function NotificationMenu({ className }: NotificationMenuProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [activeTab, setActiveTab] = useState<NotificationTabId>("all");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  const tabCounts = useMemo(
    () => getNotificationTabCounts(MOCK_NOTIFICATIONS),
    [],
  );

  const filteredNotifications = useMemo(
    () =>
      filterNotifications(MOCK_NOTIFICATIONS, activeTab, filter === "unread"),
    [activeTab, filter],
  );

  const groupedNotifications = useMemo(
    () => groupNotificationsByDate(filteredNotifications),
    [filteredNotifications],
  );

  const todayNotifications = groupedNotifications.Today ?? [];

  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setShowFilter(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "relative rounded-full p-2 transition-colors",
          isOpen
            ? "bg-primary text-white hover:bg-primary"
            : "text-primary hover:bg-primary-10",
        )}
        aria-label={t("notifications.actions.openMenu")}
        type="button"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span
            className={cn(
              "absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold",
              isOpen ? "bg-white text-primary" : "bg-primary text-white",
            )}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-[494px] rounded-[12px] border border-[#e4e4e4] bg-white p-6 shadow-[0_12px_24px_rgba(0,0,0,0.08)]">
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h2 className="text-[18px] font-medium leading-[18px] text-[#212121]">
                {t("notifications.title")}
              </h2>
              <div className="relative flex items-center gap-3" ref={menuRef}>
                <Link
                  to={ROUTES.NOTIFICATIONS}
                  className="text-[14px] font-medium leading-[14px] text-[#2563eb]"
                >
                  {t("notifications.actions.openNotifications")}
                </Link>
                <button
                  onClick={() => setShowMenu((prev) => !prev)}
                  className="flex h-6 w-6 items-center justify-center text-[#828282] transition-colors hover:text-[#212121]"
                  aria-label={t("notifications.actions.moreOptions")}
                  type="button"
                >
                  <MoreVertical className="h-5 w-5" />
                </button>

                {showMenu && (
                  <div className="absolute right-0 top-8 z-20 w-56 rounded-[12px] border border-[#e4e4e4] bg-white py-2 shadow-[0_12px_24px_rgba(0,0,0,0.08)]">
                    <button
                      className="w-full px-4 py-2 text-left text-[14px] leading-[14px] text-[#3d3d3d] transition-colors hover:bg-[#f9fafb]"
                      type="button"
                    >
                      {t("notifications.actions.markAllRead")}
                    </button>
                    <button
                      className="w-full px-4 py-2 text-left text-[14px] leading-[14px] text-[#3d3d3d] transition-colors hover:bg-[#f9fafb]"
                      type="button"
                    >
                      {t("notifications.actions.settings")}
                    </button>
                    <button
                      className="w-full px-4 py-2 text-left text-[14px] leading-[14px] text-[#3d3d3d] transition-colors hover:bg-[#f9fafb]"
                      type="button"
                    >
                      {t("notifications.actions.openNotifications")}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-nowrap items-center gap-1.5 overflow-hidden">
              {NOTIFICATION_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex h-9 items-center gap-2 whitespace-nowrap rounded-[12px] border px-3 text-[13px] leading-[13px] transition-colors",
                    activeTab === tab.id
                      ? "border-[#2563eb] bg-[#2563eb] font-normal text-white"
                      : "border-[#e4e4e4] bg-white font-normal text-[#6b7280]",
                  )}
                  type="button"
                >
                  {t(tab.labelKey)}
                  {tabCounts[tab.id] > 0 && (
                    <span
                      className={cn(
                        "flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-medium leading-[10px]",
                        activeTab === tab.id
                          ? "bg-white text-[#212121]"
                          : "bg-[#2563eb] text-white",
                      )}
                    >
                      {tabCounts[tab.id]}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {filteredNotifications.length > 0 ? (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="text-[16px] font-medium leading-[16px] text-[#212121]">
                    {t("notifications.sections.today")}
                  </h3>
                  <div className="relative" ref={filterRef}>
                    <button
                      type="button"
                      onClick={() => setShowFilter((prev) => !prev)}
                      className="flex items-center gap-1.5 rounded-[10px] py-2 text-[14px] leading-[14px] text-[#828282]"
                    >
                      {filter === "all"
                        ? t("notifications.filters.all")
                        : t("notifications.filters.unread")}
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    {showFilter && (
                      <div className="absolute right-0 top-9 z-10 w-28 rounded-[12px] border border-[#e4e4e4] bg-white py-2 shadow-[0_12px_24px_rgba(0,0,0,0.08)]">
                        <button
                          type="button"
                          onClick={() => {
                            setFilter("all");
                            setShowFilter(false);
                          }}
                          className="w-full px-3 py-1.5 text-left text-[12px] leading-[12px] text-[#3d3d3d] hover:bg-[#f9fafb]"
                        >
                          {t("notifications.filters.all")}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setFilter("unread");
                            setShowFilter(false);
                          }}
                          className="w-full px-3 py-1.5 text-left text-[12px] leading-[12px] text-[#3d3d3d] hover:bg-[#f9fafb]"
                        >
                          {t("notifications.filters.unread")}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="notification-scroll max-h-[453px] overflow-y-auto">
                  {todayNotifications.length > 0 ? (
                    todayNotifications.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        {...notification}
                        onAction={() => console.log("Action clicked")}
                      />
                    ))
                  ) : (
                    <div className="py-2">
                      <NotificationsEmptyState
                        size="sm"
                        title={t("notifications.empty.title")}
                        description={t("notifications.empty.body")}
                      />
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="py-2">
                <NotificationsEmptyState
                  size="sm"
                  title={t("notifications.empty.title")}
                  description={t("notifications.empty.body")}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
