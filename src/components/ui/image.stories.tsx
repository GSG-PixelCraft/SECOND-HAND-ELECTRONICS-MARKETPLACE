// src/components/ui/image.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Image } from "./image";

const meta: Meta<typeof Image> = {
  title: "UI/Image",
  component: Image,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "avatar", "thumbnail", "cover"],
      description: "Semantic variant controlling display behavior",
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
  parameters: {
    docs: {
      description: {
        component:
          "Image component with semantic variants for common display patterns. Includes automatic error handling with fallback image.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Image>;

const placeholderImage =
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop";
const productImage =
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop";

export const Default: Story = {
  args: {
    variant: "default",
    src: productImage,
    alt: "Product image",
  },
};

export const Avatar: Story = {
  args: {
    variant: "avatar",
    src: placeholderImage,
    alt: "User avatar",
    className: "h-16 w-16",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Avatar variant applies rounded-full and object-cover. Commonly used with explicit dimensions.",
      },
    },
  },
};

export const Thumbnail: Story = {
  args: {
    variant: "thumbnail",
    src: productImage,
    alt: "Product thumbnail",
    className: "h-24 w-24",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Thumbnail variant applies rounded corners and object-cover. Used for small product previews.",
      },
    },
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
  parameters: {
    docs: {
      description: {
        story:
          "Cover variant applies h-full w-full object-cover. Used within containers for full coverage.",
      },
    },
  },
};

export const ErrorHandling: Story = {
  args: {
    variant: "thumbnail",
    src: "https://invalid-url-that-will-fail.jpg",
    alt: "Failed to load",
    className: "h-32 w-32",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates automatic error handling. When image fails to load, fallback image is displayed.",
      },
    },
  },
};

export const AvatarSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Image
        variant="avatar"
        src={placeholderImage}
        alt="Small avatar"
        className="h-8 w-8"
      />
      <Image
        variant="avatar"
        src={placeholderImage}
        alt="Medium avatar"
        className="h-12 w-12"
      />
      <Image
        variant="avatar"
        src={placeholderImage}
        alt="Large avatar"
        className="h-16 w-16"
      />
      <Image
        variant="avatar"
        src={placeholderImage}
        alt="Extra large avatar"
        className="h-24 w-24"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Common avatar size variations using className overrides.",
      },
    },
  },
};

export const ProductGallery: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {[1, 2, 3, 4].map((index) => (
        <div
          key={index}
          className="group relative aspect-square overflow-hidden rounded-lg border border-neutral-10"
        >
          <Image variant="cover" src={productImage} alt={`Product ${index}`} />
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Example product gallery layout using cover variant for consistent aspect ratios.",
      },
    },
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 text-sm font-semibold">Default</h3>
        <Image variant="default" src={productImage} alt="Default" />
      </div>
      <div>
        <h3 className="mb-2 text-sm font-semibold">Avatar</h3>
        <Image
          variant="avatar"
          src={placeholderImage}
          alt="Avatar"
          className="h-16 w-16"
        />
      </div>
      <div>
        <h3 className="mb-2 text-sm font-semibold">Thumbnail</h3>
        <Image
          variant="thumbnail"
          src={productImage}
          alt="Thumbnail"
          className="h-24 w-24"
        />
      </div>
      <div>
        <h3 className="mb-2 text-sm font-semibold">Cover</h3>
        <div className="relative h-48 w-full overflow-hidden rounded-lg border border-neutral-10">
          <Image variant="cover" src={productImage} alt="Cover" />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Overview of all available Image variants in a single view.",
      },
    },
  },
};
