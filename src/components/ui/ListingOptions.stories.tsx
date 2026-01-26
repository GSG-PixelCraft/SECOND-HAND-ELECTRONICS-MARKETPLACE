import type { Meta, StoryObj } from "@storybook/react";
import { ListingOptions } from "./ListingOptions";

const meta: Meta<typeof ListingOptions> = {
  title: "UI/ListingOptions",
  component: ListingOptions,
  argTypes: {
    onAction: { action: "onAction" },
  },
};

export default meta;
type Story = StoryObj<typeof ListingOptions>;

export const Active: Story = {
  args: {
    status: "active",
  },
};

export const ProductDetail: Story = {
  args: {
    status: "product",
  },
};

export const Rejected: Story = {
  args: {
    status: "rejected",
  },
};

export const Pending: Story = {
  args: {
    status: "pending",
  },
};

export const Sold: Story = {
  args: {
    status: "sold",
  },
};

export const Archived: Story = {
  args: {
    status: "archived",
  },
};

export const Draft: Story = {
  args: {
    status: "draft",
  },
};
