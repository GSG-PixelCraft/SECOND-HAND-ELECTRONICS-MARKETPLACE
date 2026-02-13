// src/components/ui/RadioGroup.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { RadioGroup } from "./radio-group";

const meta: Meta<typeof RadioGroup> = {
  title: "Components/UI/RadioGroup",
  component: RadioGroup,
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
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

const sampleOptions = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
];

export const Default: Story = {
  args: {
    name: "default-radio",
    options: sampleOptions,
    label: "Choose an option",
  },
};

export const Horizontal: Story = {
  args: {
    name: "horizontal-radio",
    options: sampleOptions,
    label: "Horizontal layout",
    orientation: "horizontal",
  },
};

export const WithHelperText: Story = {
  args: {
    name: "helper-radio",
    options: sampleOptions,
    label: "Select your preference",
    helperText: "This choice cannot be changed later",
  },
};

export const WithError: Story = {
  args: {
    name: "error-radio",
    options: sampleOptions,
    label: "Required selection",
    error: "Please select an option",
  },
};

export const Small: Story = {
  args: {
    name: "small-radio",
    options: sampleOptions,
    label: "Small size",
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    name: "large-radio",
    options: sampleOptions,
    label: "Large size",
    size: "lg",
  },
};

export const WithDisabledOption: Story = {
  args: {
    name: "disabled-radio",
    options: [
      { value: "option1", label: "Option 1" },
      { value: "option2", label: "Option 2 (Disabled)", disabled: true },
      { value: "option3", label: "Option 3" },
    ],
    label: "Some options disabled",
  },
};
