import type { Meta, StoryObj } from "@storybook/react";
import { DaysFilter } from "./DaysFilter";
import { useState } from "react";

const meta = {
  title: "Components/Admin/UI/DateFilter/DaysFilter",
  component: DaysFilter,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof DaysFilter>;

export default meta;
type Story = StoryObj<typeof meta>;

const InteractiveStory = () => {
  const [value, setValue] = useState<string | number>(30);
  return (
    <div className="space-y-4">
      <DaysFilter value={value} onChange={setValue} />
      <div className="text-sm text-neutral-60">
        Selected period: {value === "all" ? "All Time" : `${value} days`}
      </div>
    </div>
  );
};

export const Default: Story = {
  args: {
    value: 30,
    onChange: (value) => console.log("Selected:", value),
  },
};

export const Interactive: Story = {
  render: () => <InteractiveStory />,
};