import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  AdminDateRangePicker,
  type AdminDateRangeValue,
} from "./AdminDateRangePicker";
import { getPresetRange } from "./admin-date-range.utils";

const meta = {
  title: "Components/Admin/UI/AdminDateRangePicker",
  component: AdminDateRangePicker,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof AdminDateRangePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

function InteractivePicker() {
  const [value, setValue] = useState<AdminDateRangeValue>(
    getPresetRange("last7"),
  );

  return (
    <div className="space-y-3">
      <AdminDateRangePicker value={value} onChange={setValue} />
      <div className="text-neutral-60 text-sm">
        Preset: {value.preset}
        <br />
        Start: {value.startDate || "--"}
        <br />
        End: {value.endDate || "--"}
      </div>
    </div>
  );
}

export const Default: Story = {
  render: () => <InteractivePicker />,
};
