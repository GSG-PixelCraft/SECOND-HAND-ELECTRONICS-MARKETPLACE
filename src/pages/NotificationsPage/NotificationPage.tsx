import { useMemo, useState } from "react";
import { NotificationItem } from "./components";
import { NotificationsEmptyState } from "@/components/feedback/emptyState";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button/button";
import { Span } from "@/components/ui/Span/span";
import {
  MOCK_NOTIFICATIONS,
  NOTIFICATION_TABS,
  filterNotifications,
  getNotificationTabCounts,
  groupNotificationsByDate,
  type NotificationTabId,
} from "./components";
import { useTranslation } from "react-i18next";

export function NotificationsPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<NotificationTabId>("all");

  const tabCounts = useMemo(
    () => getNotificationTabCounts(MOCK_NOTIFICATIONS),
    [],
  );

  const filteredNotifications = useMemo(
    () => filterNotifications(MOCK_NOTIFICATIONS, activeTab, false),
    [activeTab],
  );

  const groupedNotifications = useMemo(
    () => groupNotificationsByDate(filteredNotifications),
    [filteredNotifications],
  );

  return (
    <div className="flex w-full flex-col items-start bg-white px-24 pb-14 pt-10">
      {/* Page Title */}
      <h1 className="mb-8 w-full font-['Poppins'] text-[24px] font-medium leading-normal text-[#212121]">
        {t("notifications.title")}
      </h1>

      {/* Main Content Area */}
      <div className="flex w-full flex-col gap-6 px-[106px]">
        {/* Tabs */}
        <div className="flex items-start justify-center gap-2">
          {NOTIFICATION_TABS.map((tab) => (
            <Button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex h-9 items-center justify-center gap-2 rounded-[12px] px-6 py-2 font-['Poppins'] text-[14px] leading-normal transition-colors",
                activeTab === tab.id
                  ? "bg-[#2563eb] font-medium text-white"
                  : "border border-[#e4e4e4] bg-white font-normal text-[#6b7280] hover:bg-gray-50",
              )}
            >
              {t(tab.labelKey)}
              {tabCounts[tab.id] > 0 && (
                <Span
                  className={cn(
                    "flex h-4 w-4 items-center justify-center rounded-full font-['Poppins'] text-[10px] font-medium leading-normal",
                    activeTab === tab.id
                      ? "bg-white text-[#212121]"
                      : "bg-[#2563eb] text-white",
                  )}
                >
                  {tabCounts[tab.id]}
                </Span>
              )}
            </Button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="flex w-full flex-col gap-8">
          {filteredNotifications.length === 0 ? (
            <div className="px-4 py-10">
              <NotificationsEmptyState
                title={t("notifications.empty.title")}
                description={t("notifications.empty.body")}
              />
            </div>
          ) : (
            Object.entries(groupedNotifications).map(
              ([date, notifications]) => (
                <div key={date} className="flex w-full flex-col gap-3">
                  {/* Date Header with Mark all as read */}
                  <div className="flex w-full items-center gap-1 px-4">
                    <h2 className="flex-1 font-['Poppins'] text-[20px] font-medium text-[#3d3d3d]">
                      {date === "Today"
                        ? t("notifications.sections.today")
                        : date === "Yesterday"
                          ? t("notifications.sections.yesterday")
                          : date}
                    </h2>
                    {date === "Today" && (
                      <Button
                        type="button"
                        className="font-['Poppins'] text-[16px] font-normal leading-normal text-[#2563eb] hover:underline"
                      >
                        {t("notifications.actions.markAllRead")}
                      </Button>
                    )}
                  </div>

                  {/* Notifications for this date */}
                  <div className="flex w-full flex-col">
                    {notifications.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        {...notification}
                        onAction={() => console.log("Action clicked")}
                      />
                    ))}
                  </div>
                </div>
              ),
            )
          )}
        </div>
      </div>
    </div>
  );
}
