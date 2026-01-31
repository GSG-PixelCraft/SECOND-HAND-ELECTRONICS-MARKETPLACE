export type NotificationTabId = "all" | "listings" | "chats" | "general";

export type NotificationCategory = "listings" | "chats" | "general";

export type NotificationType =
  | "message"
  | "listing_update"
  | "identity"
  | "order"
  | "pending"
  | "system"
  | "warning"
  | "deleted";

export interface NotificationItemData {
  id: string;
  type: NotificationType;
  category: NotificationCategory;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionLabel?: string;
  actionUrl?: string;
  dateGroup: string;
}

export interface NotificationTab {
  id: NotificationTabId;
  labelKey: string;
}

export const NOTIFICATION_TABS: NotificationTab[] = [
  { id: "all", labelKey: "notifications.tabs.all" },
  { id: "listings", labelKey: "notifications.tabs.listings" },
  { id: "chats", labelKey: "notifications.tabs.chats" },
  { id: "general", labelKey: "notifications.tabs.general" },
];

export const MOCK_NOTIFICATIONS: NotificationItemData[] = [
  {
    id: "1",
    type: "message",
    category: "chats",
    title: "New Message",
    message:
      "Ali Ahmed has sent you a new message about your product iPhone 14 Pro Max.",
    timestamp: "01:30 pm",
    read: false,
    actionLabel: "Open Chat",
    dateGroup: "Today",
  },
  {
    id: "2",
    type: "listing_update",
    category: "listings",
    title: "Listing visibility reduced",
    message:
      "This listing hasn't been updated recently and may appear lower in search results.",
    timestamp: "01:50 pm",
    read: false,
    actionLabel: "Edit Listing",
    dateGroup: "Today",
  },
  {
    id: "3",
    type: "identity",
    category: "general",
    title: "Success Identity verified",
    message:
      "Your identity is verified. This helps build trust with other users.",
    timestamp: "01:50 pm",
    read: false,
    dateGroup: "Today",
  },
  {
    id: "4",
    type: "pending",
    category: "listings",
    title: "Your listing under review",
    message:
      "Your list is currently being reviewed by admins you'll be notified once a decision is made.",
    timestamp: "01:50 pm",
    read: false,
    dateGroup: "Today",
  },
  {
    id: "5",
    type: "warning",
    category: "listings",
    title: "Your listing rejected",
    message:
      "Your listing didn't meet our guidelines. Please review the reason and update it.",
    timestamp: "01:50 pm",
    read: true,
    actionLabel: "View Reason",
    dateGroup: "Yesterday",
  },
  {
    id: "6",
    type: "listing_update",
    category: "listings",
    title: "Listing visibility reduced",
    message:
      "This listing hasn't been updated recently and may appear lower in search results.",
    timestamp: "01:50 pm",
    read: true,
    actionLabel: "Edit Listing",
    dateGroup: "Yesterday",
  },
  {
    id: "7",
    type: "identity",
    category: "general",
    title: "Phone verified",
    message: "Your phone number has been verified successfully.",
    timestamp: "01:50 pm",
    read: true,
    dateGroup: "10 December 2025",
  },
  {
    id: "8",
    type: "listing_update",
    category: "listings",
    title: "Listing visibility reduced",
    message:
      "This listing hasn't been updated recently and may appear lower in search results.",
    timestamp: "01:50 pm",
    read: true,
    actionLabel: "Edit Listing",
    dateGroup: "10 December 2025",
  },
  {
    id: "9",
    type: "deleted",
    category: "listings",
    title: "Your listing deleted",
    message:
      "Your listing has been deleted successfully. It is no visible to others.",
    timestamp: "01:50 pm",
    read: true,
    dateGroup: "10 December 2025",
  },
];

export const getNotificationTabCounts = (
  items: NotificationItemData[],
): Record<NotificationTabId, number> => {
  const listingCount = items.filter(
    (item) => item.category === "listings",
  ).length;
  const chatCount = items.filter((item) => item.category === "chats").length;
  const generalCount = items.filter(
    (item) => item.category === "general",
  ).length;

  return {
    all: items.length,
    listings: listingCount,
    chats: chatCount,
    general: generalCount,
  };
};

export const filterNotifications = (
  items: NotificationItemData[],
  activeTab: NotificationTabId,
  unreadOnly: boolean,
): NotificationItemData[] => {
  return items.filter((item) => {
    const matchesTab = activeTab === "all" ? true : item.category === activeTab;
    const matchesUnread = unreadOnly ? !item.read : true;

    return matchesTab && matchesUnread;
  });
};

export const groupNotificationsByDate = (
  items: NotificationItemData[],
): Record<string, NotificationItemData[]> => {
  return items.reduce<Record<string, NotificationItemData[]>>((acc, item) => {
    if (!acc[item.dateGroup]) {
      acc[item.dateGroup] = [];
    }
    acc[item.dateGroup].push(item);
    return acc;
  }, {});
};
