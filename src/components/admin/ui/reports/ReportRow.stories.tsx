import type { Meta, StoryObj } from "@storybook/react";
import { ReportRow } from "./ReportRow";

const meta = {
  title: "Components/Admin/UI/Reports/ReportRow",
  component: ReportRow,
  tags: ["autodocs"],
} satisfies Meta<typeof ReportRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    reportId: "REP-123",
    reporterName: "Alice Smith",
    reason: "Inappropriate Content",
    targetType: "Listing",
    targetTitle: "Illegal Item for sale",
    date: "2024-02-06",
    status: "pending",
  },
  render: (args) => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <tbody>
          <ReportRow {...args} />
        </tbody>
      </table>
    </div>
  ),
};
