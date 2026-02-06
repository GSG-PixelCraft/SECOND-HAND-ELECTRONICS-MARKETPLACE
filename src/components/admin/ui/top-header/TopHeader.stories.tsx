import type { Meta, StoryObj } from "@storybook/react";
import { TopHeader } from "./TopHeader";

const meta = {
    title: "Admin/UI/TopHeader",
    component: TopHeader,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
    argTypes: {
        notificationCount: {
            control: { type: "number", min: 0, max: 99 },
            description: "Number of unread notifications",
        },
        userName: {
            control: "text",
            description: "User's display name",
        },
        userRole: {
            control: "text",
            description: "User's role or title",
        },
        showSearch: {
            control: "boolean",
            description: "Show/hide search bar",
        },
        showNotifications: {
            control: "boolean",
            description: "Show/hide notifications bell",
        },
    },
} satisfies Meta<typeof TopHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        userName: "John Doe",
        userRole: "Administrator",
        notificationCount: 0,
        showSearch: true,
        showNotifications: true,
        showProfile: true,
    },
};

export const WithNotifications: Story = {
    args: {
        userName: "Jane Smith",
        userRole: "Super Admin",
        notificationCount: 5,
        showSearch: true,
        showNotifications: true,
        showProfile: true,
    },
};

export const ManyNotifications: Story = {
    args: {
        userName: "Admin User",
        userRole: "Administrator",
        notificationCount: 99,
        showSearch: true,
        showNotifications: true,
        showProfile: true,
    },
};

export const WithAvatar: Story = {
    args: {
        userName: "Sarah Johnson",
        userRole: "Content Manager",
        notificationCount: 3,
        userAvatar: "https://i.pravatar.cc/150?img=5",
        showSearch: true,
        showNotifications: true,
        showProfile: true,
    },
};

export const NoSearch: Story = {
    args: {
        userName: "Mike Wilson",
        userRole: "Moderator",
        notificationCount: 2,
        showSearch: false,
        showNotifications: true,
        showProfile: true,
    },
};

export const NoNotifications: Story = {
    args: {
        userName: "Emily Brown",
        userRole: "Administrator",
        showSearch: true,
        showNotifications: false,
        showProfile: true,
    },
};

export const Minimal: Story = {
    args: {
        userName: "Admin",
        userRole: "Admin",
        showSearch: false,
        showNotifications: false,
        showMessages: false,
        showProfile: false,
    },
};

export const Interactive: Story = {
    args: {
        userName: "Interactive User",
        userRole: "Administrator",
        notificationCount: 7,
        onMenuClick: () => console.log("Menu clicked"),
        onSearchClick: () => console.log("Search clicked"),
        onNotificationClick: () => console.log("Notifications clicked"),
        onProfileClick: () => console.log("Profile clicked"),
        showProfile: true,
    },
};
