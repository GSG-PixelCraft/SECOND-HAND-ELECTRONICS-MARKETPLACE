import type { Meta, StoryObj } from "@storybook/react";
import { AdminSidebar } from "./AdminSidebar";

const meta: Meta<typeof AdminSidebar> = {
  title: "Components/Layout/AdminSidebar",
  component: AdminSidebar,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof AdminSidebar>;

export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-neutral-5">
      <AdminSidebar />
    </div>
  ),
};