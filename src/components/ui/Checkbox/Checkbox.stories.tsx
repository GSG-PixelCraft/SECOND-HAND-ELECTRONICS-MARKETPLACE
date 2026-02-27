// src/components/ui/Checkbox.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "../Checkbox/checkbox";

const meta: Meta<typeof Checkbox> = {
  title: "Components/UI/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {
    label: "Accept terms and conditions",
    onChange: () => {},
  },
};

export const Checked: Story = {
  args: {
    label: "Receive updates",
    checked: true,
    onChange: () => {},
  },
};
