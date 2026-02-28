import type { Meta, StoryObj } from "@storybook/react";
import { AdminDashboardLayout } from "../adminLayout/AdminDashboardLayout";

const meta: Meta<typeof AdminDashboardLayout> = {
  title: "Components/Layout/AdminDashboardLayout",
  component: AdminDashboardLayout,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof AdminDashboardLayout>;

export const Default: Story = {
  render: () => (
    <AdminDashboardLayout>
      <div className="rounded-xl border border-dashed border-neutral-20 bg-white p-6">
        Admin dashboard content
      </div>
    </AdminDashboardLayout>
  ),
};
