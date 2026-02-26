import type { Meta, StoryObj } from "@storybook/react";
import PageLayout from "../PageLayout/PageLayout";

const meta: Meta<typeof PageLayout> = {
  title: "Components/Layout/PageLayout",
  component: PageLayout,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof PageLayout>;

export const Default: Story = {
  args: {
    title: "Settings",
    subtitle: "Manage your account settings",
    children: (
      <div className="rounded-lg border border-neutral-10 bg-neutral-5 p-4">
        Page content goes here.
      </div>
    ),
  },
};
