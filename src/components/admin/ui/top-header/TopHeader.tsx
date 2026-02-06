import * as React from "react";
import { cn } from "@/lib/utils";
import { Text } from "@/components/ui/text";
import { Span } from "@/components/ui/span";
import { Image } from "@/components/ui/image";
import { NotificationMenu } from "@/pages/NotificationsPage/components";
import type {
    NotificationItemData,
    NotificationTab,
} from "@/pages/NotificationsPage/components";
import { Bell, Menu as MenuIcon, MessageSquare, Search } from "lucide-react";

export interface TopHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    onMenuClick?: () => void;
    onSearchClick?: () => void;
    onSearchChange?: (value: string) => void;
    onNotificationClick?: () => void;
    onMessageClick?: () => void;
    onProfileClick?: () => void;
    notificationCount?: number;
    notificationItems?: NotificationItemData[];
    notificationTabs?: NotificationTab[];
    notificationButtonVariant?: "ghost" | "filled";
    notificationsHref?: string;
    showOpenNotificationsLink?: boolean;
    userAvatar?: string;
    userName?: string;
    userRole?: string;
    showSearch?: boolean;
    showNotifications?: boolean;
    showMessages?: boolean;
    showProfile?: boolean;
    searchPlaceholder?: string;
}

export const TopHeader = React.forwardRef<HTMLDivElement, TopHeaderProps>(
    (
        {
            onMenuClick,
            onSearchClick,
            onSearchChange,
            onNotificationClick,
            onMessageClick,
            onProfileClick,
            notificationCount = 0,
            notificationItems,
            notificationTabs,
            notificationButtonVariant = "ghost",
            notificationsHref,
            showOpenNotificationsLink = true,
            userAvatar,
            userName = "Admin User",
            userRole = "Administrator",
            showSearch = true,
            showNotifications = true,
            showMessages = true,
            showProfile = false,
            searchPlaceholder = "Search ...",
            className,
            ...props
        },
        ref,
    ) => {
        const [searchValue, setSearchValue] = React.useState("");
        const showSimpleNotification =
            Boolean(onNotificationClick) && !notificationItems && !notificationTabs;

        return (
            <header
                ref={ref}
                className={cn(
                    "sticky top-0 z-50 flex items-center justify-between gap-4 border-b border-[#e4e4e4] bg-white px-6 py-4",
                    className,
                )}
                {...props}
            >
                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        onClick={onMenuClick}
                        className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#e4e4e4] text-[#6b7280] transition-colors hover:bg-[#f9fafb] lg:hidden"
                        aria-label="Toggle menu"
                    >
                        <MenuIcon className="h-5 w-5" />
                    </button>

                    {showSearch && (
                        <div className="relative hidden w-[520px] max-w-[520px] flex-1 md:flex">
                            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#bdbdbd]" />
                            <input
                                value={searchValue}
                                onChange={(event) => {
                                    setSearchValue(event.target.value);
                                    onSearchChange?.(event.target.value);
                                }}
                                onFocus={onSearchClick}
                                placeholder={searchPlaceholder}
                                className="w-full rounded-[12px] border border-[#e4e4e4] bg-white py-2.5 pl-10 pr-4 text-[14px] text-[#3d3d3d] placeholder:text-[#bdbdbd] focus:border-[#2563eb] focus:outline-none"
                            />
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    {showSearch && (
                        <button
                            type="button"
                            onClick={onSearchClick}
                            className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#e4e4e4] text-[#6b7280] transition-colors hover:bg-[#f9fafb] md:hidden"
                            aria-label="Search"
                        >
                            <Search className="h-4 w-4" />
                        </button>
                    )}

                    {showNotifications && (
                        <>
                            {showSimpleNotification ? (
                                <button
                                    type="button"
                                    onClick={onNotificationClick}
                                    className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[#e4e4e4] text-[#2563eb] transition-colors hover:bg-[#f5f7ff]"
                                    aria-label="Notifications"
                                >
                                    <Bell className="h-4 w-4" />
                                    {notificationCount > 0 && (
                                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-error text-[10px] font-bold text-white">
                                            {notificationCount > 9 ? "9+" : notificationCount}
                                        </span>
                                    )}
                                </button>
                            ) : (
                                <NotificationMenu
                                    className="shrink-0"
                                    items={notificationItems}
                                    tabs={notificationTabs}
                                    notificationsHref={notificationsHref}
                                    showOpenLink={showOpenNotificationsLink}
                                    buttonVariant={notificationButtonVariant}
                                />
                            )}
                        </>
                    )}

                    {showMessages && (
                        <button
                            type="button"
                            onClick={onMessageClick}
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e4e4e4] text-[#2563eb] transition-colors hover:bg-[#f5f7ff]"
                            aria-label="Messages"
                        >
                            <MessageSquare className="h-4 w-4" />
                        </button>
                    )}

                    {showProfile && (
                        <button
                            type="button"
                            onClick={onProfileClick}
                            className="flex items-center gap-3 rounded-full border border-[#e4e4e4] bg-white px-2 py-1.5 transition-colors hover:bg-[#f9fafb]"
                        >
                            <div className="hidden sm:flex flex-col items-end">
                                <Text variant="body" className="font-semibold text-neutral-90">
                                    {userName}
                                </Text>
                                <Span variant="caption" className="text-neutral-50">
                                    {userRole}
                                </Span>
                            </div>
                            <div className="relative h-9 w-9 rounded-full overflow-hidden bg-neutral-10 border border-neutral-20">
                                {userAvatar ? (
                                    <Image
                                        src={userAvatar}
                                        alt={userName}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-primary text-white font-semibold text-sm">
                                        {userName.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                        </button>
                    )}
                </div>
            </header>
        );
    },
);

TopHeader.displayName = "TopHeader";
