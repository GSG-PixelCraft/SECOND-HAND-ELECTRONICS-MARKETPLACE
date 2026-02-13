import type { Meta, StoryObj } from "@storybook/react";
import { RemovedListingBanner } from "./RemovedListingBanner";

const meta: Meta<typeof RemovedListingBanner> = {
  title: "Components/Admin/UI/RemovedListingBanner",
  component: RemovedListingBanner,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof RemovedListingBanner>;

export const Default: Story = {
  args: {
    removedAt: "2026-01-20T14:45:00Z",
    removedBy: "Admin Team",
    reason: "policy_violation",
    comment:
      "This listing violates marketplace guidelines. Please update and resubmit.",
  },
};
