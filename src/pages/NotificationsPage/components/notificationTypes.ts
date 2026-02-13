export type NotificationTabId =
  | "all"
  | "listings"
  | "chats"
  | "general"
  | "verifications"
  | "users";

export type NotificationCategory =
  | "listings"
  | "chats"
  | "general"
  | "verifications"
  | "users";

export type NotificationType =
  | "message"
  | "listing_update"
  | "identity"
  | "order"
  | "pending"
  | "system"
  | "warning"
  | "deleted"
  | "pending_review"
  | "verification_request"
  | "user_signup";

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

export const ADMIN_NOTIFICATION_TABS: NotificationTab[] = [
  { id: "all", labelKey: "notifications.tabs.all" },
  { id: "listings", labelKey: "notifications.tabs.listings" },
  { id: "verifications", labelKey: "notifications.tabs.verifications" },
  { id: "users", labelKey: "notifications.tabs.users" },
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

export const ADMIN_NOTIFICATIONS: NotificationItemData[] = [
  {
    id: "a1",
    type: "pending_review",
    category: "listings",
    title: "New Product Pending Review",
    message: 'User "Ali Ahmed" submitted a product "Samsung A71".',
    timestamp: "05:30 pm",
    read: false,
    dateGroup: "Today",
  },
  {
    id: "a2",
    type: "verification_request",
    category: "verifications",
    title: "New Verification Request",
    message: 'User "Mona Saeed" submitted a verification document.',
    timestamp: "01:30 pm",
    read: false,
    dateGroup: "Today",
  },
  {
    id: "a3",
    type: "user_signup",
    category: "users",
    title: "New User Signed Up",
    message: 'New user "Ibrahim Khaled" registered an account.',
    timestamp: "12:30 pm",
    read: false,
    actionLabel: "View Profile",
    dateGroup: "Today",
  },
  {
    id: "a4",
    type: "pending_review",
    category: "listings",
    title: "New Product Pending Review",
    message: 'User "Salma Ali" submitted a product "iPhone 14".',
    timestamp: "11:40 am",
    read: true,
    dateGroup: "Today",
  },
  {
    id: "a5",
    type: "pending_review",
    category: "listings",
    title: "New Product Pending Review",
    message: 'User "Ali Ahmed" submitted a product "Samsung A71".',
    timestamp: "10:32 am",
    read: true,
    dateGroup: "Today",
  },
];

export const getNotificationTabCounts = (
  items: NotificationItemData[],
  tabs: NotificationTab[] = NOTIFICATION_TABS,
): Record<string, number> => {
  return tabs.reduce<Record<string, number>>((acc, tab) => {
    acc[tab.id] =
      tab.id === "all"
        ? items.length
        : items.filter((item) => item.category === tab.id).length;
    return acc;
  }, {});
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
