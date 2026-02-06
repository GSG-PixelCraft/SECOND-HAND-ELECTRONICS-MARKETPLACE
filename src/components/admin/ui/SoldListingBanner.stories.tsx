import type { Meta, StoryObj } from "@storybook/react";
import { SoldListingBanner } from "./SoldListingBanner";

const meta: Meta<typeof SoldListingBanner> = {
  title: "Components/Admin/UI/SoldListingBanner",
  component: SoldListingBanner,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SoldListingBanner>;

export const Default: Story = {
  args: {
    soldAt: "2026-01-15T10:30:00Z",
    soldTo: "Alex Morgan",
    price: 799,
  },
};