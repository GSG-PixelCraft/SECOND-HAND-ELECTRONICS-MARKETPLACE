import { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { NotificationItem } from "./components";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "all", label: "All", count: 8 },
  { id: "listings", label: "Listings", count: 2 },
  { id: "chats", label: "Chats", count: 0 },
  { id: "general", label: "General & System", count: 0 },
];

// Mock data grouped by date
const notificationsByDate = {
  Today: [
    {
      id: "1",
      type: "message" as const,
      title: "New Message",
      message:
        "Ali Ahmed has sent you a new message about your product iPhone 14 Pro Max.",
      timestamp: "01:50 pm",
      read: false,
      actionLabel: "Open Chat",
    },
    {
      id: "2",
      type: "listing_update" as const,
      title: "Listing visibility reduced",
      message:
        "This listing hasn't been updated recently and may appear lower in search results.",
      timestamp: "01:50 pm",
      read: false,
      actionLabel: "Edit Listing",
    },
    {
      id: "3",
      type: "identity" as const,
      title: "Success Identity verified",
      message:
        "Your identity is verified. This helps build trust with other users.",
      timestamp: "01:50 pm",
      read: false,
    },
    {
      id: "4",
      type: "order" as const,
      title: "Your listing under review",
      message:
        "Your list is currently being reviewed by admins you'll be notified once a decision is made.",
      timestamp: "01:50 pm",
      read: false,
    },
  ],
  Yesterday: [
    {
      id: "5",
      type: "warning" as const,
      title: "Your listing rejected",
      message:
        "Your listing didn't meet our guidelines. Please review the reason and update it.",
      timestamp: "01:50 pm",
      read: true,
      actionLabel: "View Reason",
    },
    {
      id: "6",
      type: "listing_update" as const,
      title: "Listing visibility reduced",
      message:
        "This listing hasn't been updated recently and may appear lower in search results.",
      timestamp: "01:50 pm",
      read: true,
      actionLabel: "Edit Listing",
    },
  ],
  "10 December 2025": [
    {
      id: "7",
      type: "identity" as const,
      title: "Phone verified",
      message: "Your phone number has been verified successfully.",
      timestamp: "01:50 pm",
      read: true,
    },
    {
      id: "8",
      type: "listing_update" as const,
      title: "Listing visibility reduced",
      message:
        "This listing hasn't been updated recently and may appear lower in search results.",
      timestamp: "01:50 pm",
      read: true,
      actionLabel: "Edit Listing",
    },
    {
      id: "9",
      type: "deleted" as const,
      title: "Your listing deleted",
      message:
        "Your listing has been deleted successfully. It is no visible to others.",
      timestamp: "01:50 pm",
      read: true,
    },
  ],
};

export function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [filterUnread, setFilterUnread] = useState(false);

  return (
    <PageLayout title="Notifications">
      <div className="mx-auto max-w-4xl">
        {/* Header with Tabs and Filter */}
        <div className="mb-6 rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-200 p-4">
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            <button className="text-sm font-medium text-primary hover:underline">
              Mark all as read
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 px-4 pt-3">
            {tabs.map((tab) => (
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
                {tab.label}
                {tab.count > 0 && (
                  <span
                    className={cn(
                      "ml-2 rounded-full px-2 py-0.5 text-xs font-semibold",
                      activeTab === tab.id
                        ? "bg-primary text-white"
                        : "bg-gray-200 text-gray-700",
                    )}
                  >
                    {tab.count}
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
              <option value="all">All</option>
              <option value="unread">Unread</option>
            </select>
          </div>
        </div>

        {/* Notifications List */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          {Object.entries(notificationsByDate).map(([date, notifications]) => (
            <div key={date}>
              {/* Date Header */}
              <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
                <h2 className="text-sm font-semibold text-gray-700">{date}</h2>
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
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
