import type { Meta, StoryObj } from "@storybook/react";
import { Tip } from "./Tip";

const meta = {
  title: "Components/Admin/UI/Tips/Tip",
  component: Tip,
  tags: ["autodocs"],
} satisfies Meta<typeof Tip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: {
    title: "Pro Tip",
    children: "You can use bulk actions to manage multiple listings at once.",
    variant: "info",
  },
};

export const Warning: Story = {
  args: {
    children: "Removing this category will affect all associated listings.",
    variant: "warning",
  },
};