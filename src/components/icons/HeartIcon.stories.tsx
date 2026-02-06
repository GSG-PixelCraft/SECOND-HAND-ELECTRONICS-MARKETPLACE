import type { Meta, StoryObj } from "@storybook/react";
import { HeartIcon } from "./HeartIcon";

const meta: Meta<typeof HeartIcon> = {
  title: "Components/Icons/HeartIcon",
  component: HeartIcon,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof HeartIcon>;

export const Default: Story = {
  args: {
    className: "h-8 w-8 text-primary",
  },
};