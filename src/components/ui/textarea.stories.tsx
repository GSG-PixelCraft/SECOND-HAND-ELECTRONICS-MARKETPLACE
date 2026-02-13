import type { Meta, StoryObj } from "@storybook/react";
import { Textarea } from "./textarea.tsx";

const meta: Meta<typeof Textarea> = {
  title: "Components/UI/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  argTypes: {
    intent: {
      control: "select",
      options: ["default", "error", "success"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    disabled: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: {
    placeholder: "Write your message here...",
    rows: 4,
  },
};

export const ErrorState: Story = {
  args: {
    placeholder: "Invalid description",
    intent: "error",
    rows: 4,
  },
};

export const Success: Story = {
  args: {
    placeholder: "Looks good!",
    intent: "success",
    rows: 4,
  },
};

export const Small: Story = {
  args: {
    placeholder: "Small textarea",
    size: "sm",
    rows: 3,
  },
};

export const Large: Story = {
  args: {
    placeholder: "Large textarea",
    size: "lg",
    rows: 6,
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "Cannot type here",
    disabled: true,
    rows: 4,
  },
};
