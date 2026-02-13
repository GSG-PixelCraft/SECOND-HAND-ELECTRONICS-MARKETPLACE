import type { Meta, StoryObj } from "@storybook/react";
import { PageTitle } from "./PageTitle";

const meta: Meta<typeof PageTitle> = {
  title: "Components/Layout/PageTitle",
  component: PageTitle,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PageTitle>;

export const Default: Story = {
  args: {
    children: "Dashboard",
    subtitle: "Manage your account and listings",
  },
};
