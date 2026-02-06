import type { Meta, StoryObj } from "@storybook/react";
import { PhotoTips } from "./PhotoTips";

const meta = {
  title: "Components/Admin/UI/Tips/PhotoTips",
  component: PhotoTips,
  tags: ["autodocs"],
} satisfies Meta<typeof PhotoTips>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};