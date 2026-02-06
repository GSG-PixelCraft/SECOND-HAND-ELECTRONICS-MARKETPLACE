import type { Meta, StoryObj } from "@storybook/react";
import { AppLoading } from "./app-loading";

const meta: Meta<typeof AppLoading> = {
  title: "Components/Feedback/Loading/AppLoading",
  component: AppLoading,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AppLoading>;

export const Default: Story = {};