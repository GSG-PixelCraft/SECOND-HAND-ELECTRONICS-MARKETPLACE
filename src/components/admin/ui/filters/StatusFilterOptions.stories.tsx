import type { Meta, StoryObj } from "@storybook/react";
import { StatusFilterOptions } from "../filters/StatusFilterOptions";
import { useState } from "react";
import type { ComponentProps } from "react";

const meta = {
  title: "Components/Admin/UI/Filters/StatusFilterOptions",
  component: StatusFilterOptions,
  tags: ["autodocs"],
} satisfies Meta<typeof StatusFilterOptions>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockOptions = [
  { value: "published", label: "Published", count: 120 },
  { value: "pending", label: "Pending", count: 24 },
  { value: "rejected", label: "Rejected", count: 8 },
  { value: "draft", label: "Draft", count: 15 },
];

type StatusFilterOptionsStoryArgs = ComponentProps<typeof StatusFilterOptions>;

const DefaultStory = (args: StatusFilterOptionsStoryArgs) => {
  const [selected, setSelected] = useState(args.selectedValues ?? []);
  return (
    <StatusFilterOptions
      {...args}
      selectedValues={selected}
      onSelectionChange={setSelected}
    />
  );
};

export const Default: Story = {
  args: {
    options: mockOptions,
    selectedValues: ["published"],
    onSelectionChange: () => {},
  },
  render: (args) => <DefaultStory {...args} />,
};
