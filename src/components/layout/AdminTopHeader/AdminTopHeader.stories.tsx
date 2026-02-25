import type { Meta, StoryObj } from "@storybook/react";
import { AdminTopHeader } from "../AdminTopHeader/AdminTopHeader";

const meta: Meta<typeof AdminTopHeader> = {
  title: "Components/Layout/AdminTopHeader",
  component: AdminTopHeader,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof AdminTopHeader>;

export const Default: Story = {
  render: () => <AdminTopHeader />,
};
