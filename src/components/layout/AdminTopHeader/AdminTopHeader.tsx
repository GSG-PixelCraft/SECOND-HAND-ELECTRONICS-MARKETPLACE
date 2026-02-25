import { TopHeader } from "@/components/admin";
import {
  ADMIN_NOTIFICATION_TABS,
  ADMIN_NOTIFICATIONS,
} from "@/pages/NotificationsPage/components";

export function AdminTopHeader() {
  return (
    <TopHeader
      onMenuClick={() => console.log("Mobile menu toggled")}
      onSearchClick={() => console.log("Search opened")}
      onMessageClick={() => console.log("Messages opened")}
      notificationTabs={ADMIN_NOTIFICATION_TABS}
      notificationItems={ADMIN_NOTIFICATIONS}
      notificationButtonVariant="filled"
      showOpenNotificationsLink={false}
      showProfile={false}
    />
  );
}
