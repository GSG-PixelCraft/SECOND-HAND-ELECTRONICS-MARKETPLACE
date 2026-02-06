import type { Meta, StoryObj } from "@storybook/react";
import { NotificationsEmptyState } from "./NotificationsEmptyState";

const meta: Meta<typeof NotificationsEmptyState> = {
  title: "Components/Feedback/EmptyState/NotificationsEmptyState",
  component: NotificationsEmptyState,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof NotificationsEmptyState>;

export const Default: Story = {
  args: {
    title: "No notifications",
    description: "You are all caught up.",
  },
};

export const Compact: Story = {
  args: {
    title: "No new updates",
    description: "We will notify you when something arrives.",
    size: "sm",
  },
};