import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../Button/button";

const meta: Meta<typeof Button> = {
  title: "Components/UI/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    intent: {
      control: "select",
      options: ["primary", "outline", "danger"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    fullWidth: {
      control: "boolean",
    },
    disabled: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: "Button",
  },
};

export const Primary: Story = {
  args: {
    intent: "primary",
    children: "Primary Button",
  },
};

export const Outline: Story = {
  args: {
    intent: "outline",
    children: "Outline Button",
  },
};

export const Danger: Story = {
  args: {
    intent: "danger",
    children: "Delete Item",
  },
};

export const Small: Story = {
  args: {
    size: "sm",
    children: "Small Button",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
    children: "Large Button",
  },
};

export const FullWidth: Story = {
  args: {
    fullWidth: true,
    children: "Full Width Button",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: "Disabled Button",
  },
};
