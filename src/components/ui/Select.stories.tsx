import type { Meta, StoryObj } from "@storybook/react";
import { Select } from "./select.tsx";

const meta: Meta<typeof Select> = {
  title: "UI/Select",
  component: Select,
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
type Story = StoryObj<typeof Select>;

const sampleOptions = (
  <>
    <option value="">Choose an option</option>
    <option value="phones">Phones</option>
    <option value="laptops">Laptops</option>
    <option value="tablets">Tablets</option>
  </>
);

export const Default: Story = {
  args: {
    children: sampleOptions,
    helperText: "Select a product category",
  },
};

export const ErrorState: Story = {
  args: {
    children: sampleOptions,
    error: "Please select a category",
  },
};

export const Success: Story = {
  args: {
    children: sampleOptions,
    intent: "success",
    helperText: "Looks good!",
  },
};

export const Small: Story = {
  args: {
    children: sampleOptions,
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    children: sampleOptions,
    size: "lg",
  },
};

export const Disabled: Story = {
  args: {
    children: sampleOptions,
    disabled: true,
    helperText: "Selection is disabled",
  },
};
