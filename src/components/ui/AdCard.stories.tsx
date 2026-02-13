import type { Meta, StoryObj } from "@storybook/react";
import { AdCard } from "./AdCard";

const meta: Meta<typeof AdCard> = {
  title: "Components/UI/AdCard",
  component: AdCard,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AdCard>;

export const Default: Story = {
  args: {
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
    title: "iPhone 14 Pro Max",
    price: "$1,050",
    location: "Ramallah",
    category: "Electronics",
  },
};
