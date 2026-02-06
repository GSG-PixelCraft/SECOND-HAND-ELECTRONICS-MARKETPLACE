import type { Meta, StoryObj } from "@storybook/react";
import { FavoritesEmptyState } from "./FavoritesEmptyState";

const meta: Meta<typeof FavoritesEmptyState> = {
  title: "Components/Feedback/EmptyState/FavoritesEmptyState",
  component: FavoritesEmptyState,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof FavoritesEmptyState>;

export const Default: Story = {
  args: {
    title: "No favorites yet",
    description: "Save listings to your favorites to see them here.",
  },
};