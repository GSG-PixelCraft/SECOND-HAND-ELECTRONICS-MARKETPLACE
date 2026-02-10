// src/components/ui/span.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Span } from "./span";

const meta: Meta<typeof Span> = {
  title: "UI/Span",
  component: Span,
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
        "primary",
        "success",
        "warning",
        "error",
      ],
      description: "Semantic variant controlling inline typography and color",
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
          "Span component (`<span>`) with semantic variants for inline text, badges, and status indicators. Includes status color variants (primary, success, warning, error).",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Span>;

export const Body: Story = {
  args: {
    variant: "body",
    children: "Inline body text",
  },
};

export const BodyLarge: Story = {
  args: {
    variant: "bodyLg",
    children: "Larger inline text",
  },
};

export const BodySmall: Story = {
  args: {
    variant: "bodySmall",
    children: "Smaller inline text",
  },
};

export const Caption: Story = {
  args: {
    variant: "caption",
    children: "Caption inline text",
  },
};

export const Label: Story = {
  args: {
    variant: "label",
    children: "Label inline text",
  },
};

export const Muted: Story = {
  args: {
    variant: "muted",
    children: "Muted inline text",
  },
};

export const Primary: Story = {
  args: {
    variant: "primary",
    children: "Primary status",
  },
};

export const Success: Story = {
  args: {
    variant: "success",
    children: "✓ Verified",
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
    children: "⚠ Pending",
  },
};

export const Error: Story = {
  args: {
    variant: "error",
    children: "✗ Failed",
  },
};

export const StatusBadges: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <div className="flex items-center gap-2 rounded-lg border border-neutral-20 bg-white px-3 py-2">
        <Span variant="success">✓ Email Verified</Span>
      </div>
      <div className="flex items-center gap-2 rounded-lg border border-neutral-20 bg-white px-3 py-2">
        <Span variant="warning">⏳ Phone Pending</Span>
      </div>
      <div className="flex items-center gap-2 rounded-lg border border-neutral-20 bg-white px-3 py-2">
        <Span variant="primary">🕐 In Review</Span>
      </div>
      <div className="flex items-center gap-2 rounded-lg border border-neutral-20 bg-white px-3 py-2">
        <Span variant="error">✗ Rejected</Span>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Common usage pattern for status badges with semantic variants.",
      },
    },
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-3">
      <div>
        <Span variant="body">Body</Span>
      </div>
      <div>
        <Span variant="bodyLg">Body Large</Span>
      </div>
      <div>
        <Span variant="bodySmall">Body Small</Span>
      </div>
      <div>
        <Span variant="caption">Caption</Span>
      </div>
      <div>
        <Span variant="label">Label</Span>
      </div>
      <div>
        <Span variant="muted">Muted</Span>
      </div>
      <div>
        <Span variant="primary">Primary Status</Span>
      </div>
      <div>
        <Span variant="success">Success Status</Span>
      </div>
      <div>
        <Span variant="warning">Warning Status</Span>
      </div>
      <div>
        <Span variant="error">Error Status</Span>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Overview of all available Span variants in a single view.",
      },
    },
  },
};
