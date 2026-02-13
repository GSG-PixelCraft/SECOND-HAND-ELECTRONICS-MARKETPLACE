import type { Meta, StoryObj } from "@storybook/react";
import { Show } from "./Show";
import { useState } from "react";

const meta = {
  title: "Components/Admin/UI/Show",
  component: Show,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Show>;

export default meta;
type Story = StoryObj<typeof meta>;

const InteractiveStory = () => {
  const [value, setValue] = useState(10);
  return (
    <div className="space-y-4">
      <Show value={value} onChange={setValue} />
      <div className="text-neutral-60 text-sm">
        Current value: {value} entries
      </div>
    </div>
  );
};

export const Default: Story = {
  args: {
    value: 10,
    onChange: (value) => console.log("Changed to:", value),
  },
};

export const Interactive: Story = {
  render: () => <InteractiveStory />,
  args: {
    value: 10,
    onChange: () => {},
  },
};
