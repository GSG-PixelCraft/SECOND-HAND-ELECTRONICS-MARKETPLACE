import type { Meta, StoryObj } from "@storybook/react";
import { TopHeader } from "./TopHeader";
import {
  ADMIN_NOTIFICATION_TABS,
  ADMIN_NOTIFICATIONS,
} from "@/pages/NotificationsPage/components";

const meta = {
  title: "Components/Admin/UI/TopHeader",
  component: TopHeader,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof TopHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AdminDefault: Story = {
  args: {
    onMenuClick: () => console.log("Mobile menu toggled"),
    onSearchClick: () => console.log("Search opened"),
    onMessageClick: () => console.log("Messages opened"),
    notificationTabs: ADMIN_NOTIFICATION_TABS,
    notificationItems: ADMIN_NOTIFICATIONS,
    notificationButtonVariant: "filled",
    showOpenNotificationsLink: false,
    showProfile: false,
  },
};