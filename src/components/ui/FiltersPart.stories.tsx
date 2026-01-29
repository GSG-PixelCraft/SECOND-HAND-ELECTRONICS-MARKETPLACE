import type { Meta, StoryObj } from "@storybook/react";
import { FiltersPart } from "./FiltersPart";

const meta = {
  title: "Components/FiltersPart",
  component: FiltersPart,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof FiltersPart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithSearchAndFilters: Story = {
  args: {},
};
