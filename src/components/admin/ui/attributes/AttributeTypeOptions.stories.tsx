import type { Meta, StoryObj } from "@storybook/react";
import { AttributeTypeOptions } from "./AttributeTypeOptions";
import { useState } from "react";

const meta = {
  title: "Components/Admin/UI/Attributes/AttributeTypeOptions",
  component: AttributeTypeOptions,
  tags: ["autodocs"],
} satisfies Meta<typeof AttributeTypeOptions>;

export default meta;
type Story = StoryObj<typeof meta>;

const DefaultStory = () => {
  const [selected, setSelected] = useState("text");
  return (
    <AttributeTypeOptions selectedValue={selected} onSelect={setSelected} />
  );
};

export const Default: Story = {
  render: () => <DefaultStory />,
};
