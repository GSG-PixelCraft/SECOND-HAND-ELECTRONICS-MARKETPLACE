import type { Meta, StoryObj } from "@storybook/react";
import { FullScreenLoading } from "./full-screen-loading";

const meta: Meta<typeof FullScreenLoading> = {
  title: "Components/Feedback/Loading/FullScreenLoading",
  component: FullScreenLoading,
  tags: ["autodocs"],
  args: {
    open: true,
    message: "Loading...",
    ariaLabel: "Loading",
  },
};

export default meta;
type Story = StoryObj<typeof FullScreenLoading>;

export const Default: Story = {};

export const WithMessage: Story = {
  args: {
    message: "Loading dashboard...",
    ariaLabel: "Loading dashboard",
  },
};
