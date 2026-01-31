import { useState, useRef, useEffect, useMemo } from "react";
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
        <div className="absolute right-0 z-50 mt-2 w-96 rounded-lg border border-gray-200 bg-white shadow-lg">
          <div className="flex items-center justify-between border-b border-gray-200 p-4">
            <h2 className="text-base font-semibold text-gray-900">
              {t("notifications.title")}
            </h2>
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu((prev) => !prev)}
                className="rounded p-1 transition-colors hover:bg-gray-100"
                aria-label={t("notifications.actions.moreOptions")}
                type="button"
              >
                <MoreVertical className="h-5 w-5 text-gray-600" />
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-1 w-56 rounded-lg border border-gray-200 bg-white py-2 shadow-lg">
                  <button
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
                    type="button"
                  >
                    {t("notifications.actions.markAllRead")}
                  </button>
                  <button
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
                    type="button"
                  >
                    {t("notifications.actions.settings")}
                  </button>
                  <button
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
                    type="button"
                  >
                    {t("notifications.actions.openNotifications")}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 border-b border-gray-200 px-4 py-3">
            {NOTIFICATION_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium leading-none transition-colors",
                  activeTab === tab.id
                    ? "border-primary bg-primary text-white"
                    : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50",
                )}
                type="button"
              >
                {t(tab.labelKey)}
                {tabCounts[tab.id] > 0 && (
                  <span
                    className={cn(
                      "flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-semibold",
                      activeTab === tab.id
                        ? "bg-white text-primary"
                        : "bg-primary text-white",
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
              <div className="flex items-center justify-between border-b border-gray-100 px-4 py-2.5">
                <h3 className="text-sm font-semibold text-gray-900">
                  {t("notifications.sections.today")}
                </h3>
                <div className="relative" ref={filterRef}>
                  <button
                    type="button"
                    onClick={() => setShowFilter((prev) => !prev)}
                    className="flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-gray-500 hover:bg-gray-100"
                  >
                    {filter === "all"
                      ? t("notifications.filters.all")
                      : t("notifications.filters.unread")}
                    <svg
                      className="h-3.5 w-3.5"
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
                    <div className="absolute right-0 top-8 z-10 w-28 rounded-lg border border-gray-200 bg-white py-2 shadow-lg">
                      <button
                        type="button"
                        onClick={() => {
                          setFilter("all");
                          setShowFilter(false);
                        }}
                        className="w-full px-3 py-1.5 text-left text-xs text-gray-700 hover:bg-gray-50"
                      >
                        {t("notifications.filters.all")}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setFilter("unread");
                          setShowFilter(false);
                        }}
                        className="w-full px-3 py-1.5 text-left text-xs text-gray-700 hover:bg-gray-50"
                      >
                        {t("notifications.filters.unread")}
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {todayNotifications.length > 0 ? (
                  todayNotifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      {...notification}
                      onAction={() => console.log("Action clicked")}
                    />
                  ))
                ) : (
                  <div className="px-4">
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
            <div className="px-4 py-6">
              <NotificationsEmptyState
                size="sm"
                title={t("notifications.empty.title")}
                description={t("notifications.empty.body")}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
