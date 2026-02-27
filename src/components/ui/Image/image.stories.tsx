import type { Meta, StoryObj } from "@storybook/react";
import { Image } from "../Image/image";

const meta: Meta<typeof Image> = {
  title: "Components/UI/Image",
  component: Image,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "cover"],
      description: "Display variant for the image",
      table: {
        defaultValue: { summary: "default" },
      },
    },
    className: {
      control: "text",
      description: "Additional CSS classes (merged last for overrides)",
    },
    src: {
      control: "text",
      description: "Image source URL",
    },
    alt: {
      control: "text",
      description: "Alternative text for accessibility",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Image>;

const productImage =
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop";

export const Default: Story = {
  args: {
    variant: "default",
    src: productImage,
    alt: "Product image",
  },
};

export const Cover: Story = {
  args: {
    variant: "cover",
    src: productImage,
    alt: "Product cover",
  },
  render: (args) => (
    <div className="relative h-48 w-full overflow-hidden rounded-lg border border-neutral-10">
      <Image {...args} />
    </div>
  ),
};
