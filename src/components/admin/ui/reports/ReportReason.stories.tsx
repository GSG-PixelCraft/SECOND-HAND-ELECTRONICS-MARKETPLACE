import type { Meta, StoryObj } from "@storybook/react";
import { ReportReason } from "./ReportReason";
import { useState } from "react";

const meta = {
  title: "Components/Admin/UI/Reports/ReportReason",
  component: ReportReason,
  tags: ["autodocs"],
} satisfies Meta<typeof ReportReason>;

export default meta;
type Story = StoryObj<typeof meta>;

const SelectStory = () => {
  const [selected, setSelected] = useState("");
  return <ReportReason selectedValue={selected} onSelect={setSelected} mode="select" />;
};

export const Select: Story = {
  render: () => <SelectStory />,
};

export const Display: Story = {
  args: {
    selectedValue: "scam",
    mode: "display",
  },
};