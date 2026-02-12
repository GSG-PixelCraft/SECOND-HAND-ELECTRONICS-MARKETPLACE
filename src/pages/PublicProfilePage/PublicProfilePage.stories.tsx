import type { Meta, StoryObj } from "@storybook/react";
import PublicProfilePage from "./PublicProfilePage";

const meta: Meta<typeof PublicProfilePage> = {
  title: "Pages/PublicProfilePage",
  component: PublicProfilePage,
};

export default meta;

type Story = StoryObj<typeof PublicProfilePage>;

export const Default: Story = {};
