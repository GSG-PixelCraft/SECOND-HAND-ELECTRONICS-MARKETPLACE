// src/components/ui/text.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Text } from "../Text/text";

const meta: Meta<typeof Text> = {
  title: "Components/UI/Text",
  component: Text,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "body",
        "bodyLg",
        "bodySmall",
        "caption",
        "label",
        "muted",
        "error",
      ],
      description: "Semantic variant controlling typography and color",
      table: {
        defaultValue: { summary: "body" },
      },
    },
    className: {
      control: "text",
      description: "Additional CSS classes (merged last for overrides)",
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Text component (`<p>`) with semantic variants for typography and color. Uses CVA for variant management and supports className overrides.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Text>;

export const Body: Story = {
  args: {
    variant: "body",
    children: "This is body text with standard size and neutral color.",
  },
};

export const BodyLarge: Story = {
  args: {
    variant: "bodyLg",
    children: "This is larger body text for emphasis or headings.",
  },
};

export const BodySmall: Story = {
  args: {
    variant: "bodySmall",
    children: "This is smaller body text for secondary information.",
  },
};

export const Caption: Story = {
  args: {
    variant: "caption",
    children: "This is caption text - small and subtle.",
  },
};

export const Label: Story = {
  args: {
    variant: "label",
    children: "Form Label Text",
  },
};

export const Muted: Story = {
  args: {
    variant: "muted",
    children: "This is muted text for less important content.",
  },
};

export const Error: Story = {
  args: {
    variant: "error",
    children: "This is error text for validation messages.",
  },
};

export const WithClassName: Story = {
  args: {
    variant: "body",
    className: "font-bold underline",
    children: "Text with additional className overrides.",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates that className prop merges last, allowing custom overrides while preserving variant styles.",
      },
    },
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <Text variant="body">Body - Standard paragraph text</Text>
      </div>
      <div>
        <Text variant="bodyLg">Body Large - Larger emphasis text</Text>
      </div>
      <div>
        <Text variant="bodySmall">Body Small - Secondary information</Text>
      </div>
      <div>
        <Text variant="caption">Caption - Small subtitle text</Text>
      </div>
      <div>
        <Text variant="label">Label - Form label text</Text>
      </div>
      <div>
        <Text variant="muted">Muted - Less important content</Text>
      </div>
      <div>
        <Text variant="error">Error - Validation error messages</Text>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Overview of all available Text variants in a single view.",
      },
    },
  },
};
