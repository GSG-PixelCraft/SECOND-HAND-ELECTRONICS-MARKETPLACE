import type { Meta, StoryObj } from "@storybook/react";
import { CustomerServiceStatus } from "./CustomerServiceStatus";

const meta = {
  title: "Components/Admin/UI/Status/CustomerServiceStatus",
  component: CustomerServiceStatus,
  tags: ["autodocs"],
  argTypes: {
    status: {
      control: "select",
      options: ["open", "in-progress", "resolved", "closed"],
    },
    showDot: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof CustomerServiceStatus>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = { args: { status: "open" } };
export const InProgress: Story = { args: { status: "in-progress" } };
export const Resolved: Story = { args: { status: "resolved" } };
export const Closed: Story = { args: { status: "closed" } };
export const NoDot: Story = { args: { status: "open", showDot: false } };