import { useMemo, useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { NotificationItem } from "@/components/notifications/NotificationItem";
import { NotificationsEmptyState } from "@/components/feedback/emptyState";
import { cn } from "@/lib/utils";
import {
  MOCK_NOTIFICATIONS,
  NOTIFICATION_TABS,
  filterNotifications,
  getNotificationTabCounts,
  groupNotificationsByDate,
  type NotificationTabId,
} from "@/components/notifications/notificationTypes";
import { useTranslation } from "react-i18next";

export function NotificationsPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<NotificationTabId>("all");
  const [filterUnread, setFilterUnread] = useState(false);

  const tabCounts = useMemo(
    () => getNotificationTabCounts(MOCK_NOTIFICATIONS),
    [],
  );

  const filteredNotifications = useMemo(
    () => filterNotifications(MOCK_NOTIFICATIONS, activeTab, filterUnread),
    [activeTab, filterUnread],
  );

  const groupedNotifications = useMemo(
    () => groupNotificationsByDate(filteredNotifications),
    [filteredNotifications],
  );

  return (
    <PageLayout title="Notifications">
      <div className="mx-auto max-w-4xl">
        {/* Header with Tabs and Filter */}
        <div className="mb-6 rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-200 p-4">
            <h1 className="text-2xl font-bold text-gray-900">
              {t("notifications.title")}
            </h1>
            <button className="text-sm font-medium text-primary hover:underline">
              {t("notifications.actions.markAllRead")}
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 px-4 pt-3">
            {NOTIFICATION_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "rounded-t-lg px-4 py-2 text-sm font-medium transition-colors",
                  activeTab === tab.id
                    ? "border-b-2 border-primary bg-primary-10 text-primary"
                    : "text-gray-600 hover:bg-gray-50",
                )}
              >
                {t(tab.labelKey)}
                {tabCounts[tab.id] > 0 && (
                  <span
                    className={cn(
                      "ml-2 rounded-full px-2 py-0.5 text-xs font-semibold",
                      activeTab === tab.id
                        ? "bg-primary text-white"
                        : "bg-gray-200 text-gray-700",
                    )}
                  >
                    {tabCounts[tab.id]}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Filter Dropdown */}
          <div className="flex justify-end px-4 pb-3 pt-2">
            <select
              value={filterUnread ? "unread" : "all"}
              onChange={(e) => setFilterUnread(e.target.value === "unread")}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">{t("notifications.filters.all")}</option>
              <option value="unread">
                {t("notifications.filters.unread")}
              </option>
            </select>
          </div>
        </div>

        {/* Notifications List */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
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
                <div key={date}>
                  {/* Date Header */}
                  <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
                    <h2 className="text-sm font-semibold text-gray-700">
                      {date === "Today"
                        ? t("notifications.sections.today")
                        : date === "Yesterday"
                          ? t("notifications.sections.yesterday")
                          : date}
                    </h2>
                  </div>

                  {/* Notifications for this date */}
                  <div className="divide-y divide-gray-100">
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
    </PageLayout>
  );
}
