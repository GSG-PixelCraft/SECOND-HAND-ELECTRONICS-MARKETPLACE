import type { Meta, StoryObj } from "@storybook/react";
import { PendingListingHeader } from "../filters/PendingListingHeader";

const meta = {
  title: "Components/Admin/UI/Filters/PendingListingHeader",
  component: PendingListingHeader,
  tags: ["autodocs"],
} satisfies Meta<typeof PendingListingHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Pending Listings",
    count: 24,
    onFilterClick: () => console.log("Filter clicked"),
  },
};