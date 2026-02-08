// src/components/ui/Checkbox.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "./checkbox";

const meta: Meta<typeof Checkbox> = {
  title: "UI/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  argTypes: {
    intent: {
      control: "select",
      options: ["default", "error"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {
    label: "Accept terms and conditions",
  },
};

export const WithHelperText: Story = {
  args: {
    label: "Subscribe to newsletter",
    helperText: "We'll send you updates once a week",
  },
};

export const WithError: Story = {
  args: {
    label: "I agree to the terms",
    error: "You must accept the terms to continue",
  },
};

export const Disabled: Story = {
  args: {
    label: "Disabled checkbox",
    disabled: true,
  },
};

export const Small: Story = {
  args: {
    label: "Small checkbox",
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    label: "Large checkbox",
    size: "lg",
  },
};

export const WithoutLabel: Story = {
  args: {},
};
