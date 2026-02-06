import type { Meta, StoryObj } from "@storybook/react";
import { ListingStatusBadge } from "./ListingStatusBadge";

const meta: Meta<typeof ListingStatusBadge> = {
  title: "Components/Admin/UI/Badges/ListingStatusBadge",
  component: ListingStatusBadge,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ListingStatusBadge>;

export const Pending: Story = {
  args: {
    status: "pending",
  },
};

export const AllStatuses: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <ListingStatusBadge status="pending" />
      <ListingStatusBadge status="active" />
      <ListingStatusBadge status="rejected" />
      <ListingStatusBadge status="sold" />
      <ListingStatusBadge status="hidden" />
      <ListingStatusBadge status="removed" />
    </div>
  ),
};