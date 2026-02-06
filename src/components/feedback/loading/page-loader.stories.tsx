import type { Meta, StoryObj } from "@storybook/react";
import { PageLoader } from "./page-loader";

const meta: Meta<typeof PageLoader> = {
  title: "Components/Feedback/Loading/PageLoader",
  component: PageLoader,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PageLoader>;

export const Default: Story = {};