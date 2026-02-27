import type { Meta, StoryObj } from "@storybook/react";
import { SearchSort } from "../SearchSort/SearchSort";

const meta: Meta<typeof SearchSort> = {
  title: "Components/UI/SearchSort",
  component: SearchSort,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SearchSort>;

export const Default: Story = {
  args: {
    onSortChange: (sortBy: string) => console.log("Sort by:", sortBy),
  },
};
