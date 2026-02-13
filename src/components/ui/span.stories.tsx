import type { Meta, StoryObj } from "@storybook/react";
import { Span } from "./span";

const meta: Meta<typeof Span> = {
  title: "Components/UI/Span",
  component: Span,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "body",
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
};

export default meta;
type Story = StoryObj<typeof Span>;

export const Body: Story = {
  args: {
    variant: "body",
    children: "Inline body text",
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

export const StatusVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <div className="flex items-center gap-2 rounded-lg border border-neutral-20 bg-white px-3 py-2">
        <Span variant="success">Verified</Span>
      </div>
      <div className="flex items-center gap-2 rounded-lg border border-neutral-20 bg-white px-3 py-2">
        <Span variant="warning">Under Review</Span>
      </div>
      <div className="flex items-center gap-2 rounded-lg border border-neutral-20 bg-white px-3 py-2">
        <Span variant="primary">Uploading</Span>
      </div>
      <div className="flex items-center gap-2 rounded-lg border border-neutral-20 bg-white px-3 py-2">
        <Span variant="error">Rejected</Span>
      </div>
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-3">
      <div>
        <Span variant="body">Body</Span>
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
        <Span variant="primary">Primary</Span>
      </div>
      <div>
        <Span variant="success">Success</Span>
      </div>
      <div>
        <Span variant="warning">Warning</Span>
      </div>
      <div>
        <Span variant="error">Error</Span>
      </div>
    </div>
  ),
};
