import type { Meta, StoryObj } from "@storybook/react";
import { VerificationStatus } from "./VerificationStatus";

const meta = {
  title: "Components/Admin/UI/Status/VerificationStatus",
  component: VerificationStatus,
  tags: ["autodocs"],
  argTypes: {
    status: {
      control: "select",
      options: ["pending", "verified", "rejected", "under-review"],
    },
  },
} satisfies Meta<typeof VerificationStatus>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Pending: Story = { args: { status: "pending" } };
export const Verified: Story = { args: { status: "verified" } };
export const Rejected: Story = { args: { status: "rejected" } };
export const UnderReview: Story = { args: { status: "under-review" } };
