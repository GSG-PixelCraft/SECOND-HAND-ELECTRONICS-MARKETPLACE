import type { Meta, StoryObj } from "@storybook/react";
import { FiltersPart } from "../FiltersPart/FiltersPart";

const meta = {
  title: "Components/UI/FiltersPart",
  component: FiltersPart,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof FiltersPart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onSearch: (query: string) => console.log("Search query:", query),
    onFilterChange: (filters) => console.log("Filters updated:", filters),
  },
};
