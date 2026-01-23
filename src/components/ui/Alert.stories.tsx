import type { Meta, StoryObj } from "@storybook/react";
import { Alert } from "./alert";

const meta: Meta<typeof Alert> = {
  title: "UI/Alert",
  component: Alert,
  args: {
    children: "Something went wrong. Please try again.",
  },
};

export default meta;

type Story = StoryObj<typeof Alert>;

export const ErrorState: Story = {
  args: {
    variant: "error",
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
    children: "This action may have unintended consequences.",
  },
};

export const Info: Story = {
  args: {
    variant: "info",
    children: "Please review the information below.",
  },
};

export const Success: Story = {
  args: {
    variant: "success",
    children: "Your changes were saved successfully.",
  },
};
