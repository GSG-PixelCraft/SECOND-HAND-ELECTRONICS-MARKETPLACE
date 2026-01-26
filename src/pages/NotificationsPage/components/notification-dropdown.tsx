import { useState, useRef, useEffect } from "react";
import { Bell, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { NotificationItem } from "@/pages/NotificationsPage/components/NotificationItem";

export interface NotificationDropdownProps {
  className?: string;
}

// Mock data - replace with real data later
const mockNotifications = [
  {
    id: "1",
    type: "message" as const,
    title: "New Message",
    message:
      "Ali Ahmed has sent you a new message about your product iPhone 14 Pro Max.",
    timestamp: "01:30 pm",
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
];

const tabs = [
  { id: "all", label: "All", count: 4 },
  { id: "listings", label: "Listings", count: 2 },
  { id: "chats", label: "Chats", count: 0 },
  { id: "general", label: "General & System", count: 0 },
];

export function NotificationDropdown({ className }: NotificationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const unreadCount = mockNotifications.filter((n) => !n.read).length;

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
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-full p-2 transition-colors hover:bg-gray-100"
        aria-label="Notifications"
      >
        <Bell className="h-6 w-6 text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-96 rounded-lg border border-gray-200 bg-white shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Notifications
            </h2>
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="rounded p-1 transition-colors hover:bg-gray-100"
                aria-label="More options"
              >
                <MoreVertical className="h-5 w-5 text-gray-600" />
              </button>

              {/* Three-dot Menu */}
              {showMenu && (
                <div className="absolute right-0 mt-1 w-56 rounded-lg border border-gray-200 bg-white py-2 shadow-lg">
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50">
                    Mark all as read
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50">
                    Notification settings
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50">
                    Open Notifications
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-gray-200 px-4 pt-3">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "relative rounded-t-lg px-3 py-2 text-sm font-medium transition-colors",
                  activeTab === tab.id
                    ? "bg-primary-10 text-primary"
                    : "text-gray-600 hover:bg-gray-50",
                )}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span
                    className={cn(
                      "ml-1.5 rounded-full px-1.5 py-0.5 text-xs font-semibold",
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

          {/* Notifications List */}
          {mockNotifications.length > 0 ? (
            <div className="max-h-96 overflow-y-auto">
              {mockNotifications.slice(0, 5).map((notification) => (
                <NotificationItem
                  key={notification.id}
                  {...notification}
                  onAction={() => console.log("Action clicked")}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center px-4 py-12">
              <div className="mb-4 flex h-32 w-32 items-center justify-center">
                <svg viewBox="0 0 200 200" className="h-full w-full">
                  <rect
                    x="40"
                    y="30"
                    width="120"
                    height="140"
                    rx="10"
                    fill="#E3F2FD"
                  />
                  <path
                    d="M80 80 L120 120 M120 80 L80 120"
                    stroke="#1976D2"
                    strokeWidth="4"
                  />
                  <circle cx="60" cy="50" r="8" fill="#4FC3F7" />
                  <circle cx="140" cy="50" r="8" fill="#FFD54F" />
                </svg>
              </div>
              <h3 className="mb-1 text-base font-semibold text-gray-900">
                No notifications yet
              </h3>
              <p className="text-center text-sm text-gray-500">
                You'll see updates about your listings, messages, and account
                activity here.
              </p>
            </div>
          )}

          {/* Footer */}
          {mockNotifications.length > 0 && (
            <div className="border-t border-gray-200 p-3 text-center">
              <button className="text-sm font-medium text-primary hover:underline">
                See all
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
