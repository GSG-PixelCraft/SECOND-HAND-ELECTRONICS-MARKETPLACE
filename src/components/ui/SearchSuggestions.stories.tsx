import type { Meta, StoryObj } from "@storybook/react";
import { SearchSuggestions } from "./SearchSuggestions";

const meta: Meta<typeof SearchSuggestions> = {
  title: "UI/SearchSuggestions",
  component: SearchSuggestions,
};

export default meta;

type Story = StoryObj<typeof SearchSuggestions>;

export const Default: Story = {
  args: {
    suggestions: ["Laptop", "Laptop charger", "Laptop bag", "Laptop stand"],
    onSelect: (value) => {
      console.log("Selected:", value);
    },
  },
};

export const Empty: Story = {
  args: {
    suggestions: [],
  },
};
